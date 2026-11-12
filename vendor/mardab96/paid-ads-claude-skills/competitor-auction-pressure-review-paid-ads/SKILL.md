---
name: competitor-auction-pressure-review-paid-ads
description: Reviews paid ads performance for signs of competitor pressure, auction cost changes, seasonality, CPC/CPM inflation, impression share shifts, and creative or offer weakness. Use when costs rise or performance declines without obvious account changes.
---

# Competitor and Auction Pressure Review - Paid Ads

When you need the shared quality bar, use `../references/paid-ads-output-standard.md` and `../references/paid-ads-principles.md` if they are available.

## Use this skill when

The user suspects outside market pressure.

## Required input

- CPC, CPM, CTR, CPA, impression share, lost IS, auction insights where available.
- Time windows before and after the change.
- Competitor notes or screenshots.
- Offer and creative changes.
- Seasonality context.
- Campaign list, status, and material campaign-set changes for each compared
  window. Without this, the trend comparison is `needs_data`.

## Analysis workflow

1. Check if costs rose before conversion metrics worsened.
2. Review auction insights or impression share.
3. Compare creative and offer freshness.
4. Separate market pressure from internal execution.
5. Recommend monitor, creative refresh, bid adjustment, offer test, or budget hold.

## Decision rules

Every threshold below is a starting heuristic, not a platform rule. Recalibrate against the account's own history, and say which threshold you adjusted and why.

How to read the instruments (Google auction insights):

- Lost IS (budget) rising -> a budget ceiling, not competition; route to budget planning. Lost IS (rank) rising -> genuine auction pressure or quality decline.
- Exports floor and cap IS values ("< 10%", "> 90%"); treat those rows as bounds, not numbers, and say so when they carry the conclusion.
- Pressure case requires the sequence: overlap rate or a competitor's top-of-page rate rising 10+ percentage points AND CPC rising BEFORE conversion metrics worsened [heuristic]. Costs-then-outcomes is pressure; outcomes-first points inward (creative, page, tracking).
- Volume floor: auction-insight shares on campaigns under ~1,000 impressions in the window are unstable; no verdict below it [heuristic].
- Mid-window campaign-set changes invalidate the period comparison; check the campaign list is constant before trending shares.
- Response ladder: improve ad strength / relevance first, bid or budget second, "outbid them" last - and only when the pressured segment clears target economics at the higher CPC.

## Output format

Owner-decision labels in output tables use the shared enum from `../references/paid-ads-output-standard.md`: `do_now / test / investigate / monitor / ignore / approval_needed`. Evidence labels use `export / screenshot / url / notes / hypothesis / needs_data`.

| Signal | Evidence | Interpretation | Action | Confidence |
|---|---|---|---|---|

### Missing data

Name the exact exports or fields that would change the diagnosis, and which finding each one would firm up.

### Approval gates

List what needs a human yes before anything moves: budget changes, pauses, negative lists, tracking edits, page changes. Nothing in this output is an instruction to execute.

## Practical example

Illustrative made-up account, not a real advertiser.

Input: Google auction insights, one Search campaign, 4,200 impressions in the window. Competitor overlap rate rose from 31% to 44% (+13 percentage points). CPC rose 12% in week 2. Conversion rate fell in week 4. Lost IS (budget) flat at 3%, Lost IS (rank) 18% to 27%. A second campaign shows 640 impressions.

| Finding | Evidence | Verdict |
|---|---|---|
| Costs moved before outcomes | overlap and CPC first, conversions two weeks later | pressure case holds |
| Budget is not the limit | Lost IS (budget) flat | no budget fix |
| Second campaign | 640 impressions, under ~1,000 | no verdict |

Response ladder: ad relevance and ad strength first, bids second. One competitor row reads "< 10%", which is a bound, not a number. Say so in the readout.

## Guardrails

- Do not claim competitor activity without evidence.
- Do not treat rising CPC or CPM as automatically bad.
- Do not recommend panic changes from one short window.
