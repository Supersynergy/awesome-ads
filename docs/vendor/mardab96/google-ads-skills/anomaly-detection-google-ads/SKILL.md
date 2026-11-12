---
name: anomaly-detection-google-ads
description: Analyzes Google Ads performance data to detect statistically unusual changes in spend, impressions, clicks, CPC, CTR, CVR, CPA, ROAS, conversion volume, and conversion value. Use when the user asks why performance changed, whether a spike or drop is normal, or what likely caused an outlier.
---

# Anomaly Detection — Google Ads Performance

## Use this skill when

The user wants to detect or explain unusual performance changes.

Common user requests:

- "Why did CPA spike yesterday?"
- "Find anomalies in this account."
- "Did performance drop significantly?"
- "What caused this ROAS decline?"
- "Compare last 7 days vs normal baseline."

## Required input

Recommended data:

- Daily performance for at least 90 days.
- Campaign-level daily data.
- Ad group or asset group data if root cause is needed.
- Search terms or search insights if query mix may be involved.
- Change history, if available.
- Budget and bid strategy changes.
- Conversion tracking changes.

Required columns:

- date
- campaign
- campaign type
- cost
- impressions
- clicks
- conversions
- conversion value
- CTR
- CPC
- CVR
- CPA
- ROAS
- impression share metrics, where available
- budget
- bid strategy

Optional but useful:

- device
- location
- hour
- network
- search terms
- conversion action
- change history
- landing page
- asset performance

## Before analysis

1. Confirm the anomaly window:
   - yesterday,
   - last 3 days,
   - last 7 days,
   - custom period.
2. Confirm the baseline:
   - previous 30 days,
   - previous 90 days,
   - same weekday baseline,
   - same period last year if seasonality matters.
3. Exclude or label days affected by tracking outages, holidays, major launches, stockouts, or known changes.
4. Avoid overinterpreting low-volume metrics.

## Analysis workflow

1. Build daily time series for key metrics:
   - spend,
   - impressions,
   - clicks,
   - CTR,
   - CPC,
   - conversions,
   - CVR,
   - CPA,
   - conversion value,
   - ROAS.
2. Calculate baselines:
   - 30-day mean,
   - 30-day standard deviation,
   - 90-day mean,
   - 90-day standard deviation,
   - same weekday average where useful.
3. Calculate z-scores:
   - z = (observed value - baseline mean) / baseline standard deviation.
4. Flag anomaly severity:
   - within normal variance: |z| < 2 (verdict: monitor),
   - investigate: |z| 2-3,
   - significant: |z| > 3.
   One ladder, the same one Decision rules and `../scripts/anomaly_scan.py` use.
5. Compare anomaly period to baseline:
   - absolute change,
   - percent change,
   - contribution to account-level change.
6. Decompose root cause:
   - volume issue: impressions, clicks, budget, impression share,
   - traffic quality issue: CTR, query mix, audience, device, geo,
   - auction issue: CPC, impression share lost to rank,
   - conversion issue: CVR, landing page, tracking, offer,
   - value issue: AOV, conversion value, product mix,
   - measurement issue: conversion action, tag, consent, import delay.
7. Generate root-cause hypotheses ranked by evidence strength.

## Root-cause hypothesis patterns

Impressions down:

- budget reduced,
- campaign limited by budget,
- rank declined,
- targeting narrowed,
- disapprovals,
- seasonality,
- competitor pressure.

Clicks down while impressions stable:

- CTR decline,
- ad relevance issue,
- worse asset performance,
- query mix change,
- SERP competition.

CPC up:

- auction pressure,
- Quality Score or rank issue,
- bid strategy target change,
- budget increase into less efficient auctions,
- device or geo mix shift.

CVR down:

- landing page issue,
- tracking issue,
- query quality decline,
- offer or pricing change,
- stockout,
- site speed issue,
- audience mix shift.

CPA up:

- CPC up,
- CVR down,
- conversion lag,
- budget scaled into lower-efficiency traffic,
- tracking or conversion mix issue.

ROAS down:

- CVR down,
- AOV down,
- product mix shift,
- promo ended,
- value tracking issue,
- more low-intent traffic.

## Decision rules

Every threshold below is a starting heuristic, not a Google rule. When one does not fit the account's volume or vertical, say which one you adjusted and why.

Volume guards before any z-score is trusted:

- Ratio metrics (CPA, CVR) on days below ~5 conversions are unreadable at daily grain; z-score cost and clicks daily, and judge conversion metrics at the weekly grain instead [heuristic].
- A z-score needs the baseline too: fewer than 7 usable baseline days (or 3 same-weekday points, matching the script) means no z-score, only a descriptive delta labeled as such.
- Same-weekday baseline is the default, not an option; a Monday is compared with Mondays.

Severity to action:

- |z| under 2 at adequate volume -> within normal variance; verdict is monitor, and the output says so instead of inventing a driver.
- |z| 2-3 -> investigate; split by campaign, device, geo and check the change log.
- |z| over 3 -> significant; attribution starts immediately, tracking changes first.
- A logged tracking, site, or upgrade event inside the window makes the anomaly significant regardless of z; platform statistics never outrank a known change. Campaigns exposed to the September 2026 AI Max auto-upgrade (DSA, auto-created assets, campaign-level broad match): the upgrade event itself is a candidate cause.

Worked micro-example: baseline Tuesdays spend $500 with SD $13; anomaly Tuesday $570 gives z = (570-500)/13 = +5.4 -> significant. The same day's 6 conversions vs baseline mean 9.7 with SD 0.6 would give z = -6.2, but 6 conversions is below the daily floor, so CPA is judged on the week, not the day.

For long daily exports, run `../scripts/anomaly_scan.py` to compute baselines, z-scores and severity tiers per campaign deterministically (it covers cost, clicks, conversions and CPA; CVR stays a manual weekly-grain check).

## Practical example

E-commerce client, $28K/month Google Ads spend. User reports "CPA spiked yesterday" without clear cause. Claude builds 90-day baselines and runs z-score analysis on yesterday's metrics. Findings: account-level CPA jumped from $42 to $67 (z-score 2.7, investigate tier), spend stable at $1,050, conversions dropped 38% day-over-day. Decomposition by segment: 60% of CPA increase from one campaign where mobile traffic share rose from 41% to 67% after a competitor disappeared from desktop auctions (mobile CVR is 4x lower in this account); 25% from broad match drift on three keywords that started matching competitor brand queries (CTR up, CVR down); 15% from new auction pressure during 9-11am window (CPC up 18%). Hypotheses ranked by evidence strength. Recommended next diagnostics: (1) check competitor activity in Auction Insights, (2) review search terms for the 3 broad keywords, (3) review mobile bid adjustment. Caveat flagged: data is within the 24-hour conversion lag window for ~22% of typical conversions; recheck in 48h before acting.

## Output format

### Executive summary

- Main anomaly detected.
- Severity.
- Business impact.
- Most likely root cause.
- Recommended next step.

### Anomaly table

For each anomaly include:

- metric
- observed value
- baseline value
- absolute change
- percent change
- z-score
- severity
- affected campaign or segment
- contribution to total change

### Root-cause hypotheses

For each hypothesis include:

- hypothesis
- evidence supporting it
- evidence against it
- confidence
- next diagnostic step
- recommended action

### Segment breakdown

Break down by:

- campaign,
- campaign type,
- device,
- location,
- network,
- conversion action,
- search term or search category where available.

### Route to next

Confirmed CPA anomaly -> cpa-spike-diagnosis-google-ads for decomposition. Tracking-shaped anomaly -> conversion-tracking-audit-google-ads. Auction-shaped anomaly -> competitor-benchmark-auction-insights-google-ads.

### Data gaps

Name the exports or fields that were missing and which verdict each one would firm up.

## Guardrails

- Do not treat z-score as proof of causality.
- Do not overinterpret anomalies on tiny sample sizes.
- Use same-weekday baselines when weekday patterns are strong.
- Mark conversion-lag risk clearly.
- Separate statistical anomaly from business significance.
