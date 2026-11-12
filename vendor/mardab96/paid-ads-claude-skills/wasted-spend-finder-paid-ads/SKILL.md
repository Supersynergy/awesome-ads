---
name: wasted-spend-finder-paid-ads
description: Finds paid ads spend that is unlikely to create business value across Google Ads, Meta Ads, placements, search terms, audiences, devices, geos, creatives, and landing pages. Use when the user wants to reduce wasted spend or find budget leaks.
---

# Wasted Spend Finder - Paid Ads

When you need the shared quality bar, use `../references/paid-ads-output-standard.md` and `../references/paid-ads-principles.md` if they are available.

## Use this skill when

The user wants to find where money is leaking.

## Required input

- Spend by campaign, audience, search term, placement, device, geo, creative, or landing page.
- Conversions and conversion value.
- Business conversion definition.
- Lead quality or sales notes if available.
- Time window.
- Target CPA (or equivalent business target) and account baseline conversion
  rate. Without either, the corresponding waste test is `needs_data`.

## Analysis workflow

1. Define what counts as waste for this business.
2. Rank segments by spend with no or weak business outcome.
3. Check whether missing tracking could explain zero conversions.
4. Separate low-quality traffic from normal learning spend.
5. Estimate reclaim opportunity with confidence.

## Decision rules

Every threshold below is a starting heuristic, not a platform rule. Recalibrate against the account's own history, and say which threshold you adjusted and why.

What counts as waste (do not punt this back to the user):

- Waste candidate: a segment with spend at 2x target CPA or more and zero conversions, measured only after the conversion window closed [heuristic].
- Expected-conversions test for zero-conversion segments: clicks x the account's baseline CVR. If expected conversions are 3+ and actual is 0, the segment is a waste candidate; below 3 expected, it is `needs_data`, not waste [heuristic].
- Weak segment (not yet waste): CPA above 2x target with 5+ conversions - route to the relevant deep-dive before cutting.
- Tracking gaps are always `needs_data`: a segment cannot be waste if its conversions may be uncounted.
- Reclaim estimate: sum only high-confidence waste (closed windows, tracking trusted); report medium-confidence separately. Never present the combined number as savings.

Do not use this skill for search-term-level cleanup (use search-terms-intent-hygiene) or for budget shifting between channels (use cross-channel-budget-reallocation).

For long exports, run `../scripts/wasted_spend_rank.py` to apply these rules deterministically and total the reclaimable spend by confidence tier.

## Output format

Owner-decision labels in output tables use the shared enum from `../references/paid-ads-output-standard.md`: `do_now / test / investigate / monitor / ignore / approval_needed`. Evidence labels use `export / screenshot / url / notes / hypothesis / needs_data`.

| Segment | Spend | Result | Waste type | Evidence | Confidence | Action |
|---|---:|---|---|---|---|---|

### Missing data

Name the exact exports or fields that would change the diagnosis, and which finding each one would firm up.

### Approval gates

List what needs a human yes before anything moves: budget changes, pauses, negative lists, tracking edits, page changes. Nothing in this output is an instruction to execute.

## Practical example

Illustrative made-up account, not a real advertiser.

Input: target CPA $40, account baseline conversion rate 2%, conversion window 7 days, all windows closed.

| Segment | Spend | Clicks | Expected conversions | Actual | Verdict |
|---|---|---|---|---|---|
| Placement X | $95 | 160 | 3.2 | 0 | waste candidate, high confidence |
| Placement Y | $120 | 40 | 0.8 | 0 | needs_data, under 3 expected |
| Audience Z | $540 | 90 | 1.8 | 6 | weak: CPA $90 above 2x target, route to a deep-dive |
| Region W | $210 | 100 | 2.0 | 0 | needs_data: conversion tag gap |

Reclaim estimate: $95, high confidence only. Medium confidence is $0 here. Do not present a combined number as savings.

## Guardrails

- Do not call spend wasted if the conversion window is still open.
- Do not cut segments without checking role and sample size.
- Mark tracking gaps as `needs_data`, not waste.
