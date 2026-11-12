---
name: microsoft-campaign-setup-and-optimization
description: Build, QA, and optimize Microsoft Advertising campaigns across Search, Performance Max, Shopping, Audience, conversion tracking, UET, asset groups, search themes, product feeds, budgets, imports, brand controls, learning, and reporting. Use when the user asks how to improve Microsoft Ads or Bing campaigns beyond UET or PMax-only setup.
---

# Microsoft campaign setup and optimization

Help an operator build and improve Microsoft Advertising campaigns across Search, Performance Max, Shopping, Audience, and feed-led retail. Microsoft Ads often starts from a Google import, but the account still needs Microsoft-specific tracking, feed, budget, search, and placement checks. This skill supports campaign operators. It does not replace them or approve live account changes.

For UET, Conversions API, offline conversions, and consent, use `microsoft-uet-and-conversions-api`. For Performance Max and Shopping object detail, use `microsoft-performance-max-and-shopping`.

## When to use this skill

- "Set up Microsoft Ads for this account."
- "Import Google campaigns into Microsoft and QA them."
- "My Microsoft campaign is not spending."
- "Should I use Search, Performance Max, Shopping, or Audience?"
- "How do I optimize Microsoft PMax or Shopping after launch?"
- "What should I check in UET before scaling?"
- "How do I use search themes, audience signals, product feeds, and brand controls?"
- "How do I read Microsoft results next to Google?"

Boundaries with sibling skills:
- UET, conversion goals, Conversions API, and offline conversions: `microsoft-uet-and-conversions-api`.
- PMax and Shopping asset groups, feeds, listing groups, and bid strategy: `microsoft-performance-max-and-shopping`.
- Google Ads equivalent: `google-ads-performance-max`, `google-ads-shopping-and-feed`, and search skills.
- Cross-platform reconciliation: `cross-platform-conversion-reconciliation`.
- Search Ads 360 engine management: `sa360-account-structure-and-engines`.

## Quick reference

| Goal | Campaign path | Operator priorities |
| --- | --- | --- |
| Capture existing demand | Search | Keywords, match types, negatives, RSA assets, UET conversions |
| Retail catalog scale | Performance Max or Shopping | Merchant Center feed, product scope, asset groups, ROAS target |
| Product-group bid control | Shopping | Product partitions, priorities, enhanced CPC or manual control |
| Broad automated conversion growth | Performance Max | Conversion goal, asset groups, search themes, audience signals, final URL expansion |
| Native/display reach | Audience campaigns | Content targeting, audience segments, creative, placement quality |
| Google migration | Import then QA | Budgets, goals, feed mapping, tracking, negatives, brand controls |

## Core process

1. Confirm tracking first. UET, conversion goals, revenue values, consent handling, and offline conversion imports must be correct before conversion bidding. If UET is not healthy, stop and use `microsoft-uet-and-conversions-api`.
2. Choose campaign type by control need. Search gives keyword control. Shopping gives product-group control. PMax gives automation across Microsoft inventory. Audience gives native and display reach. Do not use PMax when the client needs keyword-level or product-group bid control.
3. QA any Google import. Imports are useful, not trustworthy by default. Re-check budgets, bid targets, conversion goals, Merchant Center store, product feed, URL tracking, locations, ad schedules, negatives, and policy status before unpausing.
4. Build the feed foundation for retail. Microsoft Merchant Center store, catalog freshness, product IDs, availability, price, image, GTIN or MPN where required, and landing URL quality decide Shopping and retail PMax scale.
5. Build search with explicit intent. Use exact and phrase for proven terms, broad only with conversion tracking and negatives in place, and keep brand separate when budget and reporting require it.
6. Build PMax with strong inputs. Asset groups, search themes, audience signals, product listing groups, final URL expansion, page feeds, brand lists, and conversion value decide quality. Microsoft AI controls much of the delivery.
7. Set budgets and targets sanely. A target CPA or ROAS that is too tight at launch blocks delivery. Let campaigns gather data, then add targets based on actual conversion economics.
8. Set brand and content boundaries. Protect brand Search from PMax cannibalization, set URL expansion intentionally, and use content controls when placements or sensitive categories matter.
9. Launch with a QA gate. Check tracking, budgets, dates, bids, asset approvals, feed disapprovals, policy, URLs, and naming before spend.
10. Optimize one lever at a time. Creative, search terms, negatives, product groups, feed fixes, target changes, and budgets should be logged and read on a stable window.
11. Reconcile with the source of truth. Microsoft-attributed conversions will not match Google, GA4, CRM, or the warehouse exactly. Explain the method and reconcile before client reporting.

## Decision rules and thresholds

- Do not scale without UET confidence. Conversion bidding depends on a working UET or offline conversion feed.
- Search stays separate when query control matters. PMax can extend reach, but it does not replace a strong Search structure for brand and high-intent terms.
- Shopping stays separate when product control matters. Use feed-based Shopping when product partitions, priorities, and per-group bids are required.
- Imports need verification. Never assume a Google budget, target, URL, negative, or conversion goal imported into the right Microsoft equivalent.
- Feed fixes often beat bid changes. Disapprovals, stale prices, poor images, missing identifiers, and broken URLs cap Shopping and retail PMax before bidding gets a chance.
- Final URL expansion is a business decision. Leave it on only when the full domain is a valid paid destination, or use opt-out and page feeds.
- Step targets gradually. Tight CPA or ROAS targets at launch can make a campaign look broken when it is simply starved.

## Optimization menu

| Symptom | First checks | Safer first move |
| --- | --- | --- |
| No spend | Status, budget, bid target, UET, policy, feed, audience size | Remove excessive target or fix policy/feed |
| High CPA | Query quality, product feed, landing page, conversion goal | Add negatives, fix feed/page, then adjust target |
| PMax cannibalizes brand | Brand list, Search structure, query/category insight | Apply brand controls and keep Search separate |
| Shopping low volume | Feed disapprovals, product partitions, bid, priority | Fix feed and product scope before raising bids |
| Import underperforms | Goals, budgets, tracking templates, location, negatives | Re-QA import mapping |
| Audience low quality | Placement/content report, audience segment, creative | Tighten content or refresh creative |

## Templates and examples

Google import QA:

```text
Imported from: Google Search and PMax.
Before unpause: UET goal selected, budgets converted, locations verified, negatives imported, tracking templates working, Merchant Center store linked, product feed approved, brand controls set.
Decision: Keep brand Search separate, launch Microsoft PMax at lower test budget, read after learning.
```

Retail setup:

```text
Goal: Grow incremental ecommerce revenue.
Tracking: UET purchase event with revenue value.
Feed: Microsoft Merchant Center catalog approved and refreshed.
Campaigns: Shopping for best-seller bid control, PMax for automated expansion.
Guardrails: ROAS, revenue, new customer share, impression share, product disapprovals.
```

## Common pitfalls

- Importing from Google and unpausing without QA.
- Running PMax with no UET conversion goal.
- Letting PMax absorb brand Search and then reporting inflated growth.
- Ignoring Merchant Center disapprovals and trying to bid around a feed problem.
- Setting a ROAS target before the account has enough conversion value history.
- Leaving final URL expansion on for pages that should not receive paid traffic.
- Reading Microsoft performance as a direct copy of Google performance.
- Making budget, bid, feed, and creative changes together, then losing causality.

## Sources

- [Performance Max Campaigns, Microsoft Advertising API](https://learn.microsoft.com/en-us/advertising/guides/performance-max?view=bingads-13) (as of July 2026)
- [Universal Event Tracking, Microsoft Advertising](https://help.ads.microsoft.com/#apex/ads/en/56682/2) (as of July 2026)
- [Product Ads, Microsoft Advertising API](https://learn.microsoft.com/en-us/advertising/guides/product-ads?view=bingads-13) (as of July 2026)
- [Performance Max updates and product news for January 2026, Microsoft Advertising](https://about.ads.microsoft.com/en/blog/post/january-2026/performance-max-updates-and-other-product-news-for-january-2026) (as of July 2026)
