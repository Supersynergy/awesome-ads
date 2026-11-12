---
name: Meta Revenue Attribution
description: Connect Meta Ads spend to Shopify, GA4, HubSpot, Salesforce, BI, pipeline, closed revenue, MER, CAC, and downstream quality. Use for revenue-informed Meta reporting, attribution gap checks, ecommerce performance, lead quality, pipeline summaries, and blended efficiency analysis.
---

# Meta Revenue Attribution

Use this skill when the work connects Meta Ads performance to off-platform outcomes. The goal is to separate platform-attributed performance from ground-truth revenue, pipeline, and customer quality.

## Start Here

1. Read any customized Meta revenue-attribution instructions if available.
2. Discover connected Meta Ads, Shopify or ecommerce, GA4, HubSpot, Salesforce, warehouse, spreadsheet, and BI tools.
3. Confirm account, date range, timezone, currency, attribution setting, primary event, revenue source, and CRM stages.
4. Pull Meta spend, campaigns, ad sets, ads, conversion value, results, and tracking parameters.
5. Pull ecommerce orders, refunds, revenue, new versus returning customers, or CRM leads, demos, pipeline, and closed revenue where available.
6. Normalize campaign, source, medium, content, term, click ID, order, contact, company, and deal fields.
7. Separate lead volume, qualified pipeline, closed revenue, ecommerce revenue, blended revenue, and sales-cycle lag.
8. Check attribution gaps before drawing conclusions.
9. Summarize revenue impact and recommend media actions tied to downstream quality.

For formulas and interpretation rules, read `../meta-ads-command-center/references/meta-math.md`.

## Metrics to Report

Report only metrics supported by connected data:

- Meta Ads spend
- purchases, leads, demos, or primary results
- platform-reported conversion value and ROAS
- ecommerce revenue and order count
- refunds and cancellations when available
- new customer revenue
- MER
- CRM MQL, SQL, opportunity, open pipeline, closed-won revenue, and closed-lost outcomes
- CAC, cost per demo, cost per SQL, pipeline-to-spend ratio, or LTV:CAC
- stage conversion rates and sales-cycle lag

## Quality Checks

Before making recommendations, check:

- missing UTMs or click IDs
- inconsistent UTM casing or naming
- campaign renames that broke joins
- pixel and CAPI freshness
- duplicate orders, contacts, or deals
- refunds, cancellations, and subscription churn
- recent leads that have not had time to progress
- attribution setting changes during the reporting window

## Recommendation Rules

- Scale campaigns that produce profitable revenue or qualified pipeline, not just cheap platform conversions.
- Flag campaigns with strong in-platform ROAS but weak MER, refund-adjusted revenue, or CRM quality.
- Protect campaigns with weak short-window ROAS if cohort-matured revenue is strong.
- Do not claim revenue attribution when the join is incomplete or stale.
- Keep customer, order, and deal names out of broad reports unless the channel is approved.

## Output Format

```text
Meta revenue attribution: <account>, <date window>.
Spend: <amount>.
Platform: <Meta results and ROAS/CPA>.
Ground truth: <Shopify/GA4/CRM/BI revenue or pipeline>.
Efficiency: <MER, CAC, ROAS, or pipeline-to-spend>.
Best sources: <campaigns, ad sets, or creative themes>.
Weak sources: <campaigns, ad sets, or creative themes>.
Attribution gaps: <issues>.
Recommendation: <budget, creative, audience, landing page, or tracking action>.
```

