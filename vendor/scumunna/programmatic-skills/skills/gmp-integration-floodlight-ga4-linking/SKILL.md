---
name: gmp-integration-floodlight-ga4-linking
description: Wire the Google Marketing Platform measurement spine so GA4, Campaign Manager 360 Floodlight, Display & Video 360, and Search Ads 360 count the same conversion once under one attribution model. Use when the user asks how to link GA4 to CM360 or DV360, share Floodlight across GMP, export GA4 key events and audiences to DV360/SA360/Ad Manager, whether Google signals is required, how the GA4-to-Ads conversion import works, why the same conversion counts differently in GA4 and Floodlight, or how the June 2026 consent change affects GMP linking.
---

# GMP integration: Floodlight and GA4 linking

Connect the four Google Marketing Platform surfaces so one conversion is defined once and read the same way everywhere: GA4 for on-site behavior and key events, Campaign Manager 360 Floodlight for the cross-channel conversion of record, DV360 and SA360 for buying and bidding against that same Floodlight. The goal is one attribution model and one deduplicated count across the spine, not four numbers that disagree.

This skill is the wiring, not the object setup. It assumes you already know CPA, ROAS, click-through vs view-through, and lookback windows (see `programmatic-foundations`). Build the Floodlight activities themselves in `cm360-floodlight-and-conversions`. Design GA4 key events in `ga4-events-and-key-events`. Build and export GA4 audiences in `ga4-conversions-and-audiences`. When the linked numbers still disagree after wiring, hand off to `cross-platform-conversion-reconciliation`.

## When to use this skill

- "Link GA4 to Campaign Manager 360 / DV360 / Search Ads 360."
- "Share Floodlight across GMP so DV360 and SA360 bid on the same conversion."
- "Export GA4 key events and audiences to DV360 / SA360 / Ad Manager."
- "Do I need Google signals for this to work?" / "Why is a GA4 audience empty in DV360?"
- "Import GA4 key events into Google Ads as conversions."
- "Why does the same purchase count differently in GA4 and Floodlight?"
- "How does the June 2026 consent change affect our GMP links?"
- "Keep one attribution model across GA4, CM360, DV360, and SA360."

Boundaries with sibling skills:
- Creating Floodlight activities, counting methods, windows, offline uploads: `cm360-floodlight-and-conversions`.
- Trafficking placements, ad tags, and click macros that fire Floodlight: `cm360-trafficking-and-ad-tags`.
- Designing the GA4 event model and marking key events: `ga4-events-and-key-events`.
- Building GA4 audiences (rules, predictive) and their exclusions: `ga4-conversions-and-audiences`.
- Consent Mode v2 signals on the page that gate tag firing: `gtm-consent-mode-v2`.
- Deduping the numbers once they are linked and rolling up blended CPA/ROAS: `cross-platform-conversion-reconciliation`.

## Quick reference

| You want to | Wire this link | Direction | Why |
| --- | --- | --- | --- |
| One cross-channel conversion of record for DV360 and SA360 bidding | Floodlight shared across GMP (CM360 config) | CM360 to DV360/SA360 | Floodlight dedupes one conversion across display, search, and video |
| GA4 behavior visible next to CM360 media | GA4 to CM360 product link (Analytics admin) | GA4 to CM360 | Brings GA4 dimensions into CM360 reporting for the same users |
| GA4 audiences targetable in DV360 | GA4 to DV360 product link plus audience export | GA4 to DV360 | Analytics audiences publish to the linked DV360 advertiser |
| GA4 audiences for cross-channel remarketing in SA360 | GA4 to SA360 product link plus audience export | GA4 to SA360 | Reengage users who clicked search, social, or display |
| GA4 key events counted in Google Ads for bidding | GA4 to Google Ads link plus import key events as conversions | GA4 to Google Ads | Google Ads bids on the imported key events |
| GA4 audiences to publisher line items | GA4 to Ad Manager link | GA4 to Ad Manager | Target high-value GA4 segments on owned inventory |

Two families of link, keep them straight:

- Conversion spine: Floodlight is the shared conversion of record for CM360, DV360, and SA360. One Floodlight activity, one dedup, one attribution model. GA4 key events are a separate measurement system that you import into Google Ads, they are not Floodlight.
- Audience spine: GA4 audiences publish out to DV360, SA360, Ad Manager, and Google Ads over product links, gated on Google signals and consent.

## Core process

1. Decide the conversion of record before linking anything. For a GMP buy that spans display, video, and search, Floodlight is the shared conversion so DV360 and SA360 dedupe against the same event. GA4 key events feed Google Ads and analysis, not Floodlight bidding. Mixing the two systems as if they were one is the most common wiring error.
2. Set the CM360 Floodlight configuration once, then confirm it is shared to the DV360 partner/advertiser and the SA360 accounts that need it. Floodlight activities are shared across GMP, which is what lets the three products dedupe one conversion instead of triple-counting it. Build the activities in `cm360-floodlight-and-conversions`.
3. Pin one attribution model at the CM360/Floodlight level and read it everywhere. The model that credits the conversion lives with Floodlight and flows to DV360 and SA360 reporting, so setting different models per product guarantees numbers that never reconcile. Change the model deliberately and annotate the date, because it rewrites reported history.
4. Link GA4 to the GMP products you need in the Analytics admin product-links section: CM360 for reporting overlap, DV360 and SA360 for audience export, Google Ads for conversion import, Ad Manager for owned inventory. Each link is a separate authorization and a separate admin permission on both sides.
5. Turn on Google signals in GA4 if you need cross-device audiences and demographics to export. Analytics audiences that contain demographics or interests data are not exported to DV360, and cross-device membership depends on signals, so audiences will look thin or empty in the DSP without it.
6. Export the audiences and import the key events. Publish GA4 audiences to the linked DV360/SA360/Ad Manager destination, and in the GA4 to Google Ads link import the key events you want Google Ads to bid on as conversions. Audiences and key events are different exports over the same links.
7. Verify consent is wired for the June 2026 change. From June 15, 2026, GA4 uses Consent Mode (in Google Ads) as the single control for Google Ads cookies and IDs; the old Google signals toggle no longer governs that collection. If Consent Mode is not sending `ad_storage` and `ad_user_data`, ads-data flow (audiences and personalized measurement) is cut off regardless of the link. See `gtm-consent-mode-v2` for the signals.
8. Reconcile before anyone trusts a number. Even correctly linked, GA4 and Floodlight count different events with different identities and windows, so they will not match to the unit. Hand the deltas to `cross-platform-conversion-reconciliation` and set tolerance bands rather than chasing an exact tie.

Safe-by-default: read the current links, Floodlight sharing, and attribution model first, and pull a report. Creating or removing a product link, changing the shared Floodlight config, or switching the attribution model changes billed and optimization numbers across three products at once. Treat every one of those as human-gated, and never remove a link to "test" it on a live account.

## Decision rules and thresholds

### Floodlight vs GA4 key events, which is the conversion of record

- Cross-channel GMP buy (DV360 display/video plus SA360 search) that must dedupe one conversion: Floodlight is the conversion of record. DV360 and SA360 bid and report against the shared Floodlight activity. GA4 sits alongside for behavior, funnels, and audiences.
- Google Ads campaigns bidding on site actions: import GA4 key events into Google Ads as conversions, or use Google Ads conversion tracking. This is a separate count from Floodlight and should not be summed with it.
- Never add a GA4 key-event count and a Floodlight count into one "conversions" total. They are two measurement systems observing overlapping events with different identity and windows. Present them side by side, reconcile, do not add.

### When Google signals is required

- You need cross-device audiences, or audiences carrying demographics/interests, exported to DV360 or Ad Manager: Google signals must be on, because those audiences depend on signed-in cross-device data and Analytics does not export demographics/interests to DV360 without it.
- You only need rule-based, on-device audiences and event exports: signals is not strictly required for the link to function, but membership and reach are smaller.
- After June 15, 2026, do not treat the Google signals toggle as the consent control for Google Ads collection. Consent Mode in Google Ads is the single control from that date; signals governs enriched cross-device reporting, not whether ads cookies/IDs are collected.

### Attribution model, one across the spine

- Set one model at the Floodlight/CM360 level and let DV360 and SA360 read it. Per-product models produce structurally different credit and cannot be reconciled.
- GA4 reporting uses its own attribution and its own key events, so GA4 and Floodlight credit will differ by design. Align the window and model where the products allow, then reconcile the residual rather than forcing a match.
- Changing the model or window is retroactive: it rewrites reported history for the affected product and breaks period-over-period trends. Change on a boundary, annotate the date, tell the reconciliation owner.

### Consent gating (June 2026)

- From June 15, 2026, GA4 transitions to using Consent Mode (within Google Ads) as the single control for Google Ads cookie/ID collection. The Google signals setting stops controlling that collection.
- Consent Mode v2 must send `ad_storage`, `analytics_storage`, `ad_user_data`, and `ad_personalization`. Missing `ad_storage`/`ad_user_data` cuts ads-data flow: audience export and personalized measurement stop, even on a healthy link.
- Ads personalization control moves to the Consent Mode `ad_personalization` setting later in 2026. Wire all four signals now so nothing breaks on a date you did not schedule. Implementation lives in `gtm-consent-mode-v2`.

## Reference material

- `references/ga4-to-floodlight-export.md`: the full link matrix (GA4 to CM360, DV360, SA360, Google Ads, Ad Manager), which admin permission each side needs, what actually crosses each link (audiences vs key events vs reporting dimensions), the audience-export exclusions (no demographics/interests to DV360), and the GA4 key-event to Google Ads conversion-import flow with field mapping. Read this when setting up or auditing a specific link.
- `references/shared-floodlight-spine.md`: how one Floodlight configuration is shared across CM360, DV360, and SA360, how the shared activity dedupes one conversion across channels, where the attribution model and window live, how the `All Conversions` vs `Conversions` (bidding) column split works, and a decision table for which product owns which setting. Read this when deciding the conversion of record or debugging why three products disagree.
- `references/google-signals-requirement.md`: what Google signals adds (cross-device, demographics/interests), exactly which exports require it, the reporting-identity interaction, the 26-month signed-in data expiry, and the June 15 2026 transition that moves Google Ads collection control to Consent Mode. Read this when an audience is empty in the DSP or you are deciding whether to enable signals.

## Templates and examples

Cross-channel brand buy, DV360 video plus SA360 search, one CPA target:
- Floodlight Sales activity `purchase` in the shared CM360 configuration (id `DC-1234567`), shared to the DV360 partner and the SA360 advertiser. One attribution model (for example data-driven) pinned at Floodlight. DV360 and SA360 both bid the `Conversions` column driven by that activity. GA4 links to CM360 for behavior overlap only, its `purchase` key event feeds analysis and Google Ads, not the DV360 bid. Reconcile GA4 vs Floodlight weekly, expect a standing delta.

GA4 remarketing audience to DV360:
- Google signals on. GA4 audience `cart_abandoners_7d` (rule-based, no demographics). GA4 to DV360 product link authorized by an admin on both sides. Publish the audience to the linked DV360 advertiser; it appears as an addressable audience for line items. If it exports empty, check signals, consent (`ad_storage`/`ad_user_data` granted), and that the audience is not demographics/interests based.

GA4 key events into Google Ads for bidding:
- GA4 to Google Ads link active. In the link, import key events `purchase` and `generate_lead` as Google Ads conversions. Google Ads Smart Bidding then optimizes to those imported key events. This count is separate from Floodlight; do not sum them in a blended report.

June 2026 consent readiness check:
- Consent Mode v2 firing all four signals on every page and confirmed in the tag preview. `ad_storage` and `ad_user_data` set from the CMP before any Google tag loads. GA4 audience export and Google Ads collection verified still flowing after June 15 2026. If audiences went quiet around that date, consent, not the link, is almost always the cause.

## Common pitfalls

- Summing GA4 key events and Floodlight into one total. Two systems, two identities, two windows. They overlap but are not additive. Present side by side, reconcile, never add.
- Different attribution models per product. DV360 on one model, SA360 on another, GA4 on a third guarantees numbers that cannot reconcile. Pin one model at Floodlight and read it everywhere.
- Expecting GA4 and Floodlight to match exactly. They count different events with different identity resolution and windows, so a residual delta is normal. Set tolerance bands in `cross-platform-conversion-reconciliation`, do not chase a tie.
- Audience empty in DV360 because signals is off or it carries demographics. Analytics does not export demographics/interests audiences to DV360, and cross-device membership needs Google signals. Check both before assuming the link is broken.
- Treating the Google signals toggle as the consent control after June 15 2026. From that date Consent Mode in Google Ads is the single control for Google Ads collection. Wire `ad_storage`, `analytics_storage`, `ad_user_data`, `ad_personalization` in Consent Mode v2 or ads-data flow stops.
- Removing a live product link to "test" it. Links carry authorizations and history; dropping one on a live account interrupts export and reporting for real campaigns. Read and stage, never yank.
- Changing the shared Floodlight config or model mid-flight. One edit rewrites credit across CM360, DV360, and SA360 at once and retroactively rewrites history. Change on a boundary, annotate, notify the reconciliation owner.
- Assuming the link alone moves data. A link is authorization; you still export the audience or import the key events explicitly, and consent still has to be granted for anything ads-related to flow.

## Sources

- [About Floodlight and Floodlight activities (CM360)](https://support.google.com/campaignmanager/answer/3027419?hl=en) (as of July 2026)
- [About Floodlight activities and counting (CM360)](https://support.google.com/campaignmanager/answer/2823400?hl=en) (as of July 2026)
- [Share audiences with your linked advertising products (GA4)](https://support.google.com/analytics/answer/12800258?hl=en) (as of July 2026)
- [Updates to Google Analytics data controls (GA4, June 2026 consent change)](https://support.google.com/analytics/answer/17016975?hl=en) (as of July 2026)
- [Activate Google signals for Google Analytics properties](https://support.google.com/analytics/answer/9445345?hl=en) (as of July 2026)
- [Reporting conversions (Search Ads 360, Floodlight in SA360)](https://support.google.com/sa360/answer/9157988?hl=en) (as of July 2026)
- [Coming soon: Campaign Manager 360 updates in Q2 2026](https://support.google.com/campaignmanager/answer/17108857?hl=en) (as of July 2026)
- [CM360 API deprecation schedule](https://developers.google.com/doubleclick-advertisers/deprecation) (as of July 2026)
