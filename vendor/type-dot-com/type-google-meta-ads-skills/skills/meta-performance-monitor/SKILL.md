---
name: Meta Performance Monitor
description: Monitor Meta Ads daily or weekly performance across spend, pacing, ROAS or CPA, CPM, link CTR, frequency, delivery status, anomalies, and account health. Use for Facebook or Instagram Ads sweeps, spend checks, conversion drops, CPA spikes, ROAS declines, and delivery alerts.
---

# Meta Performance Monitor

Use this skill for recurring Meta Ads performance checks. The goal is to catch material changes early and route root causes to the right follow-up skill.

## Start Here

1. Read any customized Meta performance-monitor instructions if available.
2. Discover connected Meta Ads, Events Manager, analytics, ecommerce, CRM, spreadsheet, and notification tools.
3. Confirm account, timezone, currency, date range, attribution setting, and primary event.
4. Pull yesterday, last 7 days, previous 7 days, month to date, and comparable prior period when available.
5. Compare spend, results, CPA, purchase value, ROAS, CPM, link CTR, CPC, reach, frequency, delivery status, and budget pacing.
6. Segment by campaign, ad set, and top-spend ads.
7. Check whether a tracking, landing page, or revenue-source issue explains performance.
8. Classify findings by severity.
9. Report material alerts, likely causes, and recommended next steps.

For formulas and interpretation rules, read `../meta-ads-command-center/references/meta-math.md`.

## What to Monitor

Performance:

- spend and budget consumed
- purchases, leads, demos, or primary results
- CPA, ROAS, conversion value, and MER when available
- impressions, reach, CPM, link clicks, link CTR, CPC, and frequency
- landing page views and landing page CVR when available

Delivery:

- active, paused, rejected, limited, learning, or learning-limited states
- ad sets with too little event volume
- campaign or ad set budget concentration
- ads that stopped receiving delivery
- recent edits that may explain volatility

Pacing:

- month-to-date spend versus expected spend
- projected month-end spend
- overspending or underspending campaigns
- budget-limited campaigns with strong economics
- spending campaigns with weak downstream quality

## Severity

- `P0` - Tracking outage, spend runaway, account disabled, major rejection, or same-day budget risk.
- `P1` - Material CPA spike, ROAS drop, CPM spike, conversion drop, or delivery collapse.
- `P2` - Worth reviewing in the weekly optimization cycle.
- `P3` - Normal variance or too little data.

## Diagnosis Hints

- CPM up and frequency up often points to creative fatigue or audience saturation.
- CTR down before CPA rises often points to weak creative or message fatigue.
- CPA up with stable CTR can point to landing page, checkout, form, or attribution issues.
- ROAS down in Meta but MER stable can point to attribution mix, not necessarily bad media buying.
- Learning Limited often points to too little event volume per ad set.

## Output Format

```text
Meta performance monitor: <account>, <date window>.
P0/P1: <top alerts or none>.
Pacing: <overspend/underspend findings>.
Delivery: <learning, rejection, or status issues>.
Likely cause: <creative, audience, tracking, landing page, attribution, or normal variance>.
Recommended next step: <specific follow-up or none>.
Blocked: <missing data or none>.
```

If the sweep finds no meaningful movement, keep the update to one sentence or stay silent if the runner allows it.

