---
name: scale-readiness-check-paid-ads
description: Checks if a paid ads account is ready for more budget using conversion quality, tracking confidence, creative capacity, landing page capacity, bidding stability, marginal CPA or ROAS, and business constraints. Use before increasing spend.
---

# Scale Readiness Check - Paid Ads

When you need the shared quality bar, use `../references/paid-ads-output-standard.md` and `../references/paid-ads-principles.md` if they are available.

## Use this skill when

The user wants to increase budget or decide if scaling is safe.

## Required input

- Current budget and proposed increase.
- CPA, ROAS, CVR, conversion volume, revenue, or lead quality.
- Tracking confidence.
- Creative fatigue status.
- Landing page or checkout conversion.
- Sales, inventory, or delivery constraints.

## Analysis workflow

1. Check if the current result is real enough to scale.
2. Check tracking and business signal quality.
3. Check creative and landing page capacity.
4. Check bidding and learning stability.
5. Recommend scale, hold, fix first, or test small.

## Decision rules

Every threshold below is a starting heuristic, not a platform rule. Recalibrate against the account's own history, and say which threshold you adjusted and why.

Gate pass criteria (each gate is pass / fail / needs_data, never vibes):

| Gate | Pass criteria |
|---|---|
| Result is real | 30+ conversions in the window AND tracking verdict `ready` from a signal audit AND (for lead gen) qualification rate known [heuristic] |
| Performance holds | CPA / ROAS at or better than target for 14+ consecutive days, not one good week against three bad [heuristic] |
| Bidding stable | Learning complete, no target or strategy change inside the last conversion-delay window |
| Creative capacity | At least one concept below fatigue thresholds with headroom, or replacements approved |
| Ops capacity | Sales / inventory / delivery can absorb the projected extra volume - stated, not assumed |

Verdict mapping: all gates pass -> scale; one gate `needs_data` -> test small; performance or bidding gate fails -> hold; result-is-real gate fails -> fix first.

Step rules: +20% per step [heuristic], one step per 72 hours or one conversion-delay window, whichever is longer. Rollback trigger: CPA more than 20% above target for 3 consecutive days after a step [heuristic]. Do not move targets and budgets in the same step.

## Output format

Owner-decision labels in output tables use the shared enum from `../references/paid-ads-output-standard.md`: `do_now / test / investigate / monitor / ignore / approval_needed`. Evidence labels use `export / screenshot / url / notes / hypothesis / needs_data`.

### Scale verdict

Scale / test small / hold / fix first.

| Gate | Status | Evidence | Risk |
|---|---|---|---|

### Plan

| Step | Budget change | Monitoring trigger | Rollback |
|---|---:|---|---|

### Missing data

Name the exact exports or fields that would change the diagnosis, and which finding each one would firm up.

### Approval gates

List what needs a human yes before anything moves: budget changes, pauses, negative lists, tracking edits, page changes. Nothing in this output is an instruction to execute.

## Practical example

Illustrative made-up case, not a real account.

Input: proposal to raise the winning campaign from $200/day to $300/day. CPA $52 vs $60 target for 19 days, 74 conversions in 30 days, tracking verdict `ready` from a prior audit, one fresh creative concept approved, lead gen with 44% qualification rate known.

| Gate | Status | Evidence | Risk |
|---|---|---|---|
| Result is real | pass | 74 conv, tracking ready, qual rate known | low |
| Performance holds | pass | 19 consecutive days at/below target | low |
| Bidding stable | pass | learning complete, no target change in 14d | low |
| Creative capacity | pass | 1 fresh concept + current winner below fatigue thresholds | medium |
| Ops capacity | needs_data | sales team load unstated | medium |

Verdict: test small, not scale - one gate is needs_data. Plan: +20% to $240/day (not the requested +50%), hold 72h / one lag window, rollback if CPA > $72 for 3 consecutive days. Ask the owner one question (can sales absorb ~25% more leads); a yes upgrades the next step to the second +20%.

## Guardrails

- Do not recommend scaling if tracking or lead quality is weak.
- Do not ignore operational constraints.
- Do not recommend large jumps without monitoring triggers.
