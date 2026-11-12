---
name: product-feed-catalog-qa-paid-ads
description: Reviews product feed, catalog, and merchant diagnostics for paid ads issues affecting Shopping, Performance Max, Advantage+ catalog, dynamic product ads, and ecommerce paid traffic. Use when product ads underperform or feed quality is suspected.
---

# Product Feed and Catalog QA - Paid Ads

When you need the shared quality bar, use `../references/paid-ads-output-standard.md` and `../references/paid-ads-principles.md` if they are available.

## Use this skill when

The user runs ecommerce paid ads and suspects feed or catalog issues.

## Required input

- Google Merchant Center diagnostics.
- Meta catalog diagnostics.
- Product feed export.
- Disapproved or limited products.
- Product titles, descriptions, images, prices, availability.
- Product performance by SKU or item group.

## Analysis workflow

1. Identify feed errors and warnings.
2. Map affected products to spend and revenue.
3. Check title, image, price, availability, category, and variant issues.
4. Identify products that should be excluded or fixed before scaling.
5. Prioritize fixes by revenue and spend impact.

## Decision rules

Every threshold below is a starting heuristic, not a platform rule. Recalibrate against the account's own history, and say which threshold you adjusted and why.

- Priority by money, not by error count: rank issues by the revenue share of affected SKUs. Disapproved or missing SKUs carrying 5%+ of catalog revenue are `do_now` [heuristic]; long-tail disapprovals below 1% are batch cleanup.
- A feed warning that suppresses impressions on a top seller outranks an error on a product that never sold.
- Title fixes follow the query, not the brand style guide: leading tokens should match how buyers search (product type + attribute before brand for non-brand queries) [heuristic].
- Value integrity: price or availability mismatches between feed and page are `do_now` at any revenue share - they burn both policy standing and conversion.
- Fix-at-scale rule: 10+ SKUs sharing one defect get a supplemental feed or feed rule recommendation, not per-SKU edits.

## Output format

Owner-decision labels in output tables use the shared enum from `../references/paid-ads-output-standard.md`: `do_now / test / investigate / monitor / ignore / approval_needed`. Evidence labels use `export / screenshot / url / notes / hypothesis / needs_data`.

| Product or issue | Platform | Evidence | Impact | Fix | Priority |
|---|---|---|---|---|---|

### Missing data

Name the exact exports or fields that would change the diagnosis, and which finding each one would firm up.

### Approval gates

List what needs a human yes before anything moves: budget changes, pauses, negative lists, tracking edits, page changes. Nothing in this output is an instruction to execute.

## Practical example

Illustrative made-up account, not a real advertiser.

Input: feed of 2,000 SKUs. 14 disapproved SKUs carry 7% of catalog revenue. 120 long-tail SKUs have warnings and carry 0.6% of revenue. 3 SKUs list $49 in the feed and $54 on the page. 46 SKUs lack the size attribute.

| Issue | Revenue share | Priority | Fix |
|---|---|---|---|
| 14 disapproved SKUs | 7% | do_now | fix policy cause first |
| Price mismatch, 3 SKUs | any | do_now | align feed to page price |
| 46 SKUs missing size | not ranked | supplemental feed rule | one rule, not 46 edits |
| 120 long-tail warnings | 0.6% | batch cleanup | monitor |

Money order beats error count. 120 warnings are the biggest count and the lowest priority.

## Guardrails

- Do not recommend feed edits without checking business and inventory impact.
- Do not treat all diagnostics as equal.
- Do not promise approval outcomes.
