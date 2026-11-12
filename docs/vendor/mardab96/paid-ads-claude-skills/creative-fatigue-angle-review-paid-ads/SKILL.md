---
name: creative-fatigue-angle-review-paid-ads
description: Reviews Meta Ads, Google Ads, and landing page creative signals to identify creative fatigue, weak concepts, tired winners, offer fatigue, and replacement angles. Use when CPA rises, CTR drops, frequency rises, or creative performance weakens.
---

# Creative Fatigue and Angle Review - Paid Ads

When you need the shared quality bar, use `../references/paid-ads-output-standard.md` and `../references/paid-ads-principles.md` if they are available.

## Use this skill when

The user asks if creative is the problem.

## Required input

- Ad-level or asset-level exports.
- Creative names, thumbnails, copy, hooks, or screenshots.
- Spend, impressions, frequency, CTR, CPC, CPM, conversions, CPA.
- Landing page URL.
- Comment samples or sales objections if available.
- Target CPA or ROAS for the status and volume rules. Without the applicable
  target, concept status is `needs_data`.

## Analysis workflow

1. Group ads by creative concept and offer angle.
2. Compare performance across 7, 14, 30, and 60 day windows if available.
3. Separate creative fatigue from offer, traffic, tracking, and auction issues.
4. Compare ad-level signals with ad set, ad group, campaign, and blended funnel results.
5. Check whether the landing page repeats the ad promise, promotion, and CTA.
6. Classify concepts as winner, tired winner, watchlist, replace, or insufficient data.
7. Suggest replacement angles tied to evidence.

## Decision rules

Every threshold below is a starting heuristic, not a platform rule. Recalibrate against the account's own history, and say which threshold you adjusted and why.

What a concept is (statuses attach to concepts, so the partition must be stable): group ads that share the same promise AND the same proof mechanism; format (video vs static) and audience split do not create new concepts, a changed promise or mechanism does. When ad naming encodes concepts, use it and say so. Always output the ad-to-concept mapping table so a second run (or next week's run) reuses the same partition instead of regrouping. An ad spanning two concepts goes to the one its hook leads with, noted as shared.

Volume floor: a concept gets a status only with spend of 3x target CPA or more AND 10+ conversions in the window [heuristic]; below that it is `insufficient data`.

Status assignment (compare each concept against its own 30-day baseline):

- Winner: CPA at or below target, CTR within 20% of its own baseline.
- Tired winner: previously at target for 14+ days AND all three fatigue signals - frequency up 50%+, CTR down 30%+, CPA drift 20%+ - with CPM roughly stable (within 15%) ruling out an auction story [heuristic]. Brief a replacement hook or angle on the same promise right away; do not wait for Replace.
- Watchlist: 2 of the 3 fatigue signals, or the decline is younger than 7 days.
- Replace: tired-winner criteria persisting 14+ days with no recovery at stable spend [heuristic]. The 14 days only decide this label, not when the replacement brief starts.
- Never-worked: never within 20% of target after 3x target CPA in spend - that is a concept failure, not fatigue.

Cross-channel disambiguation: CPM up with CTR stable is auction pressure (route to bidding-learning-sanity-check); CTR stable with CVR down is the landing page (route to landing-page-conversion-review). On Google Search, frequency is not a fatigue signal; judge on CTR and impression-weighted position instead [heuristic].

## Output format

Owner-decision labels in output tables use the shared enum from `../references/paid-ads-output-standard.md`: `do_now / test / investigate / monitor / ignore / approval_needed`. Evidence labels use `export / screenshot / url / notes / hypothesis / needs_data`.

| Concept | Status | Evidence | Likely issue | Replacement angle | Confidence |
|---|---|---|---|---|---|

### Missing data

Name the exact exports or fields that would change the diagnosis, and which finding each one would firm up.

### Approval gates

List what needs a human yes before anything moves: budget changes, pauses, negative lists, tracking edits, page changes. Nothing in this output is an instruction to execute.

## Practical example

Illustrative made-up account, not a real advertiser.

Input: Meta account, target CPA $30. Concept "Free setup" (3 ads, same promise and proof) has $1,100 spend and 14 conversions. Concept "Case study" has 4 conversions. Concept "Free setup" was at target for 3 weeks before the drop.

| Concept | Signals vs own 30-day baseline | Status |
|---|---|---|
| Free setup | frequency 2.0 to 3.2 (+60%), CTR 1.5% to 1.0% (-33%), CPA $26 to $32 (+23%), CPM $8.10 to $8.40 (+4%) | tired winner |
| Case study | 4 conversions, under 10 | insufficient data |

All three fatigue signals fire and CPM is stable, so this is not an auction story. Decline is 9 days old, under the 14-day mark for Replace. Plan: brief a new hook on the same promise now, and rerun this review in 5 days to see whether the label moves to Replace.

## Guardrails

- Do not call fatigue from frequency alone.
- Do not recommend replacing winners without trend evidence.
- Do not invent new claims without proof.
