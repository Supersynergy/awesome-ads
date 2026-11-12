---
name: performance-max-control-review-paid-ads
description: Reviews Google Ads Performance Max campaigns for control, search insights, asset groups, audience signals, product/feed issues, brand cannibalization, budget role, and conversion signal quality. Use when PMax performance is unclear or the account feels black-boxed.
---

# Performance Max Control Review - Paid Ads

When you need the shared quality bar, use `../references/paid-ads-output-standard.md` and `../references/paid-ads-principles.md` if they are available.

## Use this skill when

The user needs a focused PMax diagnosis inside a broader paid ads review.

## Required input

- PMax campaign report.
- Asset group report.
- Search terms or search insights where available.
- Product or listing group report for ecommerce.
- Audience signal notes.
- Conversion actions and values.
- Brand campaign context.

## Analysis workflow

1. Define PMax role in the account.
2. Check asset group and product coverage.
3. Review search insights and brand cannibalization risk.
4. Check audience signals and asset quality.
5. Check feed, value, and tracking issues.
6. Recommend controls, exclusions, segmentation, or hold.

## Decision rules

Every threshold below is a starting heuristic, not a platform rule. Recalibrate against the account's own history, and say which threshold you adjusted and why.

- Cannibalization case: brand terms visible in search insights at a meaningful share (roughly 20%+ of categories or spend) while an active brand Search campaign exists [heuristic] -> recommend brand exclusions and state the tradeoff (reported PMax ROAS will drop; that drop is honesty, not damage).
- Asset group floor: groups under ~10-15 conversions per month are consolidation candidates [heuristic]; more groups than volume feeds is fragmentation, same rule as campaigns.
- Spend concentration: top products absorbing 70%+ of spend [heuristic] is a flag - healthy if their ROAS beats target, a feed-mix constraint if not; route feed issues to product-feed-catalog-qa.
- Signal quality outranks structure: with a weak or duplicated conversion signal, no structural change to PMax is recommended until the signal audit passes - PMax amplifies whatever it is fed.
- Channel-split inference: without official reporting, infer from placement/asset clues and label every such number as an estimate.

## Output format

Owner-decision labels in output tables use the shared enum from `../references/paid-ads-output-standard.md`: `do_now / test / investigate / monitor / ignore / approval_needed`. Evidence labels use `export / screenshot / url / notes / hypothesis / needs_data`.

| Issue | Evidence | Impact | Recommendation | Confidence |
|---|---|---|---|---|

### Missing data

Name the exact exports or fields that would change the diagnosis, and which finding each one would firm up.

### Approval gates

List what needs a human yes before anything moves: budget changes, pauses, negative lists, tracking edits, page changes. Nothing in this output is an instruction to execute.

## Practical example

Illustrative made-up account, not a real advertiser.

Input: one PMax campaign with an active brand Search campaign. Search insights show brand terms in 34% of categories. 4 asset groups, two with 6 and 8 conversions per month. Top 3 products take 78% of spend at 2.1 ROAS against a 3.0 target.

| Finding | Evidence | Action |
|---|---|---|
| Brand cannibalization case | 34% is above the ~20% mark and a brand Search campaign exists | recommend brand exclusions. Reported PMax ROAS will drop. That is honesty, not damage |
| Two asset groups under ~10 to 15 conversions a month | 6 and 8 | consolidation candidates |
| Spend concentration | 78% on top 3 products, ROAS below target | feed-mix constraint, route to product-feed-catalog-qa |

Conversion signal not yet audited, so no structure change beyond exclusions until it passes. Approval needed for exclusions.

## Guardrails

- Do not blame PMax without comparing account role and signal quality.
- Do not recommend exclusions without tradeoff.
- Do not assume PMax should be split by default.
