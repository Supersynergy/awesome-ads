---
name: account-structure-audit-google-ads
description: Reviews Google Ads campaign, ad group, keyword, budget, and bidding structure to find under-volume campaigns, budget fragmentation, duplicate targeting, legacy debt, and structures that limit algorithmic learning. Use when inheriting an account, conducting quarterly audits, diagnosing plateaued performance, or preparing to scale spend.
---

# Account Structure Audit — Google Ads

## Use this skill when

The user wants to audit whether their Google Ads account structure supports their budget, conversion volume, and bidding strategy.

Common user requests:

- "Audit this Google Ads account structure."
- "Should we consolidate these campaigns?"
- "Is the account too fragmented?"
- "We inherited an account. What should we clean up?"
- "Performance plateaued. Could structure be the reason?"

## Required input

Recommended date range: 60–180 days, with 90 days as the default.

Required exports:

- Campaign performance report.
- Ad group performance report.
- Keyword performance report for Search.
- Search terms report, if query overlap is part of the audit.
- Asset group report for PMax, if applicable.
- Budget report or impression share metrics.
- Conversion action report.

Required columns where available:

- campaign
- campaign type
- campaign status
- campaign budget
- bid strategy type
- target CPA or target ROAS
- spend
- conversions
- conversion value
- CPA
- ROAS
- impressions
- clicks
- impression share
- search impression share lost to budget
- search impression share lost to rank
- ad group count
- keyword count
- asset group count
- location targeting
- audience targeting
- final URL or landing page

## Before analysis

1. Identify campaign types:
   - Search
   - Shopping
   - Performance Max
   - Demand Gen
   - Display
   - YouTube
2. Identify primary optimization goal:
   - lead volume
   - qualified leads
   - purchases
   - revenue
   - profit
   - new customer acquisition
3. Identify active bid strategies.
4. Confirm whether imported offline conversions or value-based bidding are used.
5. Check for recent structural changes that may distort the data.

Upgrade exposure check before proposing structure: campaigns using Dynamic Search Ads, automatically created assets, or campaign-level broad match are subject to auto-upgrade to AI Max from September 2026. Flag them before recommending consolidation, splits, or rebuilds the upgrade would change.

## Analysis workflow

1. Map the account skeleton:
   - account → campaign → ad group / asset group → keyword / listing group / assets.
2. Calculate conversion density:
   - conversions per campaign,
   - conversions per ad group,
   - conversions per asset group,
   - spend per conversion action.
3. Identify under-volume structures:
   - campaigns using Smart Bidding with too little conversion data,
   - ad groups with thin traffic,
   - excessive keyword granularity,
   - too many campaign splits for the available budget.
4. Identify budget fragmentation:
   - campaigns with low daily budget and meaningful lost impression share due to budget,
   - campaigns exhausting budget before peak conversion hours,
   - many small campaigns with overlapping objectives.
5. Identify targeting overlap:
   - campaigns competing for the same queries,
   - duplicated geographies,
   - duplicated brand/non-brand logic,
   - duplicated product/category structures,
   - PMax overlap with Search or Shopping.
6. Identify legacy debt:
   - stale tCPA or tROAS targets,
   - paused-but-not-removed experiments,
   - old campaign naming conventions,
   - obsolete conversion actions,
   - abandoned ad groups or keywords.
7. Recommend one of:
   - keep
   - consolidate
   - split
   - pause
   - rebuild
   - migrate gradually
   - test via experiment

## Decision rules

Use flexible heuristics. Do not treat them as universal rules.

Potential consolidation candidate:

- campaign has low conversion volume (consolidation trigger: under ~15 conversions per month; stable-learning floor for automated bidding: ~30 conversions per 30 days, the same floor bidding-strategy-sanity-check and conversion-tracking-audit use [platform guidance range - verify current docs]; or a daily budget under ~1x target CPA [heuristic]),
- campaign shares intent, geography, product, or landing page with another campaign,
- campaign uses the same bid strategy and objective,
- segmentation does not produce materially different performance or control value.

Potential split candidate:

- segment has enough conversion volume to support independent optimization,
- segment has materially different CPA, ROAS, margin, geography, budget need, or business objective,
- segment needs separate creative, landing page, budget, or bidding target.

Potential rebuild candidate:

- structure is too damaged to migrate safely,
- conversion tracking changed materially,
- naming, targeting, and campaign logic are unrecoverable,
- historical data is less valuable than clean control.

Prefer migration over rebuild when:

- existing campaigns have stable performance,
- historical learning is valuable,
- changes can be made gradually,
- the business cannot tolerate volume disruption.

Migration mechanics every consolidation plan must state: what happens to shared negative lists, audiences, and historical data (significant edits reset learning), how budget carries over, what the naming becomes, and a cap of 2-3 structural changes per week so reads stay clean [heuristic]. A merge is only recommended when the merged campaign clears the volume floor; merging two starving campaigns into one starving campaign is not a fix.

## Practical example

You inherit a Google Ads account from a previous agency. 41 Search and Shopping campaigns, $32K/month spend. Claude maps the structure and surfaces: 22 campaigns with under 15 monthly conversions (Smart Bidding starves below ~30/month for stable learning), 9 campaigns with daily budgets under $20 that exhaust before 11am peak conversion hours (~$2,400/month pre-noon waste), 4 pairs of geographic duplicates that could consolidate using location bid adjustments, 3 abandoned tCPA campaigns with stale targets from two years ago, 7 ad groups with under 5 keywords competing for the same query themes. Recommendation: 41 → 17 campaigns through phased migration. Projected impact: per-campaign learning data triples, ~$2,400/month budget recovered before noon, redundant ad groups consolidated into stronger query coverage. Migration plan staged by traffic volume (low-risk first) with 14-day monitoring per phase.

## Output format

### Executive summary

- Current account structure summary.
- Main structural constraint.
- Recommended target structure.
- Expected upside and key risks.

### Account map

Show:

- campaign count by type,
- active vs paused campaigns,
- spend by campaign type,
- conversion volume by campaign type,
- budget fragmentation summary.

### Structural issues table

For each issue include:

- issue type
- affected campaigns
- evidence
- impact
- recommended action
- priority
- risk level

### Consolidation or restructuring plan

For each proposed change include:

- current state
- proposed state
- migration method
- expected benefit
- risk level
- rollback condition
- monitoring window

### Target structure

Provide a recommended campaign structure with:

- campaign names,
- campaign purpose,
- budget logic,
- bidding strategy,
- conversion action,
- targeting rules,
- notes.

### Route to next

Bid strategy questions raised by consolidation -> bidding-strategy-sanity-check-google-ads. Conversion volume doubts -> conversion-tracking-audit-google-ads. Post-cleanup scaling -> scaling-planner-google-ads.

### Data gaps

Name the exports or fields that were missing and which verdict each one would firm up.

## Guardrails

- Do not recommend consolidation just to simplify reporting.
- Do not recommend splitting unless the segment has enough data and needs independent control.
- Do not promise that historical learning will be preserved after rebuilds.
- Do not ignore business logic such as regions, margins, sales teams, inventory, or offline quality.
- Treat the volume floors (consolidation under ~15/month, stable learning ~30/30d) as heuristics, not fixed rules - the same numbers the bidding and tracking skills use.
- When a threshold in this skill does not fit the account's volume or vertical, say which one you adjusted and why.
