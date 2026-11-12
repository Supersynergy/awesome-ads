---
name: shopping-feed-qa-google-ads
description: Audits a Merchant Center product feed as a performance lever rather than a compliance chore, covering disapprovals and warnings, missing or weak attributes, title and description structure, identifier coverage, price and availability accuracy against the site, image quality, and product segmentation for bidding. Use when Shopping or Performance Max underdelivers, products are not serving, impressions are concentrated in a few items, or the user asks for a feed audit before scaling.
---

# Shopping Feed QA — Google Ads

## Use this skill when

The user runs Shopping or Performance Max and the feed is a plausible cause of weak delivery, poor coverage, or unprofitable spend concentration. The feed is not a technical prerequisite that sits outside the account. It is the targeting layer, the creative layer, and the eligibility layer at the same time.

Common user requests:

- "Our Shopping campaigns barely spend. What is wrong?"
- "Half our catalogue never gets impressions."
- "Audit our Merchant Center feed."
- "Performance Max is only pushing three products."
- "We keep getting disapprovals and I don't understand them."
- "Is the feed ready before we increase budget?"

Do not use this skill when the diagnosis is clearly about bidding, budget, or asset groups rather than product data. Route to the Performance Max or bidding skills instead.

## Why feed quality gates delivery

State this to the user early, because it reframes the work from housekeeping to performance.

In Search, the advertiser supplies keywords and ad copy. In Shopping and Performance Max shopping inventory, the advertiser supplies neither. The product data does both jobs: Google matches a query against the product's attributes, and the ad is assembled from the product's title, image, and price. That produces three hard consequences.

First, eligibility. A disapproved product cannot serve at all, and a product missing required attributes for its category may be limited or excluded from particular surfaces without the campaign reporting anything obviously wrong.

Second, matching breadth. A thin title restricts the range of queries a product can plausibly match, so a large catalogue with weak titles behaves like a small catalogue. The advertiser sees low impression volume and usually blames budget.

Third, spend concentration. When most products carry weak data and a handful carry strong data, automated bidding concentrates delivery on the strong ones. The account looks like it has a bidding or Performance Max problem. It has a data problem.

Feed quality therefore gates delivery before any bid or budget decision has an effect. Audit it before scaling, not after.

## Required input

Minimum useful data:

- Access to Merchant Center diagnostics, or an export of item level issues.
- The product feed itself, or a representative sample including the poorest performing items.
- Shopping or Performance Max performance data segmented by product or item ID.
- The site URLs for a sample of products, so feed values can be checked against the live page.
- The business goal: ROAS target, margin target, or revenue target.

Recommended exports:

- Item level issues report from Merchant Center, including severity.
- Full product feed export with all supplied attributes.
- Shopping performance by item ID, with impressions, clicks, cost, conversions, and conversion value, plus the same data aggregated by product type and brand.
- Price competitiveness and best sellers reporting where the account has access to it.
- Landing page price and availability for a sample of at least 20 items.

Required columns where available:

- item ID, title, description
- product type and google product category
- brand, GTIN, MPN
- price and sale price
- availability and condition
- image link and additional image links
- custom labels 0 to 4
- impressions, clicks, cost, conversions, conversion value

If the user only has partial access, start with item level issues and the item ID performance report. Those two carry most of the diagnostic weight.

## Before analysis

1. Confirm which campaigns consume this feed and whether they are Shopping, Performance Max, or both. The same weakness has different symptoms in each.
2. Confirm the catalogue size and how many items are currently active and serving, not merely uploaded. The gap between those two numbers is often the entire finding.
3. Confirm the feed update mechanism and cadence. Price and availability drift is a function of update frequency.
4. Confirm the conversion action and whether revenue values are passed. Feed segmentation for bidding is meaningless without value data.
5. Note that Dynamic Search Ads, automatically created assets, and campaign-level broad match are subject to auto-upgrade to AI Max from September 2026, which increases how much Google infers from supplied data rather than from advertiser targeting. Feed quality becomes more load-bearing under that shift, not less.
6. Exclude data inside the conversion lag window before judging any product's performance.

## Analysis workflow

Work in this order. Each layer constrains the ones below it.

### Layer 1: Eligibility

1. Count disapproved items and group them by the stated reason rather than by product.
2. Separate account level issues from item level issues. An account level suspension makes every item level finding secondary.
3. List warnings distinctly from disapprovals. Warnings do not block serving today but frequently predict future disapproval or restricted surfaces.
4. Calculate what share of catalogue value, not catalogue count, is blocked. Ten disapproved bestsellers matter more than four hundred disapproved long-tail items.

### Layer 2: Attribute completeness

1. Measure fill rate for each attribute across the catalogue.
2. Flag attributes that are required for the item's category but absent.
3. Flag attributes that are technically present but functionally empty, such as a description copied from the title or a product type of a single generic word.
4. Check identifier coverage specifically: GTIN, brand, and MPN. Note which items legitimately have no GTIN, such as custom or handmade goods, and confirm they are declared as such rather than left silently incomplete.

### Layer 3: Title and description structure

1. Assess whether titles lead with the terms a buyer would actually search, rather than an internal SKU name or a marketing phrase. Score it, do not feel it - per title, mark four binary checks: (a) first 3 tokens contain the product type, (b) a differentiating attribute (size, color, model, material) appears before character 70, (c) no internal jargon or SKU code in the visible portion, (d) brand present where brand queries matter for this catalog. A title failing 2+ checks is a rewrite candidate; 10+ SKUs failing the same check is a feed-rule fix, not per-SKU edits [heuristic]. The "materially limiting" verdict for this layer requires rewrite candidates covering 20%+ of catalog revenue [heuristic].
2. Check for a consistent title pattern within each product type. Inconsistency across a category is usually the cause of uneven delivery inside it.
3. Check whether attributes that buyers search by, such as brand, model, size, colour, material, or pack quantity, appear in the title where relevant to the category.
4. Assess description substance. A description that repeats the title adds nothing to matching.
5. Flag titles that are truncated in a way that cuts the distinguishing attribute, since the visible portion is what a shopper reads.

### Layer 4: Accuracy against the site

1. Compare feed price to the live landing page price for the sample. Mismatches are a common and severe disapproval cause.
2. Compare feed availability to the live page. Out of stock items still marked in stock waste spend and damage trust.
3. Check for currency, tax, and shipping value mismatches where those are declared.
4. Check that landing pages resolve, are not redirecting to a generic category page, and are not returning soft errors.

### Layer 5: Image quality

1. Flag missing images, placeholder images, and low resolution images.
2. Flag images containing promotional overlays, watermarks, or added text, which are a routine disapproval cause.
3. Note where a single image is reused across variants that visually differ, which suppresses click-through.
4. Note whether additional images are supplied at all, since they support richer placements.

### Layer 6: Segmentation for bidding

1. Aggregate performance by product type, brand, and custom label.
2. Identify how spend distributes across the catalogue: what share of items receives most of the spend, and what share receives no impressions at all.
3. Check whether custom labels encode anything bid-relevant, such as margin band, seasonality, stock depth, or price tier. Empty or decorative custom labels are a missed control surface.
4. Identify items whose performance justifies separation into their own campaign or asset group, and items whose spend should be constrained.

## Decision rules

Use these as default heuristics, not hard laws. Every threshold here is a starting point to adjust to catalogue size, vertical, and margin structure.

Treat the feed as **blocking, fix before scaling** when:

- a material share of catalogue revenue potential sits in disapproved items,
- price or availability mismatches appear in the sampled items,
- required identifiers are missing across a whole brand or category,
- a large majority of the catalogue has received no impressions over a full lookback period despite being active.

Treat the feed as **materially limiting but serving** when:

- titles are inconsistent within categories,
- descriptions add no matching surface,
- custom labels are unused while bidding needs segmentation,
- image quality is uneven across categories.

Treat the feed as **healthy** when:

- disapprovals are negligible relative to catalogue value,
- identifier coverage is complete or legitimately declared as absent,
- sampled price and availability match the site,
- impression coverage extends across the catalogue rather than concentrating in a handful of items.

Do not attribute weak Shopping performance to the feed when impression coverage is broad, data is accurate, and the actual constraint is budget, bid strategy, or margin. Say so and route elsewhere.

Blocking threshold starting point: disapprovals or critical warnings touching 5%+ of catalog revenue (not SKU count) are treated as blocking [heuristic]; price or availability mismatches are blocking at any share. Fix-at-scale rule: 10+ SKUs sharing one defect get a supplemental feed or feed rule recommendation, not per-SKU edits.

## Practical example

A homeware retailer runs Shopping and one Performance Max campaign on a catalogue of 4,200 items, spending roughly $22K per month against a target ROAS of 400%. The complaint is that Performance Max spends nearly all of its budget on the same twelve products.

Layer 1 finds 380 disapproved items, of which 310 share one reason: image with promotional text overlay, applied by a seasonal campaign the merchandising team ran through the product image tool. Those 310 items represent a small share of catalogue count but include two of the top five selling categories.

Layer 2 finds GTIN supplied on 61% of items. The missing 39% is not random. It is almost entirely one supplier's range, imported through a different feed rule.

Layer 3 explains the concentration. Titles across the catalogue follow the internal naming convention, so a ceramic vase is titled "HW-4471 Vase Ceramic Lg". The twelve products absorbing the budget were retitled by hand last year during a test and read "Large Ceramic Flower Vase 30cm White Matte". Those twelve match a far wider set of queries than the rest of the catalogue, so automated bidding correctly pours spend into them. The campaign is behaving rationally on irrational data.

Layer 4 samples 25 items and finds four with a feed price above the live sale price, a mismatch that will produce disapprovals as the sale propagates.

Layer 6 finds custom labels entirely unused, so there is no way to separate high margin from low margin items for bidding, and no way to constrain clearance stock.

Verdict: blocking, fix before scaling. Sequenced actions are removal of the image overlays across the 310 items, a GTIN backfill for the affected supplier range, a title restructure applied per product type in the pattern brand plus product plus key attribute plus size, a feed update cadence fix for pricing, and custom label 0 populated with margin band so bidding can be segmented. The budget increase the client requested is deferred, because increasing budget on this feed increases spend on the same twelve products.

## Output format

Return an audit that leads with what blocks delivery.

### Verdict

One line: blocking / materially limiting / healthy, with the single strongest piece of evidence and the share of catalogue value affected.

### Findings by layer

For each finding include:

- layer: eligibility / completeness / titles / accuracy / images / segmentation
- finding
- items affected, as a count and as a share of spend or revenue potential
- evidence: the specific attribute, reason string, or sampled mismatch
- severity: blocking / material / minor
- confidence: confirmed / likely / needs data

### Fix plan, sequenced

Group by implementation owner, because feed fixes rarely sit with the ads team alone:

- fixes applied in Merchant Center or via feed rules
- fixes applied in the ecommerce platform or PIM
- fixes requiring merchandising or photography work
- fixes applied in the Google Ads account, such as segmentation and campaign splits

Order by blocked value recovered per unit of effort, and say which fixes are prerequisites for others.

### Coverage baseline

Record the current numbers so the next audit has something to compare against: active items, items with impressions, items with clicks, items with conversions, disapproval count, and identifier fill rate.

### Route to next

Name the sibling skills to run next. Typical routing:

- pmax-performance-diagnosis-google-ads once the feed is clean and the remaining question is campaign level,
- bidding-strategy-sanity-check-google-ads when segmentation is in place and the bid strategy must be matched to it,
- account-structure-audit-google-ads when product groups or asset groups need restructuring around the new segmentation,
- conversion-tracking-audit-google-ads when revenue values or transaction data look unreliable,
- wasted-spend-finder-google-ads for the items absorbing spend without return,
- scaling-planner-google-ads only after the verdict is healthy.

### Data gaps

List what was missing and which conclusion it prevented.

## Guardrails

- Never claim a specific Merchant Center policy or attribute requirement you have not verified. Describe the observed behaviour and the reason string shown in the account instead of asserting a rule.
- Never present the number of disapproved items without the share of value they represent. Counts mislead on large catalogues.
- Do not recommend a bulk title rewrite without sampling the result against real search terms first.
- Do not treat missing GTIN as an error before checking whether the products legitimately lack one.
- Never recommend increasing budget on a feed classified as blocking. The extra spend concentrates rather than expands.
- Sample price and availability against the live site rather than trusting the feed's own values.
- When a threshold here does not fit the catalogue size or vertical, say which one you adjusted and why.
- Flag the September 2026 AI Max upgrade exposure before recommending structural work that the upgrade would undo.
