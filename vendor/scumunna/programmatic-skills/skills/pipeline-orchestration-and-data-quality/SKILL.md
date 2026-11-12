---
name: pipeline-orchestration-and-data-quality
description: Build idempotent extraction, load, and transform pipelines that pull marketing data (GA4, CM360, DV360, DSPs, retail media) into a warehouse on a schedule, with watermarks, freshness SLAs, schema-drift detection, and tests as code so a rerun never double counts and a broken feed never reaches a dashboard silently. Use when the user asks how to schedule and orchestrate a marketing data pipeline, make a load idempotent, backfill without duplicates, set incremental watermarks, detect schema drift, add data-quality tests, set a freshness SLA, handle late-arriving data, paginate an ad API with backoff, or why last night's ingestion silently produced stale or partial numbers.
---

# Pipeline orchestration and data quality

Build the ingestion layer under a marketing warehouse so it runs unattended, survives reruns, and fails loud instead of quietly serving stale or duplicated numbers. Three jobs done right: idempotent load (a rerun of the same window produces the same table, never a double count), orchestration with watermarks (the pipeline knows what it already loaded and picks up from there), and tests as code (freshness, schema drift, volume, and null checks run in the pipeline and block a bad table from reaching a dashboard). This is the plumbing that makes every reporting skill downstream trustworthy.

This skill assumes you know CPM, CPA, ROAS, and what an impression, a click, and a key event are. For that KPI math see the `programmatic-foundations` skill. This skill moves and validates data at the pipeline level; it does not model the warehouse, reconcile conflicting platform numbers, or query the data.

## When to use this skill

- "Schedule and orchestrate the nightly marketing data pull." / "Set up the ingestion DAG."
- "Make this load idempotent so a rerun does not double count."
- "Backfill 90 days without creating duplicates."
- "Set an incremental watermark so I do not reprocess the whole history every night."
- "Detect schema drift." / "A column changed type and the load broke." / "The API added a field."
- "Add data-quality tests / assertions to the pipeline." / "Gate the load on a freshness check."
- "Set a freshness SLA and alert when data is late."
- "Handle late-arriving conversions / restated data / the platform revised yesterday's number."
- "Paginate the Data API with backoff." / "The pull keeps hitting quota / rate limits."
- "Last night's job said success but the numbers are stale or partial, why?"

Boundaries with sibling skills:
- Modeling the fact and dimension tables, partitioning, clustering, and serving dashboards: `marketing-analytics-warehouse-and-dashboards`. That skill designs the destination; this skill fills it.
- Reconciling conflicting conversion counts across GA4, CM360, and each DSP into one blended number: `cross-platform-conversion-reconciliation`. That skill decides which number wins; this skill lands each number cleanly first.
- The statistical anomaly method (weekday and seasonality aware) and the acceptable-variance bands: `data-quality-and-reconciliation`. This skill runs mechanical tests (freshness, schema, nulls, row counts); that skill decides whether a real change is a break.
- Querying the raw GA4 BigQuery export and its nested schema: `ga4-bigquery-export-and-sql`. Pulling GA4 through the Data API, Admin API, or Measurement Protocol: `ga4-apis-and-measurement-protocol`.
- Deploying a scheduled agent to run the recurring pull: the `anomaly-detection` loop reads what this pipeline produces.

## Quick reference

| Symptom | Root cause | Fix |
| --- | --- | --- |
| Rerun doubled the rows | Load appends instead of replacing the window | Delete-then-insert the partition, or MERGE on a unique key |
| Backfill created duplicates | No dedup key, or the window overlapped a prior load | MERGE on a stable natural key, backfill partition by partition |
| Reprocessing all of history nightly | No watermark, full table scan each run | Incremental table keyed on a watermark column, load only new partitions |
| Job succeeded but numbers stale | No freshness assertion; empty or partial pull counted as success | Freshness SLA test that fails when max(event_date) lags now |
| Load broke on a new API field | Rigid schema, no drift handling | Land raw as JSON, evolve typed columns, alert on drift not crash |
| Yesterday's totals changed today | Platform restated data (late attribution) | Reload a trailing lookback window (7 to 14 days) every run |
| Pull dies partway | Rate limit or quota, no retry | Exponential backoff with jitter, resume from the last cursor |

Two non-negotiables before any pipeline is "done": every load is idempotent (rerun equals one run), and every load ends with a data-quality gate that can fail the run.

## Core process

1. Pick the grain and the watermark column first, because idempotency depends on them. Grain is the smallest row you store (one row per campaign per day, or per event). The watermark is the column you advance each run (event_date for daily exports, a lastModified timestamp for API records). Get this wrong and no amount of retry logic makes the load safe.
2. Extract with pagination and backoff, so a rate limit or a large window does not lose data. Loop the API's page token or cursor to exhaustion, retry 429 and 5xx with exponential backoff plus jitter, and checkpoint the cursor so a mid-run failure resumes instead of restarting. See `references/api-ingestion-pagination-backoff.md`.
3. Land raw before you transform, so a schema change or a bad transform never destroys the source of truth. Write the API response to a raw or staging table (JSON or lightly typed) partitioned by ingestion date. Raw is cheap and lets you replay any day without re-hitting the API.
4. Load idempotently into the typed table using delete-then-insert on the partition or MERGE on the natural key, so a rerun of the same window replaces rather than appends. Never plain-INSERT a window you might run twice. See `references/idempotent-load-patterns.md`.
5. Reload a trailing lookback window every run, because ad platforms restate recent data (late-arriving conversions, attribution settling). A 7 to 14 day trailing reload catches restatements without reprocessing history. Size the window to the platform's attribution lag.
6. Run the data-quality gate as the last step and let it fail the run, so a stale, short, or drifted table never reaches a dashboard. Assert freshness (data is recent enough), schema (expected columns and types present), volume (row count within a sane band), and nulls (key columns populated). See `references/freshness-and-schema-drift-tests.md`.
7. Orchestrate with explicit dependencies and idempotent tasks, so the scheduler can retry any task safely. Each task reads its window from a parameter, not from wall-clock "today", so a backfill and a retry both produce the same result. Alert on a failed gate; do not let a red test pass silently.
8. Keep every spend or live-config change human-gated. This pipeline reads and validates. If a downstream step would change a bid, a budget, or a campaign, stop and hand it to a person or to the platform's own skill.

## Decision rules and thresholds

### Idempotent load: pick the pattern by grain

- Partitioned by date, whole-partition replace: delete the target partition for the window, then insert. Simplest and safe when you always reload a full day. Use for daily platform exports keyed on event_date.
- Natural key exists, rows can update: MERGE (upsert) on the key, update on match, insert on no match. Use when a record can change after first load (a conversion whose value settles, a line item renamed). The key must be stable and unique at the grain.
- Append-only immutable events: insert with a dedup guard on a unique event id, so a replay drops rows already present. Use for event streams where a row never changes once written.

Never rely on "I will not run it twice." Schedulers retry, humans rerun, backfills overlap. Assume every load runs at least twice.

### Watermarks and incremental loads

- Advance the watermark only after the load and the gate both pass, so a failed run does not skip a window. Store the last successful watermark in a control table, not in code.
- For daily exports, the watermark is the partition date. Load [last_watermark, today], plus a trailing lookback for restatements.
- For API records with a lastModified field, the watermark is the max lastModified you have loaded. Pull records changed since then, MERGE on the primary key.
- A full refresh is the fallback, not the default. Reprocessing all history nightly wastes cost and hides drift. Reserve it for a schema migration or a corrupted table.

### Trailing lookback by platform behavior

- GA4 export: daily export delivers complete previous-day data (typically mid-afternoon in the property timezone), so a 3 to 7 day trailing reload is usually enough. Streaming export has no completeness guarantee, so never treat the intraday table as final.
- Attribution-heavy DSP and CM360 conversions: conversions attach to impressions days later, so reload 7 to 14 days, longer if the click or view lookback window is 30 days or more.
- Retail media (Amazon, Walmart): reporting settles over several days, so match the lookback to the retailer's stated finalization window.

### Freshness SLA

Set the SLA from the source's own cadence, not a guess.

- Daily export source: fail the gate if max(event_date) is more than 1 full day behind the expected date at gate time. A single missing day is a break, not noise.
- Hourly or streaming source: fail if the newest row lags the SLA (for example more than 3 hours). Alert before the client notices.
- Encode the SLA as an assertion the pipeline runs, not a dashboard a human watches. An unwatched dashboard is not an SLA.

### Schema-drift response

- New column appears: do not crash. Land raw as JSON so unexpected fields survive, add the typed column deliberately, alert so someone decides whether it matters.
- Column type changed (string to int, or a field became nullable): fail the gate and hold the load. A silent cast corrupts history. Fix the mapping, then reload the affected window.
- Column disappeared: fail the gate. A downstream join or metric depends on it. Do not let the table publish with a hole.
- Treat the raw landing table as tolerant and the typed table as strict. Tolerance upstream, contracts downstream.

### When to fail the run versus warn

- Fail (block publish): freshness past SLA, a key column all null, a required column missing or retyped, row count near zero when history is nonzero.
- Warn (publish, notify): row count outside a soft band but nonzero, a new nullable column, a lookback-window restatement larger than usual. Route warns to the anomaly method in `data-quality-and-reconciliation` to decide if it is real.

## Reference material

- `references/idempotent-load-patterns.md`: the three idempotent load patterns (partition replace, MERGE upsert, dedup insert) with concrete BigQuery SQL, a Dataform incremental-table config, backfill-without-duplicates recipes, and a watermark control-table pattern. Read this when writing or fixing a load so a rerun cannot double count.
- `references/freshness-and-schema-drift-tests.md`: the data-quality gate as code. Dataform assertions (nonNull, rowConditions, uniqueKey, uniqueKeys, manual) and equivalent standalone SQL for freshness, schema drift, volume, and null tests, with fail-versus-warn thresholds and how to wire the gate so it blocks publish. Read this when adding tests or setting a freshness SLA.
- `references/api-ingestion-pagination-backoff.md`: pulling ad and analytics APIs safely. Pagination (page token, offset, cursor), exponential backoff with jitter for 429 and 5xx, quota-aware pacing with GA4 Data API token math as the worked example, cursor checkpointing for resumable pulls, and a method-by-source table. Read this when building the extract step or when a pull hits rate limits or quota.

## Templates and examples

- Nightly GA4-to-warehouse pull: watermark is event_date. Each run loads [last_watermark, yesterday] plus a 3-day trailing reload for late data, MERGE into the typed table on (event_date, event_name, ga_session_id-derived key), then a freshness assertion fails if max(event_date) is more than 1 day behind yesterday. Watermark advances only after the gate passes.
- DV360 conversion feed with 30-day click lookback: reload a 14-day trailing window every run because conversions keep attaching to older impressions, MERGE on the DSP's conversion id so a restated value overwrites the old row instead of adding a second. Volume warn band set at plus or minus 40 percent of the trailing 28-day median, routed to the anomaly method, not an auto-fail.
- Amazon retail-media daily pull hitting rate limits: page the report API to exhaustion on its next-token, retry 429 with backoff starting at 2 seconds and doubling to a 60-second cap plus jitter, checkpoint the token so a timeout resumes mid-report instead of restarting the day.
- Schema drift caught in the gate: the CM360 report added a column and one existing column went from INT64 to STRING. The raw JSON landing table absorbed both with no crash. The typed-table assertion failed on the retype and held publish. Fix the mapping, reload the affected partitions, gate passes, table publishes.

## Common pitfalls

- Plain INSERT of a window you might rerun. The scheduler retries or a human backfills, and the same day lands twice. Use partition-replace or MERGE. This is the single most common cause of inflated numbers.
- No trailing lookback. The pipeline loads yesterday and never revisits it, so late-arriving conversions never land and totals for last week silently undercount. Reload a trailing window sized to attribution lag.
- Freshness measured on a dashboard, not asserted in the pipeline. The job returns success on an empty or partial pull, the dashboard shows a flat or dropping line, and nobody notices until the client does. Make freshness a test that fails the run.
- Watermark advanced before the gate passes. A failed or partial load still moves the watermark, so the skipped window is never retried and there is a permanent hole. Advance the watermark only after load and gate both succeed.
- Rigid typed schema at the point of ingestion. A single new API field crashes the whole load. Land raw tolerantly, evolve typed columns deliberately, alert on drift instead of crashing.
- Retrying a non-idempotent task. Backoff and retry on a plain-INSERT load multiplies the duplication. Make the task idempotent first, then retry is safe.
- Treating a full refresh as normal. Reprocessing all history every night is expensive and masks drift because every run rewrites everything. Load incrementally; reserve full refresh for migrations.
- Letting the pipeline change spend. Ingestion should read and validate only. Any bid, budget, or config change is human-gated and belongs to the platform's own skill, never to the loader.

## Sources

- [Dataform documentation](https://docs.cloud.google.com/dataform/docs) (as of July 2026)
- [Create assertions in Dataform](https://docs.cloud.google.com/dataform/docs/assertions) (as of July 2026)
- [Create table definitions in Dataform (incremental tables)](https://docs.cloud.google.com/dataform/docs/tables) (as of July 2026)
- [GA4 BigQuery Export setup and schema](https://support.google.com/analytics/answer/9358801?hl=en) (as of July 2026)
- [GA4 Data API v1 overview](https://developers.google.com/analytics/devguides/reporting/data/v1) (as of July 2026)
- [GA4 Data API v1 quotas](https://developers.google.com/analytics/devguides/reporting/data/v1/quotas) (as of July 2026)
- [GA4 Measurement Protocol overview](https://developers.google.com/analytics/devguides/collection/protocol/ga4) (as of July 2026)
- [Campaign Manager 360 API deprecation schedule](https://developers.google.com/doubleclick-advertisers/deprecation) (as of July 2026)
