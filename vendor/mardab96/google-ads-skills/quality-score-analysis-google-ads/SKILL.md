---
name: quality-score-analysis-google-ads
description: Breaks Quality Score into its three diagnostic components across keywords, identifies which weaknesses actually drag account performance, and prioritises fixes by revenue impact rather than by lowest score. Use when the user asks about Quality Score, low ad relevance, poor landing page experience, rising CPCs, or which keywords deserve creative and landing page work first.
---

# Quality Score Analysis — Google Ads

## Use this skill when

The user wants to understand why Quality Score is low, which component is responsible, and what to fix first. The point of this skill is prioritisation: a score of 3 on a keyword that spends nothing matters far less than a score of 6 on a keyword carrying a third of the budget.

Common user requests:

- "Our Quality Scores are terrible. Where do we start?"
- "Why are our CPCs so high compared to competitors?"
- "Which keywords have bad ad relevance?"
- "Is our landing page hurting our ads?"
- "Give me a Quality Score improvement plan ranked by impact."

Do not use this skill to explain Quality Score as a concept without account data. Without keyword-level cost, the output is trivia rather than a plan.

## Required input

Ask only for what the requested scope needs.

Minimum useful data:

- Keyword performance export including the three Quality Score component columns.
- Date range: 30 to 90 days.
- Stated goal: target CPA, target ROAS, or revenue per conversion.
- Which campaigns are Search. Quality Score components are reported for Search keywords, so Performance Max, Demand Gen, and Display campaigns are out of scope for this skill.

Recommended Google Ads exports:

- Keyword performance report with Quality Score, expected CTR, ad relevance, and landing page experience columns.
- Ad group performance report.
- Search terms report, to test whether the query mix matches the keyword.
- Ad or asset level report, to judge whether creative addresses the keyword theme.
- Landing page report, where available.

Required columns where available:

- campaign
- ad group
- keyword
- match type
- Quality Score
- expected CTR component
- ad relevance component
- landing page experience component
- cost
- impressions
- clicks
- CTR
- average CPC
- conversions
- conversion value
- final URL

If the Google Ads MCP server or API access is available, pull the keyword view with its quality-related fields directly rather than requesting CSV exports.

## Before analysis

1. Confirm the goal. Quality Score is a diagnostic, not a KPI. Improving a score that does not move CPA or revenue is wasted work.
2. Confirm that the component columns are populated. Keywords with too little impression volume commonly report no component values, and those keywords cannot be diagnosed here.
3. Exclude data inside the conversion lag window before drawing any revenue conclusion.
4. Note that the reported components describe historical performance relative to other advertisers on the same terms. They lag behind changes and will not update the moment an ad or page is edited.
5. Check the account's 2026 upgrade exposure. Campaigns using Dynamic Search Ads, automatically created assets, or campaign-level broad match are subject to auto-upgrade to AI Max from September 2026. Keyword-level component work in those campaigns may be partly overtaken by that change, so flag it before recommending a long creative programme.
6. Check whether the ads in scope are responsive search ads. Call-only ads were deprecated in February 2026 and should not appear in any recommendation.

## Analysis workflow

### Step 1: Weight the account by money, not by score

1. Rank keywords by cost share over the window.
2. Compute the cumulative share of cost held by the top keywords. In most accounts a small minority of keywords carries the majority of spend.
3. Everything below the cost threshold you choose is a secondary tier. Say what threshold you used.

### Step 2: Decompose the score

For each keyword with populated components, record which of the three is rated below average:

- expected CTR below average points at the keyword and ad pairing, or at a keyword whose intent the ad never names.
- ad relevance below average points at creative that does not reflect the query theme.
- landing page experience below average points at the destination, not the ad.

Group keywords by their failing component. The grouping, not the individual score, is what produces an actionable plan, because one landing page fix can lift dozens of keywords at once.

### Step 3: Cluster the fixes

1. Cluster landing page failures by final URL. Count cost per URL.
2. Cluster ad relevance failures by ad group. Count cost per ad group.
3. Cluster expected CTR failures by keyword theme and match type.

### Step 4: Estimate impact

For each cluster, state:

- cost currently flowing through it,
- current CTR, CPC, conversion rate, and CPA against the ad group or account benchmark,
- what a realistic improvement would be worth, framed as a range and clearly labelled an estimate.

Never claim a specific CPC reduction from a specific score increase. The relationship is directional, not arithmetic.

### Step 5: Rank and sequence

Rank clusters by cost exposure multiplied by confidence that the fix will work. A cheap, confident landing page fix on a high-spend URL outranks a speculative rewrite of a low-spend ad group.

## Decision rules

Use these as default heuristics, not hard laws. Adjust every threshold to the account's volume and vertical.

Treat a cluster as **high priority** when:

- it carries a meaningful share of account cost, roughly 5% or more as a starting point,
- at least one component is rated below average,
- its CPA or ROAS is materially worse than the campaign benchmark,
- the failing component is one you can actually change.

Treat a cluster as **secondary** when:

- the component is rated average rather than below average,
- cost exposure is small,
- performance already meets the target despite the score.

Treat as **do not act** when:

- component values are blank due to low impression volume,
- the keyword is brand defence, where a weak component rarely matters against a strong conversion rate,
- the score is low but CPA is comfortably at target. A profitable keyword with a score of 4 does not need rescuing.
- the campaign is due for an upgrade that will change how its serving is decided.

A low score is a symptom. Do not pause a keyword because of its score alone. Pause it because it loses money.

Blank-components path: when component columns are empty on most of the spend tier (common on smaller accounts), do not stop at "insufficient data" for the whole account. Aggregate to the ad group level, judge the components that do exist, and use CTR-vs-expected and landing-page checks as proxies on the blank rows, labeled as proxies.

## Practical example

An e-commerce account spends roughly $42K a month across Search. The client asks Claude to fix the 118 keywords sitting at Quality Score 4 or below.

Claude reorders the question around money. Those 118 keywords carry $3,100 of the monthly spend. Meanwhile 14 keywords rated 5 and 6 carry $19,400, and every one of them is marked below average on landing page experience.

Component clustering shows the real structure. Eleven of those 14 keywords point at the same category page. That page carries $14,900 of monthly spend, converts at 1.1% against a site average of 2.4%, and its average CPC of $3.85 sits well above the campaign mean of $2.60. Two ad groups account for the ad relevance failures: both run a single responsive search ad written for a broader product category than the keywords in the group, worth $2,900 combined. The expected CTR failures cluster almost entirely in the low-spend tail.

The delivered plan inverts the client's request. Priority one is the category page, one fix touching $14,900 of spend. Priority two is splitting the two ad groups by theme and writing headlines that name the specific product, touching $2,900. Priority three, explicitly deprioritised, is the 118 low-score keywords, of which 34 are recommended for pausing purely on CPA grounds and the rest left alone. Estimated impact is expressed as a range on CPC and conversion rate, not as a promised score movement.

## Output format

Return a prioritised improvement plan, not a keyword score dump.

### Executive summary

- Total Search cost analysed and the share of it sitting on below-average components.
- The single biggest component weakness by cost exposure.
- The top three fix clusters.
- Main caveat or data gap.

### Component breakdown

For each of the three components:

- number of keywords rated below average
- cost carried by those keywords
- share of total analysed cost
- the dominant pattern behind the weakness

### Ranked fix clusters

For each cluster include:

- rank
- failing component
- cluster type: landing page / ad group creative / keyword and match type
- affected campaigns and ad groups
- cost exposure
- current CTR, CPC, conversion rate, CPA or ROAS
- benchmark
- recommended action
- estimated impact, stated as a range
- confidence: high / medium / speculative
- effort: low / medium / high

### Route to next

- Landing page experience clusters route to a landing page or offer review, and to `conversion-tracking-audit-google-ads` if the page change risks breaking measurement.
- Ad relevance clusters route to `rsa-ad-copy-review-google-ads`, then `rsa-ad-copy-generator-google-ads` for replacements.
- Expected CTR clusters driven by query mismatch route to `search-terms-hygiene-google-ads`.
- Ad groups too broad to fix with copy alone route to `account-structure-audit-google-ads`.
- Keywords that are unprofitable regardless of score route to `wasted-spend-finder-google-ads`.
- If CPCs rose across the board rather than on specific clusters, route to `cpa-spike-diagnosis-google-ads` instead, since the cause is unlikely to be keyword quality.

### Monitoring plan

- Re-check components after 21 to 30 days, since they update on accumulated data rather than immediately.
- Track CPC, CTR, conversion rate, and CPA per cluster, not the score alone.
- State rollback conditions for each creative or page change.

### Data gaps

Name the exports or fields that were missing and which verdict each one would firm up.

## Guardrails

- Never present Quality Score as a KPI or a goal in itself. It is a diagnostic input.
- Never promise a specific CPC reduction from a specific score improvement. State direction and a range, and label it an estimate.
- Do not diagnose keywords whose component values are blank. Say the data is missing instead.
- Do not describe the score components as a published formula. Describe the observable behaviour they point at.
- Never recommend pausing a profitable keyword because of a low score.
- Quality Score components are a Search construct. Do not apply this skill to Performance Max or Demand Gen inventory.
- Flag pending platform upgrades before committing the user to a long creative programme an upgrade may overtake.
- When a threshold in this skill does not fit the account, say which one you adjusted and why.
