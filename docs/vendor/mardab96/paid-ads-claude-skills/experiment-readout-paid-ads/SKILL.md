---
name: experiment-readout-paid-ads
description: Turns a paid ads test into a decision using hypothesis, setup, dates, budget, metrics, sample size, tracking confidence, business result, and next action. Use after creative, offer, landing page, audience, bidding, or channel tests.
---

# Experiment Readout - Paid Ads

When you need the shared quality bar, use `../references/paid-ads-output-standard.md` and `../references/paid-ads-principles.md` if they are available.

## Use this skill when

The user needs to decide what a test means.

## Required input

- Test hypothesis.
- Start and end dates.
- Control and variant.
- Budget and traffic split.
- Metrics and conversion definition.
- Tracking confidence.
- Business notes.

## Analysis workflow

1. Restate the hypothesis.
2. Check if the test was set up cleanly.
3. Compare outcome metrics and business result.
4. Check sample size and confounding changes.
5. Decide: scale, iterate, hold, stop, or rerun.

## Decision rules

Every threshold below is a starting heuristic, not a platform rule. Recalibrate against the account's own history, and say which threshold you adjusted and why.

Can this test decide anything (check before reading results):

- Event gate: ~50 unique binary outcomes per arm for a directional read, ~100 per arm for the configured higher gate [operational heuristic]. Below 50 per arm, the local policy allows only `rerun bigger` or `iterate`; passing either floor is not a statistical-power claim.
- Significance instruction: with one declared unique binary outcome and its shared traffic unit per arm, run `../scripts/experiment_significance.py` (two-proportion z-test plus the configured event gate). It reports relative lift as undefined when control is zero and gives percentage points instead. A p-value near 0.05 on a marginal event gate is `directional`, not `winner`; a p-value is not causal proof or interval coverage.
- Invalidation checklist - any of these voids the comparison: budget change on one arm mid-test, tracking or landing page change during the flight, overlapping audiences between arms, unequal flight dates or dayparting, an external event hitting one arm (promo, PR, seasonality).
- Shallow-vs-deep rule: a variant that wins on the shallow metric (CTR, CPL) and loses on the deep one (qualified rate, ROAS) is a loss, not a win. State both.
- Verdict mapping: clean setup + passes configured event gate + deep-metric win -> scale; clean but marginal -> iterate; invalidated -> rerun; passes configured event gate + no difference -> stop, the hypothesis is answered.

## Output format

Owner-decision labels in output tables use the shared enum from `../references/paid-ads-output-standard.md`: `do_now / test / investigate / monitor / ignore / approval_needed`. Evidence labels use `export / screenshot / url / notes / hypothesis / needs_data`.

| Test | Result | Confidence | Decision | Next action |
|---|---|---|---|---|

### Missing data

Name the exact exports or fields that would change the diagnosis, and which finding each one would firm up.

### Approval gates

List what needs a human yes before anything moves: budget changes, pauses, negative lists, tracking edits, page changes. Nothing in this output is an instruction to execute.

## Practical example

Illustrative made-up account, not a real advertiser.

Input: landing page test. Control 60 conversions from 2,400 clicks. Variant 75 conversions from 2,450 clicks. Variant arm budget was doubled in week 2.

Helper run: `experiment_significance.py` gives 2.50% vs 3.06%, relative lift +22.4%, absolute difference +0.56 percentage points, z = +1.19, p = 0.2349, and event gate "directional only".

| Check | Result |
|---|---|
| Sample | 60 and 75 per arm: directional event gate, not a power estimate |
| Invalidation | budget change on one arm mid-test voids the comparison |
| Shallow vs deep | qualified rate not supplied |

Verdict: rerun. Equal budgets, same flight dates, and the qualified-lead rate reported next to conversion rate.

## Guardrails

- Do not declare a winner from weak sample size.
- Do not ignore tracking changes during the test.
- Do not recommend scaling a test that won on shallow conversions but lost on lead quality.
