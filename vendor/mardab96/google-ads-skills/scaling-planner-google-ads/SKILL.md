---
name: scaling-planner-google-ads
description: Analyzes Google Ads campaigns to decide where to add budget, where to hold, where to reduce, and where to pause. Uses efficiency metrics, lost impression share due to budget, conversion volume, CPA or ROAS stability, search demand, budget constraints, and campaign maturity. Use before increasing spend, reallocating monthly budgets, or building a scaling plan.
---

# Scaling Planner — Google Ads

## Use this skill when

The user wants to decide where to add budget or reduce spend.

Common user requests:

- "Where should we scale budget?"
- "Which campaigns deserve more spend?"
- "Where should we pause or cut?"
- "Create a budget reallocation plan."
- "We want to increase spend next month. What is safest?"

## Required input

Recommended date range: 30–90 days, plus prior period if available.

Required exports:

- Campaign performance report.
- Budget and impression share report.
- Bid strategy report.
- Conversion action report.
- Search terms or search category report, if relevant.
- Product/category report for Shopping or PMax ecommerce.

Required columns where available:

- campaign
- campaign type
- budget
- spend
- conversions
- conversion value
- CPA
- ROAS
- impression share
- search impression share lost to budget
- search impression share lost to rank
- click share
- top impression share
- bid strategy
- target CPA or target ROAS
- status
- limited by budget status
- conversion action

Optional but useful:

- margin,
- inventory status,
- sales capacity,
- lead quality,
- LTV,
- offline conversions,
- seasonality calendar,
- planned promos.

## Before analysis

1. Confirm scaling goal:
   - more conversions,
   - more revenue,
   - more qualified leads,
   - profit growth,
   - market share,
   - new customer growth.
2. Confirm acceptable efficiency trade-off:
   - target CPA,
   - target ROAS,
   - max CPA,
   - minimum ROAS,
   - marginal CPA tolerance.
3. Confirm whether budget can increase overall or must be reallocated within a fixed total.
4. Check conversion tracking and bidding readiness.
5. Check whether campaigns are limited by budget or by rank/demand.

## Analysis workflow

1. Classify campaigns by performance and opportunity:
   - efficient and budget-limited,
   - efficient but not budget-limited,
   - inefficient but strategically necessary,
   - inefficient and not strategic,
   - under-tested,
   - tracking-risk.
2. Calculate scaling indicators:
   - CPA or ROAS vs target,
   - conversion volume,
   - conversion stability,
   - lost impression share due to budget,
   - lost impression share due to rank,
   - spend share,
   - conversion share,
   - marginal opportunity.
3. Identify scale candidates:
   - CPA below target or ROAS above target,
   - meaningful lost IS due to budget,
   - stable conversion volume,
   - no tracking issues,
   - no major query quality concerns.
4. Identify hold candidates:
   - efficient but no clear extra demand,
   - performance volatile,
   - recently changed bidding or budget,
   - conversion lag risk.
5. Identify reduction candidates:
   - inefficient vs target,
   - low strategic value,
   - no evidence of budget constraint,
   - query or targeting waste,
   - poor conversion quality.
6. Identify pause candidates:
   - persistent high spend with no conversions,
   - tracking-confirmed poor quality,
   - obsolete offer/product/geo,
   - duplicate structure.
7. Build a budget movement plan.

## Decision rules: scaling

Prefer increasing budget when:

- campaign is at or better than efficiency target,
- conversion volume is stable,
- lost impression share due to budget is meaningful,
- search demand or audience opportunity exists,
- tracking quality is trusted,
- bid strategy is not overly constrained.

Avoid scaling when:

- performance is efficient only because of brand-heavy traffic,
- conversion volume is too low to trust,
- recent changes are still learning,
- conversion lag is significant,
- campaign is rank-limited rather than budget-limited,
- target CPA or tROAS is unrealistic.

Consider reducing or pausing when:

- spend exceeds 1.5–2.0x target CPA with no conversions and sufficient data,
- ROAS is persistently below threshold,
- query mix is poor,
- conversion quality is poor,
- campaign duplicates another better-performing campaign,
- the campaign is not strategically required.

## Budget increase guidance

Cadence: one increment per 72 hours or one conversion-delay window, whichever is longer [heuristic]; each 20%+ change can re-enter learning, so judge the effect only after the window closes. Do not move tCPA / tROAS targets and budgets in the same step - one variable at a time; when scaling with a target, expect to loosen the target slightly as volume grows and say so in the plan. 2026 note: campaigns exposed to the September 2026 AI Max auto-upgrade (DSA, auto-created assets, campaign-level broad match) should not anchor a long scaling program without naming the upgrade as a moving part.

Use conservative scaling by default:

- low-risk campaigns: increase 10–20%,
- medium-risk campaigns: increase 5–10%,
- high-risk campaigns: hold or test first,
- unstable campaigns: do not scale until stabilized.

If the user asks for aggressive scaling, clearly state the efficiency risk.

## Practical example

D2C subscription brand currently spending $45K/month on Google Ads, target ROAS 3.5. User asks: "where can we add $5K/month next month". Claude classifies all 14 campaigns: 2 campaigns at ROAS 4.8 (above target) with 38% IS lost to budget = scale candidates with $8–12K monthly capacity, 1 campaign at ROAS 4.2 (above target) but 0% IS lost to budget = hold (already maxed on demand), 3 campaigns at ROAS 1.9–2.6 (below target) = reduce budget 30%, 1 campaign at $1,800 spend over 21 days with 0 conversions = pause (sufficient data), 7 campaigns within target band = hold. Net plan delivered: take $5,400 from underperforming campaigns ($3,600 reduce + $1,800 pause), add $5,000 net new budget, total $10,400 redirected to 2 scale candidates. Projected total spend: $50,000/month with blended ROAS 4.1 vs 3.5 target — efficiency improvement comes from reallocation, not just new budget. Monitoring plan: review at days 7, 14, 30 with rollback if blended ROAS drops below 3.2 or scale candidates lose >0.5 ROAS points.

## Output format

### Executive summary

- Total current spend.
- Recommended new spend.
- Budget to add, hold, reduce, or pause.
- Main scaling opportunity.
- Main scaling risk.

### Budget recommendation table

For each campaign include:

- campaign
- campaign type
- current budget
- current spend
- conversions
- CPA / ROAS
- target
- lost IS due to budget
- lost IS due to rank
- recommendation: scale / hold / reduce / pause
- recommended budget change
- reason
- risk level

### Reallocation plan

Show:

- budget taken from,
- budget added to,
- net change,
- expected impact,
- assumptions.

### Monitoring plan

Include:

- review cadence,
- metrics to monitor,
- acceptable CPA / ROAS drift,
- rollback conditions,
- next scale checkpoint.

### Route to next

Pre-scale readiness doubts -> account-triage-google-ads. Bidding stability -> bidding-strategy-sanity-check-google-ads. Forecast for the proposed budget -> roas-forecast-scenarios-google-ads.

### Data gaps

Name the exports or fields that were missing and which verdict each one would firm up.

## Guardrails

- Do not recommend adding budget based only on strong CPA or ROAS; require evidence of additional available demand.
- Do not treat lost IS due to budget as automatic scale permission if efficiency is weak.
- Do not cut strategic campaigns without labeling the trade-off.
- Do not recommend large budget jumps without explaining learning and efficiency risk.
- Always separate guaranteed budget movement from estimated performance impact.
- When a threshold in this skill does not fit the account's volume or vertical, say which one you adjusted and why.
