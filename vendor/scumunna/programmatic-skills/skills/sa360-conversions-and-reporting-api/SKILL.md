---
name: sa360-conversions-and-reporting-api
description: Wire Search Ads 360 conversion sources (Floodlight, Google Ads conversion actions, and GA4) and pull performance data with the read-only Reporting API v0 using the SA360 Query Language. Use when the user asks how conversions get into SA360, the difference between the Conversions and All conversions columns, how GA4 key events reach SA360, how to query SA360 with SearchAds360 search or searchStream, how to page through results, why cost is in micros, how to segment by conversion action or date, or why the new SA360 API report does not match the old DoubleClick Search reporting.
---

# SA360 conversions and reporting API

Two jobs, one skill: get the right conversions counting in Search Ads 360, then pull them out cleanly with the Reporting API v0. Conversions enter SA360 from Floodlight, Google Ads conversion actions, and Google Analytics (GA4), and the read-only Reporting API returns them with the SA360 Query Language over the `searchAds360:search` and `searchAds360:searchStream` methods. Get the source wiring wrong and every downstream number is wrong; get the query wrong and you pull the wrong column, the wrong window, or a truncated page.

This skill assumes you know CPA, ROAS, click-through vs view-through, and lookback windows. For that KPI math see the `programmatic-foundations` skill. This is the conversion and reporting layer, not the account tree and not bidding.

## When to use this skill

- "How do conversions get into SA360?" / "What conversion sources does SA360 support?"
- "What is the difference between Conversions and All conversions?" / "Which column does bidding use?"
- "How do GA4 key events / conversions show up in SA360?"
- "Query SA360 with the Reporting API." / "How do I use searchAds360:search vs searchStream?"
- "Write an SA360 Query Language (SAQL) query for campaign performance by day."
- "How do I page through SA360 API results?" / "Why is my result set capped?"
- "Why is cost 12500000 in the API?" (micros) / "How do I segment by conversion_action?"
- "Why does the new SA360 API not match the old DoubleClick Search reporting?"
- "How do I pull conversions by conversion date instead of click date?"

Boundaries with sibling skills:
- The Manager/Sub-Manager tree, engine accounts, and engine track accounts: `sa360-account-structure-and-engines`.
- Portfolio vs native bid strategies, performance plans, pacing: `sa360-bidding-and-budget-management`.
- Building Floodlight activities themselves (counting methods, windows, offline uploads): `cm360-floodlight-and-conversions`.
- Sharing one Floodlight across GMP and linking GA4 to the products: `gmp-integration-floodlight-ga4-linking`.
- Designing the GA4 event model and marking key events: `ga4-events-and-key-events`.
- When SA360 and GA4 or CM360 numbers still disagree after this: `cross-platform-conversion-reconciliation`.

## Quick reference

Conversion sources into SA360:

| Source | What it is | How it counts in SA360 | Use it when |
| --- | --- | --- | --- |
| Floodlight activity | CM360 cross-channel conversion of record | Shared Floodlight columns, deduped across GMP | You buy across DV360 and SA360 and need one deduped conversion |
| Google Ads conversion action | Native Google Ads conversion (tag, import, or call) | Flows from the linked Google Ads engine account | The engine account already has Google Ads conversion tracking you trust |
| Google Analytics (GA4) | GA4 conversions surfaced through the linked stack | Appear as conversion columns you can choose to optimize | You want on-site GA4 outcomes usable for SA360 bidding |

Reporting API at a glance:

| You want | Method | Notes |
| --- | --- | --- |
| A bounded, paged report | `customers/{id}/searchAds360:search` (POST) | Default page size 10,000 rows; page with `pageToken` |
| A full result set in one stream | `customers/{id}/searchAds360:searchStream` (POST) | More efficient for bulk pulls, no manual paging |
| The set of accounts you can query | `customers:listAccessibleCustomers` (GET) | Start here to discover customer IDs |
| The schema for a field or resource | `searchAds360Fields:search` / `:get` | Confirm a field exists and is selectable before querying |

Service host: `searchads360.googleapis.com`. Version: v0 (read-only). Cost and monetary values come back in micros (1,000,000 micros = 1 unit of account currency).

## Core process

1. Confirm the conversion sources before you report, because the report only reflects what is wired. Check which of Floodlight, Google Ads conversion actions, and GA4 are feeding the SA360 account, and which conversion actions are marked to include in the Conversions column. If a source is not connected, its conversions are simply absent, not zero-because-nothing-happened.
2. Decide which column you are optimizing and reporting. Conversions is the curated set chosen for bidding; All conversions is every tracked action regardless of the include-in-conversions setting. Bidding reads Conversions, so a source left out of that column will never influence a bid even though it shows in All conversions.
3. Pick click-time vs conversion-time reporting deliberately. SA360 defaults to click-time (the conversion credited back to the click date), which keeps restating recent days as conversions land. Conversion-time (also called conversion-date) attributes to the day the conversion happened, which stabilizes closed periods. Pick one per report and label it, because the two never match on recent days.
4. Discover the customer IDs you can query with `listAccessibleCustomers`, then set the `login-customer-id` header to the manager account through which you are authorized. Mismatching the login customer to the queried customer is the most common auth failure on the new API.
5. Write the SAQL query: `SELECT` the resource, segment, and metric fields you need, `FROM` the resource, add `WHERE segments.date DURING ...` and any filters, and note that ordering and limits are expressed in the query itself. Only request fields the schema says are selectable together; incompatible field combinations are rejected rather than silently dropped.
6. Choose search or searchStream. Use `searchAds360:search` when you want paging control and a bounded response; use `searchAds360:searchStream` when you want the whole result set in one pass for a warehouse load. Both take the same query.
7. Page every `search` call to exhaustion. The default page size is 10,000 rows and a `nextPageToken` in the response means there is more; a pull that stops at the first page silently truncates the report. searchStream avoids this because it returns everything.
8. Convert micros and normalize before anyone reads the number. Divide cost_micros and any `*_micros` value by 1,000,000, and confirm the account currency, because a raw micros figure in a client report reads as a 1,000,000x error.

Safe-by-default: the Reporting API is read-only, so pulling reports is non-destructive. But changing which conversion actions are included in the Conversions column, or switching the account attribution model, changes what every bid strategy optimizes toward. Treat those source and column changes as human-gated, read the current setup first, and never flip include-in-conversions on a live account to "see what happens."

## Decision rules and thresholds

### Which conversion source to trust

- Cross-channel GMP buy that must dedupe one conversion across DV360 and SA360: Floodlight is the conversion of record. Share it across GMP (see `gmp-integration-floodlight-ga4-linking`) and bid SA360 against the Floodlight-driven Conversions column.
- Search-only account where Google Ads conversion tracking is already trusted: use the Google Ads conversion actions that flow from the linked engine account. Do not also count the same action through Floodlight, or you double count.
- On-site GA4 outcomes you want SA360 to optimize toward: bring the GA4 conversions in through the linked stack and mark the ones you want in the Conversions column. GA4 in GA4 uses the term key events; what SA360 optimizes is the conversion column you select. Do not add a GA4 count and a Floodlight count into one total; they observe overlapping events with different identity and windows.

### Conversions vs All conversions

- Report and optimize on Conversions when the number must drive or reflect bidding. It is the curated set the bid strategy actually uses.
- Report on All conversions when you want the full picture of every tracked action, including ones deliberately excluded from bidding (for example micro-conversions you track but do not bid to).
- Never present All conversions as the KPI a Target CPA or Target ROAS is being held to. The strategy is held to Conversions and Conversions value; mixing the columns makes the CPA look artificially low.

### Click-time vs conversion-time

- Use click-time (default) when you need conversions credited to the media that drove them for optimization and click-based CPA. Expect the last several days to keep rising as delayed conversions attach to earlier clicks.
- Use conversion-time when you need a stable, closed accounting period (finance, month-end) where a day's number will not restate later.
- Do not compare a click-time pull from Monday with a conversion-time pull from Tuesday and call the delta a performance change. It is a methodology difference.

### Reporting API version and migration

- The new Search Ads 360 Reporting API is v0 and read-only. It replaces the old DoubleClick Search API. If a script still calls DoubleClick Search endpoints or expects write/report-generation semantics, it is on the retired surface and must be migrated.
- The new API returns numbers from the new Search Ads 360 experience, which structures accounts and conversions differently from the legacy product. A one-to-one tie to old DoubleClick Search reports is not guaranteed; reconcile on definitions, not on an exact match.
- Field availability changes by release. Confirm a field with `searchAds360Fields` before depending on it, because segments and metrics are added over time (for example newer conversion-with-cart-data metrics and vertical ads segments).

### Paging and limits

- `search` returns up to a default 10,000 rows per page. Always loop on `nextPageToken` until it is empty.
- Prefer `searchStream` for warehouse loads and any pull you expect to exceed a page, because it returns the full set without manual paging and is more efficient for bulk retrieval.
- A query that selects a very wide field set or an unbounded date range is slow and easy to truncate by mistake. Constrain `segments.date DURING` and select only the fields you will use.

## Reference material

- `references/conversion-sources-and-columns.md`: the three conversion sources (Floodlight, Google Ads conversion actions, GA4) mapped to how each enters SA360, the exact Conversions vs All conversions column semantics, the include-in-conversions control, click-time vs conversion-time behavior, and a decision table for which source owns which conversion. Read this when wiring sources or explaining why a conversion count is off.
- `references/ga4-via-floodlight.md`: how GA4 outcomes reach SA360, the relationship between GA4 key events and the SA360 conversion column, where GA4 conversions can flow through Floodlight versus a direct product link, the June 2026 consent gate on Google Ads data, and why GA4 and SA360 never match to the unit. Read this when GA4 conversions are missing from SA360 or look different from GA4.
- `references/reporting-api-v0-query-language.md`: the SAQL grammar (SELECT/FROM/WHERE/ORDER BY/LIMIT/PARAMETERS), the request and response field maps for `search` and `searchStream`, auth headers (`login-customer-id`, developer token, OAuth), a full field-category table (attributes, segments, metrics), micros handling, paging, and ready-to-run query patterns. Read this when writing or debugging a query or a pull script.

## Templates and examples

Campaign performance by day, click-time, one calendar month (SAQL):

```
SELECT
  campaign.id,
  campaign.name,
  segments.date,
  metrics.impressions,
  metrics.clicks,
  metrics.cost_micros,
  metrics.conversions,
  metrics.conversions_value
FROM campaign
WHERE segments.date DURING LAST_30_DAYS
  AND campaign.status = 'ENABLED'
ORDER BY segments.date
```

POST it to `https://searchads360.googleapis.com/v0/customers/1234567890/searchAds360:search` with the OAuth bearer token, the developer token header, and `login-customer-id: 9876543210` (the manager account you authorized through). Divide `metrics.cost_micros` by 1,000,000 for spend in account currency.

Conversions broken out by conversion action (to see which source drives the number):

```
SELECT
  campaign.name,
  segments.conversion_action_name,
  metrics.conversions,
  metrics.all_conversions
FROM campaign
WHERE segments.date DURING LAST_7_DAYS
```

Compare `metrics.conversions` against `metrics.all_conversions` per action to spot actions that are tracked but excluded from bidding.

Bulk warehouse load, whole account, one quarter, no paging (searchStream):

```
SELECT
  campaign.id,
  ad_group.id,
  segments.date,
  segments.device,
  metrics.impressions,
  metrics.clicks,
  metrics.cost_micros,
  metrics.conversions
FROM ad_group
WHERE segments.date BETWEEN '2026-01-01' AND '2026-03-31'
```

POST to `.../searchAds360:searchStream`. Stream the rows straight into staging, then divide micros and cast dates on load.

Discover accounts before querying:

```
GET https://searchads360.googleapis.com/v0/customers:listAccessibleCustomers
```

Returns the resource names of customers your credentials can reach. Extract the numeric customer IDs, then query each with the correct `login-customer-id`.

## Common pitfalls

- Truncating a `search` pull at the first page. The default is 10,000 rows and a `nextPageToken` means more remain. Loop until the token is empty, or use searchStream. A silent truncation looks like a real performance drop.
- Reporting micros as the actual amount. `cost_micros` of 12,500,000 is 12.50 in account currency, not 12.5 million. Divide every `*_micros` field by 1,000,000 and confirm the currency.
- Confusing Conversions with All conversions. Bidding uses Conversions; All conversions includes actions excluded from bidding. Holding a Target CPA to All conversions makes efficiency look better than it is.
- Mixing click-time and conversion-time in the same trend. The two never agree on recent days by design. Label the report and keep one method per comparison.
- Double counting a conversion across sources. The same purchase tracked as both a Floodlight activity and a Google Ads conversion action counts twice if both are included. Pick one source of record per conversion.
- Assuming GA4 in GA4 equals SA360. GA4 uses key events with its own identity and attribution; SA360 optimizes the conversion column you select. They will not tie to the unit. Reconcile on definitions in `cross-platform-conversion-reconciliation`.
- Calling old DoubleClick Search endpoints. The new API is the read-only Reporting API v0 with a different structure. Legacy scripts must migrate; a stale endpoint returns the wrong thing or nothing.
- Wrong `login-customer-id`. If the login customer does not match how you are authorized to the queried customer, the call fails or returns empty. Set it to the manager account you have access through.
- Depending on a field that was not in your API version. Segments and metrics are added over releases. Confirm with `searchAds360Fields` before shipping a query that assumes a newer field.
- Flipping include-in-conversions on a live account to test. It changes what every bid strategy optimizes toward. Read first, stage the change, human-gate it.

## Sources

- [Search Ads 360 Reporting API, search method (REST reference)](https://developers.google.com/search-ads/reporting/api/reference/rest/search) (as of July 2026)
- [Search Ads 360 Reporting API release notes](https://developers.google.com/search-ads/reporting/api/reference/release-notes) (as of July 2026)
- [Search Ads 360 Reporting API quickstart guide](https://developers.google.com/search-ads/reporting/quickstart/quickstart-guide) (as of July 2026)
- [Search Ads 360 Reporting API, campaign resource fields (v0)](https://developers.google.com/search-ads/reporting/api/reference/fields/v0/campaign) (as of July 2026)
- [Search Ads 360 Reporting API overview](https://developers.google.com/search-ads/reporting) (as of July 2026)
- [Reporting conversions (Search Ads 360 Help)](https://support.google.com/sa360/answer/9157988?hl=en) (as of July 2026)
