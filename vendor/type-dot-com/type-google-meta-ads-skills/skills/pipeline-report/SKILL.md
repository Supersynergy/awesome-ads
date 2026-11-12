---
name: Pipeline Report
description: Connect Google Ads spend to HubSpot CRM pipeline, demos, deal stages, closed revenue, and CAC with an AI summary. Use for weekly paid-search pipeline reporting, CRM quality checks, stage movement summaries, and revenue-informed Google Ads recommendations.
---

# Pipeline Report

Use this skill when the work connects Google Ads performance to CRM outcomes. The default CRM is HubSpot when connected, but the workflow can adapt to Salesforce or another approved CRM source.

## Start Here

1. Read any customized pipeline-report instructions if available.
2. Discover connected Google Ads, HubSpot or CRM, analytics, spreadsheet, and BI tools.
3. Confirm account, date range, timezone, currency, conversion actions, attribution model, CRM stages, and revenue rules.
4. Pull Google Ads spend, clicks, conversions, campaigns, ad groups, keywords, and tracking parameters.
5. Pull CRM leads, contacts, companies, deals, lifecycle stages, demos, pipeline value, close dates, and closed revenue where available.
6. Normalize source, medium, campaign, ad group, keyword, gclid, UTM, and CRM owner fields.
7. Separate leads, demos, qualified pipeline, open pipeline, closed-won revenue, and closed-lost outcomes.
8. Check for attribution gaps before drawing conclusions.
9. Summarize pipeline impact and recommend Ads actions tied to downstream quality.

For attribution handling, read `references/crm-attribution-guide.md`.

## Metrics to Report

Report only metrics supported by connected data:

- Google Ads spend
- leads or form fills
- demos or meetings booked
- MQL, SQL, opportunity, or qualified pipeline stages
- open pipeline value
- closed-won revenue
- closed-lost count or value
- CPL, cost per demo, cost per SQL, CAC, ROAS, or pipeline-to-spend ratio
- stage conversion rates
- sales-cycle lag

## Quality Checks

Before making recommendations, check:

- missing gclid or UTM values
- offline conversion import freshness
- duplicate contacts or deals
- demo source field consistency
- campaign renames that broke joins
- CRM stage definitions
- whether recent leads have had enough time to progress

## Recommendation Rules

- Scale campaigns that produce qualified pipeline, not just cheap leads.
- Flag campaigns with strong lead volume but poor stage progression.
- Protect high-CAC campaigns if they produce strategic closed revenue.
- Do not claim revenue attribution when the CRM link is incomplete or stale.
- Keep customer and deal names out of broad reports unless the channel is approved.

## Output Format

```text
Pipeline report: <account>, <date window>.
Spend: <amount>.
Funnel: <leads -> demos -> pipeline -> closed revenue>.
Best sources: <campaigns or themes>.
Weak sources: <campaigns or themes>.
Attribution gaps: <issues>.
Recommendation: <budget, keyword, landing page, or tracking action>.
```

