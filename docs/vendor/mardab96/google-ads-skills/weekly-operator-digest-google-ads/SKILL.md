---
name: weekly-operator-digest-google-ads
description: Produces the recurring Google Ads account readout with an executive summary, key metrics with week-over-week and month-over-month deltas, what changed and why, anomalies, and next actions. Use when the user needs a weekly or monthly report that serves both the operator who needs detail and the stakeholder who needs the headline.
---

# Weekly Operator Digest — Google Ads

## Use this skill when

The user needs the recurring readout: a document that tells a stakeholder in thirty seconds whether the account is fine, and tells the operator in ten minutes exactly what to do next. One document, two audiences, no duplication.

Common user requests:

- "Write this week's Google Ads report."
- "Client update is due. Summarise the account."
- "What changed this week and what do I do about it?"
- "Monthly account readout for the leadership deck."
- "Set up a repeatable weekly report format for this account."

Do not use this skill to investigate a single named problem. The digest reports and routes; it does not resolve. When a finding needs a real diagnosis, hand it to the specialised skill and say so in the digest.

## Required input

The digest is recurring, so the input list should be stable enough to repeat every week without renegotiation.

Minimum useful data:

- Current period performance: the reporting week or month.
- Prior period, for week-over-week or month-over-month comparison.
- Same period last year where available, for seasonality context.
- Stated business goal: CPA target, ROAS target, lead volume, or revenue.
- Change history for the reporting period, including who changed what.

Recommended exports:

- Campaign performance report, segmented by day, covering the current and prior periods.
- Campaign settings export: type, status, bid strategy, daily budget.
- Conversion action report with status and attribution settings.
- Search terms report for the reporting period, at minimum for the top-spending campaigns.
- Asset or ad-level report where available.
- Change history for the period.

Required columns where available:

- campaign, campaign type, campaign status, bid strategy, daily budget
- date
- cost, impressions, clicks
- conversions, conversion value, conversion action name
- search impression share and its budget and rank loss split

Also ask once, then reuse each period:

- who reads this and what decision they make from it
- the three to five metrics the stakeholder actually cares about
- the conversion lag window, so the same cut-off is applied every period

## Before analysis

1. Fix the reporting period and apply the same cut-off every time. A digest whose window moves cannot be compared to the last one.
2. Exclude data inside the conversion lag window, or report it separately and label it as immature. Do this identically every period.
3. Read change history before writing a single explanation. Most of the week's movement has an author.
4. Check conversion action status. A tracking change mid-period makes the delta a measurement artefact, not performance, and that must lead the digest.
5. Confirm the goal being reported against. If it was assumed rather than given, say so in the document.
6. Note 2026 platform exposure once and carry it forward. Campaigns using Dynamic Search Ads, automatically created assets, or campaign-level broad match are subject to auto-upgrade to AI Max from September 2026. Flag affected campaigns in the digest so the stakeholder is not surprised.
7. Check that no reported campaign relies on a deprecated format. Call-only ads were deprecated in February 2026, and Video Action and Discovery campaigns have been replaced by Demand Gen. Do not describe any of these as current.

## Analysis workflow

### Layer 1: Integrity check before reporting

1. Confirm conversion actions are unchanged versus the prior period.
2. Compare conversion trend against click trend. A divergence is a measurement story, not a performance story.
3. Confirm the campaign set is the same. New or paused campaigns make raw account deltas misleading unless disclosed.

If integrity fails, the digest leads with that and every performance delta below it carries a warning label.

### Layer 2: Headline metrics and deltas

1. Compute for the period: cost, impressions, clicks, CTR, average CPC, conversions, conversion rate, conversion value, CPA, ROAS.
2. Compute week-over-week and month-over-month deltas in both absolute and percentage terms. Percentage alone hides small bases.
3. Compare against the stated target, not only against the prior period. A metric can improve week-over-week and still miss target.
4. Add same period last year where available, and say when it is not available.

### Layer 3: Attribution of change

For each material movement, assign a cause and a confidence level:

- deliberate change made in the account, with the change history entry as evidence
- budget or pacing effect
- mix shift between campaigns, devices, geographies, or brand and non-brand
- external: seasonality, competitive pressure, demand shift
- measurement: tracking, attribution, or lag artefact
- unexplained, which is an honest and acceptable answer

Never leave a headline delta without an attempted cause and a confidence level.

### Layer 4: Anomalies

1. Flag daily outliers within the period rather than only period totals. A flat week can hide two broken days.
2. Flag campaigns that stopped spending, hit budget every day, or changed spend share sharply.
3. Flag conversion actions with unusual volume in either direction.
4. Separate anomalies that need action this week from those that need watching.

### Layer 5: Next actions

1. Produce a short ordered list of actions, each with an owner, an expected effect, and a check date.
2. Distinguish actions from investigations. An investigation routes to a sibling skill rather than to a change in the account.
3. Carry forward last period's actions with their status so the digest builds a record over time.

## Decision rules

Use these as default heuristics, not hard laws. Adjust every threshold to the account's volume and variance.

Escalate a movement to the executive summary when:

- it moves the account away from the stated target rather than only between periods,
- it persists rather than appearing as a single-day spike,
- it affects a campaign carrying a large share of spend,
- it changes what the stakeholder should decide or expect.

Keep a movement in the detail section when:

- it is within the account's normal weekly variance,
- it affects a small share of spend,
- it is already explained by a known deliberate change,
- it is interesting to the operator but changes no decision.

Label a delta as **not meaningful** when:

- the base is small enough that a couple of conversions swing the percentage,
- the period sits inside the conversion lag window,
- the campaign set changed between periods,
- a tracking change occurred in either period.

Route rather than resolve when:

- the finding needs a full diagnosis to be actionable,
- the cause is unclear after change history and mix analysis,
- the fix would take longer than the digest cycle.

Variance band method: "normal weekly variance" is computed, not felt - use the trailing 8 weeks of the metric, flag only moves outside mean +/- 2 standard deviations, or outside +/-15% when history is shorter [heuristic]. Spend is always reported regardless of the band.

## Practical example

A lead-gen account spending about $22K/month, target CPA $130, reporting week ending Sunday.

Integrity passes: conversion actions unchanged, click and conversion trends move together, campaign set identical to the prior week.

Headline: cost $5,180 versus $5,040 week-over-week, up 2.8%. Conversions 34 versus 43, down 20.9%. CPA $152 versus $117, up 29.9% and now 17% above target. Month-over-month CPA is up 11%, so this is a deterioration, not a one-week wobble.

Attribution splits the movement rather than telling one story. Change history shows a target CPA on the largest campaign was lowered from $130 to $105 nine days ago. That campaign's conversions fell from 24 to 15 while its impression share dropped, which is the expected behaviour of a tighter target, and it accounts for most of the volume loss. Confidence: confirmed. A second cause is a mix shift: a secondary campaign's spend share rose from 14% to 23% after a competitor pulled back, and it converts at $198. Confidence: likely.

Anomalies: Thursday recorded 1 conversion against a weekly daily average of 5, with clicks normal. Worth watching, not yet acting on. One campaign hit its daily budget on six of seven days, up from two.

Next actions delivered: revert the target CPA to $130 and allow ten days to re-stabilise, owner named, check date set; cap or restructure the secondary campaign whose spend share grew at $198 CPA; investigate Thursday only if it repeats. The stakeholder-facing headline reads that CPA rose because a bidding change was made deliberately, the change is being reversed, and volume should recover within two weeks.

## Output format

One document, layered so the stakeholder can stop after the first section and the operator can keep reading.

### Executive summary

Five lines or fewer, written for someone who will read nothing else:

- account status against target in plain language
- the single most important movement and its cause
- what is being done about it
- what to expect by the next digest
- any risk the stakeholder should know about

No jargon, no metric tables, no hedging language in this section.

### Key metrics

Table with, for each metric: current period, prior period, week-over-week delta in absolute and percent, month-over-month delta, same period last year where available, target, and status against target.

Mark any delta that is not meaningful rather than letting it read as a result.

### What changed and why

For each material movement:

- movement
- attributed cause
- evidence, including the change history entry where one exists
- confidence: confirmed / likely / unexplained
- whether it is expected to continue

### Anomalies

For each:

- what
- when
- scale
- action this week or watch only

### Next actions

Ordered list, each with owner, expected effect, and check date. Include carried-forward actions from the prior period with their status.

### Route to next

Name the sibling skills that own each open investigation:

- unexplained CPA or ROAS movement with no clear cause: account-triage-google-ads
- efficiency drift and budget leakage: wasted-spend-finder-google-ads
- query drift or new irrelevant terms: search-terms-hygiene-google-ads
- conversion volume moving independently of clicks: conversion-tracking-audit-google-ads
- single-day or sudden breaks: anomaly-detection-google-ads
- bid strategy or target changes not settling: bidding-strategy-sanity-check-google-ads
- spend share shifting between overlapping campaigns: account-structure-audit-google-ads
- Performance Max carrying the movement: pmax-performance-diagnosis-google-ads
- CTR decline or ad strength concerns: rsa-ad-copy-review-google-ads, then rsa-ad-copy-generator-google-ads
- impression share loss with competitive pressure suspected: competitor-benchmark-auction-insights-google-ads
- a budget increase is on the table: roas-forecast-scenarios-google-ads, then scaling-planner-google-ads

### Data gaps

List what was missing this period and which conclusion it prevented. Keep this section even when it is empty, so its absence is never ambiguous.

## Guardrails

- Never let the executive summary contradict the detail. The stakeholder and the operator must be reading the same account.
- Never report a performance delta on top of a tracking change without labelling it as a measurement artefact first.
- Percentage deltas on small bases mislead. Always show absolute numbers alongside them and mark small-base movements as not meaningful.
- Do not invent a cause. "Unexplained" is a legitimate and preferable answer when change history and mix analysis come up empty.
- Do not restate the same window with a shifted cut-off between periods. Comparability is the whole point of a recurring digest.
- Keep the period definition, the conversion lag treatment, and the metric set stable across digests. Announce any change to them in the digest itself.
- The digest routes problems, it does not solve them. Do not embed a full audit inside it.
- Do not describe deprecated formats as current: call-only ads were deprecated in February 2026, and Video Action and Discovery were replaced by Demand Gen.
- Flag campaigns exposed to the September 2026 AI Max auto-upgrade so the change does not arrive unannounced.
- When a threshold in this skill does not fit the account's volume or variance, say which one you adjusted and why.
