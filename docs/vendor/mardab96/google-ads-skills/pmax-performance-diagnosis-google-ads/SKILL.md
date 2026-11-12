---
name: pmax-performance-diagnosis-google-ads
description: Audits Google Ads Performance Max campaigns to identify issues in asset group structure, audience signals, feed or product mix, search term insights, creative coverage, conversion tracking, budget, and bidding strategy. Use when PMax performance drops, scales poorly, cannibalizes other campaigns, or lacks clear diagnostic visibility.
---

# PMax Performance Diagnosis — Google Ads

## Use this skill when

The user wants to diagnose Performance Max performance.

Common user requests:

- "Why is PMax performance down?"
- "Audit this PMax campaign."
- "Check asset groups and audience signals."
- "Is PMax cannibalizing Search?"
- "What should we fix before scaling PMax?"

## Required input

Recommended exports:

- PMax campaign performance report.
- Asset group performance report.
- Asset performance report.
- Listing group or product performance report for ecommerce.
- Search term insights / search categories, if available.
- Audience signal setup.
- Final URL expansion settings.
- Conversion action report.
- Budget and bid strategy settings.
- Brand exclusions and negative keyword setup, if applicable.

Required fields where available:

- campaign
- asset group
- asset group status
- spend
- impressions
- clicks
- conversions
- conversion value
- CPA
- ROAS
- asset performance label
- product ID or item group ID
- product category
- audience signal
- search category / search insight
- final URL
- conversion action
- budget
- bid strategy
- target CPA or target ROAS

## Before analysis

1. Identify business model:
   - ecommerce,
   - lead generation,
   - local,
   - subscription,
   - marketplace.
2. Identify campaign goal:
   - revenue,
   - lead volume,
   - qualified leads,
   - new customer acquisition,
   - store visits.
3. Confirm conversion tracking quality.
4. Confirm whether brand traffic should be included or excluded.
5. Confirm whether Search campaigns are active for core terms.

## Analysis workflow

1. Check conversion tracking and bidding readiness:
   - primary conversions,
   - conversion value accuracy,
   - offline quality,
   - tCPA or tROAS fit,
   - recent conversion action changes.
2. Review campaign-level performance:
   - spend trend,
   - conversion trend,
   - CPA / ROAS trend,
   - budget constraints,
   - target changes.
3. Review asset groups:
   - spend concentration,
   - conversion concentration,
   - weak or inactive asset groups,
   - overlap between asset groups,
   - landing page alignment.
4. Review creative assets:
   - asset performance labels,
   - missing image/video/text coverage,
   - repetitive messaging,
   - poor fit to audience or category.
5. Review audience signals:
   - whether signals map to real buyer segments,
   - whether signals are too broad, too narrow, or stale,
   - whether first-party lists are used when available.
6. Review search insights:
   - brand vs non-brand mix,
   - category relevance,
   - irrelevant search themes,
   - competitor or informational drift,
   - cannibalization risk with Search.
7. Review feed or product performance for ecommerce:
   - spend by product/category,
   - product ROAS,
   - margin or stock issues,
   - disapproved products,
   - poor titles/images.
8. Diagnose root causes and recommend fixes.

## PMax issue patterns

Poor ROAS:

- weak product/category mix,
- low-margin products receiving spend,
- conversion value tracking issue,
- tROAS too aggressive or too loose,
- poor creative or landing page fit,
- brand/non-brand mix shift.

CPA spike:

- low-quality lead conversion action,
- audience expansion into weak traffic,
- target change,
- budget increase too fast,
- search insight drift,
- landing page issue.

Low scale:

- budget too low,
- tROAS too restrictive,
- insufficient conversion volume,
- weak feed coverage,
- limited creative inventory,
- narrow audience signals.

Cannibalization risk:

- high brand search insight share,
- overlap with exact or phrase Search campaigns,
- Final URL expansion sending traffic to core Search pages,
- PMax capturing cheap branded conversions.

## Decision rules

Every threshold below is a starting heuristic, not a Google rule. When one does not fit the account's volume or vertical, say which one you adjusted and why.

- Brand cannibalization case: brand terms at 20%+ of search insights categories or spend while an active brand Search campaign exists [heuristic] -> recommend brand exclusions and state the tradeoff honestly: reported PMax ROAS will fall, and that fall is the previously hidden brand share, not new damage.
- Asset group floor: groups under ~10-15 conversions per month are consolidation candidates [heuristic]; more groups than conversion volume can feed is the same fragmentation rule as campaigns.
- Spend concentration: top products or one asset group absorbing 70%+ of spend [heuristic] is a flag - healthy when its own ROAS beats target, a feed-mix constraint when it merely matches average. Feed problems route to shopping-feed-qa-google-ads.
- Signal outranks structure: with a weak, duplicated, or too-shallow conversion signal, no structural PMax recommendation stands until conversion-tracking-audit-google-ads passes - PMax amplifies whatever it is fed.
- Channel-split inference without official reporting is labeled an estimate, every time.
- 2026 exposure: campaigns with DSA, auto-created assets, or campaign-level broad match auto-upgrade to AI Max from September 2026; diagnosis of those campaigns names the upgrade as a moving part before recommending long structural work.

## Practical example

D2C subscription brand running PMax + Search Brand campaigns, $24K/month total. ROAS dropped from 4.2 to 2.8 over 30 days. Claude diagnoses: search insights show 67% of PMax spend going to brand-heavy categories (significant cannibalization with $4K/month Search Brand campaign — PMax wins cheap branded conversions, Search Brand looks weaker by comparison); 3 of 7 asset groups under 5 conversions/month (insufficient for asset rotation and learning); audience signals are "website visitors" and "similar customers" only (no first-party CRM upload despite a 12k subscriber list); feed contains 4 disapproved products consuming impression spend; tROAS target was lowered from 3.5 to 2.5 six weeks ago, which expanded auctions into low-quality traffic. Health rating: not ready for scaling. Highest-priority fixes: (1) brand exclusion list, (2) consolidate 3 weak asset groups into 1 stronger, (3) upload CRM list as audience signal, (4) fix or remove 4 disapproved products, (5) raise tROAS back toward 3.5 with a 14-day learning period. Scaling readiness: only after fixes 1–4 land.

## Output format

### Executive summary

- PMax health rating.
- Main performance issue.
- Most likely root cause.
- Highest-priority fix.
- Scaling readiness: ready / not ready / only after fixes.

### Diagnostic table

For each issue include:

- issue area
- evidence
- affected asset group / product / audience / search category
- impact
- recommended action
- priority
- risk level

### Asset group review

For each asset group include:

- role
- spend
- conversions
- conversion value
- CPA / ROAS
- asset coverage
- audience signal quality
- landing page fit
- recommendation

### Search insights review

Include:

- top search categories,
- brand vs non-brand interpretation,
- irrelevant themes,
- recommended exclusions or Search campaign coverage.

### Action plan

Group recommendations into:

- tracking fixes,
- bidding fixes,
- budget fixes,
- asset group restructuring,
- feed/product fixes,
- creative fixes,
- exclusions and brand controls,
- Search/PMax coordination.

### Route to next

Feed findings -> shopping-feed-qa-google-ads. Signal doubts -> conversion-tracking-audit-google-ads. Budget role questions -> account-triage-google-ads.

### Data gaps

Name the exports or fields that were missing and which verdict each one would firm up.

## Guardrails

- Do not diagnose PMax only from campaign-level CPA or ROAS.
- Do not recommend scaling if conversion quality is unverified.
- Do not assume audience signals are strict targeting.
- Do not ignore brand traffic mix.
- Do not recommend aggressive restructuring without a monitoring and rollback plan.
