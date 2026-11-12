---
name: bidding-strategy-sanity-check-google-ads
description: Reviews Google Ads bid strategies such as Manual CPC, Maximize Clicks, Maximize Conversions, Maximize Conversion Value, tCPA, and tROAS to determine whether they fit the account's conversion volume, tracking quality, budget, historical performance, and growth stage. Use before changing bidding, when CPA or ROAS is unstable, after tracking changes, or before scaling.
---

# Bidding Strategy Sanity Check — Google Ads

## Use this skill when

The user wants to evaluate whether their current bidding strategy is appropriate.

Common user requests:

- "Is tCPA right for this account?"
- "Should we switch to Maximize Conversions?"
- "Why did performance drop after changing bidding?"
- "Check if our bidding setup makes sense."
- "Can we move to tROAS?"

## Required input

Recommended exports:

- Campaign performance report for 60–180 days.
- Bid strategy report.
- Conversion action report.
- Budget and impression share report.
- Change history around bidding and budget changes.
- Conversion value report, if using value-based bidding.

Required fields where available:

- campaign
- campaign type
- bid strategy
- bid strategy status
- target CPA or target ROAS
- budget
- spend
- conversions
- conversion value
- CPA
- ROAS
- impression share
- lost IS due to budget
- lost IS due to rank
- conversion action
- conversion lag
- change date

## Before analysis

1. Identify account stage:
   - new account,
   - learning / data gathering,
   - stable efficiency,
   - scaling,
   - constrained by budget,
   - constrained by conversion volume,
   - tracking unstable.
2. Identify primary business goal:
   - traffic,
   - leads,
   - qualified leads,
   - purchases,
   - revenue,
   - profit.
3. Verify conversion tracking quality.
4. Check whether conversion value is accurate and meaningful.
5. Check for recent target, budget, or conversion action changes.

## Analysis workflow

1. Map each campaign to:
   - campaign type,
   - current bid strategy,
   - target,
   - conversion volume,
   - spend,
   - budget constraints,
   - tracking quality.
2. Evaluate strategy fit:
   - Manual CPC,
   - Maximize Clicks,
   - Maximize Conversions,
   - Maximize Conversion Value,
   - Target CPA,
   - Target ROAS.
3. Check conversion volume sufficiency:
   - enough conversions for stable optimization,
   - stable conversion action mix,
   - conversion lag maturity.
4. Check target realism:
   - target CPA too low vs historical CPA,
   - target ROAS too high vs historical ROAS,
   - targets changed too frequently,
   - targets inconsistent across similar campaigns.
5. Check budget fit:
   - budget too low for target,
   - campaign limited by budget,
   - budget increases too aggressive,
   - daily budget incompatible with CPA target.
6. Check objective mismatch:
   - optimizing for leads when quality is the problem,
   - optimizing for revenue when value tracking is wrong,
   - using click bidding when conversion data exists,
   - using tROAS without reliable values.
7. Recommend bidding setup by campaign.

## Decision rules: strategy fit heuristics

Manual CPC may fit when:

- conversion volume is very low,
- tracking is not ready,
- the user needs tight CPC control,
- the campaign is exploratory.

Note on Manual CPC and Enhanced CPC: Enhanced CPC (eCPC) for Search and Display was deprecated effective 2025-03-31 and is no longer available as a standalone strategy on those campaign types. Manual CPC remains documented but availability depends on campaign type. For modern CPC control, use Maximize Clicks with a max CPC limit as a practical equivalent — it preserves CPC ceiling control while allowing the auction to bid up to that limit on better-quality traffic.

Maximize Clicks may fit when:

- the goal is traffic discovery,
- conversion tracking is not ready,
- CPC control is needed with a max CPC limit,
- the campaign is not expected to optimize for conversions yet.

Maximize Conversions may fit when:

- conversion tracking is reliable,
- the campaign needs volume,
- there is enough budget flexibility,
- CPA target is not yet stable.

Target CPA may fit when:

- conversion tracking is reliable,
- conversion volume is sufficient (~30 conversions in the last 30 days per campaign [platform guidance range - verify current docs]; below that, prefer Maximize Conversions or consolidate),
- CPA target is realistic vs history (a target more than 15-20% better than the trailing 30-day actual is a starvation flag [heuristic]),
- conversion quality is acceptable.

Cadence and scope rules that apply to every strategy above:

- More than one target change per campaign per 2 weeks keeps resetting learning [heuristic].
- Portfolio bid strategies and shared budgets are checked as one unit: a per-campaign read of a portfolio member is misleading; name the portfolio and judge it whole.

Maximize Conversion Value may fit when:

- conversion value is tracked accurately,
- the user wants revenue or value growth,
- the account is not ready for a strict tROAS target.

Target ROAS may fit when:

- value tracking is accurate,
- enough conversion value data exists,
- margins or revenue goals are clear,
- target ROAS is realistic.

## Practical example

Agency inheriting a Google Ads account from a previous freelancer. 12 campaigns, $19K/month spend. Claude maps current bidding setup: 9 campaigns on tCPA, 2 on Maximize Clicks, 1 on Maximize Conversions. Findings: 4 campaigns with 8–15 monthly conversions on tCPA (below the ~30/month threshold for stable Smart Bidding learning), 3 campaigns with tCPA targets 40–60% below historical CPA (artificially capping volume — Smart Bidding throttles to hit unrealistic target, IS lost to bid jumps), 2 brand campaigns on tCPA (better fit: Maximize Conversion Value or even Manual CPC where available, since brand traffic does not benefit from CPA optimization), 2 prospecting campaigns on Maximize Clicks but conversion volume is now 40+/month (data sufficient for tCPA migration). Migration plan delivered: shift 4 volume-constrained campaigns from tCPA to Maximize Conversions with a 14-day learning period, raise tCPA targets 30–40% on volume-constrained campaigns to realistic levels, switch 2 brand campaigns to value-based, migrate 2 prospecting campaigns to tCPA with conservative targets. Risk flagged: never migrate more than 2 campaigns simultaneously, to keep diagnostic clarity if performance shifts.

## Output format

### Executive summary

- Current bidding health.
- Campaigns with misaligned strategies.
- Biggest bidding risk.
- Recommended bidding direction.

### Campaign bidding table

For each campaign include:

- campaign
- campaign type
- current strategy
- current target
- conversion volume
- CPA / ROAS
- budget status
- fit rating
- recommended strategy
- reason
- risk level

### Target sanity check

For each target include:

- current target,
- historical average,
- gap,
- whether target is realistic,
- recommended adjustment.

### Migration plan

Include:

- what to change,
- what not to change,
- sequencing,
- learning period expectations,
- monitoring metrics,
- rollback conditions.

### Route to next

Signal doubts before any change -> conversion-tracking-audit-google-ads. Volume too thin for targets -> account-structure-audit-google-ads (consolidation). Ready to add budget -> scaling-planner-google-ads.

### Data gaps

Name the exports or fields that were missing and which verdict each one would firm up.

## Guardrails

- Do not recommend Smart Bidding if conversion tracking is unreliable.
- Do not recommend tROAS if conversion values are missing or untrusted.
- Do not recommend aggressive target changes without explaining risk.
- Do not judge bidding in isolation from budget, conversion volume, and tracking quality.
- Do not treat default conversion volume thresholds as universal rules.
- When a threshold in this skill does not fit the account's volume or vertical, say which one you adjusted and why.
