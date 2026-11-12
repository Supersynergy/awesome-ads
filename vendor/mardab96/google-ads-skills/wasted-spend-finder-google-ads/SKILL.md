---
name: wasted-spend-finder-google-ads
description: Audits Google Ads performance exports to find segments that spend inefficiently relative to the user's CPA, ROAS, or conversion-value goals. Use when the user asks to reduce wasted spend, diagnose rising CPA, clean an account before scaling, or review budget leakage across search terms, devices, locations, demographics, or time segments.
---

# Wasted Spend Finder — Google Ads

## Use this skill when

The user wants to identify inefficient Google Ads spend, reduce CPA, clean up budget leakage, or find segments that should be excluded, reduced, paused, or reviewed before scaling.

Common user requests:

- "Find wasted spend in this Google Ads account."
- "CPA is up. Where are we leaking budget?"
- "Review search terms, devices, geo, demographics, and dayparting."
- "What should we cut before increasing budget?"

## Required input

Ask for the narrowest set of exports needed for the requested scope.

Minimum useful data:

- Date range: ideally 30–90 days.
- Account-level target CPA, target ROAS, or business goal.
- Conversion action definition: which conversions count as primary.
- Conversion lag window, if known.

Recommended Google Ads exports:

- Search terms report.
- Campaign performance report.
- Ad group performance report.
- Device performance report.
- Hour-of-day or dayparting report.
- Geographic report.
- Demographic report.
- Conversion action report.
- Optional: assisted conversion, offline conversion, CRM quality, revenue, or LTV data.

Required columns where available:

- campaign
- ad group
- search term or segment name
- date
- cost
- impressions
- clicks
- conversions
- conversion value
- conversion action
- device
- location
- hour or day
- age / gender / household income, where applicable

## Before analysis

1. Confirm the performance goal: CPA, ROAS, conversion volume, revenue, qualified lead volume, or another KPI.
2. Confirm whether conversions are lead-based, purchase-based, offline-imported, or value-based.
3. Exclude data inside the likely conversion lag window unless the user confirms the data is mature.
4. Check whether Smart Bidding is active. If yes, avoid recommending manual bid adjustments as the default fix.
5. Check for tracking changes, landing page changes, offer changes, or budget changes during the selected window.

## Analysis workflow

1. Normalize all column names and currencies.
2. Aggregate performance by segment:
   - search term
   - keyword
   - campaign
   - ad group
   - device
   - location
   - hour of day
   - day of week
   - demographic segment
3. Calculate:
   - spend
   - clicks
   - impressions
   - CTR
   - CPC
   - conversions
   - conversion rate
   - CPA
   - ROAS, if value data exists
   - spend share
   - conversion share
   - expected conversions based on account or campaign baseline
4. Compare each segment against the appropriate benchmark:
   - account average
   - campaign average
   - ad group average
   - target CPA or target ROAS
   - same segment over prior period, if available
5. Classify inefficient spend:
   - clear waste
   - likely waste
   - needs review
   - strategic spend
   - insufficient data
6. Prioritize by estimated reducible or reallocatable spend, not guaranteed savings.
7. Recommend the least disruptive action first:
   - add negative keyword
   - exclude location
   - adjust schedule
   - shift budget
   - split or consolidate structure
   - review landing page or offer
   - pause only when confidence is high

## Decision rules

Use these as default heuristics, not hard laws.

A segment may be a safe waste candidate when:

- spend is at least 1.5–2.0x target CPA,
- conversions are zero or materially below expectation (expected conversions = clicks x the account's baseline CVR; 3+ expected with 0 actual is the signal, below 3 expected is `needs_data` [heuristic]),
- click volume is sufficient relative to expected CVR,
- conversion lag has passed,
- no assisted conversion or high-value downstream signal exists,
- the segment has no strategic role such as brand defense, competitor testing, or upper-funnel learning.

A segment should be marked "review" when:

- spend is meaningful but data volume is limited,
- intent is ambiguous,
- attribution may be delayed,
- conversions exist but CPA is weak,
- it may support pipeline quality, assisted conversions, or strategic coverage.

Do not recommend cutting when:

- the term or segment has profitable conversion value,
- it drives qualified offline conversions not visible in Google Ads,
- it is a deliberate competitor, brand, or research test,
- tracking is unreliable,
- data is inside the conversion lag window,
- the segment has too little spend or too few clicks to judge.

Reducible-spend formula (so the headline number is reproducible): for zero-conversion waste candidates, reducible = 100% of segment spend; for weak segments kept under review, reducible = spend minus (conversions x target CPA), floored at zero; report the two sums separately by confidence tier and never as one combined number [heuristic].

Multiple-comparisons caution: scanning device x daypart x geo produces hundreds of cells, so a few zero-conversion cells are expected by chance at any account volume; only cells that also clear the spend floor and persist across two consecutive windows enter the waste table [heuristic].

Note on floors: the least disruptive action here (add a negative keyword) may fire earlier under search-terms-hygiene's lower per-term floor (1x target CPA); the 1.5-2.0x floor above governs segment cuts, which are costlier to reverse.

Vertical adjustments: lead gen ranks on CRM-verified lead value where available and expects longer lag, so widen the review window before calling waste; ecommerce ranks on ROAS and margin band, and a low-ROAS segment with high assisted value is `review`, not waste.

## Practical example

A SaaS client spending $18K/month on Google Ads with target CPA $85. Claude analyzes 60-day data and surfaces three concentrated waste sources: $1,400/month spent on 23 search terms that triggered 142 clicks and zero conversions (broad match drift to informational queries); $890/month leaking to mobile traffic in two campaigns where mobile CPA is $215 vs $46 desktop; $620/month burned between 11pm and 5am with conversion rate 6x below daily average. Total estimated reducible spend: $2,910/month. Specific actions delivered: 23 negative keywords with match type recommendations, mobile bid adjustment of -45% on two campaigns, ad schedule modification removing the 11pm-5am slot. Confidence rating per cut: 19 marked safe, 4 marked review (assisted conversions present in attribution).

## Output format

Return a concise audit with these sections:

### Executive summary

- Total analyzed spend.
- Estimated reducible or reallocatable spend.
- Top 3–5 waste sources.
- Main risk or caveat.

### Ranked waste table

For each recommendation include:

- rank
- segment type
- segment name
- campaign / ad group
- spend
- clicks
- conversions
- CPA or ROAS
- benchmark
- estimated reducible spend
- confidence: safe / review / experimental
- recommended action
- reason
- risk note

### Action plan

Group recommendations by implementation type:

- negative keywords
- location exclusions or adjustments
- device recommendations
- dayparting recommendations
- demographic recommendations
- campaign or budget changes
- tracking or measurement checks

### Monitoring plan

Include:

- review after 7, 14, and 30 days,
- metrics to monitor,
- rollback conditions,
- expected trade-off between spend reduction and conversion volume.

### Route to next

Search-term-level cleanup -> search-terms-hygiene-google-ads. Zero conversions that might be a tracking artifact -> conversion-tracking-audit-google-ads. Structural fragmentation behind the waste -> account-structure-audit-google-ads.

### Data gaps

Name the exports or fields that were missing and which verdict each one would firm up.

## Guardrails

- Never present projected savings as guaranteed savings.
- Use "estimated reducible spend" or "estimated reallocatable spend."
- Explain assumptions behind any projection.
- Prefer conservative recommendations when conversion volume is low.
- If data quality is weak, prioritize measurement fixes over cuts.
- When a threshold in this skill does not fit the account's volume or vertical, say which one you adjusted and why.
