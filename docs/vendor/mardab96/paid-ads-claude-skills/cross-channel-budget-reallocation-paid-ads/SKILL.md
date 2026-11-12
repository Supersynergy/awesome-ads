---
name: cross-channel-budget-reallocation-paid-ads
description: Builds a Google Ads and Meta Ads budget reallocation plan using performance, conversion quality, tracking confidence, channel role, and business constraints. Use when the user asks where to add, hold, reduce, or pause spend across paid channels.
---

# Cross-Channel Budget Reallocation - Paid Ads

When you need the shared quality bar, use `../references/paid-ads-output-standard.md` and `../references/paid-ads-principles.md` if they are available.

## Use this skill when

The user needs a budget decision across paid channels.

Common requests:

- "Where should we move budget?"
- "Should we scale Google or Meta?"
- "Which campaigns should lose spend?"
- "Build a reallocation plan."

## Required input

- Current spend by channel and campaign.
- CPA, ROAS, conversion volume, CVR, CTR, CPC, CPM.
- Lead quality or revenue by source, if available.
- Tracking confidence.
- Budget constraints.
- Sales or inventory constraints.

## Analysis workflow

1. Map each channel role: capture demand, create demand, remarketing, testing, retention.
2. Rank campaigns by business result, not only platform conversions.
3. Check tracking confidence and lead quality.
4. Identify campaigns safe to scale, hold, reduce, or pause.
5. Add monitoring triggers and rollback conditions.

## Decision rules

Every threshold below is a starting heuristic, not a platform rule. Recalibrate against the account's own history, and say which threshold you adjusted and why.

Classification (per campaign, on the business result, not the platform number):

- Scale: business-result CPA / ROAS 15%+ better than target for 14+ days, 30+ conversions in the window, tracking trusted [heuristic].
- Hold: within 15% of target, or fewer than 30 conversions.
- Reduce: 25-100% worse than target with 30+ conversions after the lag window.
- Pause: spend of 3x target CPA with zero conversions after the lag window, or CPA more than 2x target with 20+ conversions. Pause here is the post-diagnosis action at campaign scope: a weak campaign routes through wasted-spend-finder (segment scope) first, and pauses only when the deep dive found no fixable segment.
- Cross-channel moves: shift no more than 20% of a channel's budget per week [heuristic]; the receiving channel's marginal CPA rises as it absorbs budget, so scale the destination in steps, not in one move. Within the destination, per-campaign steps follow scale-readiness-check pacing (+20% per step, one step per 72h); this weekly channel cap and that per-campaign cadence are the same brake at two scopes, and the tighter one wins.
- Channel-role guard: money does not leave a role uncovered - demand capture (search/brand), demand creation, and remarketing are compared within role first; cutting the last capture campaign because creation looks cheaper confuses marginal and average cost.
- Attribution overlap: when two channels claim the same conversions, deduplicate on the business source of truth before comparing CPAs; if none exists, mark the comparison medium confidence at best.

## Output format

Owner-decision labels in output tables use the shared enum from `../references/paid-ads-output-standard.md`: `do_now / test / investigate / monitor / ignore / approval_needed`. Evidence labels use `export / screenshot / url / notes / hypothesis / needs_data`.

### Budget verdict

- Scale candidates.
- Hold candidates.
- Reduction candidates.
- Pause candidates.

### Reallocation table

| Campaign | Current spend | Proposed action | Reason | Risk | Monitoring trigger |
|---|---:|---|---|---|---|

### Missing data

Name the exact exports or fields that would change the diagnosis, and which finding each one would firm up.

### Approval gates

List what needs a human yes before anything moves: budget changes, pauses, negative lists, tracking edits, page changes. Nothing in this output is an instruction to execute.

## Practical example

Illustrative made-up account, not a real advertiser.

Input: target business-result CPA $50. Weekly budgets: Google Search $6,000, Meta $5,000.

| Campaign | Business CPA | Conversions | Class |
|---|---|---|---|
| Google Search non-brand | $38 (24% better for 3 weeks) | 64 | scale |
| Meta prospecting A | $52 (4% worse) | 48 | hold |
| Meta prospecting B | $95 (90% worse) | 41 | reduce |

Move: $800 per week from Meta prospecting B to Google Search. Cap: 20% of Meta's $5,000 is $1,000 per week, so $800 fits. Scale the receiving campaign in steps and watch its marginal CPA. Reread after the lag window. Approval needed before budgets move.

## Guardrails

- Do not move budget based only on CPA if conversion quality differs.
- Do not cut learning campaigns without checking role and time window.
- Do not recommend aggressive scaling when signal quality is weak.
