---
name: retailmedia-foundations-and-networks
description: Map the commerce and retail media landscape and pick the right network and surface for a brief. Use when the user asks about retail media, commerce media, Amazon Ads, Walmart Connect, Kroger Precision Marketing, Instacart, DoorDash Ads, Uber Advertising, Chase Media Solutions, onsite vs offsite vs in-store, sponsored products vs display, closed-loop measurement, clean rooms like AMC, new-to-brand, or which retail network to buy.
---

# Retail media foundations and networks

Pick the right commerce media network and the right surface (onsite, offsite, in-store) for a
brief, then set the expectation for how closed-loop measurement and new-to-brand will read.
Retail media is programmatic buying where the seller owns first-party purchase data and can
attribute ad exposure to a sale, so the network choice is really a data and audience choice,
not just an inventory choice.

This skill is the map and the selection logic. It does not run campaigns inside any one
network. For Amazon buying in depth, hand off to the `amazon-dsp-*` skills and
`amazon-marketing-cloud`. For packaging retail audiences onto open-web inventory through
sell-side deals, hand off to `curation-and-curated-marketplaces`. For trimming the bid-to-
impression path, hand off to `curation-and-supply-path-optimization`. For KPI math (ROAS,
CPA, incrementality), see `programmatic-foundations`.

## When to use this skill

- "Which retail media network should we buy?" / "Amazon vs Walmart vs Kroger vs Instacart?"
- "What is the difference between commerce media and retail media?"
- "Onsite or offsite? Do I need in-store screens?"
- "Sponsored products vs sponsored display vs a DSP buy on this network."
- "How does closed-loop measurement work?" / "Why does this network report different sales?"
- "What is a good new-to-brand rate?" / "Is this campaign actually acquiring customers?"
- "Can I use Walmart or DoorDash data off their site?" (offsite activation and clean rooms)
- "What is AMC / a retail clean room and when do I need one?"

Boundaries with sibling skills:
- Running Amazon DSP campaigns, audiences, bidding, reporting: the `amazon-dsp-*` skills.
- Amazon clean-room analysis and audience building: `amazon-marketing-cloud`.
- Buying retail audiences as a curated Deal ID on open-web supply: `curation-and-curated-marketplaces`.
- Reducing hops and fees on the supply path: `curation-and-supply-path-optimization`.
- CTV pod mechanics when a retail network sells streaming: `ctv-supply-and-ad-pods`.
- Stitching retail conversions into one warehouse: `marketing-analytics-warehouse-and-dashboards`.

## Quick reference

| Brief | Lead network(s) | Lead surface | Why |
| --- | --- | --- | --- |
| Sell more of a product that lives on Amazon | Amazon Ads (Sponsored Products, then DSP) | Onsite search, then onsite/offsite display | Purchase intent and the buy button are on the page |
| Grocery/CPG, big-basket, US mass retail | Walmart Connect, Kroger Precision Marketing | Onsite + offsite + in-store | Loyalty-card purchase data and store footprint |
| Same-day grocery delivery, recipe/basket context | Instacart | Onsite sponsored + offsite (Carrot Ads network) | First-party cart and SKU-level data at add-to-cart |
| Food delivery, restaurant/CPG, high new-customer rate | DoorDash Ads, Uber Advertising | Onsite sponsored + offsite + CTV | Logged-in intent, strong new-to-advertiser reach |
| Reach a retailer's shoppers off their property | The retailer's offsite program or a curated deal | Offsite open web, social, CTV | Activate the audience where the impression is cheap |
| Non-endemic brand (auto, finance, travel) wanting purchase data | Chase Media Solutions, retailer offsite/clean room | Offsite + card-linked offers | Spend data without a product on the retailer's shelf |
| Prove exposure drove sales, privacy-safe | Any network with a clean room (AMC and peers) | Measurement layer, not a buy | Aggregated, log-level joins without exporting PII |

Three surfaces, three jobs:
- Onsite: ads on the retailer's own app or site (search results, product pages). Highest
  intent, closest to the purchase, most limited scale.
- Offsite: the retailer's first-party audience activated on the open web, social, or CTV.
  Bigger reach, lower intent, needs a clean measurement join back to sales.
- In-store: screens, audio, and self-checkout in physical stores. Reaches the shopper at the
  shelf but is the hardest to attribute at the individual level.

## Core process

1. Name the objective and where the product is bought. If the product sells on the retailer,
   the onsite search ad sits next to the purchase and usually wins first dollar. If the goal is
   reach or acquisition, weight offsite. The network that owns the transaction owns the
   attribution, so pick the network whose shoppers actually buy this product.
2. Match the audience to the network's data. Amazon has broad shopping and browsing signal;
   Walmart and Kroger have loyalty-card grocery baskets and store trips; Instacart has SKU-level
   cart data; DoorDash and Uber have logged-in food and mobility intent; Chase has card-spend
   data across merchants. Choose the network whose first-party data best describes your buyer.
3. Pick the surface per the Quick reference. Start onsite for conversion, add offsite for reach
   and new customers, add in-store only when the shelf moment matters and you accept weaker
   attribution.
4. Decide onsite ad type before DSP. On most networks the ladder is sponsored search first
   (keyword or category, closest to the buy button), then sponsored display on product pages,
   then the network DSP for audience-based display, video, and offsite. Do not jump to the DSP
   before the sponsored-search shelf is defended.
5. Set the measurement frame up front. Confirm the attribution window, whether reporting is
   click-based, view-through, or clean-room modeled, and whether new-to-brand (or new-to-
   advertiser) is available. Networks report their own numbers on their own methodology, so
   agree the metric definition before launch, not after.
6. Decide if you need a clean room. If you must join the network's exposure data to your own
   first-party or CRM data for incrementality, audience building, or cross-media dedup, plan a
   clean-room workflow (AMC on Amazon, equivalents elsewhere). Aggregated outputs only, no PII
   export. For AMC specifically, hand off to `amazon-marketing-cloud`.
7. Human-gate the spend. Recommend the network, surface, budget split, and target metric, then
   stop and let a human approve budgets and go live. Never launch spend or push a live config
   change automatically.

## Decision rules and thresholds

### Commerce media vs retail media

Retail media is the subset owned by retailers (Amazon, Walmart, Kroger, Target, Instacart).
Commerce media is the wider set that includes delivery, mobility, travel, and financial
players that sell media against first-party transaction data (DoorDash, Uber, Chase, airlines,
hotels). DoorDash calls its expanded onsite-plus-offsite program a commerce media platform.
Treat them the same way operationally: whoever owns the transaction owns the closed loop. The
label matters less than "does this network's data describe my buyer, and can it attribute a
sale."

### Onsite first, offsite for reach

- Endemic brand, product on the retailer's shelf, conversion goal: onsite sponsored search is
  first dollar. It is the highest-intent, lowest-waste surface because it sits on the query.
- Reach, awareness, or new-customer goals: shift budget offsite once the onsite shelf is
  defended. Offsite buys the same audience on cheaper open-web, social, or CTV impressions.
- In-store: add only when the shelf decision is the moment that matters (impulse, category
  disruption) and you accept that individual-level attribution is weaker than digital.

### Non-endemic brands

If your product does not sell on the retailer (a bank, an automaker, a streaming service), you
cannot run sponsored products there. Your play is the network's offsite/DSP program to reach
their shoppers, a card-linked-offer network like Chase Media Solutions that monetizes spend
data, or a curated deal that packages the retailer's audience onto open-web supply (see
`curation-and-curated-marketplaces`).

### Offsite activation and data leaving the property

Several retailers now let you activate their first-party audience and run closed-loop
measurement on media you buy in your own platforms, not just on the retailer's site. Walmart
Connect is expanding first-party data access to outside platforms (Yahoo DSP as a launch
partner, VIZIO CTV inventory via Magnite supply, in a phased rollout as of May 2026). DoorDash
Ads runs offsite through an acquired ad-tech layer and matches to advertiser data through a
data-collaboration partner for privacy-safe measurement (June 2026). When you activate a
retailer's audience offsite, insist on the measurement join back to sales, because offsite
reach without the closed loop is just another audience segment.

### New-to-brand as an acquisition gauge

New-to-brand (Amazon's term) or new-to-advertiser (used by delivery networks) counts buyers
who had not purchased from the brand in a lookback window. Use it to judge whether a campaign
acquires customers or just harvests existing ones. Rules of thumb, not guarantees:

- Offsite and delivery surfaces skew high on new customers by design. Reported figures in 2025
  and 2026 include a median of 52% new-to-brand on Walmart Connect offsite display, and over
  80% new-to-advertiser reach on DoorDash test campaigns. Treat vendor figures as directional.
- A very low new-to-brand rate on a prospecting line usually means you are retargeting existing
  buyers. Rebalance toward upper-funnel audiences or offsite.
- A very high new-to-brand rate on a line meant to defend the shelf can mean you are buying
  incremental reach you did not intend. Match the metric to the line's job.

Full benchmark ranges and how each network defines and windows the metric live in
`references/new-to-brand-benchmarks.md`.

### When a clean room is worth it

Use a retail clean room (AMC on Amazon, and clean-room equivalents on other networks) when you
need to join exposure to your own data for incrementality, custom audiences, or cross-media
dedup, and you accept aggregated, non-exportable outputs. Do not stand up a clean room just to
pull standard campaign reports; the network console already gives those. AMC on Amazon is
privacy-safe (data cannot be exported, outputs are aggregated) and carries a 25-month lookback
and custom-model support. For AMC workflows, hand off to `amazon-marketing-cloud`.

## Reference material

- `references/commerce-vs-retail-media.md`: the taxonomy (retail vs commerce media), the
  onsite/offsite/in-store surface map, endemic vs non-endemic, and closed-loop measurement
  mechanics. Read this when someone confuses the categories or asks how attribution works.
- `references/network-set-and-surfaces.md`: a network-by-network map (Amazon, Walmart, Kroger,
  Instacart, DoorDash, Uber, Chase) with the data each owns, the surfaces and ad types it
  sells, its DSP and clean-room posture, and its offsite/curation path. Read this when choosing
  a network or briefing a specific one.
- `references/new-to-brand-benchmarks.md`: how each network defines new-to-brand or new-to-
  advertiser, the lookback windows, directional benchmark ranges by surface, and the pitfalls
  in comparing the metric across networks. Read this when setting or defending an acquisition
  target.

## Templates and examples

- CPG snack brand, product on Amazon and Walmart, goal is unit sales plus new buyers. Plan:
  Amazon Sponsored Products to defend branded and category search, Walmart Connect Sponsored
  Search for the mass-retail basket, then Amazon DSP and Walmart offsite display for reach.
  Target metric: onsite ROAS on sponsored search, new-to-brand on the DSP and offsite lines.
  Measurement: AMC for cross-line incrementality on the Amazon side. Human approves budgets.
- Regional grocery push, loyalty-driven, goal is trips and basket size. Plan: Kroger Precision
  Marketing onsite sponsored plus offsite against loyalty-card segments, in-store screens in
  target banners for the shelf moment. Target metric: sales lift on card-linked purchases.
- Auto brand (non-endemic), goal is qualified reach among high-income grocery shoppers. Plan:
  no sponsored products (no shelf); buy the retailer's offsite/DSP audience or a curated Deal ID
  packaging that audience onto CTV and open web via `curation-and-curated-marketplaces`; measure
  reach and new-to-advertiser, and store visitation if the network offers it.
- Restaurant chain, goal is new customers and orders. Plan: DoorDash Ads sponsored listings plus
  the homepage Spotlight format onsite, offsite through the network's ad-tech layer, matched to
  first-party data through the network's data-collaboration partner for closed-loop
  measurement. Target metric: new-to-advertiser share and cost per incremental order.

## Common pitfalls

- Comparing networks on the same "ROAS" number. Each network attributes on its own window and
  methodology (click, view-through, or clean-room modeled), so a 6x on one is not a 6x on
  another. Normalize the definitions before you compare, or compare incremental sales in a
  clean room.
- Jumping to the DSP before defending the shelf. On endemic buys, sponsored search is first
  dollar. Spending on audience display while a competitor owns your branded search leaks sales.
- Treating offsite reach as closed-loop by default. Offsite is only closed-loop if the
  measurement join back to the retailer's purchase data is in place. Confirm it exists before
  you count offsite as retail media rather than plain open-web reach.
- Assuming in-store attributes like digital. In-store screens and audio reach the shopper at
  the shelf but attribute at the store or basket level, not the individual. Set that
  expectation with the client up front.
- Running a non-endemic brand toward sponsored products. There is no shelf to sponsor. Route to
  offsite, card-linked offers, or a curated audience deal instead.
- Taking vendor new-to-brand figures as guaranteed. They are directional and self-reported on
  the vendor's own definition. Validate against your own repeat-purchase data where possible,
  and see `references/new-to-brand-benchmarks.md`.
- Standing up a clean room for reports you can already pull. Clean rooms are for joins and
  incrementality, not for standard campaign metrics the console already returns.

## Sources

- [Walmart Connect: expanding access to Walmart first-party data across leading platforms](https://www.walmartconnect.com/resources/articles/2026/expanding-access-to-walmart-first-party-data-across-leading-platforms) (as of July 2026)
- [DoorDash Ads becomes a global commerce media platform](https://about.doordash.com/en-us/news/doordash-ads-becomes-a-global-commerce-media-platform) (as of July 2026)
- [Amazon Certified Supply Exchange](https://advertising.amazon.com/library/news/certified-supply-exchange) (as of July 2026)
- [Amazon Marketing Cloud](https://advertising.amazon.com/solutions/products/amazon-marketing-cloud) (as of July 2026)
- [Amazon DSP Performance+ tactics](https://advertising.amazon.com/resources/whats-new/amazon-dsp-launches-performance-plus-tactics) (as of July 2026)
- [Brand+ and Performance+: two powerhouse tools](https://advertising.amazon.com/library/news/brand-performance-plus-two-powerhouse-tools) (as of July 2026)
- [The Trade Desk OpenPath](https://www.thetradedesk.com/our-demand-side-platform/openpath) (as of July 2026)
- [The trader's guide to supply path optimization (SPO)](https://www.thetradedesk.com/resources/the-traders-guide-to-supply-path-optimization-spo) (as of July 2026)
