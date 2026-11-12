---
name: Search Term Intelligence
description: Analyze Google Ads search terms for waste detection, positive keyword mining, theme clustering, and draft negative keyword changes. Use for weekly search query reviews, irrelevant spend, new keyword opportunities, auto-negative proposals, and query intent summaries.
---

# Search Term Intelligence

Use this skill when the work is primarily search query analysis. The goal is to reduce waste, find useful demand, and turn raw search terms into safe keyword and negative keyword recommendations.

## Start Here

1. Read any customized search-term instructions if available.
2. Discover connected Google Ads, analytics, CRM, and spreadsheet tools.
3. Confirm account, campaign scope, match types, timezone, currency, date range, and conversion actions.
4. Pull search term performance for the last 7 days, 30 days, and 90 days when available.
5. Normalize terms by case, pluralization, obvious punctuation, and close variants.
6. Cluster terms by intent theme.
7. Classify each cluster as waste, positive opportunity, ambiguous, protected brand, competitor, or informational.
8. Draft negatives and positive keyword candidates separately.
9. Apply negatives only when explicit authority exists and the match type is safe for the evidence.

## Waste Detection

Flag waste when search terms show:

- high spend with no qualified conversions
- intent that cannot buy or convert
- job, career, internship, login, support, refund, cancellation, free, template, or definition intent
- irrelevant industries, geographies, products, or audiences
- repeated poor downstream quality in CRM or analytics

Do not mark a term as waste solely because it has no conversion in a short window. Consider spend, clicks, query specificity, conversion lag, and CRM quality.

## Positive Mining

Find positive keyword candidates when terms show:

- repeated conversions or strong qualified pipeline
- high CTR and landing-page engagement
- valuable long-tail language not already covered by exact or phrase keywords
- clear product, problem, competitor, or segment intent
- low-cost discovery themes worth isolating in a new ad group

For each candidate, recommend the campaign or ad group, match type, landing page, and expected value.

## Negative Keyword Drafting

For every proposed negative, include:

- term or theme
- suggested match type
- campaign or ad group scope
- spend, clicks, conversions, and CPL or CPA
- reason
- risk of blocking useful traffic

Prefer exact negatives for narrow evidence. Use phrase or broad negatives only when the excluded concept is clearly invalid across the scoped campaign.

## Output Format

```text
Search term intelligence: <account>, <date window>.
Waste: <top terms or clusters with evidence>.
Positive mining: <keyword candidates>.
Draft negatives: <count and highest-impact examples>.
Ambiguous: <terms needing human review>.
Applied: <changes applied or none>.
```

If the user asks for a bulk upload, produce a reviewable table rather than applying changes silently.

