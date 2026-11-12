---
name: Meta Budget Scaling
description: Build Meta Ads budget, CBO or ABO, and scaling recommendations using ROAS, CPA, MER, frequency, learning phase, profit headroom, and pacing guardrails. Use for budget changes, scaling plans, spend forecasts, campaign budget optimization questions, and "can we increase spend" decisions.
---

# Meta Budget Scaling

Use this skill when the work is budget allocation, scaling, or forecasting. The goal is to scale what is truly profitable without destabilizing delivery or amplifying fatigue.

## Start Here

1. Read any customized Meta budget-scaling instructions if available.
2. Discover connected Meta Ads, ecommerce, analytics, CRM, spreadsheet, and BI tools.
3. Confirm account, campaign scope, date range, timezone, currency, attribution setting, primary event, KPI target, and budget guardrails.
4. Pull spend, budgets, results, CPA, purchase value, ROAS, CPM, frequency, learning status, and revenue truth sources.
5. Read AOV, gross margin, LTV, lead-to-customer rate, or target CPA from customized instructions or connected sources when available.
6. Check tracking quality before making scale recommendations.
7. Check creative fatigue and learning phase before recommending more budget.
8. Draft budget changes, pacing plans, or forecasts.
9. Apply changes only when explicit authority exists.

For formulas and interpretation rules, read `../meta-ads-command-center/references/meta-math.md`.

## Scale Readiness

A campaign or ad set is a scale candidate when:

- tracking is credible
- ROAS, CPA, or downstream quality clears the target
- frequency is not signaling fatigue
- CPM trend is not deteriorating without explanation
- delivery is not stuck in Learning Limited
- there is enough audience size or event volume
- the same result appears across more than one short window

If creative is fatigued or tracking is broken, recommend fixing that before increasing spend.

## Budget Recommendations

For each budget recommendation, include:

- current budget and spend
- proposed new budget
- campaign or ad set scope
- evidence and date window
- expected conversions, revenue, CPA, ROAS, or MER
- learning-phase risk
- fatigue risk
- rollback path
- approval needed

Prefer staged increases when scaling. Avoid large single-step increases unless the user explicitly accepts relearning and volatility risk.

## CBO and ABO Guidance

Use CBO-style campaign budgets when the goal is portfolio optimization across ad sets with enough event volume. Use ad set budgets when the user needs controlled tests, guaranteed spend, or strict audience separation.

Before recommending a CBO or ABO change, check:

- current objective and optimization event
- ad set event volume
- whether one ad set dominates delivery
- audience overlap
- creative parity across ad sets
- reporting and testing needs

## Output Format

```text
Meta budget scaling: <account>, <date window>.
Scale candidates: <campaigns or ad sets>.
Do not scale: <fatigue, tracking, or learning blockers>.
Budget plan: <current -> proposed with staged timing>.
Forecast: <spend, results, revenue, CPA/ROAS/MER>.
Needs approval: <specific edits>.
Blocked: <missing margin, revenue, or tracking data>.
```

