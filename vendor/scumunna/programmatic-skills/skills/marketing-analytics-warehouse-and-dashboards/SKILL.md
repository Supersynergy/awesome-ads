---
name: marketing-analytics-warehouse-and-dashboards
description: Model a cross-platform marketing reporting warehouse in BigQuery and serve it through Looker Studio with one metrics definition. Use when the user asks how to partition and cluster reporting tables, do incremental loads, build a fact and dimension model across GA4, CM360, DV360, Amazon, Meta, TikTok and search, control BigQuery cost, define one source of truth for spend and conversions, build a semantic layer, or fix Looker Studio dashboards that are slow, expensive, or disagree with each platform UI.
---

# Marketing analytics warehouse and dashboards

Turn a pile of per-platform exports and API pulls into one queryable warehouse, then serve it through dashboards that every stakeholder trusts. The job is three things done right: a BigQuery physical model that stays cheap at scale (partition, cluster, incremental load), a cross-platform fact and dimension model that lets you compare spend and conversions across GA4, CM360, DV360, Amazon, Meta, TikTok and search on the same grain, and a single metrics definition that dashboards read so two tiles never disagree.

This skill assumes you know CPM, CPC, CPA, ROAS, and the difference between an impression, a click, and a conversion. For that KPI math see the `programmatic-foundations` skill. This skill models and serves data; it does not pull it and it does not reconcile the numbers.

## When to use this skill

- "How should I partition and cluster the reporting tables?" / "Why is this query scanning the whole table?"
- "Set up incremental loads so I do not reprocess history every night."
- "Design the fact and dimension model across GA4, CM360, DV360, Amazon, Meta, TikTok and search."
- "Build one metrics definition so every dashboard agrees on spend and conversions."
- "The Looker Studio dashboard is slow / expensive / times out."
- "Two tiles show different conversion numbers." / "The dashboard does not match the platform UI."
- "Control BigQuery cost." / "Why is our BigQuery bill so high?"
- "Build a semantic layer / a governed data source for Looker Studio."

Boundaries with sibling skills:
- Pulling GA4 data through the Data API, Admin API, or Measurement Protocol: `ga4-apis-and-measurement-protocol`.
- Querying the raw GA4 event export and its nested schema: `ga4-bigquery-export-and-sql`.
- Pulling CM360 report and Floodlight data through reports or the API: `cm360-reporting-and-trafficking-api`.
- Ingesting CM360 Data Transfer v2 log-level files: `cm360-data-transfer-and-attribution`.
- Reconciling conversions and spend across platforms and against the billed number: `cross-platform-conversion-reconciliation`.
- Deciding what is a key event and how consent gates measurement: `ga4-events-and-key-events` and the consent skills.

This skill is where those feeds land, get modeled, and get served. It does not re-explain how to extract them.

## Quick reference

| Situation | Do this | Why |
| --- | --- | --- |
| Table grows every day by date | Partition by an ingestion or `DATE` column | Query one day, scan one day, not the history |
| Queries always filter one advertiser or channel | Cluster on that column (up to 4) | Block pruning skips unmatched blocks, cutting scanned bytes |
| Nightly bill keeps climbing | Force a partition filter and bound every scan | Unbounded `SELECT *` over a wildcard scans everything |
| Rebuilding the whole history each night | Incremental load with `MERGE` on a stable key | Reprocess only the changed window, usually last 3 to 30 days |
| Comparing spend and conversions across platforms | One fact table per grain, shared dimensions | Same grain and same keys make platforms comparable |
| Two dashboards disagree | Define the metric once, read it everywhere | A metric computed twice is computed two ways |
| Dashboard slow or expensive | Serve a pre-aggregated table, set data freshness | Looker Studio queries the warehouse live unless cached |
| A platform UI and the dashboard differ | Expect it, document the reason, do not "fix" data | Attribution windows and consent modeling differ by design |

## Core process

1. Fix the grain before you write any DDL, because grain is the one decision you cannot cheaply reverse. Decide the atom of each fact table: usually date by advertiser by campaign by (optionally) placement, in one currency and one timezone. Everything downstream (partition key, join keys, metric definitions) follows from the grain.
2. Land raw feeds in a staging dataset, unchanged. Keep one staging table per source (GA4 export, CM360 report, DV360 report, Amazon, Meta, TikTok, search) so you can always re-derive the model without re-pulling. Staging is append-only and cheap; do not transform here.
3. Partition and cluster every table that grows with time. Partition on the date, cluster on the columns you filter by most (advertiser, channel, campaign). This is the single biggest lever on cost because BigQuery bills on bytes scanned. The physical-model rules and DDL are in `references/warehouse-modeling-and-cost.md`.
4. Load incrementally, not from scratch. Run a `MERGE` keyed on a stable natural key over a bounded recent window (platforms restate the last few days), so you reprocess days, not years. The incremental pattern and the restatement window per platform are in the same reference.
5. Conform to shared dimensions. Build a `dim_date`, `dim_channel`, `dim_advertiser`, and `dim_campaign` that every fact table joins to, and a crosswalk that maps each platform's ids and channel names into your canonical values. This is what makes "compare Meta to DV360" a join and not a spreadsheet. The model and the crosswalk are in `references/cross-platform-fact-dim-model.md`.
6. Define each metric exactly once. Put spend, impressions, clicks, conversions, CPA, and ROAS in one governed view or one set of Looker Studio calculated fields, and make every dashboard read that. Two tiles disagree only when the metric was defined twice. The semantic-layer patterns are in `references/looker-studio-semantic-layer.md`.
7. Serve from a shape built for serving. Point Looker Studio at a pre-aggregated daily table or a governed view, not the raw event export, so tiles are fast and cheap. Set data freshness to match how often the warehouse actually updates.
8. Reconcile before you publish, then keep the differences documented. The warehouse total will not equal each platform UI (attribution windows, consent modeling, dedup all differ). Confirm the gaps are the expected ones with `cross-platform-conversion-reconciliation`, write them down, and never quietly patch data to force a match.

## Decision rules and thresholds

### Partitioning

- Partition any table that grows with time. Use a `DATE`, `TIMESTAMP`, or `DATETIME` column, ingestion-time partitioning, or an integer range. For marketing facts, partition on the report date.
- Prefer daily granularity. BigQuery caps the number of partitions per table (a documented hard limit), so daily partitions on a multi-year table are fine but hourly usually is not. If you would exceed the ceiling, use a coarser granularity.
- Turn on `require_partition_filter` on large facts so a query without a date filter fails loudly instead of scanning the whole table and running up the bill.
- Set partition expiration where you do not need deep history, so old partitions drop automatically instead of accruing storage cost.

### Clustering

- Cluster on the columns you filter or group by most, in order of how often they appear in a `WHERE` clause. Marketing facts cluster well on advertiser, then channel, then campaign.
- You can specify at most four clustering columns. Order matters: BigQuery prunes blocks only when the query filters the clustering columns from the first one onward, so a filter on the second column alone gets no benefit.
- Combine clustering with partitioning. Partition removes days you do not need; clustering removes blocks within a day you do not need. Together they cut scanned bytes the most.

### Incremental loads

- Never rebuild history nightly. Load the recent window platforms can still restate and `MERGE` it in. Typical restatement windows: GA4 export can receive late hits up to about 72 hours, most ad platforms restate the last 3 to 7 days, and view-through and longer conversion windows can move numbers for up to 28 to 90 days depending on the platform and window.
- Choose the window per fact table from the longest attribution or restatement it feeds. A 7-day click plus 1-day view fact needs at least an 8-day reprocessing window; a 90-day view-through fact needs 90.
- Key the `MERGE` on a stable natural key (for example date plus advertiser id plus campaign id plus placement id), not on a surrogate you generate, so a restated row updates in place instead of duplicating.

### Cost control

- BigQuery on-demand billing charges for bytes scanned, not rows returned, so `SELECT *` over a wildcard with no date bound is the most expensive query you can write. Bound every scan.
- Serve dashboards from a pre-aggregated daily table, not from the raw GA4 event export. A dashboard that hits a billion-row table on every tile refresh burns money and times out.
- Use Looker Studio data freshness (the cache) deliberately. Cached tiles do not re-query BigQuery, which cuts cost and speeds the report; a manual refresh or a cache miss does re-query and does bill. See the serving rules below.

### Serving and freshness

- Looker Studio caches query results in memory and serves from cache while the data is within its freshness threshold. Configurable freshness runs from every 1 to 50 minutes or every 1 to 12 hours, with 12 hours the default.
- Match freshness to the warehouse cadence. If the nightly load finishes at 6am, a 12-hour freshness is fine and cheap; a 15-minute freshness re-queries BigQuery all day for data that only changes once, wasting money.
- Never point a stakeholder dashboard at a live, unaggregated event table. Point it at the served daily table so freshness and cost are predictable.

### One metric, one definition

- Define spend, impressions, clicks, conversions, CPA (`spend / conversions`), and ROAS (`revenue / spend`) once, in a governed BigQuery view or one shared set of Looker Studio calculated fields, and reference it everywhere.
- Two tiles disagree only when the same metric was computed in two places with two slightly different filters (one included a channel, one deduped conversions, one used a different attribution column). Centralize the definition and the disagreement disappears.

### 2026 ground truth that changes the model

- GA4 counts "key events," not "conversions." Model the column as `key_events` and map it to whatever a given campaign calls a conversion in the crosswalk. Labeling a GA4 measure "conversions" is where cross-platform comparisons quietly go wrong.
- The June 2026 consent change gates ads-data flow on consent, so GA4 modeled conversions in the UI and raw event counts in the export can legitimately diverge. The warehouse holds observed events; do not expect it to equal the modeled UI number.
- Privacy Sandbox advertising APIs (Topics, Protected Audience, Attribution Reporting) were retired on October 17, 2025, and third-party cookies stay in Chrome. Do not model a warehouse feed from a retired Sandbox API. Signal loss is real on Safari, Firefox, iOS, and where consent is denied, which is exactly why the fact model must carry a consent-state column.
- DV360 exports and API pulls are on API v4 and Structured Data Files v10. Pin those versions in the extract layer that feeds staging so a version bump does not silently break schemas.

## Reference material

- `references/warehouse-modeling-and-cost.md`: the physical model. Partitioning and clustering decision tables, `CREATE TABLE` DDL with `PARTITION BY` / `CLUSTER BY` / `require_partition_filter` / partition expiration, the incremental `MERGE` pattern with restatement windows per platform, staging-to-mart layering, and the bytes-scanned cost rules. Read this when you are writing DDL or chasing a BigQuery bill.
- `references/cross-platform-fact-dim-model.md`: the logical model. Fact tables by grain (daily performance, conversion, spend), the conformed dimensions (`dim_date`, `dim_channel`, `dim_advertiser`, `dim_campaign`), the per-platform field crosswalk that maps GA4, CM360, DV360, Amazon, Meta, TikTok and search ids and metric names into canonical columns, and the currency and timezone normalization rules. Read this when you are designing tables or wiring a new platform in.
- `references/looker-studio-semantic-layer.md`: the serving layer. How to build one metrics definition (governed view vs shared calculated fields), blended vs single-source data sources, the served-table pattern, data-freshness and cache settings, and the checklist for why two tiles disagree or a dashboard is slow. Read this when you are building or debugging a dashboard.

## Templates and examples

Partitioned, clustered daily performance fact (BigQuery Standard SQL):

```sql
CREATE TABLE `analytics_mart.fact_performance_daily`
(
  report_date   DATE      NOT NULL,
  channel       STRING    NOT NULL,   -- canonical: 'display', 'video', 'search', 'social', 'retail_media'
  advertiser_id STRING    NOT NULL,
  campaign_id   STRING    NOT NULL,
  placement_id  STRING,
  impressions   INT64,
  clicks        INT64,
  spend_usd     NUMERIC,
  key_events    INT64,               -- GA4 key events; NOT called "conversions"
  revenue_usd   NUMERIC,
  consent_state STRING                -- 'granted', 'denied', 'unknown' from the source event
)
PARTITION BY report_date
CLUSTER BY advertiser_id, channel, campaign_id
OPTIONS (
  require_partition_filter = TRUE,
  partition_expiration_days = 800     -- ~26 months; drop older partitions automatically
);
```

Incremental load that only reprocesses the platform restatement window:

```sql
MERGE `analytics_mart.fact_performance_daily` T
USING (
  SELECT report_date, channel, advertiser_id, campaign_id, placement_id,
         impressions, clicks, spend_usd, key_events, revenue_usd, consent_state
  FROM   `analytics_staging.stg_performance`
  WHERE  report_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 8 DAY)   -- 7-day click + 1-day view
) S
ON  T.report_date   = S.report_date
AND T.channel       = S.channel
AND T.advertiser_id = S.advertiser_id
AND T.campaign_id   = S.campaign_id
AND IFNULL(T.placement_id, '') = IFNULL(S.placement_id, '')
WHEN MATCHED THEN UPDATE SET
  impressions = S.impressions, clicks = S.clicks, spend_usd = S.spend_usd,
  key_events  = S.key_events,  revenue_usd = S.revenue_usd, consent_state = S.consent_state
WHEN NOT MATCHED THEN INSERT ROW;
```

One metrics definition as a governed view every dashboard reads:

```sql
CREATE OR REPLACE VIEW `analytics_mart.v_kpi_daily` AS
SELECT
  report_date, channel, advertiser_id, campaign_id,
  SUM(impressions) AS impressions,
  SUM(clicks)      AS clicks,
  SUM(spend_usd)   AS spend,
  SUM(key_events)  AS key_events,
  SUM(revenue_usd) AS revenue,
  SAFE_DIVIDE(SUM(spend_usd), NULLIF(SUM(key_events), 0)) AS cpa,
  SAFE_DIVIDE(SUM(revenue_usd), NULLIF(SUM(spend_usd), 0)) AS roas
FROM `analytics_mart.fact_performance_daily`
WHERE report_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 400 DAY)
GROUP BY report_date, channel, advertiser_id, campaign_id;
```

Serving decision, worked: a client dashboard refreshed by 30 analysts all morning was scanning the 900M-row GA4 event export on every tile. Fix was to build `fact_performance_daily` above (about 4M rows), point Looker Studio at it, and set data freshness to every 1 hour (the nightly load finishes at 6am, so hourly is generous). Scanned bytes per report load dropped by more than two orders of magnitude and tiles stopped timing out.

## Common pitfalls

- No partition filter, so every query scans the whole table. Turn on `require_partition_filter` and always bound the date. This is the most common cause of a runaway BigQuery bill.
- Clustering on the wrong column order. If the frequent filter is on campaign but the table is clustered advertiser-first and campaign-third, filtering on campaign alone gets no pruning. Order clustering columns by filter frequency.
- Rebuilding history every night. It works at 10M rows and quietly costs a fortune at 1B. Switch to a `MERGE` over the restatement window.
- Mixing grains in one fact table. A table that is sometimes campaign-level and sometimes placement-level double-counts on any rollup. Pick one grain per table.
- Calling GA4 key events "conversions" and comparing them to a platform's post-view conversions as if they are the same measure. They are not; map both into the crosswalk and label them honestly.
- Defining the same metric in two dashboards. The moment CPA is computed in two places it will be computed two ways. Centralize it in a view or shared calculated field.
- Pointing Looker Studio at the raw event export. Slow, expensive, and it times out under concurrency. Serve a pre-aggregated table.
- Freshness set too aggressive. A 15-minute freshness on data that updates once a night re-queries BigQuery all day for nothing. Match freshness to the load cadence.
- Forcing the warehouse to match a platform UI. Attribution windows, consent modeling, and dedup differ by design, and the June 2026 consent gating widened the GA4 gap. Document the expected differences with `cross-platform-conversion-reconciliation` instead of patching data.

## Sources

- [BigQuery partitioned tables](https://cloud.google.com/bigquery/docs/partitioned-tables) (as of July 2026)
- [BigQuery clustered tables](https://cloud.google.com/bigquery/docs/clustered-tables) (as of July 2026)
- [GA4 BigQuery Export (types, limits, streaming cost)](https://support.google.com/analytics/answer/9358801?hl=en) (as of July 2026)
- [Manage data freshness in Looker Studio](https://cloud.google.com/looker/docs/studio/manage-data-freshness) (as of July 2026)
- [Looker Studio developer documentation](https://developers.google.com/looker-studio) (as of July 2026)
- [Display & Video 360 API release notes (v4, SDF v10)](https://developers.google.com/display-video/api/release-notes) (as of July 2026)
- [Privacy Sandbox: update on plans for Privacy Sandbox technologies](https://privacysandbox.google.com/blog/update-on-plans-for-privacy-sandbox-technologies) (as of July 2026)
