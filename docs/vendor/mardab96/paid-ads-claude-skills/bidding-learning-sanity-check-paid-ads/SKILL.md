---
name: bidding-learning-sanity-check-paid-ads
description: Reviews bid strategy, learning status, conversion volume, budget, optimization event quality, and recent changes across Google Ads and Meta Ads. Use before changing bid strategy, scaling budget, or diagnosing unstable delivery.
---

# Bidding and Learning Sanity Check - Paid Ads

When you need the shared quality bar, use `../references/paid-ads-output-standard.md` and `../references/paid-ads-principles.md` if they are available.

## Use this skill when

The user wants to know if bidding or learning setup makes sense.

## Required input

- Bid strategy or campaign objective.
- Optimization event.
- Conversion volume by campaign.
- Budget and spend pacing.
- Learning status.
- Recent changes.
- Tracking confidence.
- Conversion delay and attribution window.
- Conversion actions included in platform optimization.

## Analysis workflow

1. Match bid strategy to conversion volume.
2. Check if budget supports the current learning setup.
3. Check whether the optimization event is deep enough and clean enough.
4. Check if the target CPA or ROAS is too tight for current volume and auction conditions.
5. Check whether recent results are still inside expected conversion delay.
6. Identify campaigns stuck in learning or constrained by budget.
7. Recommend hold, simplify, change event, adjust budget, or investigate.

## Decision rules

Every threshold below is a starting heuristic, not a platform rule. Recalibrate against the account's own history, and say which threshold you adjusted and why.

Strategy-vs-volume reference table:

| Setup | Volume floor before the setup is well fed |
|---|---|
| Google tCPA / tROAS | ~30 conversions in the last 30 days per campaign [platform guidance range - verify current docs] |
| Google Max Conversions / Max Value (no target) | works lower, but under ~15 conversions/30d expect volatility [heuristic] |
| Meta ad set | ~50 optimization events per week to exit learning limited [platform guidance] |
| Value-based bidding (either platform) | needs value data on most conversions; below ~50% value coverage, value bidding is under-fed [heuristic] |

Target sanity:

- Target too tight: a tCPA / tROAS target more than 15-20% better than the trailing 30-day actual is a starvation flag [heuristic] - recommend stepping the target toward actual, not a strategy change.
- Target moves count as changes: more than one target change per 2 weeks per campaign keeps resetting learning [heuristic].
- Under-fed setups get one of two fixes, in this order: broaden the optimization event (shallower but cleaner volume), or consolidate campaigns so conversions pool. Strategy change is the last resort.
- Recent-change quarantine: no verdict on stability within one conversion-delay window of a bid strategy, target, or budget change over 20%.

## Output format

Owner-decision labels in output tables use the shared enum from `../references/paid-ads-output-standard.md`: `do_now / test / investigate / monitor / ignore / approval_needed`. Evidence labels use `export / screenshot / url / notes / hypothesis / needs_data`.

| Campaign | Current setup | Issue | Evidence | Recommendation | Risk |
|---|---|---|---|---|---|

### Missing data

Name the exact exports or fields that would change the diagnosis, and which finding each one would firm up.

### Approval gates

List what needs a human yes before anything moves: budget changes, pauses, negative lists, tracking edits, page changes. Nothing in this output is an instruction to execute.

## Practical example

Illustrative made-up account, not a real advertiser.

Input: one Google tCPA campaign. Target CPA $40, trailing 30-day actual CPA $52, 22 conversions in 30 days, daily budget not limited. Target lowered 4 days ago. Conversion delay is about 7 days.

| Check | Evidence | Verdict |
|---|---|---|
| Volume vs setup | 22 conversions in 30 days, under the ~30 floor for tCPA | under-fed |
| Target sanity | $40 is 23% below the $52 actual, past the 15-20% flag | starvation risk |
| Recent change | target edit 4 days ago, inside the 7-day conversion delay | results not readable yet |

Recommendation: hold. Do not judge the campaign for 3 more days. If CPA still sits near $52 afterwards, set the target near the actual or merge with a sibling campaign to clear the volume floor. Approval needed for the target edit.

## Guardrails

- Do not recommend bid changes before checking signal quality.
- Do not recommend frequent changes that reset learning.
- Do not assume automation is bad because performance is unstable.
