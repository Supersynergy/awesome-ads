---
name: retailmedia-onsite-sponsored-products
description: Plan, structure, and optimize onsite sponsored-product and sponsored-brand campaigns across retailer ad consoles. Use when the user asks about Sponsored Products, Sponsored Brands, Walmart Connect Sponsored Search, Instacart sponsored product, Roundel Target Product Ads, keyword vs auto targeting, ACOS or ROAS targets, bid down or harvest search terms, TACOS, dayparting on a retail console, or how to build an onsite retail search campaign that spends efficiently.
---

# Retail media onsite sponsored products

Build and tune the onsite search and product-page ads that sit next to the buy button on a
retailer's own site: Amazon Sponsored Products and Sponsored Brands, Walmart Connect Sponsored
Search, Instacart sponsored product, and Roundel Target Product Ads. These are CPC auctions
where the retailer owns the purchase data, so the whole game is a keyword and bid structure
that harvests converting search terms and starves the ones that only spend.

This skill runs the onsite search book. It assumes you know CPC, ACOS, ROAS, and CTR; for that
math and closed-loop definitions see `programmatic-foundations`. To choose which retail network
and surface to buy in the first place, start in `retailmedia-foundations-and-networks`. For
audience-based display, video, and offsite on Amazon, hand off to the `amazon-dsp-*` skills.

## When to use this skill

- "Set up Sponsored Products / Sponsored Brands for this catalog."
- "Walmart Connect Sponsored Search structure and bids." / "Instacart sponsored product setup."
- "Roundel Target Product Ads / how do onsite retail search ads work?"
- "Auto vs manual targeting?" / "Broad, phrase, exact, or product targeting?"
- "My ACOS is too high / ROAS is too low, how do I fix it?"
- "Harvest search terms." / "Bid down or negate wasted spend." / "What is TACOS?"
- "Dayparting, placement multipliers, or top-of-search bid boosts on a retail console."
- "Why is my sponsored campaign not spending / not showing in search?"

Boundaries with sibling skills:
- Which network and surface to buy (onsite vs offsite vs in-store): `retailmedia-foundations-and-networks`.
- Amazon DSP display, video, streaming TV, audiences, and offsite: the `amazon-dsp-*` skills.
- Amazon clean-room analysis and custom audiences: `amazon-marketing-cloud`.
- KPI math (ACOS, ROAS, TACOS, incrementality definitions): `programmatic-foundations`.
- Packaging retail audiences onto open-web supply as a curated deal: `curation-and-curated-marketplaces`.

## Quick reference

| Goal | Ad type to lead with | Targeting to lead with | Why |
| --- | --- | --- | --- |
| Defend branded search, own your own shelf | Sponsored Products, then Sponsored Brands | Exact keyword on your brand terms | Cheapest conversions; block competitors on your name |
| Win non-branded category demand | Sponsored Products | Auto first to discover, then manual exact | Auto finds converting terms; exact locks them in cheap |
| Launch a new ASIN or item with no history | Sponsored Products auto | Auto (all match types) | No search-term data yet; let the engine find intent |
| Cross-sell and defend against competitor pages | Sponsored Products product targeting | ASIN / category product targeting | Place on competitor and complementary detail pages |
| Build brand awareness at top of search | Sponsored Brands | Category and branded keywords | Banner and logo real estate above the fold |
| Efficiency is failing (ACOS too high) | Existing Sponsored Products | Tighten to exact, negate waste, bid down | Concentrate spend on proven converters |

Naming ladder across consoles (same job, different labels):

| Job | Amazon Ads | Walmart Connect | Instacart | Roundel (Target) |
| --- | --- | --- | --- | --- |
| Onsite search product ad | Sponsored Products | Sponsored Search (Sponsored Products) | Sponsored product | Target Product Ads |
| Onsite banner / brand ad | Sponsored Brands | Sponsored Brands | Display / brand pages | Display |
| Product-page display | Sponsored Display | Onsite Display | Display | Display |

## Core process

1. Confirm retail readiness before spending a dollar. An onsite ad only converts if the item is
   in stock, buy-box eligible, priced competitively, and has a complete detail page (title,
   images, bullets, A+ content where available). Ads amplify the page; they cannot fix a page
   that will not convert. Full checklist in `references/retail-readiness-prerequisites.md`.
2. Set the account and campaign taxonomy. One structure that separates branded, non-branded
   category, competitor-conquesting, and auto-discovery so each has its own budget and target,
   because you cannot manage ACOS on a bucket you cannot see. Layout in
   `references/campaign-taxonomy-and-targeting.md`.
3. Pick the ad type per the Quick reference. Lead with Sponsored Products (the search product
   ad) on every network; it carries the most volume and the cleanest attribution. Add Sponsored
   Brands once Sponsored Products is defending your branded terms.
4. Choose targeting. Start non-branded categories on auto to discover search terms, run branded
   terms on exact, and use product (ASIN/item) targeting for conquesting and cross-sell. Match
   types and when to use each are in `references/campaign-taxonomy-and-targeting.md`.
5. Set the starting bid off the console's suggested-bid range, not a guess. Suggested bids
   reflect the current clearing price for that keyword; start near the low end of the range on
   discovery campaigns and near the top on must-win branded exact.
6. Set an ACOS or ROAS guardrail per campaign bucket, not one number for the account. Branded
   defense runs a low ACOS, category prospecting runs a higher one, launch runs the highest.
   Targets and the bid math in `references/roas-and-acos-guardrails.md`.
7. Human-gate the launch. Recommend the full structure, bids, budgets, and per-bucket targets,
   then stop and let a human approve the spend and go live. Never push budgets or a live bid
   change automatically.
8. Run the weekly optimization loop: harvest converting search terms into exact, negate wasted
   terms, adjust bids toward the target, and rebalance budget to the buckets hitting goal.
   Thresholds for each move are in `references/roas-and-acos-guardrails.md`.

## Decision rules and thresholds

### Auto vs manual targeting

- New item or new category with no search-term history: start auto. It surfaces the queries and
  ASINs that actually convert so you are not guessing keywords.
- Once auto has spend and clicks on a term with orders: harvest that term into a manual exact
  campaign and add it as a negative in the auto campaign, so the two do not bid against each
  other and the proven term gets a controlled bid.
- Branded terms: always manual exact from day one. You know the query and you want tight control
  and a low bid, since your own listings should win cheaply.

### Match type ladder (search-term targeting)

- Broad: widest reach, most waste; use only in discovery, watch the search-term report daily.
- Phrase: middle ground; the query contains your term in order.
- Exact: tightest, cheapest per converting click; the destination for every harvested winner.
- Product / ASIN / item targeting: not a match type; places your ad on a specific product page
  or category. Use for conquesting competitors and cross-selling complements.

### Harvest and negate thresholds

Use clicks-without-orders as the negation trigger and orders-at-target as the harvest trigger.
A practical default on a mid-volume catalog:

- Harvest a search term to exact when it has driven multiple orders at or below your target ACOS
  in the auto or broad campaign, because it is now a proven converter that deserves a dedicated
  bid.
- Negate a search term when it has spent roughly 1.5 to 2x your target cost-per-order with zero
  orders (for example, 15 to 20 clicks and no sale on an item that normally converts around 1 in
  8 clicks), because continued spend is very unlikely to pay back.
- Tune both thresholds to the item's real conversion rate: a 1-in-4 converter can negate faster,
  a 1-in-20 converter needs more clicks before you call it dead.

### ACOS and ROAS guardrails by bucket

ACOS (ad spend / ad-attributed sales) and ROAS are inverses: ROAS = 1 / ACOS. Set the guardrail
by intent, not one account number:

- Branded defense: lowest ACOS (own terms should convert cheaply). If branded ACOS is high, the
  listing or price is the problem, not the bid.
- Non-branded category / prospecting: higher ACOS is acceptable because you are buying new
  demand and, on many catalogs, new-to-brand customers.
- Launch / harvest: highest ACOS tolerated for a defined window to gather velocity and reviews,
  then tightened once organic rank builds.
- Watch total ACOS (TACOS = total ad spend / total brand sales, ad plus organic). Falling TACOS
  while sales grow means ads are lifting organic rank, which is the real win. Rising TACOS with
  flat sales means you are buying sales you would have gotten anyway.

Full bid-adjustment math and the exact move for each ACOS-vs-target case are in
`references/roas-and-acos-guardrails.md`.

### Bid modifiers and placements

- Top-of-search (or top-of-page) placement usually converts best and costs most. Use the
  console's placement multiplier to bid up for it only on campaigns already hitting target, so
  you scale winners, not losers.
- Dayparting: bid down or pause in hours that spend without converting once you have enough
  hour-of-day data to trust the pattern. Do not daypart a campaign still in its first weeks.

## Reference material

- `references/campaign-taxonomy-and-targeting.md`: the full branded / non-branded / competitor /
  auto-discovery campaign structure, the match-type and product-targeting decision table, and
  the naming convention mapped across Amazon, Walmart Connect, Instacart, and Roundel. Read this
  when building the account or deciding how to target a specific keyword or ASIN.
- `references/retail-readiness-prerequisites.md`: the pre-flight checklist every item must pass
  before it is worth advertising (stock, buy box, price competitiveness, detail-page
  completeness, reviews, content), and what to fix first when a campaign spends but does not
  convert. Read this before launch and when ACOS is bad despite reasonable bids.
- `references/roas-and-acos-guardrails.md`: target ACOS/ROAS by bucket, the weekly optimization
  loop, the exact bid move for each ACOS-vs-target case, harvest and negation thresholds, and
  the TACOS read. Read this when setting targets or running the weekly tune.

## Templates and examples

Example structure for a mid-size Amazon catalog (one brand, one hero product line):

- `SP | Brand Defense | Exact`: exact-match on your brand plus product name (for example,
  "acme cold brew concentrate"). Target ACOS around 8 to 12 percent, low bids, high budget
  priority. Job: never let a competitor buy your name cheaply.
- `SP | Category | Auto`: auto targeting across the catalog to discover converting queries and
  ASINs. Target ACOS around 30 to 40 percent while it learns. Job: find winners to harvest.
- `SP | Category | Manual Exact`: harvested winners from the auto campaign (for example, "cold
  brew concentrate", "unsweetened cold brew"). Target ACOS around 20 to 30 percent. Job: own
  proven non-branded demand at a controlled bid.
- `SP | Conquest | Product Targeting`: ASIN targeting on competitor detail pages and complements.
  Target ACOS higher, watch it closely. Job: steal consideration at the competitor's page.
- `SB | Brand | Category + Branded`: Sponsored Brands banner above search for branded and top
  category terms once Sponsored Products is defending the shelf. Job: brand real estate and
  new-to-brand reach.

Weekly loop (filled-in example move):
- Search term "nitro cold brew can" in the auto campaign spent your target cost-per-order twice
  over with 3 orders at 22 percent ACOS. Move: harvest to `SP | Category | Manual Exact` at a
  bid near the suggested midpoint, add it as an exact negative in the auto campaign.
- Search term "cold brew maker machine" spent 18 clicks, 0 orders, on a concentrate that has no
  machine. Move: add as a negative exact in auto and any broad campaign. It is the wrong intent.

Walmart Connect and Roundel mapping: the same five-bucket structure applies. On Walmart the
search product ad is Sponsored Search / Sponsored Products with keyword bidding and an auction
model; on Roundel the onsite search product ad is Target Product Ads on Target.com and the Target
app. Instacart runs sponsored product against SKU and category context in the grocery cart flow.
Keep the branded/non-branded/conquest/auto split on every network; only the labels and available
match types change.

## Common pitfalls

- Advertising an item that is not retail-ready. If the page will not convert (out of stock, lost
  buy box, uncompetitive price, thin content, no reviews), ads burn budget. Fix the page first.
  See `references/retail-readiness-prerequisites.md`.
- One ACOS target for the whole account. Branded and prospecting have different economics;
  a single number either starves prospecting or overpays on defense. Set targets per bucket.
- Never harvesting. Leaving winners in a broad or auto campaign means proven terms keep bidding
  at broad-match prices and against your own manual campaigns. Harvest weekly.
- Never negating. Auto and broad campaigns leak spend on wrong-intent queries. Negate on the
  clicks-without-orders threshold every week.
- Bidding up placements or dayparting on a losing campaign. Multipliers and boosts scale whatever
  the campaign already does; apply them only to campaigns hitting target.
- Reading ACOS without TACOS. Low ad ACOS while total brand sales are flat can mean you are just
  harvesting organic sales as paid. Track TACOS to see if ads are actually growing the business.
- Judging a launch campaign in week one. New campaigns and new items need time and clicks before
  the numbers mean anything; do not gut a launch bucket before it has data.
- Jumping to the DSP before the sponsored-search shelf is defended. Audience display and video
  are the next step, not the first. Own your branded and category search first, then hand off to
  the `amazon-dsp-*` skills for offsite and audiences.

## Sources

- [Unboxed 2025 recap: Sponsored Products video, Sponsored Brands reserve share of voice and collections, Full-funnel Campaigns](https://advertising.amazon.com/library/news/unboxed-2025-recap) (as of July 2026)
- [Unboxed 2025: campaign analysis with unified reporting](https://advertising.amazon.com/resources/whats-new/unboxed-2025-campaign-analysis-with-unified-reporting) (as of July 2026)
- [Brand+ and Performance+ overview (ROAS-driven tools)](https://advertising.amazon.com/library/news/brand-performance-plus-two-powerhouse-tools) (as of July 2026)
- [Amazon DSP launches Performance+ tactics (ROAS/CPA optimization)](https://advertising.amazon.com/resources/whats-new/amazon-dsp-launches-performance-plus-tactics) (as of July 2026)
- [Walmart Connect resources and advertising products](https://www.walmartconnect.com/resources) (as of July 2026)
- [Instacart Ads for brands](https://company.instacart.com/ads) (as of July 2026)
- [Roundel (Target Product Ads and retail media products)](https://roundel.com/) (as of July 2026)
- [The Trade Desk guide to supply path optimization](https://www.thetradedesk.com/resources/the-traders-guide-to-supply-path-optimization-spo) (as of July 2026)
