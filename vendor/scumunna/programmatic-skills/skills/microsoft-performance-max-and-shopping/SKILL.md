---
name: microsoft-performance-max-and-shopping
description: Build and optimize Microsoft Advertising Performance Max and feed-based Shopping campaigns. Use when the user asks about Microsoft (Bing) Performance Max, PMax on Microsoft, asset groups, search themes, audience signals, the new customer acquisition goal, Microsoft Shopping campaigns, product ads, Microsoft Merchant Center store, the Content API feed, product partitions, final URL expansion, page feeds, Google Import into Microsoft, PMax vs Shopping, or why a Microsoft PMax campaign is not spending.
---

# Microsoft Performance Max and Shopping

Decide whether Microsoft Advertising Performance Max or a feed-based Shopping campaign fits the goal, then build it and feed it the signals it needs. Performance Max is one goal-based campaign that serves across Bing search, MSN, Outlook, Microsoft Edge, Microsoft Casual Games, and the partner network from a single campaign, so almost all the leverage is in the inputs: the conversion goal, the asset groups, the search themes, the audience signals, the product feed for retail, and the brand and content boundary. Feed-based Shopping is the older, more explicit path where you keep product-group control and manual or enhanced CPC. Microsoft AI controls bidding, budget split, placement, and creative assembly in PMax. You control what it optimizes toward and what it has to work with.

Microsoft Advertising (formerly Bing Ads) is a separate platform from Google Ads and DV360; do not carry Google Ads campaign objects or DV360 line-item concepts across unchanged. Conversion tracking for both PMax and Shopping runs on the Universal Event Tracking (UET) tag and the Conversions API. For instrumenting that, see the `microsoft-uet-and-conversions-api` skill. For the Google Ads counterpart of Performance Max, see `google-ads-performance-max`, and for the Google Shopping feed, see `google-ads-shopping-and-feed`. For KPI math (CPA, ROAS, ACOS, CPM), see `programmatic-foundations`.

## When to use this skill

- "Should I run Performance Max or Shopping on Microsoft/Bing?"
- "Set up a Microsoft Advertising PMax campaign / asset groups / search themes / audience signals."
- "What is the new customer acquisition goal in Microsoft PMax?"
- "Set up a Microsoft Shopping campaign / product ads / product groups / product partitions."
- "How do I submit a feed to Microsoft Merchant Center / the Content API / FTP?"
- "Turn off final URL expansion / auto-generated assets / add a page feed in Microsoft PMax."
- "Import my Google Performance Max or Shopping campaigns into Microsoft."
- "Why is my Microsoft PMax campaign not spending / not serving?"

Boundaries with sibling skills:
- UET tag, Conversions API, consent mode, enhanced conversions: `microsoft-uet-and-conversions-api`. PMax and Shopping cannot optimize without this wired first.
- Google Ads Performance Max mechanics: `google-ads-performance-max`. Same concept, different platform and field names.
- Google Ads Shopping and Merchant Center feed: `google-ads-shopping-and-feed`.
- Retailer onsite sponsored products (Amazon, Walmart, Instacart): `retailmedia-onsite-sponsored-products`. That is retail-console media, not Microsoft search Shopping.
- Cross-platform conversion reconciliation across Microsoft, Google, Meta: `cross-platform-conversion-reconciliation`.

## Quick reference

What you supply versus what Microsoft AI controls in Performance Max:

| You control | Microsoft AI controls |
| --- | --- |
| Conversion goal(s) and conversion values | Bid per auction (automated bidding) |
| Daily budget and bid strategy | Budget split across placements |
| Asset groups (headlines, descriptions, images, logos) | Which placement and channel serves |
| Search themes (up to 50 per campaign) | Query and keyword-less matching |
| Audience signals per asset group | Final creative assembly and combination |
| Product feed and listing scope (retail) | Which products and placements to push |
| Final URL expansion, brand list, content boundary | Final URL chosen when expansion is on |
| New customer acquisition goal (bid-higher or exclusive) | Whether each impression is a new or returning customer |

Performance Max vs feed-based Shopping, the decision in one table:

| Situation | Run | Why |
| --- | --- | --- |
| Retail catalog, want maximum reach and full automation | Performance Max with a store | Listing scope extends the feed across every Microsoft placement, AI assembles creative |
| Retail catalog, want product-group control and manual/enhanced CPC bids | Shopping campaign | Product partitions and manual CPC give explicit per-group control PMax hides |
| Lead gen or non-retail with a clean conversion goal | Performance Max, no store | It finds converters across placements without a feed |
| No working UET conversion tracking | Neither yet | Both need a conversion signal; wire UET first |
| Migrating a working Google PMax/Shopping build | Google Import, then tune | Import carries structure across, but re-verify feed, budgets, and goals |
| Manufacturer/retailer co-op sharing ad cost | Shopping campaigns for brands | A dedicated Shopping subtype with shared cost, not available in PMax |

Run Performance Max alongside a Search campaign, not instead of it, and apply a brand list so PMax does not absorb branded conversions a dedicated Search campaign would earn.

## Core process

1. Wire conversion tracking first, because both PMax and Shopping are goal-based and optimize toward the UET conversion signal. Confirm the UET tag fires and at least one conversion goal is recording. If it is not, stop and hand off to `microsoft-uet-and-conversions-api`. A PMax campaign with no signal spends without direction.
2. For retail, stand up the Microsoft Merchant Center store and feed before the campaign, because the campaign reads products from the store. Create the store, create a product catalog, and submit the feed through the Content API (RESTful, incremental, batchable, and compatible with the Google Content API) or FTP/SFTP. Associating a store to a PMax campaign turns it into a retail PMax that also carries a Shopping setting.
3. Set one clear conversion goal and its values, because a muddy goal (many loosely related actions) produces muddy optimization. Pick the primary action and value it correctly for value-based bidding.
4. Choose the bid strategy for the goal. In PMax the two supported strategies are Maximize Conversions (with an optional target CPA) and Maximize Conversion Value (with an optional target ROAS). Standalone Target CPA and Target ROAS strategies were retired in August 2025 and are silently folded into these two, carrying the target across. Do not set a tight target at launch; it starves delivery before the campaign learns.
5. Build asset groups around a theme, product line, or audience, because each asset group is a self-contained creative set Microsoft assembles ads from. Meet the minimums (3 to 15 headlines, 1 to 5 long headlines, 2 to 5 descriptions, at least 1 landscape and 1 square image) so the campaign can serve every placement. The exact per-field limits are in `references/asset-groups-and-search-themes.md`.
6. Add search themes to each asset group or campaign to tell Microsoft what your customers search for, which speeds ramp and improves search-inventory coverage. The limit doubled to 50 search themes per campaign in January 2026. Themes guide matching, they do not pin it.
7. Add audience signals per asset group (your first-party lists, in-market and custom segments, demographics) so the AI knows who is likely to convert. Signals are suggestions, not fences; PMax serves outside them when conversion likelihood is high.
8. For retail, set the listing scope from the feed so you control which products PMax pushes. In a feed-based Shopping campaign this is the product partition tree on the ad group; in retail PMax it is the store association plus optional product scope.
9. Set the boundary before launch: final URL expansion on or off, a brand list to protect branded queries, content and placement exclusions, and the auto-generated text/image opt-outs if you do not want dynamically generated assets. See Decision rules for when to turn each off.
10. Decide the new customer acquisition posture if the goal is a purchase goal. Choose bid-higher-for-new-customers to still serve returning buyers but pay a premium for new ones, or new-customers-only to serve new customers exclusively. This is in open beta as of January 2026 for purchase-goal advertisers.
11. Launch, then hold through the learning period. Avoid frequent edits to budget, goal, or bid strategy during ramp; every change resets calibration. Read results against the conversion goal, not placement-level CPMs, because PMax reporting is rolled up. Gate any budget increase or live-config change behind a human review.

## Decision rules and thresholds

### PMax vs Shopping

- Run retail PMax when you want maximum automated reach and are willing to give up product-group-level bid control. It extends the feed across every Microsoft placement and assembles creative for you.
- Run a feed-based Shopping campaign when you need the product partition tree, per-group bids, and manual or enhanced CPC. Shopping keeps the explicit control PMax abstracts away.
- Do not run both against the same catalog without a plan; a Shopping campaign priority (0, 1, or 2) and PMax will compete for the same products. Use the Shopping priority setting to sequence which campaign wins the auction for a given product, or separate them by product scope.

### Bid strategy (as of 2026)

- PMax supports exactly two automated strategies: Maximize Conversions and Maximize Conversion Value. Each accepts an optional target (target CPA on Maximize Conversions, target ROAS on Maximize Conversion Value).
- Standalone Target CPA and Target ROAS bid schemes stopped being settable in August 2025. An attempt to set them is silently converted to Maximize Conversions or Maximize Conversion Value with the target value preserved. Do not author new automation against the retired schemes.
- PMax does not support portfolio bid strategies or shared budgets; set a daily budget on the campaign directly.
- Feed-based Shopping defaults to enhanced CPC. Smart Shopping (the older automated Shopping subtype) supports only Maximize Conversions and Maximize Conversion Value.

### Final URL expansion

- Final URL expansion is on by default in retail PMax and targets your entire domain. Leave it on only when any page on your site is a fair paid destination.
- Turn it off (opt out) when specific pages must not receive paid traffic; opting out restricts targeting to the final URLs in your asset groups and feed. In the API this is the `FinalUrlExpansionOptOut` flag on the Performance Max setting.
- Add a page feed to steer expansion toward a curated set of URLs rather than the whole domain.

### Auto-generated assets

- Auto-generated text and image assets are on by default; Microsoft dynamically generates additional text and images to fill placements. Auto-generated text was enabled globally for new responsive search ads (excluding China and South Korea) with reported click-through-rate lift.
- Opt out (set the text or image opt-out) when brand or legal constraints forbid machine-written copy or synthetic imagery, and always opt out for sensitive verticals (financial services, health, insurance) unless you have explicitly reviewed the generated assets.

### New customer acquisition goal

- Available in open beta since January 15, 2026 for advertisers using purchase goals.
- Bid-higher mode still serves returning customers but pays a premium to win new ones; use it when you want growth without cutting off repeat buyers.
- New-customers-only mode serves new customers exclusively; use it for a pure acquisition push, and expect lower volume and a higher effective CPA.

### Learning period and change discipline

- Hold budget, goal, and bid strategy stable through ramp. Each edit resets calibration and wastes the window.
- Judge the campaign on the conversion goal and incremental conversions, not on a placement-by-placement breakdown, because PMax reporting is rolled up to the campaign and asset-group level by design.

## Reference material

- `references/asset-groups-and-search-themes.md`: the full asset-group field map (exact headline, long-headline, description, image, and logo counts and character limits), image sub-types and aspect ratios, business name and call-to-action rules, retail-store asset requirements, search theme limits and behavior, audience signals, and the Campaign Management API objects (`AssetGroup`, `AssetGroupSearchTheme`, `AddAssetGroups`). Read this when building or importing asset groups or hitting an editorial or asset-count error.
- `references/new-customer-acquisition-goal.md`: the January 2026 PMax product updates (new customer acquisition goal modes, share-of-voice metrics, asset-group-level URL and tracking parameters, the 50-search-theme limit, enhanced asset-group import), plus experiments and how to read transparency and share-of-voice reports. Read this when configuring the acquisition goal or reporting on impression share and experiments.
- `references/content-targeting-and-import.md`: the Content API feed workflow (RESTful catalog management, incremental and batch updates, availability and price refresh), feed submission methods (Content API vs FTP/SFTP vs UI), the Shopping campaign object model (`ShoppingSetting` priority/country/store, `ProductScope`, ad-group product partitions, `ProductAd`), Shopping campaigns for brands, content targeting placements (MSN, Outlook, Edge, Casual Games), and Google Import. Read this when wiring the feed, structuring Shopping product groups, or migrating from Google Ads.

## Templates and examples

- Retailer, catalog live in Merchant Center, wants full automation: retail PMax with the store associated, Maximize Conversion Value with target ROAS added after value history builds, one asset group per top product category with category-specific creative and audience signals, search themes for the top product queries, final URL expansion on with product and category pages as valid destinations, brand list applied so PMax does not poach branded Search conversions. Hold for the learning window before reading results.
- Retailer that wants product-group bid control: feed-based Shopping campaign, enhanced CPC, product partition tree split by top categories and best sellers, campaign priority set to sequence against any parallel Shopping campaign, product ads with merchant promotions for sale tags. Keep a Search campaign for brand terms.
- Lead-gen advertiser, no catalog, Search already running: PMax with no store, one lead conversion goal, Maximize Conversions (add a target CPA after roughly 30 conversions), one asset group per service line with first-party and past-converter lists as audience signals, search themes for the top service queries, auto-generated assets reviewed and opted out for the regulated service line. Brand list keeps PMax off branded terms.
- Pure acquisition push on a purchase goal: retail PMax with the new-customers-only acquisition mode, Maximize Conversion Value, and an accepted higher effective CPA in exchange for net-new buyers. Reconcile new-customer counts against the store's own order data.
- Migration from Google: run Google Import to bring the PMax and Shopping structure across, then re-verify the Merchant Center feed maps correctly, budgets and bid targets are sane on the Microsoft side, and conversion goals point at UET, before unpausing.

## Common pitfalls

- Launching without UET conversion tracking. PMax and Shopping optimize toward nothing and burn budget. Wire UET first (`microsoft-uet-and-conversions-api`).
- Authoring automation against Target CPA or Target ROAS bid schemes. Those were retired in August 2025 and are silently converted to Maximize Conversions or Maximize Conversion Value, so scripts that assert the old scheme name break. Read and set the current two strategies with their target fields.
- Setting a tight target at launch. A target CPA or target ROAS below what the auction clears at starves delivery before the campaign learns. Launch on Maximize Conversions or Value, then add a target once volume exists.
- Letting PMax cannibalize brand and Search. Without a brand list, PMax serves on branded queries and claims conversions a dedicated Search campaign would have earned. Apply a brand list and keep Search separate.
- Missing the asset-group minimums. Too few headlines or images, or missing the required landscape and square image, blocks approval or limits placements. Meet 3 to 15 headlines, 1 to 5 long headlines, 2 to 5 descriptions, and at least one landscape and one square image.
- Leaving final URL expansion on with pages that should not get traffic. It targets the whole domain and can route users to unintended pages. Opt out or add a page feed.
- Shipping auto-generated assets in a regulated vertical. Machine-written copy in financial services, health, or insurance can create compliance exposure. Opt out of auto-generated text and images and review before serving.
- Retail PMax and a Shopping campaign fighting over the same products. Without a Shopping priority or product-scope split, they compete in the same auction. Sequence them with the priority setting or separate by product scope.
- Judging PMax on placement-level CPMs. Reporting is rolled up; there is no full placement-by-placement performance table. Judge on the conversion goal and use share-of-voice and content-targeting reports for coverage.
- Google Import trust without re-verification. Import carries structure but not a guarantee that the feed, budgets, and goals are correct on the Microsoft side. Re-verify before unpausing.

## Sources

- [Performance Max updates and other product news for January 2026, Microsoft Advertising](https://about.ads.microsoft.com/en/blog/post/january-2026/performance-max-updates-and-other-product-news-for-january-2026) (as of July 2026)
- [Bing Ads API Overview, Microsoft Advertising API](https://learn.microsoft.com/en-us/advertising/guides/?view=bingads-13) (as of July 2026)
- [Product Ads, Microsoft Advertising API](https://learn.microsoft.com/en-us/advertising/guides/product-ads?view=bingads-13) (as of July 2026)
- [Campaign Data Object (CampaignType, bid strategies, PerformanceMaxSetting), Campaign Management](https://learn.microsoft.com/en-us/advertising/campaign-management-service/campaign?view=bingads-13) (as of July 2026)
- [PerformanceMaxSetting Data Object, Campaign Management](https://learn.microsoft.com/en-us/advertising/campaign-management-service/performancemaxsetting?view=bingads-13) (as of July 2026)
- [AssetGroup Data Object, Campaign Management](https://learn.microsoft.com/en-us/advertising/campaign-management-service/assetgroup?view=bingads-13) (as of July 2026)
- [Content API Overview, Microsoft Advertising API](https://learn.microsoft.com/en-us/advertising/shopping-content/) (as of July 2026)
