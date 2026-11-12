---
name: cpa-spike-diagnosis-google-ads
description: Diagnoses the cause of a CPA increase by working through ranked root causes - tracking change, bid and budget change, mix shift, auction pressure, landing page, quality decay, and seasonality - and returns each with severity and supporting evidence. Use when the user reports that CPA jumped, cost per lead rose, or an anomaly alert fired and the reason is unknown.
---

# CPA Spike Diagnosis — Google Ads

## Use this skill when

The user knows CPA moved and needs to know why. This skill is about cause, and that distinction is deliberate.

`anomaly-detection-google-ads` answers "did something deviate from expectation, where, and when." It detects. It does not explain. This skill takes the detected deviation and works it back to a cause with evidence attached. If the user has not yet established that a real deviation occurred, run anomaly detection first and return here with its output.

Common user requests:

- "CPA doubled last week. What happened?"
- "Cost per lead is up 40% month over month."
- "The anomaly alert fired on this campaign. Now what?"
- "Client is asking why leads got expensive. I need an answer today."
- "Did we break something or is this the market?"

## Required input

Diagnosis needs comparison data. A single period cannot explain itself.

Minimum useful data:

- The spike window and a clean baseline window of comparable length.
- Campaign performance export covering both windows, segmented by day.
- Change history covering the baseline window and the spike window.
- Stated target CPA and which conversion actions are primary.

Recommended Google Ads exports:

- Campaign and ad group performance, segmented by day.
- Change history, covering at least 30 days before the spike began.
- Conversion action report with status, counting method, and attribution settings.
- Search terms report for both windows.
- Auction insights for both windows, where available.
- Device, geographic, and network segment reports.
- Keyword report with Quality Score components, where the campaigns are Search.
- Prior-year data for the same calendar period, where the account is old enough.

Required columns where available:

- date
- campaign, campaign type, ad group
- cost, impressions, clicks
- CTR, average CPC
- conversions, conversion rate, conversion value
- conversion action name
- search impression share and its loss breakdown
- device, location, network

If the Google Ads MCP server or API access is available, pull the `change_event` resource directly. It is the single highest-yield source in this workflow and is frequently the whole answer.

## Before analysis

1. Establish that the spike is real before explaining it. A small denominator produces violent CPA swings that mean nothing. Confirm the conversion volume in both windows is large enough to compare.
2. Define the two windows precisely and state them in the output. A vague comparison produces a vague cause.
3. Check the conversion lag window. The most common false spike in paid search is a recent window whose conversions have not finished arriving. If the spike window sits inside the lag, say so and stop. There may be nothing to diagnose.
4. Confirm which conversion actions are primary in both windows. If that set changed, the two CPA figures are not comparable.
5. Check 2026 upgrade exposure. Campaigns using Dynamic Search Ads, automatically created assets, or campaign-level broad match are subject to auto-upgrade to AI Max from September 2026, and an upgrade event is itself a candidate cause.
6. Note any known deprecations in the window. Call-only ads were deprecated in February 2026, and Video Action and Discovery campaigns were replaced by Demand Gen, so a campaign that stopped serving may reflect a platform change rather than an account problem.

## Analysis workflow

Decompose before you hypothesise. CPA is cost divided by conversions, so every spike resolves into rising cost per click, falling conversion rate, or a shift in the mix of what is being bought. Establish which one moved before naming a cause.

### Step 0: Decompose the arithmetic

Compare baseline to spike window on: cost, clicks, CPC, conversion rate, conversions. Identify whether CPA rose because CPC rose, because conversion rate fell, or both. This single step eliminates most of the candidate causes immediately.

Then work the causes in this order. The order is deliberate: earlier causes invalidate later ones, and the earlier causes are cheaper to confirm.

### Cause 1: Tracking or measurement change

Check first, always. A measurement change makes every later analysis meaningless.

Evidence to look for: conversion volume dropping while clicks hold steady, a conversion action changing status or counting method, a new or removed primary action, an attribution setting change, a tag deployment or site release near the spike start, a conversion rate that fell on all campaigns and devices simultaneously.

A cause that appears uniformly everywhere is rarely a market cause. Uniformity points at measurement.

### Cause 2: Deliberate change inside the account

Read the change history against the spike start date. Look for budget changes, bid strategy changes, target changes, new campaigns, paused campaigns, keyword or match type additions, negative list edits, geographic or schedule changes, and asset changes.

Evidence to look for: a change entry within a few days before the deviation begins, and an effect concentrated in the entities that were changed.

### Cause 3: Mix shift

CPA can rise with no single campaign getting worse, purely because spend moved toward more expensive segments.

Evidence to look for: stable per-campaign CPA alongside a changed distribution of spend, brand share of spend falling, a cheap campaign becoming budget-limited, a new expensive campaign launching, a device or geographic mix change.

Test this by recomputing account CPA on the spike window using baseline spend weights. If most of the gap disappears, the cause is mix, not decay.

### Cause 4: Auction pressure

Evidence to look for: CPC rising while conversion rate holds, impression share lost to rank increasing, auction insights showing new or more aggressive competitors, top and absolute top share falling at constant bids.

This is a real cause but it is over-diagnosed, because it is the comfortable answer. Only conclude it after causes 1 through 3 are excluded.

### Cause 5: Landing page or offer

Evidence to look for: conversion rate falling while CTR and CPC hold steady, a deployment or page change near the spike start, a specific final URL underperforming, page speed or availability problems, an offer or pricing change, a form or checkout change.

### Cause 6: Quality and relevance decay

Evidence to look for: CTR falling gradually, expected CTR or ad relevance components degrading, ad rotation shifting to weaker assets, creative fatigue on long-running ads, search terms drifting away from the keyword theme.

This cause is usually gradual. A step change on a single day is rarely creative decay.

### Cause 7: Seasonality and demand

Evidence to look for: the same pattern in the prior year, a category-wide shift, search volume falling while position holds, a holiday or event window.

Conclude seasonality last and only with prior-period evidence. Without a comparable prior period, seasonality is a guess wearing a suit.

### Final step: Attribute the gap

State how much of the CPA increase each confirmed cause explains, in currency or percentage points, and state what remains unexplained. An honest residual is better than a tidy story.

## Decision rules

Use these as default heuristics, not hard laws. Adjust to the account's volume and vertical.

Rank causes by **severity**, defined as the share of the CPA gap the cause explains multiplied by confidence in the evidence.

Assign confidence as:

- **confirmed**: a specific change event, a specific conversion action state, or a specific dated deployment lines up with the deviation start.
- **likely**: the metric pattern fits the cause and competing causes are excluded, but no dated event confirms it.
- **possible**: the pattern is consistent with the cause but also with others.
- **excluded**: the evidence rules it out.

Do not issue a diagnosis when:

- the spike window sits inside the conversion lag,
- conversion volume in either window is too low to compare,
- the primary conversion action set changed between windows,
- change history is unavailable and the pattern points at an account change.

Prefer a small number of confirmed causes over a complete list of possible ones. Multiple causes commonly coexist, and saying so is more useful than forcing one.

Mix-shift formula (the step operators fumble): for each segment, baseline spend weight x that segment's spike CPA, summed over segments with spike conversions - a weighted arithmetic mean of segment CPAs, which is what `../scripts/spike_decompose.py` computes (not a re-blended cost/conversions ratio). Verdict threshold: if the reweighted CPA sits within 30% of the baseline-to-spike distance from baseline, the move is mostly mix [heuristic - the script's own threshold]. If the reweighted CPA is close to baseline, the spike is mix (money moved to worse segments), not deterioration inside segments. `../scripts/spike_decompose.py` computes this and the CPC-vs-CVR split deterministically.

## Practical example

An account spending roughly $22K a month at a target CPA of $110 reports CPA rising from $104 to $187 in a two-week window. The client assumes competitors are bidding harder.

Decomposition rules that out immediately. CPC moved from $4.10 to $4.35, a modest rise. Conversion rate fell from 3.9% to 2.2%. This is a conversion problem, not an auction problem, and the competitor theory is excluded in the first step.

Cause 1 partly confirms. One of three primary conversion actions, a phone-call action, recorded 84 conversions in the baseline window and 11 in the spike window, while call-related click volume held steady. A site release dated two days before the deviation began matches the drop. This alone accounts for roughly $44 of the $83 CPA gap, and it is not a performance problem at all, it is unrecorded conversions.

Cause 2 confirms a second contributor. Change history shows a target CPA reduction on the largest campaign, applied one day into the window. Spend fell 22% on that campaign, which was the account's cheapest converter, pushing the mix toward two expensive campaigns.

Cause 3 quantifies that mix effect. Recomputing spike-window CPA at baseline spend weights gives $157 rather than $187, so roughly $30 of the gap is mix rather than decay.

Causes 4 through 7 are examined and returned as excluded or possible. Impression share lost to rank moved by under two points. Auction insights show no new entrant. Prior-year data shows no equivalent seasonal dip.

The delivered diagnosis: two confirmed causes, a broken call conversion tag and a mix shift caused by a bid target change, together explaining most of the gap, with roughly $9 unexplained and labelled as such. The recommended sequence is to fix the tag first and re-measure before touching bids, because the target reduction that caused the mix shift was itself a response to a CPA that was never real.

## Output format

Return a diagnosis, not a data dump. The client wants a cause and an action.

### Verdict

One or two lines: the primary cause, the share of the gap it explains, and whether the spike is real, measurement-induced, or immature data.

### The arithmetic

Baseline versus spike window on cost, clicks, CPC, conversion rate, conversions, and CPA. State both window definitions explicitly.

### Ranked causes

For each cause include:

- rank
- cause category: tracking / account change / mix shift / auction pressure / landing page / quality decay / seasonality
- finding
- evidence: the specific metric, change entry, date, or entity
- share of the CPA gap explained, in currency or percentage points
- severity: blocking / material / minor
- confidence: confirmed / likely / possible / excluded

Include excluded causes explicitly. Showing what was ruled out is often more valuable to the client than the finding itself.

### Unexplained residual

State the portion of the gap no cause accounts for. Do not distribute it across causes to make the numbers close.

### Recommended sequence

Order the fixes by dependency, not by size. Measurement fixes come first because every later measurement depends on them. Say explicitly what should not be changed until the earlier fixes have matured.

### Route to next

- Confirmed tracking causes route to `conversion-tracking-audit-google-ads`.
- Bid strategy and target changes route to `bidding-strategy-sanity-check-google-ads`.
- Budget-driven mix shifts route to `impression-share-gap-finder-google-ads`.
- Quality and relevance decay routes to `quality-score-analysis-google-ads`, then `rsa-ad-copy-review-google-ads` and `rsa-ad-copy-generator-google-ads`.
- Query drift routes to `search-terms-hygiene-google-ads`, and unprofitable segments to `wasted-spend-finder-google-ads`.
- Overlap or structural causes route to `account-structure-audit-google-ads`.
- Performance Max campaigns route to `pmax-performance-diagnosis-google-ads`, since their internal mix is not visible in the same segments.
- If the account context is unclear beyond this spike, route to `account-triage-google-ads`.
- Once CPA is restored and stable, route to `scaling-planner-google-ads`.

### Monitoring plan

- Re-measure after the conversion lag has passed, not before.
- Define what "recovered" means numerically, in advance.
- Name the rollback condition for each fix.
- Do not apply more than one significant change at a time to a campaign under diagnosis, or the next measurement will be uninterpretable.

### Data gaps

Name the exports or fields that were missing and which verdict each one would firm up.

## Guardrails

- Never diagnose a spike whose window sits inside the conversion lag. Say the data is immature and stop.
- Never conclude auction pressure or seasonality before excluding tracking, account changes, and mix.
- Never blame the market without evidence from auction insights or a comparable prior period.
- Always state the residual you cannot explain rather than forcing the causes to sum to the full gap.
- Always separate detection from diagnosis. If no deviation has been established, run `anomaly-detection-google-ads` first.
- Do not recommend bid or budget reactions to a CPA that measurement has not yet been shown to report correctly.
- Do not describe deprecated formats or campaign types as live causes or live fixes.
- When a threshold in this skill does not fit the account, say which one you adjusted and why.
