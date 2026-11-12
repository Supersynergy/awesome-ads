---
name: cm360-reporting-and-trafficking-api
description: Pull Campaign Manager 360 performance and Floodlight data through UI reports and the CM360 API v5 (Reporting plus Trafficking), and avoid the v4 sunset. Use when the user asks how to build or download a CM360 report, pick a report type (Standard, Reach, Floodlight, Path to Conversion, Cross-Media Reach), run a report through the API, poll for the report file, automate reporting, read or audit trafficking objects programmatically, migrate off API v4, fix a report that broke after an update, or set OAuth scopes and quotas for dfareporting.
---

# CM360 reporting and Trafficking API

Get numbers out of Campaign Manager 360 two ways: build a report (in the UI or through the Reporting API) that CM360 processes into a downloadable file, and read or audit the trafficking objects (advertisers, campaigns, placements, ads) through the Trafficking API. Both live in the same v5 API under the `dfareporting` service. The job here is to pull data correctly and at scale, pick the right report type, run the async report-then-file flow without race conditions, and stay off the deprecated surfaces so a pipeline does not break at the next sunset.

This skill assumes you know impressions, clicks, CTR, CPM, and view-through vs click-through. For that math see the `programmatic-foundations` skill. It does not configure what gets measured or trafficked; it reads what already exists.

## When to use this skill

- "How do I build / download a report in CM360?" / "Which report type do I need?"
- "Standard vs Reach vs Floodlight vs Path to Conversion vs Cross-Media Reach?"
- "Run a CM360 report through the API." / "How do I poll for the report file?"
- "Automate a daily CM360 pull into BigQuery / a warehouse."
- "Read placements / ads / campaigns through the Trafficking API to audit them."
- "We are on API v4, what breaks when it sunsets?" / "Migrate to v5."
- "The report / API call broke after a Google update." / "Natural Search columns disappeared."
- "What OAuth scope and quota does dfareporting need?"

Boundaries with sibling skills. This skill owns reading data and objects through reports and the v5 API.
- Configuring Floodlight activities, counting methods, conversion windows, and uploading conversions (`batchinsert` / `batchupdate`): hand off to `cm360-floodlight-and-conversions`.
- Building the object hierarchy, trafficking placements and ads, generating and QAing placement tags and macros: hand off to `cm360-trafficking-and-ad-tags`. That skill writes objects; this one reads and audits them.
- Log-level impression / click / activity files for custom attribution (Data Transfer v2), not the aggregated Reporting API: hand off to `cm360-data-transfer-and-attribution`.
- Deduping the CM360 number against GA4 and each DSP into a blended KPI: `cross-platform-conversion-reconciliation`.
- Wiring Floodlight into GA4, DV360, and SA360 and holding one attribution model: `gmp-integration-floodlight-ga4-linking`.

## Quick reference: pick the report type

| You need | Report type | v5 `type` enum | Criteria field |
| --- | --- | --- | --- |
| Impressions, clicks, cost, activity metrics by campaign/site/placement/date | Standard | `STANDARD` | `criteria` |
| Unique reach and average frequency for display/video | Reach | `REACH` | `reachCriteria` |
| Conversion counts and value by Floodlight activity, custom variables (u1..u100) | Floodlight | `FLOODLIGHT` | `floodlightCriteria` |
| The ordered touchpoint paths that led to a conversion | Path to Conversion | `PATH_TO_CONVERSION` | `pathToConversionCriteria` |
| Deduplicated reach across CM360 and connected channels | Cross-Media Reach | `CROSS_MEDIA_REACH` | `crossMediaReachCriteria` |

There are exactly five report types in v5. Reach reports carry unique-reach and frequency; Floodlight reports carry conversion and transaction metrics; the rest are interaction-level. A report always produces a downloadable file, never a live JSON body of rows: you build the report, run it, then download the generated CSV or Excel file.

## Quick reference: reports (async) vs Trafficking (sync)

| Task | Surface | Shape |
| --- | --- | --- |
| Get aggregated performance / conversion rows | Reporting API | Async: build report -> run -> poll file -> download file |
| Read or audit an object (placement, ad, campaign) | Trafficking API | Sync: `list` / `get` returns JSON directly |
| One-off numbers a human reads | UI report builder | Build, save, run, download in the UI |
| Same pull every day into a warehouse | Reporting API + a scheduler | Reuse one saved report, run it, fetch the new file |

## Core process: pull data through the Reporting API

The Reporting API is asynchronous by design. A report is a saved definition; running it produces a file you download later. Do not try to read rows from the run response.

1. Authenticate against the `dfareporting` service with OAuth 2.0 and the scope `https://www.googleapis.com/auth/dfareporting` (read and write reports) or `dfareporting.readonly` if you only fetch existing files. Every call is scoped to a `profileId` (the CM360 user profile), so resolve the profile first with `userProfiles.list`.
2. Point at v5. The base path is `https://dfareporting.googleapis.com/dfareporting/v5/...`. v4 and earlier are on the sunset track; write new pipelines on v5 only. See `references/api-v5-changes-and-quotas.md`.
3. Define or reuse the report. Create it once with `reports.insert` (set `type` and the matching criteria block, date range, dimensions, metrics, filters), or reuse a saved report by id. Reusing one saved definition per daily pull is cheaper and keeps the schema stable.
4. Validate fields before you save. Dimensions, metrics, and filters are not all mutually compatible. Query `reports.compatibleFields.query` to confirm the combination is valid, because an incompatible field mix fails the run, not the insert.
5. Run the report with `reports.run` (POST to `.../reports/{reportId}/run`). It returns a `File` object, normally with status `PROCESSING` or `QUEUED`. Leave `synchronous` off for anything but a tiny report; a synchronous run blocks and times out on large date ranges.
6. Poll the file, do not guess. Take the `File.id` from the run response and poll `reports.files.get` (or `files.get`) until `status` is `REPORT_AVAILABLE`. Back off between polls (for example start at a few seconds, grow to 30 to 60 seconds); do not hammer it. Terminal failure states are `FAILED` and `CANCELLED`; stop and surface the error.
7. Download the file, not the metadata. When `status` is `REPORT_AVAILABLE`, download the bytes from `File.urls.apiUrl` with an alt=media request (the API path), or hand `File.urls.browserUrl` to a human. `format` is `CSV` or `EXCEL`. Parse past the header block; CM360 report files carry report metadata rows before the column header and a grand-total row after the data.
8. Load and reconcile. Land the CSV in the warehouse, then reconcile the totals against the UI and against downstream systems before anyone trusts it. Hand off to `cross-platform-conversion-reconciliation`.

Safe-by-default: reading reports and listing objects is read-only and safe to run unattended. Anything that writes (creating or editing a report definition, and every Trafficking write) changes shared state, so treat report edits as reviewable and never issue Trafficking writes from this skill; those belong to `cm360-trafficking-and-ad-tags` behind a human gate.

## Core process: read and audit objects through the Trafficking API

The Trafficking API is synchronous. Use it to audit at scale, not to traffic (writes live in `cm360-trafficking-and-ad-tags`).

1. Authenticate the same way, scoped to a `profileId`. `dfareporting.readonly`-style read access is enough for an audit; do not request write scope you will not use.
2. List with server-side filters and paginate. `advertisers.list`, `campaigns.list`, `sites.list`, `placements.list`, `ads.list`, `creatives.list` all accept filter parameters (ids, search strings, date windows) and return `nextPageToken`. Filter server-side; never pull the whole account and filter in memory.
3. Fetch single objects with `get` when you have an id. Use `list` plus filters to sweep, `get` to inspect one.
4. Read only what the audit needs. To check that placements have correct sizes and active dates, list placements with a compatibility and date filter; you do not need the ads or creatives for that check.
5. Respect the quota. The API enforces per-project and per-profile request limits; batch, cache, and back off on `429`. See `references/api-v5-changes-and-quotas.md`.

## Decision rules and thresholds

### Report type

- Impressions, clicks, cost, and standard activity metrics sliced by media dimensions -> `STANDARD`. This is the default for delivery and pacing.
- Unique people and average frequency, not gross impressions -> `REACH`. Reach and frequency are their own metrics; a Standard report cannot dedupe people.
- Conversions and revenue by Floodlight activity, or a breakdown by custom Floodlight variable -> `FLOODLIGHT`. Floodlight reports separate conversion metrics (which carry value) from transaction metrics (which only count events).
- The path of touchpoints before a conversion -> `PATH_TO_CONVERSION`. Set `clicksLookbackWindow`, `impressionsLookbackWindow`, and `maximumInteractionGap` in its `reportProperties` deliberately; they define what counts as one path.
- One deduplicated reach number across CM360 and connected channels -> `CROSS_MEDIA_REACH`. This replaces the older cross-dimension reach construct; do not reach for a `CROSS_DIMENSION_REACH` type in v5, it is not there.

### Sync vs async run

- Default to asynchronous (`synchronous` unset). Build, run, poll, download. This survives large date ranges and big accounts.
- Use `synchronous=true` only for a tiny, known-small report where you accept the request blocking. It will time out on anything large, so it is not a general pattern.

### Polling discipline

- Poll `reports.files.get`, do not sleep a fixed guess and assume the file is ready. File processing time scales with rows and date range.
- Use exponential-ish backoff and a hard timeout. Treat `FAILED` and `CANCELLED` as terminal; do not retry the same broken report in a loop, fix the definition first.
- Cache the `File.id`. Re-running a report makes a new file; fetch the file you just triggered, not the last one in `files.list`.

### Version discipline (avoid the v4 sunset)

- Build every new pipeline on v5. The service supports roughly three concurrent versions and turns down the oldest; a version past sunset returns HTTP 403, then 404. Pinning to v4 buys a deadline, not stability.
- `reports.patch` was removed in v5; use `reports.update` (full update) to modify a report definition. Code that called `patch` breaks on v5.
- Some report fields were dropped in v5: `crossDimensionReachCriteria` and `enableAllDimensionCombinations` are gone from Reports, and `dynamicAssetSelection` / `creativeAssetSelection` from Creatives. If your report or audit references them, remove them before migrating.
- When editing a Floodlight activity through Trafficking, v5 requires `conversionCategory` whenever `attributionEnabled` is true. A previously valid patch can now fail without it.

### Reporting drift (fields that moved out from under you)

- Natural Search dimensions and metrics were removed from the CM360 UI and API around January 2026, and CM360 attribution shifted to paid-click only. A report that grouped by or summed Natural Search columns returns empty or errors; drop those columns.
- Paid social metrics sourced from Search Ads 360 were deprecated in CM360 reporting around March 2026. Do not build new reports on them.
- Display impression counting moved to a begin-to-render methodology (rolled out from September 2025). Impression totals can step relative to older periods, so annotate the changeover date and do not treat a level shift as a delivery problem.

## Reference material

- `references/report-types-and-download-only.md`: the five report types side by side (Standard, Reach, Floodlight, Path to Conversion, Cross-Media Reach) with the metrics and dimensions each one carries, the criteria block each uses, the download-only file model (metadata rows, header, grand-total row), CSV vs Excel, and how to parse a CM360 report file safely. Read this when choosing a report type or writing the parser.
- `references/api-v5-changes-and-quotas.md`: the v5 vs v4 delta (removed `reports.patch`, dropped Reports and Creatives fields, the `conversionCategory` requirement, the recent v5 additions), the version-support and sunset model (403 then 404), OAuth scopes (`dfareporting`, `dfareporting.readonly`), the `dfareporting` base path, quota and pagination behavior, and the reporting-drift list (Natural Search removal, paid-social deprecation, begin-to-render impressions). Read this before migrating off v4 or when a call started failing after an update.
- `references/reporting-api-workflow.md`: the full async run-and-poll flow with the exact method sequence (`userProfiles.list` -> `reports.insert` or reuse -> `reports.compatibleFields.query` -> `reports.run` -> poll `reports.files.get` -> download `File.urls.apiUrl`), the `File` object field map and status enum (`QUEUED`, `PROCESSING`, `REPORT_AVAILABLE`, `FAILED`, `CANCELLED`), a backoff and error-handling recipe, and the Trafficking `list`/`get` audit pattern with pagination. Read this when building or debugging an automated pull.

## Templates and examples

Daily delivery pull into a warehouse (Standard report, automated):

```
Report: type STANDARD, saved once with reports.insert
  dateRange: LAST_7_DAYS (relative, so the same saved report rolls forward)
  dimensions: date, campaign, campaignId, site, placement, placementId
  metrics: impressions, clicks, clickRate (CTR), mediaCost, activeViewViewableImpressions
Daily job:
  1. reports.run(profileId, reportId)  -> File{ id: 90210, status: PROCESSING }
  2. poll reports.files.get(reportId, fileId=90210) every 15s, backing off to 60s
     until status == REPORT_AVAILABLE (stop on FAILED / CANCELLED)
  3. download File.urls.apiUrl with alt=media -> CSV
  4. skip metadata rows to the "Report Fields" header, drop the grand-total row, load rows
  5. reconcile impressions/clicks against the UI Standard report for the same dates
Scope: https://www.googleapis.com/auth/dfareporting
```

Floodlight conversion pull by activity and custom variable (Floodlight report):

```
Report: type FLOODLIGHT
  floodlightCriteria:
    floodlightConfigId: <config id>
    dimensions: activity, activityId, u1 (form name), u2 (lead score)
    metrics: totalConversions, totalConversionsRevenue
    reportProperties: includeUnattributedCookieConversions=true (choose deliberately)
    dateRange: LAST_30_DAYS
Note: conversion metrics carry value; transaction metrics only count events. Do not mix them
      up when computing ROAS. Configuration of these activities lives in
      cm360-floodlight-and-conversions.
```

Trafficking audit, find placements missing active dates (read-only sweep):

```
1. userProfiles.list -> pick profileId
2. campaigns.list(profileId, archived=false)  -> page through nextPageToken
3. for each campaign: placements.list(profileId, campaignIds=[id], compatibility=DISPLAY)
   -> page through, collect placements whose pricingSchedule.startDate or endDate is null
4. output the offenders for the trafficker to fix in cm360-trafficking-and-ad-tags
Scope: https://www.googleapis.com/auth/dfareporting.readonly  (read-only audit; no writes here)
```

Migration check before turning off v4:

```
- grep the codebase for reports.patch  -> replace with reports.update (full object)
- grep for crossDimensionReachCriteria / enableAllDimensionCombinations  -> remove
- grep for Natural Search dimensions/metrics in report definitions  -> remove
- confirm any Floodlight-activity edits send conversionCategory when attributionEnabled=true
- flip the base path to /dfareporting/v5/ and run the daily pull against a test profile first
```

## Common pitfalls

- Reading rows from the run response. `reports.run` returns file metadata, not data. Poll `reports.files.get` until `REPORT_AVAILABLE`, then download `File.urls.apiUrl`. Skipping the poll gets you an empty or partial file.
- Fixed-sleep polling. Report processing time scales with rows and date range, so a hardcoded sleep either wastes time or grabs the file before it is ready. Poll the status with backoff.
- Downloading the wrong file. `files.list` returns every file the report ever produced. Capture the `File.id` from the run you just triggered and fetch that one, not the newest in the list.
- Parsing the CSV from line 1. CM360 report files start with metadata rows and end with a grand-total row. Seek to the real header and drop the total, or your loader ingests garbage rows.
- Picking Standard when you needed Reach. A Standard report cannot dedupe people; unique reach and average frequency only come from a Reach report. Match the type to the metric.
- Reaching for `CROSS_DIMENSION_REACH` on v5. It is gone; the field is `CROSS_MEDIA_REACH` with `crossMediaReachCriteria`. Old code that names the dimension-reach construct fails.
- Calling `reports.patch` on v5. It was removed. Use `reports.update` with the full report object.
- Editing a Floodlight activity without `conversionCategory`. On v5, when `attributionEnabled` is true the field is required; a previously valid write now errors.
- Building on removed columns. Natural Search fields (removed around January 2026) and SA360-sourced paid-social metrics (deprecated around March 2026) return empty or error. Drop them and re-baseline any trend that spans the change.
- Treating a begin-to-render impression step as a bug. Display impression counting changed methodology from September 2025; annotate the date rather than chasing a phantom delivery drop.
- Pinning to v4 to avoid churn. The oldest supported version turns down (403 then 404). Migrate to v5 on your schedule instead of on the sunset's.
- Pulling the whole account, then filtering. Trafficking `list` methods take server-side filters and paginate. Filter and page on the server; do not download everything and filter in memory.

## Sources

- [Campaign Manager 360 report types](https://support.google.com/campaignmanager/answer/2823790?hl=en) (as of July 2026)
- [About Floodlight reporting](https://support.google.com/campaignmanager/answer/3027419?hl=en) (as of July 2026)
- [Set up conversion tracking in Campaign Manager 360](https://support.google.com/campaignmanager/answer/17108857?hl=en) (as of July 2026)
- [Campaign Manager 360 announcements](https://support.google.com/campaignmanager/announcements/10334646?hl=en) (as of July 2026)
- [Campaign Manager 360 API deprecation schedule](https://developers.google.com/doubleclick-advertisers/deprecation) (as of July 2026)
- [Campaign Manager 360 API changelog](https://developers.google.com/doubleclick-advertisers/changelog) (as of July 2026)
- [Campaign Manager 360 API release notes](https://developers.google.com/doubleclick-advertisers/rel_notes) (as of July 2026)
- [Campaign Manager 360 API migration guide](https://developers.google.com/doubleclick-advertisers/guides/migration) (as of July 2026)
- [Reports resource, CM360 API v5 reference](https://developers.google.com/doubleclick-advertisers/rest/v5/reports) (as of July 2026)
- [reports.run, CM360 API v5 reference](https://developers.google.com/doubleclick-advertisers/rest/v5/reports/run) (as of July 2026)
- [Files resource, CM360 API v5 reference](https://developers.google.com/doubleclick-advertisers/rest/v5/files) (as of July 2026)
- [File type, CM360 API v5 reference](https://developers.google.com/doubleclick-advertisers/rest/v5/File) (as of July 2026)
</content>
</invoke>
