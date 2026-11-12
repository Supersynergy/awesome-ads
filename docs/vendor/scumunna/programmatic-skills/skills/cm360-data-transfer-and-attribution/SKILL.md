---
name: cm360-data-transfer-and-attribution
description: Ingest and join Campaign Manager 360 Data Transfer v2 (DTv2) log-level files for custom attribution and reconciliation. Use when the user asks about DTv2, log-level or event-level impression/click/activity files, match tables, DCM data transfer, joining events to dimensions, building a custom attribution model off raw CM360 logs, User ID / Rendering ID / Placement ID join keys, deduping DTv2 activities against Floodlight totals, or loading DTv2 files from Cloud Storage into BigQuery.
---

# CM360 Data Transfer and attribution

Turn Campaign Manager 360 Data Transfer v2 (DTv2) log-level files into a clean, joinable event table you can attribute and reconcile on your own terms. DTv2 delivers one row per impression, click, and activity to Cloud Storage, plus match tables that resolve the numeric IDs on those rows into names. The point of this pipeline is a custom attribution model (first-touch, position-based, data-driven) that CM360 UI attribution cannot express, and a reconciliation baseline that ties log-level counts back to the Floodlight totals finance already trusts.

This skill assumes you know click-through vs view-through, lookback windows, and attribution models. For that math see the `programmatic-foundations` skill. For how Floodlight counts and how offline conversions get uploaded, see `cm360-floodlight-and-conversions`. For UI reports and the CM360 Reporting/Trafficking API v5 (a different, aggregated data path), see `cm360-reporting-and-trafficking-api`. For reconciling the resulting numbers across GA4 and every DSP, hand off to `cross-platform-conversion-reconciliation`.

## When to use this skill

- "Set up / ingest / parse CM360 Data Transfer v2 (DTv2) files." / "Log-level or event-level CM360 data."
- "Load the impression / click / activity files from Cloud Storage into BigQuery."
- "Join the event files to the match tables." / "What resolves Placement ID / Ad ID / Creative ID to a name?"
- "Build a custom attribution model off raw CM360 logs (first-touch, position-based, data-driven)."
- "Why is my DTv2 activity count higher than the Floodlight report?"
- "Dedupe DTv2 activities." / "How do I stitch impressions, clicks, and activities into a user path?"
- "What is the User ID / Encrypted User ID column and how do I join across devices?"
- "What cadence do DTv2 files arrive?" / "How long do they stay in the bucket?"

Boundaries with sibling skills:
- Floodlight counting methods, conversion windows, and offline conversion uploads: `cm360-floodlight-and-conversions`.
- Aggregated UI reports and the Reporting/Trafficking API v5: `cm360-reporting-and-trafficking-api`.
- BigQuery schema, partitioning, and event-level SQL patterns for the warehouse: `ga4-bigquery-export-and-sql`.
- Deduping a Floodlight number against GA4 and each DSP: `cross-platform-conversion-reconciliation`.
- The equivalent DV360 log-level feed (separate schema and bucket): `dv360-measurement-and-attribution`.

## Quick reference

| You need | Use | Why |
| --- | --- | --- |
| One row per impression, click, or activity | DTv2 event files | Log-level, pre-attribution, full granularity |
| Resolve a numeric ID to a human name | DTv2 match tables | Event rows carry IDs only; names live in match tables |
| Aggregated metrics for a dashboard | CM360 UI report or API v5 | DTv2 is raw logs, not summed metrics (use the sibling skill) |
| Custom attribution CM360 UI cannot express | DTv2 + your own join/model | You own the credit rules on the raw path |
| Cross-device or cross-session stitching | User ID column + your identity graph | DTv2 gives the id, you supply the graph |
| Tie log-level counts to finance totals | DTv2 activity count vs Floodlight report | Reconcile the raw path against the trusted aggregate |

DTv2 file families and cadence (verified, see Sources):

| File family | Grain | Cadence |
| --- | --- | --- |
| Impression files | one row per served impression | 24 files per day (one per hour) |
| Click files | one row per click | 24 files per day (one per hour) |
| Activity files (Floodlight) | one row per Floodlight activity/conversion | daily |
| Match table files | current dimension snapshot (campaigns, placements, ads, sites, creatives, geo, device) | daily |

Files land in a Google Cloud Storage bucket and are retained for 60 days, so back up anything you need beyond that window into your own storage.

## Core process

1. Confirm access and delivery. DTv2 writes to a Cloud Storage bucket the CM360 account is provisioned for. Read credentials from an environment variable or a service-account path (never hardcode them), list the bucket, and confirm impression, click, activity, and match table files are arriving on the cadence above. If files stop, that is an upstream provisioning issue, not a pipeline bug.
2. Parse the filename before the contents. The name encodes account/entity, transfer type (impression, click, activity, rich_media), the processed hour (YYYYMMDDHH), and the generation date/time, separated by underscores. Use the transfer type to route the file and the processed hour to partition, so a late-arriving re-delivery lands in the correct partition instead of today.
3. Load event files raw and idempotent. Files are gzip CSV, UTF-8, first row is the header, fields with special characters are quoted, missing values are blank, rows are not sorted. Load each file into a staging table keyed so a re-delivered hour overwrites rather than double loads. Never sum anything at load time; keep the log-level grain.
4. Load match tables as slowly-changing snapshots. Match tables are a current-state snapshot delivered daily, not an append log. Keep the latest snapshot for live joins and, if you need historical accuracy, keep dated snapshots so an event joins to the dimension as it was near event time. See `references/dtv2-file-types-and-cadence.md`.
5. Resolve IDs to names by joining event rows to match tables on the ID keys (Advertiser ID, Campaign ID, Ad ID, Rendering ID or Creative ID, Placement ID, Site ID, geo and device IDs). Event rows carry only IDs, so every human-readable report is a join. The full key map is in `references/match-table-joins.md`.
6. Build the path. Order each User ID's impressions, clicks, and activities by Event Time to form a per-user event sequence, apply the lookback window (click-through longer than view-through, matching the Floodlight config), then apply your attribution rule to assign credit. Patterns and SQL are in `references/custom-attribution-patterns.md`.
7. Reconcile before anyone trusts it. Sum your attributed activities and your raw activity rows and compare both to the Floodlight report and the API v5 total for the same date range and time zone. Expect small differences (dedup logic, window edges, time-zone boundaries) but investigate anything material. Hand off to `cross-platform-conversion-reconciliation`.

Safe-by-default: this pipeline reads log files and produces tables. It does not change any live CM360 configuration, and it should not. Treat the Floodlight report and API v5 total as the source of truth for billed numbers, and treat your custom-attribution output as an analytical view until reconciliation signs off on it.

## Decision rules and thresholds

### When DTv2 is the right tool (and when it is not)

- Use DTv2 when you need row-level events, a custom attribution model, cross-device stitching with your own identity graph, or a defensible reconciliation baseline. Only the raw path gives you the credit rules and the join freedom.
- Do not use DTv2 for a quick aggregated metric or a scheduled dashboard export. That is what CM360 UI reports and the API v5 are for, at a fraction of the engineering cost. See `cm360-reporting-and-trafficking-api`.
- Do not use DTv2 as your billing number of record. Finance bills off Floodlight/UI totals; DTv2 is the analytical layer under them.

### Match tables are snapshots, so join deliberately

- Match tables reflect current state each day. If a placement was renamed or an ad reassigned after an impression fired, a naive join to today's snapshot mislabels old events.
- For live operational reporting, joining to the latest snapshot is fine. For historical accuracy (audits, year-over-year, dispute resolution), join each event to the dated snapshot nearest its Event Time. Decide which you need before you model.

### Dedup and grain discipline

- Keep event files at one row per event. The activity file already reflects Floodlight counting, so do not re-dedupe activities with your own logic unless you are deliberately re-implementing a counting method, and then reconcile the result against Floodlight.
- Re-delivered files are common. Make loads idempotent (overwrite by processed hour and execution context) so a re-delivery does not double count. A count that quietly grew after a backfill is almost always a non-idempotent load.

### Attribution window and time zone

- Apply the same click-through and view-through windows the Floodlight configuration uses, or your custom model will disagree with the UI for reasons that have nothing to do with the credit rule. View-through windows are shorter than click-through; do not extend view-through past what Floodlight allows and then compare to a UI number that did not.
- Fix one time zone for the whole pipeline and state it. DTv2 event times and the CM360 UI report can sit in different zones, and a day-boundary mismatch shows up as a persistent daily-count delta that looks like a bug but is not.

### User ID and identity

- The User ID column is the join key for path building. It is not a durable cross-device, cross-browser identity by itself. Signal loss on Safari, Firefox, iOS, and under consent denial means a large share of events will not stitch. Build the identity graph you can defend, and treat unstitched events as a known, quantified gap, not an error. For the 2026 signal-loss and consent picture, see `privacy-and-consent`.

## Reference material

- `references/dtv2-file-types-and-cadence.md`: every DTv2 file family (impression, click, activity, match tables), the filename convention parsed field by field, delivery cadence and the 60-day retention rule, the gzip-CSV format contract, a Cloud-Storage-to-BigQuery load pattern, and idempotent-load and partitioning rules. Read this when setting up ingestion or debugging late or duplicate files.
- `references/match-table-joins.md`: the full list of match tables with their columns, the exact ID join keys that link each event file to each dimension, the Rendering ID vs Creative ID distinction, the snapshot-vs-dated-snapshot decision, and copy-ready join SQL. Read this when resolving IDs to names or building the dimensional model.
- `references/custom-attribution-patterns.md`: path construction from ordered User ID events, window application, and worked SQL for first-touch, last-touch, position-based, and a data-driven starting point, plus the reconciliation query that ties attributed and raw counts to the Floodlight total. Read this when building or auditing a custom attribution model.

## Templates and examples

Ingestion, one advertiser, BigQuery target:
- Cloud Storage bucket provisioned for the CM360 account. A scheduled job lists new objects, routes by transfer type parsed from the filename (`dcm_account_XXXX_impression_2026031900_20260319_123000_2413119.csv.gz`), and loads each gzip CSV into a staging table partitioned on the processed hour. Match tables load into a `dim_*` set, overwriting the latest snapshot daily and archiving a dated copy. Loads are idempotent by processed hour so re-deliveries overwrite.

Resolve an impression to human-readable names:
- Join the impression event on Advertiser ID, Campaign ID, Placement ID, Ad ID, and Rendering ID to the `campaigns`, `placements`, `ads`, and `creatives` match tables, and on Country Code, DMA ID, City ID, State/Region, Operating System ID, and Browser/Platform ID to the geo and device match tables. The result is one wide, labeled event row.

First-touch custom attribution for a signup activity:
- Order each User ID's impressions and clicks by Event Time, keep only touches inside the click-through and view-through windows before the activity's Event Time, credit the earliest qualifying touch, and sum credited activities per campaign. Compare the total to the Floodlight signup count for the same dates and time zone.

Reconciliation check that catches a double load:
- Count raw activity rows per day from DTv2 and compare to the Floodlight/API v5 activity total per day. A day where DTv2 exceeds Floodlight by a clean multiple or a round chunk is almost always a re-delivered file loaded twice; confirm idempotency and reload that hour.

## Common pitfalls

- Summing at load time. Aggregating during ingestion destroys the log-level grain that is the whole reason to use DTv2. Load raw, aggregate in query.
- Non-idempotent loads. Re-delivered hourly files loaded again inflate counts. Key loads by processed hour and execution so a re-delivery overwrites.
- Joining old events to today's match snapshot. Renamed placements or reassigned ads mislabel historical events. Use dated snapshots when history has to be right.
- Mismatched time zones. DTv2 event time and the UI report in different zones produce a steady daily-count delta that reads like a bug. Fix and state one time zone across the pipeline.
- Different attribution windows than Floodlight. A custom model with a longer view-through window than the Floodlight config will not match the UI, for a reason unrelated to the credit rule. Match the windows first, then vary the rule deliberately.
- Treating User ID as durable cross-device identity. It is not. Quantify the unstitched share instead of pretending it is zero. See `privacy-and-consent`.
- Re-deduping activities that Floodlight already counted. The activity file already reflects the counting method. Re-deduping on top of that diverges from the trusted total unless you are deliberately re-implementing counting and reconciling.
- Trusting the 60-day bucket as an archive. Files age out after 60 days. Copy anything you need for longer into your own storage on ingest.
- Calling DTv2 the billing number. It is the analytical layer. Finance bills off Floodlight/UI/API v5 totals; reconcile to those, do not replace them.

## Sources

- [Data Transfer v2.0 overview (CM360)](https://developers.google.com/doubleclick-advertisers/dtv2/overview) (as of July 2026)
- [Data Transfer v2.0 file format (CM360)](https://developers.google.com/doubleclick-advertisers/dtv2/reference/file-format) (as of July 2026)
- [Data Transfer v2.0 match tables (CM360)](https://developers.google.com/doubleclick-advertisers/dtv2/reference/match-tables) (as of July 2026)
- [Uploading conversions overview (CM360)](https://developers.google.com/doubleclick-advertisers/guides/conversions_overview) (as of July 2026)
- [CM360 API deprecation schedule](https://developers.google.com/doubleclick-advertisers/deprecation) (as of July 2026)
- [CM360 API changelog](https://developers.google.com/doubleclick-advertisers/changelog) (as of July 2026)
