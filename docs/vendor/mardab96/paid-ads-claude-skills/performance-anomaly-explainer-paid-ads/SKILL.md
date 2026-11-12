---
name: performance-anomaly-explainer-paid-ads
description: Explains paid ads performance spikes and drops using baseline comparison, variance, volume, tracking changes, auction shifts, creative changes, landing page changes, and seasonality. Use when CPA, ROAS, CVR, CPC, CPM, or lead volume changes suddenly.
---

# Performance Anomaly Explainer - Paid Ads

When you need the shared quality bar, use `../references/paid-ads-output-standard.md` and `../references/paid-ads-principles.md` if they are available.

## Use this skill when

The user asks why performance changed.

## Required input

- Metric that changed.
- Date range of change.
- Baseline period.
- Campaign and channel breakdown.
- Recent changes.
- Spend, impressions, clicks, conversions, CPA, ROAS, CVR, CTR, CPC, CPM.
- Tracking or site changes.

## Analysis workflow

1. Define the anomaly and baseline.
2. Check sample size and normal variance.
3. Split by channel, campaign, device, geo, audience, creative, and landing page where possible.
4. Check recent changes and tracking events.
5. Produce likely explanations with confidence.

## Decision rules

Every threshold below is a starting heuristic, not a platform rule. Recalibrate against the account's own history, and say which threshold you adjusted and why.

Is it even an anomaly (compute this before hypothesizing):

- Baseline: trailing 28 days, same-weekday comparison by default [heuristic]. A Monday is compared with Mondays.
- A change is `within normal variance` if it is smaller than 2 standard deviations of the baseline daily values, or rests on fewer than 50 clicks / 10 conversions in the anomaly period [heuristic]. Verdict: monitor, not a finding.
- `investigate`: 2-3 standard deviations at sufficient volume, or a smaller move that coincides with a logged change.
- `significant`: over 3 standard deviations at sufficient volume, or any move where a tracking change is in the window (tracking outranks statistics).
- Ratio metrics (CPA, CVR) on days below ~5 conversions are unreadable; analyze cost and clicks daily and conversions at the weekly grain instead [heuristic].

Attribution order once the anomaly is real: tracking changes first, then auction (CPM/CPC moves), then creative (CTR), then landing page (CVR), then seasonality. Stop at the first sufficient explanation and state the residual.

For daily CSVs, run `../scripts/anomaly_baseline.py` to compute the baseline, deviations and the verdict tier deterministically.

## Output format

Owner-decision labels in output tables use the shared enum from `../references/paid-ads-output-standard.md`: `do_now / test / investigate / monitor / ignore / approval_needed`. Evidence labels use `export / screenshot / url / notes / hypothesis / needs_data`.

| Hypothesis | Evidence | Confidence | How to verify | Action |
|---|---|---|---|---|

### Missing data

Name the exact exports or fields that would change the diagnosis, and which finding each one would firm up.

### Approval gates

List what needs a human yes before anything moves: budget changes, pauses, negative lists, tracking edits, page changes. Nothing in this output is an instruction to execute.

## Practical example

Illustrative made-up case, not a real account.

Input: "CPA exploded yesterday." Yesterday: $95 CPA on 6 conversions, $570 spend. Trailing 28 days: mean CPA $61, but daily conversions average 9 with a standard deviation that puts 6 inside normal range; same-weekday (Tuesday) mean is $67.

| Hypothesis | Evidence | Confidence | How to verify | Action |
|---|---|---|---|---|
| Within normal variance | 6 conversions is below the 10-conversion floor for daily ratio metrics; vs same-weekday baseline the move is < 2 SD | high | recompute at weekly grain in 3 days | monitor |

Verdict: not an anomaly yet - one day at low volume. The skill explicitly refuses the "what broke" framing: nothing measurably broke. If the weekly-grain check in 3 days still shows CPA > 2 SD above baseline, escalate to `investigate` and split by campaign / device / geo, checking the change log first.

## Guardrails

- Do not overreact to one day of data.
- Do not claim causality from correlation.
- Do not ignore tracking or conversion lag.
