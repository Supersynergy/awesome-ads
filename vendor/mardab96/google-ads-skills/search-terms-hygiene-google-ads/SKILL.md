---
name: search-terms-hygiene-google-ads
description: Reviews Google Ads search terms reports to identify irrelevant queries, non-converting patterns, broad match drift, and negative keyword opportunities. Use for monthly query hygiene, CPA increases, broad or phrase match reviews, account audits, and onboarding handovers.
---

# Search Terms Hygiene — Google Ads

## Use this skill when

The user wants to clean Google Ads search terms, find negative keywords, reduce irrelevant traffic, or diagnose broad match drift.

Common user requests:

- "Review this search terms report."
- "Find negative keywords."
- "Clean irrelevant traffic."
- "Broad match is drifting. What should we negate?"
- "CPA is rising and I suspect bad queries."

## Required input

Recommended date range: 60–90 days.

Required exports:

- Search terms report across all relevant Search, Shopping, and PMax search term insights if available.
- Keyword report for Search campaigns.
- Campaign and ad group mapping.
- Conversion action settings.

Required columns where available:

- campaign
- ad group
- keyword
- keyword match type
- search term
- cost
- impressions
- clicks
- conversions
- conversion value
- date
- conversion action
- network
- final URL or landing page

Optional but useful:

- assisted conversions,
- CRM lead quality,
- new vs returning customer,
- product category,
- profit margin,
- brand terms list,
- competitor terms policy.

## Before analysis

1. Confirm the campaign goal:
   - lead generation,
   - ecommerce revenue,
   - qualified pipeline,
   - new customer acquisition,
   - brand protection.
2. Confirm whether competitor terms should be excluded, reviewed, or intentionally kept.
3. Confirm whether informational queries can have value or should be blocked.
4. Exclude data inside the conversion lag window unless confirmed mature.
5. Identify brand terms, product names, competitor names, and high-value categories.

## Analysis workflow

1. Normalize search terms:
   - lowercase,
   - trim whitespace,
   - remove punctuation where useful,
   - preserve original query for final output.
2. Group terms by:
   - intent,
   - campaign,
   - ad group,
   - keyword,
   - match type,
   - landing page,
   - product category.
3. Identify non-converting spend:
   - high-spend zero-conversion terms,
   - repeated low-spend terms sharing the same bad intent,
   - queries with poor CPA or ROAS,
   - queries misaligned with landing page intent.
4. Identify broad match drift:
   - search terms far from keyword intent,
   - irrelevant verticals,
   - informational queries in commercial campaigns,
   - B2B queries in B2C campaigns or the reverse,
   - job, free, support, PDF, template, definition, DIY, or research intent when not valuable.
5. Identify false positives:
   - assisted conversions,
   - low-volume but high-value terms,
   - brand protection terms,
   - competitor strategy terms,
   - long sales cycle queries.
6. Recommend negative keyword placement:
   - account-level shared list,
   - campaign-level,
   - ad-group-level.
7. Recommend negative match type:
   - exact,
   - phrase,
   - broad, only when safe.
8. Flag keywords that require match type tightening or structural changes rather than only negatives.

## Decision rules: negative keywords

Evidence floors before negating [heuristic]: a single term needs 10+ clicks or spend of 1x target CPA with zero conversions to be negated on performance (deliberately lower than wasted-spend-finder's 1.5-2.0x segment-cut floor: negating one term is cheap to reverse, cutting a segment is not); relevance-only negations (the term is unambiguously not the business) have no floor. A pattern group (terms sharing a token) can be negated together at 20+ combined clicks or 2x target CPA with zero conversions - group by 1-3 word n-grams before judging term by term. Long sales cycles extend judgment to the cycle window.

Vertical adjustments: lead gen treats zero-conversion terms with CRM-qualified history as converters; ecommerce weighs revenue and assisted value, not conversion count alone.

Use negative exact when:

- the exact query is irrelevant,
- close variants may still be valuable,
- the pattern is not broad enough to block safely.

Use negative phrase when:

- a repeated phrase signals bad intent,
- the phrase appears across many irrelevant queries,
- blocking variants is unlikely to remove valuable traffic.

Use negative broad cautiously when:

- the concept is universally irrelevant,
- the term has no likely valuable variants,
- the user's business context confirms exclusion is safe.

Use account-level negatives when:

- the concept is irrelevant across the entire account,
- no campaign should ever target that intent.

Use campaign-level negatives when:

- the intent is bad for one campaign but may be valuable elsewhere.

Use ad-group-level negatives when:

- the goal is query routing between ad groups,
- the term is relevant to the account but mismatched to that ad group.

## Practical example

E-commerce client running 6 Search campaigns and 1 Shopping campaign, $14K/month spend. Claude analyzes 4,200 unique search terms over 60 days. Surfaces 187 queries representing $2,100 spend and zero conversions, sharing four clear patterns: 64 informational queries ("how to clean", "what is"), 48 competitor brand queries (no convert in this account's setup), 41 wrong-vertical matches (B2B queries hitting B2C campaigns), 34 outdated product queries for discontinued SKUs. Output delivered: account-level shared list with 96 universal negatives, campaign-level lists with 67 contextual negatives, ad-group-level lists with 24 routing negatives. Plus 12 broad match keywords flagged for tightening to phrase or exact based on drift severity. Counter-flagged: 8 queries that initially looked wasteful but show assisted conversions in attribution data — kept under review.

## Output format

### Executive summary

- Total search term spend analyzed.
- Estimated reducible or reallocatable spend.
- Number of negative keyword candidates.
- Main query drift patterns.
- Key caveats.

### Negative keyword plan

Provide a paste-ready table with:

- negative keyword
- match type
- placement level
- campaign / ad group / shared list
- source queries
- spend
- clicks
- conversions
- reason
- confidence
- risk note

### Pattern groups

Group by intent type, for example:

- informational intent
- competitor terms
- wrong vertical
- employment / jobs
- free / template / DIY
- support / login / troubleshooting
- irrelevant product category
- outdated product or SKU

### Broad match drift report

For each problematic keyword include:

- keyword
- match type
- campaign / ad group
- example bad queries
- spend
- conversions
- recommended fix

### Route to next

Wasted spend beyond search terms -> wasted-spend-finder-google-ads. Broad match drift tied to bidding -> bidding-strategy-sanity-check-google-ads. Lead quality doubts on converting terms -> offline-conversion-import-audit-google-ads.

### Data gaps

Name the exports or fields that were missing and which verdict each one would firm up.

## Guardrails

- Do not recommend negatives that may block profitable variants.
- Do not auto-negate competitor queries without business confirmation.
- Do not assume all zero-conversion queries are waste.
- Do not ignore assisted conversions or offline quality.
- Do not present search terms report as complete visibility into all queries.
- When a threshold in this skill does not fit the account's volume or vertical, say which one you adjusted and why.
