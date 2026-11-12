---
name: roas-forecast-scenarios-google-ads
description: Projects Google Ads ROAS and conversion outcomes over 30, 60, and 90 days from historical trend and seasonality, with explicit optimistic, expected, and pessimistic bands across three spend scenarios. Use when the user asks what happens if budget changes, needs a forecast for planning or a client, or wants to know whether a target is reachable.
---

# ROAS Forecast Scenarios — Google Ads

## Use this skill when

The user needs a forward-looking planning number rather than a description of the past. This skill builds a bounded projection with stated assumptions, not a prediction.

Common user requests:

- "If we double budget, what happens to ROAS?"
- "Forecast next quarter at current spend."
- "Can we hit a 4x ROAS target by the end of the quarter?"
- "What conversion volume should I promise the client for the next 90 days?"
- "Model three budget scenarios for the board."

Do not use this skill when the account has just changed materially, when tracking is unverified, or when conversion volume is too thin to establish a baseline. In those cases the honest output is a refusal plus the fix that would make a forecast possible.

## Required input

A forecast is only as good as the baseline underneath it. Ask for more history than feels necessary.

Minimum useful data:

- 12 months of monthly performance where available. 6 months is workable. Under 3 months is not forecastable.
- Daily or weekly performance for the last 90 days, to read the current trend.
- Stated target: ROAS, CPA, revenue, or conversion volume, and the date it must be hit by.
- Current daily budgets and bid strategies per campaign.
- Known future events: promotions, price changes, seasonality, product launches, site migrations, budget caps.

Recommended exports:

- Campaign performance report, segmented by month, 12 months.
- Campaign performance report, segmented by week or day, last 90 days.
- Conversion action report with attribution settings.
- Campaign settings export: type, bid strategy, budget, status.
- Change history, last 90 days.
- Search impression share and its budget and rank loss split, to judge headroom.

Required columns where available:

- campaign, campaign type, bid strategy
- date or month
- cost, impressions, clicks
- conversions, conversion value
- search impression share, impression share lost to budget, impression share lost to rank

Business context to ask for explicitly:

- margin, so ROAS can be judged against profitability rather than a vanity ratio
- conversion lag window
- whether conversion value is revenue, modelled value, or a proxy

## Before analysis

1. Verify the baseline is trustworthy before projecting it. If conversion tracking is unverified, stop and route to the tracking audit. A forecast on broken measurement is worse than no forecast.
2. Exclude data inside the conversion lag window from both the baseline and the trend read.
3. Identify structural breaks in the history: tracking changes, bid strategy switches, major budget shifts, campaign type migrations. Data before a break is a different account and should be excluded or weighted down.
4. Separate brand from non-brand where identifiable. Brand ROAS is close to inelastic to spend and will flatter any blended projection.
5. Check headroom. If impression share loss is mostly rank-driven rather than budget-driven, extra spend buys less than a linear model implies, and this must be stated in the assumptions.
6. Check 2026 platform exposure. Campaigns using Dynamic Search Ads, automatically created assets, or campaign-level broad match are subject to auto-upgrade to AI Max from September 2026. A 90-day forecast crossing that date carries a named structural uncertainty and must say so.
7. Confirm what is being forecast: the account, a campaign set, or one campaign. Forecasting a blend and reporting it as a campaign number is a common and avoidable error.

## Analysis workflow

### Layer 1: Establish the baseline

1. Compute monthly cost, conversions, conversion value, CPA, ROAS, conversion rate, and average CPC.
2. Compute the same on the last 90 days at weekly resolution.
3. Choose the baseline window explicitly and state why. Recent windows track current reality; longer windows are more stable. Say which trade-off was taken.
4. Compute variance around the baseline, not just the average. The spread drives the band width later.

### Layer 2: Separate trend from seasonality

1. Look for a repeating annual pattern across the 12-month history. With under 12 months, say seasonality cannot be isolated and treat any pattern as unproven.
2. Compute a monthly seasonal index only where two or more comparable years exist, otherwise mark it as a single-year observation.
3. Strip the seasonal component and read the underlying trend direction on efficiency, not on spend.
4. Name which of trend and seasonality dominates the forecast window.

### Layer 3: Model spend response

1. Plot historical cost against conversions and against conversion value at the campaign level.
2. Look for evidence of diminishing returns: as spend rose in past periods, did marginal CPA rise and marginal ROAS fall.
3. Use observed historical elasticity where it exists. Where it does not, state that spend response is assumed rather than measured, and widen the bands.
4. Cross-check against impression share headroom. Spend cannot grow past available auction volume regardless of what a curve suggests.

### Layer 4: Build three spend scenarios

Build each scenario at the same three confidence bands.

Spend scenarios:

- hold: current budget, unchanged
- moderate increase: a stated percentage increase, defaulting to a range the account has previously absorbed
- aggressive increase: a larger stated increase, explicitly flagged as extrapolating beyond observed spend levels if it does

Confidence bands within each scenario:

- optimistic: favourable trend continues, seasonality helps, efficiency holds
- expected: central case, trend continues at observed rate with observed variance
- pessimistic: efficiency decays, competitive pressure rises, seasonality works against

Produce 30, 60, and 90 day figures for each combination. Band width must grow with horizon. A 90-day band that is as tight as the 30-day band is wrong by construction.

### Layer 5: Name the invalidators

For every scenario, list the specific events that would break it, and say roughly how much they would move the outcome and in which direction.

## Decision rules

Use these as default heuristics, not hard laws. Adjust every threshold to the account's volume, vertical, and margin.

Forecast is **reasonably reliable** when:

- at least 6 months of stable history exists with no structural break,
- conversion volume per month is high enough that monthly ROAS is not driven by a handful of orders,
- tracking has been verified,
- the forecast horizon does not cross a known structural change,
- the spend scenarios stay within or near spend levels the account has previously operated at.

Forecast is **directional only** when:

- history is 3 to 6 months, or a structural break sits inside it,
- conversion volume is low enough that monthly variance is large relative to the trend,
- seasonality is inferred from a single year,
- a scenario extrapolates well past any spend level ever run.

Refuse to forecast when:

- conversion tracking is unverified or recently changed,
- under 3 months of usable history exists,
- the account changed campaign type or bidding strategy inside the last few weeks and has not re-stabilised,
- the user is asking for a guaranteed number rather than a range.

Widen the bands, do not narrow the story, when:

- variance in the baseline is high,
- the horizon is 60 or 90 days rather than 30,
- the scenario increases spend beyond observed levels,
- headroom is rank-limited rather than budget-limited,
- the window crosses the September 2026 AI Max auto-upgrade for exposed campaigns.

Band derivation method: optimistic and pessimistic come from the baseline's own variability - use +/-1 standard deviation of the trailing 90-day efficiency (CPA or ROAS) for the near horizon, widening by roughly half a standard deviation per additional 30 days of horizon [heuristic]. State the numbers used so the reader can reproduce the bands.

## Practical example

A retail account has 14 months of history, verified tracking, and spends about $40K/month at a blended 3.8x ROAS against a 4.0x target. The client asks whether increasing budget 50% still hits target within 90 days.

Baseline work removes two months around a site migration and separates brand from non-brand. Brand runs at 11.2x on 18% of spend. Non-brand runs at 2.2x on 82%. The blended 3.8x was never the operating number, and every scenario is therefore built on non-brand.

Seasonality across two comparable years shows a repeating lift in the forecast window, indexed at roughly 1.15 for two of the three months. Trend on non-brand ROAS over the last 90 days is mildly negative, about 4% decline per month, while average CPC rose 9%.

Spend response is measurable in this account because budgets moved twice last year. Marginal non-brand ROAS at a 25% increase was about 2.1x. There is no observation above a 30% increase, so the 50% scenario is explicitly flagged as extrapolation.

Ninety-day non-brand output, all figures as ranges:

- hold at $40K: optimistic 2.5x, expected 2.2x, pessimistic 1.9x
- moderate at $50K: optimistic 2.3x, expected 2.0x, pessimistic 1.7x
- aggressive at $60K: optimistic 2.1x, expected 1.8x, pessimistic 1.4x, extrapolated

Blended figures including brand land the moderate expected case near 3.4x, below the 4.0x target. Verdict: the 4.0x blended target is unlikely at a 50% increase on current efficiency. It becomes plausible only if non-brand conversion rate improves roughly 15% or the seasonal lift lands at the top of its historical range.

Named invalidators: the seasonal index rests on two years, the 50% scenario has no observed precedent, one competitor was escalating in the last period, and two campaigns are exposed to the September 2026 auto-upgrade which sits inside the horizon.

## Output format

Lead with uncertainty, not with the headline number. A forecast presented as a single figure will be quoted as a promise.

### Forecast reliability statement

State first: reasonably reliable / directional only / refused, with the reason. Never place a number above this line.

### Assumptions

List every assumption explicitly:

- baseline window chosen and why
- brand and non-brand treatment
- seasonality basis and how many years it rests on
- spend response: measured or assumed
- attribution and conversion lag handling
- what was excluded from history and why

### Scenario table

For each of the three spend scenarios, at 30, 60, and 90 days, give:

- spend
- conversions: optimistic / expected / pessimistic
- conversion value: optimistic / expected / pessimistic
- ROAS: optimistic / expected / pessimistic
- CPA: optimistic / expected / pessimistic
- whether the scenario extrapolates beyond observed spend levels

### Target assessment

State whether the stated target is reachable in each scenario, in plain language, with the condition that would have to hold.

### Invalidators

List what would break the forecast, the direction of the impact, and roughly how large. Include platform change exposure inside the horizon.

### Route to next

Name the sibling skills to run next:

- baseline not trustworthy: conversion-tracking-audit-google-ads, run before any forecast
- account not ready to absorb more spend: account-triage-google-ads
- efficiency decay before scaling: wasted-spend-finder-google-ads and search-terms-hygiene-google-ads
- turning an approved scenario into a rollout: scaling-planner-google-ads
- bid strategy will not hold at the new spend level: bidding-strategy-sanity-check-google-ads
- external pressure suspected in the decay trend: competitor-benchmark-auction-insights-google-ads
- Performance Max campaigns carrying most of the forecast spend: pmax-performance-diagnosis-google-ads
- monitoring the forecast once live: anomaly-detection-google-ads and weekly-operator-digest-google-ads

### Data gaps

List what was missing and which part of the forecast it weakened.

## Guardrails

- Never present a projection as a guarantee, a commitment, or a promise. Use "projected range" and "expected case", never "will be".
- Never give a single number without its band. If only one number is requested, give the range anyway and explain why.
- Always state assumptions before results, in the output itself, not only in reasoning.
- Always name what would invalidate the forecast. A forecast without invalidators is not finished.
- Band width must widen with horizon and with any extrapolation beyond observed spend.
- Do not extrapolate a spend level the account has never run without labelling it as extrapolation in every table row where it appears.
- Do not forecast on unverified conversion tracking. Refuse and route instead.
- Do not treat a pattern from a single year as established seasonality.
- Do not forecast blended ROAS without disclosing the brand and non-brand mix that produces it.
- Flag any platform change inside the forecast horizon, including the September 2026 AI Max auto-upgrade for exposed campaigns, as a named structural uncertainty.
- When a threshold in this skill does not fit the account's volume or vertical, say which one you adjusted and why.
