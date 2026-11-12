---
name: cross-platform-conversion-reconciliation
description: Deduplicate and reconcile conversion counts across GA4, CM360 Floodlight, and each DSP or platform, then roll up to one blended CPA and ROAS that ties to the billed number. Use when the user says "the conversion numbers do not match", "GA4 vs CM360 vs the DSP disagree", "why does DV360 report more conversions than GA4", "double counting across platforms", "which conversion number is right", "blended CPA", "blended ROAS", "dedupe conversions", "source of truth for conversions", "reconcile conversions to the invoice", or "one number for the whole account".
---

# Cross-platform conversion reconciliation

Every platform counts the same purchase differently, and each one is right by its own rules. GA4 attributes a key event with data-driven, cross-channel logic. CM360 Floodlight counts against its own counting method and lookback windows. DV360, Google Ads, Amazon DSP, The Trade Desk (Kokai), and Meta each claim credit under their own attribution model and post-view windows. Add them up and you have counted the same sale four times. This skill picks one number to trust for each decision, defines the join key and the dedup rule that collapse the duplicates, sets a tolerance band per platform pair, and rolls the survivors up to a single blended CPA and ROAS that a finance stakeholder can tie to the invoice.

This skill assumes you know CPA, ROAS, view-through versus click-through, and attribution windows. For those definitions and the KPI math, see the `programmatic-foundations` skill. This is the layer that decides which conversion number wins and how to combine the platforms, not how any single platform counts.

## When to use this skill

- "GA4, Campaign Manager, and the DSP all show a different conversion count, which one is right?"
- "DV360 reports 1,400 conversions, GA4 shows 900 for the same campaign, why?"
- "We are double counting the same purchase across DV360 and Google Ads."
- "Build me a blended CPA / blended ROAS across all channels."
- "What is the source of truth for conversions when I report to the client?"
- "Reconcile platform-reported conversions to the number we actually bill on."
- "Set up a dedup key so a purchase counts once across platforms."
- "What variance between two platforms is normal versus a tracking break?"

Boundaries with sibling skills:

- Impression discrepancies (ad server versus DSP delivered counts), make-goods, credits, and month-end delivery close: `discrepancy-and-reconciliation`. That skill ties delivered impressions to billed; this one ties conversions to a blended KPI.
- The general data-quality gate, anomaly detection that accounts for weekday and seasonality, and the acceptable-variance method: `data-quality-and-reconciliation`. Use it to decide whether a gap is a real change or a tracking break; use this skill to decide which number bills once the gap is understood.
- Whether the conversions were incremental at all (holdout, geo lift, ghost ads): `incrementality-and-experimentation`. Reconciliation makes the counts agree; incrementality asks whether they would have happened anyway.
- How Floodlight counts (counter versus sales, counting methods, windows): `cm360-floodlight-and-conversions`. How GA4 marks key events and exports them to Google Ads: `ga4-events-and-key-events` and `ga4-conversions-and-audiences`.
- Wiring the GMP spine so GA4, Floodlight, DV360, and SA360 share one attribution model up front: `gmp-integration-floodlight-ga4-linking`. Do that first when you can; it removes most of the gap this skill otherwise has to reconcile after the fact.

## Quick reference

Pick the source of truth from the decision you are making, not from which number is biggest.

| Decision | Trust this system | Why |
| --- | --- | --- |
| Bidding and in-platform optimization | The buying platform's own conversions (DV360, Google Ads, Amazon DSP, TTD) | The algorithm optimizes to the number it can see; feeding it GA4 would break the loop |
| One cross-channel truth for the client dashboard | GA4 key events, or a shared Floodlight if GMP is linked | One de-duplicated, cross-channel model instead of each platform's self-credit |
| Billing, invoice, and revenue reconciliation | The advertiser's own system of record (order database, payment processor, CRM) | The only ledger that is not an attribution estimate; every ad platform is a claim, not a receipt |
| Delivered impressions and make-goods | The third-party ad server (CM360) | Counting server, not the buying platform (that is `discrepancy-and-reconciliation`) |

Two numbers for the same sale almost never match. The job is not to force them equal. The job is to name which one governs each decision and to prove the rest fall inside an expected band.

## Core process

1. Freeze the scope and the window, because a gap is meaningless until both sides cover the same thing. Pin one campaign or account, one date range, one conversion definition (which Floodlight activity, which GA4 key event, which platform conversion action), and one attribution setting. A 40 percent gap usually shrinks to single digits once you align a 30-day post-view window on one side to a 7-day click window on the other.
2. Pull each platform's conversion count for that exact scope into one table. Do not eyeball the UI numbers side by side; export them so the join is reproducible. For GA4 at event grain, use the BigQuery export (daily `events_YYYYMMDD` tables) so the number is unsampled and joinable. See `references/dedup-and-join-key-strategy.md` for the join.
3. Normalize the attribution basis before comparing, because most of the gap is model, not error. Convert each platform to a comparable basis: last-click, same lookback, click-through only versus click-plus-view. GA4 defaults to data-driven, cross-channel; DV360 and Floodlight report their own view-through. Restate them onto one basis (see `references/tolerance-bands-by-pair.md` for what to expect at each restatement).
4. Choose the join key and dedup rule, because that is what collapses the same sale counted many times. Prefer a deterministic transaction or order ID that every system carries. Fall back to (user identifier + timestamp bucket) only when no order ID exists. The full key hierarchy and the SQL are in `references/dedup-and-join-key-strategy.md`.
5. Apply the source-of-truth hierarchy from `references/source-of-truth-hierarchy.md`. Assign one governing system per decision (bidding, cross-channel reporting, billing). Do not average two attribution estimates into a third fake number.
6. Measure each pairwise gap against its tolerance band. If the pair is inside the band, note it as expected model difference and move on. If it is outside, open the root-cause path (window mismatch, missing consent, tag not firing, identity loss) before you touch a number. Bands per pair are in `references/tolerance-bands-by-pair.md`.
7. Roll up to the blended KPI. Sum spend across every channel (including channels the ad platforms do not see, such as organic and email if the client wants a true blend), divide the de-duplicated conversion or revenue total by the right denominator, and tie the result to the advertiser's system of record. The rollup math and the tie-out are in `references/blended-kpi-rollup.md`.
8. Recommend, do not overwrite. Reconciliation reads and reports. Never change a live conversion action, attribution setting, or bid strategy to make two numbers agree without a human gate; that alters what the buying algorithm optimizes to.

## Decision rules and thresholds

### Which number governs

- Optimize the buying platform on its own conversion signal. DV360 bids to DV360 conversions, Google Ads to its conversion actions, Amazon DSP to its pixel, The Trade Desk to its tracking tags. Swapping in GA4's cross-channel number starves the algorithm of the signal it learns from.
- Report cross-channel truth on one de-duplicated model. GA4 key events give a single cross-channel view natively; a shared Floodlight gives it across GMP if the account is linked. Pick one and use it for the top-line client number so display and search do not both claim the same conversion.
- Reconcile revenue to the advertiser's ledger. The order database or payment processor is the only non-estimate. When ad-platform revenue exceeds the ledger, the ad platforms are over-claiming (view-through, cross-device, double counting); the ledger wins for a revenue number.

### Expected direction of the gap

- A DSP or ad platform almost always reports more conversions than GA4 for the same campaign, because it counts view-through and its own last-touch within its window while GA4 distributes cross-channel credit and drops most view-through. If GA4 is higher than the DSP, suspect a tag or identity problem, not attribution.
- CM360 Floodlight sits between them: it de-duplicates across the channels it serves under one model but still counts view-through the buying platforms claim.
- Sum-of-platforms always overstates the truth. If DV360 + Google Ads + Meta conversions exceed the GA4 or ledger total, that is the double count this skill exists to remove, not four independent wins.

### Tolerance bands (starting points, tighten per account)

- GA4 versus the advertiser's server-side ledger for the same purchase key event: aim within roughly 5 percent after consent and tagging are healthy. Beyond that, suspect a firing or consent gap.
- CM360 Floodlight versus GA4 for the same action on a comparable basis: 10 to 20 percent is common and mostly model, not error.
- Any single DSP versus GA4: expect the DSP higher, often 20 to 50 percent higher on view-through-inclusive counts. This is a model difference, not a break, until it moves outside the account's own baseline.
- Full per-pair table with causes and the restatement that should close each gap: `references/tolerance-bands-by-pair.md`.

### When a gap is a break, not a model difference

Treat the gap as a defect (not expected model variance) when: GA4 is higher than the buying platform; a pair that was stable jumps outside its own trailing band; a platform drops to near zero after a site or consent change; or the gap widens right after a tag, container, or consent-mode change. Route the "real change versus tracking break" call to `data-quality-and-reconciliation`, then come back here to decide which number bills.

### Consent gating changes the denominator (2026)

Consent Mode v2 requires four signals: `ad_storage`, `analytics_storage`, `ad_user_data`, and `ad_personalization`. A June 2026 change gates ads-data flow on consent, so unconsented traffic no longer sends ads-data and its conversions arrive only through modeling, not observed hits. That means the same campaign can show a lower observed count and a higher modeled count than the prior period with no change in real sales. When you reconcile across a consent change, compare observed-plus-modeled to observed-plus-modeled, never observed-only to a pre-change number. See `gtm-consent-mode-v2` for the signal setup and modeling thresholds.

## Reference material

- `references/dedup-and-join-key-strategy.md`: the join-key hierarchy (order ID first, then user identifier plus time bucket), the exact dedup SQL against the GA4 BigQuery export, and how to build the cross-platform conversion table. Read this when you need to actually collapse duplicate conversions across systems.
- `references/source-of-truth-hierarchy.md`: which system governs each decision (bidding, cross-channel reporting, billing), the ranked identity and attribution precedence, and the rule against averaging two estimates. Read this when platforms disagree and you must pick one number.
- `references/blended-kpi-rollup.md`: the spend and conversion rollup math, how to tie blended revenue to the advertiser's ledger, and the reporting shape that survives a finance review. Read this when building the blended CPA or ROAS number for a client or executive.
- `references/tolerance-bands-by-pair.md`: the expected variance band for each platform pair, the direction and cause of each gap, and the restatement that should close it. Read this when you have two numbers and need to know whether the difference is normal.

## Templates and examples

Worked example, one purchase across a GMP-plus-Meta stack, March 2026 flight:

- Scope frozen: campaign "SS26-Prospecting", March 1 to 31, purchase conversion, one order per transaction.
- Raw platform-reported purchases: DV360 1,412; Google Ads 980; Meta 640; CM360 Floodlight (sales, transactions) 1,510; GA4 purchase key event 1,040; advertiser Shopify order ledger 1,005.
- Naive sum of the three DSP or platform numbers is 3,032, which triple counts. The ledger says 1,005 real orders happened.
- After joining on `transaction_id` across GA4 BigQuery, the Floodlight ord/transaction value, and the Shopify order export, de-duplicated purchases resolve to 1,005 (ledger truth), with GA4 at 1,040 (within about 3.5 percent, expected).
- Governing numbers: bid DV360 to its 1,412 (its own signal), report the client 1,005 blended conversions tied to the ledger, and show each platform's self-credited number in a footnote so nobody re-adds them.
- Blended CPA: total media spend across DV360 + Google Ads + Meta of 48,200 USD divided by 1,005 de-duplicated orders equals 47.96 USD blended CPA. Blended ROAS uses ledger revenue, not summed platform revenue.

Reconciliation table shape to hand a client (values filled, not placeholders):

| Platform | Reported purchases | Basis | After restatement to last-click | vs ledger |
| --- | --- | --- | --- | --- |
| Shopify ledger | 1,005 | Actual orders | 1,005 | source of truth |
| GA4 (key event) | 1,040 | Data-driven, cross-channel | 1,012 | +0.7% |
| CM360 Floodlight | 1,510 | Sales, view+click, 30d view | 1,190 | +18% (model) |
| DV360 | 1,412 | Own, view+click | n/a (bidding signal) | not summed |
| Google Ads | 980 | Own conversion action | n/a (bidding signal) | not summed |
| Meta | 640 | Own, 7d click 1d view | n/a (bidding signal) | not summed |

## Common pitfalls

- Summing platform-reported conversions. The single most common error. DV360 + Google Ads + Meta counts the same buyer up to three times. Report the de-duplicated or ledger number as the total and keep the self-credited numbers in a footnote.
- Comparing different windows and calling the gap a bug. A 30-day post-view count against a 7-day click count will diverge by design. Align the window first (process step 1) before you diagnose anything.
- Forcing the numbers equal by changing a live setting. Editing a conversion action or attribution window to make two dashboards match rewrites what the buying algorithm optimizes to and resets its learning. Reconcile in the report, not in the live config, and human-gate any change.
- Trusting GA4 as the bidding signal. GA4's cross-channel number is right for the client dashboard and wrong as the DSP's optimization input. Keep the buying platform on its own conversions.
- Ignoring identity loss. Cross-device and cross-domain journeys, `user_pseudo_id` resets, and Safari or Firefox cookie limits inflate the apparent gap because the same person looks like several. Note it as an identity cause, not an attribution one.
- Reconciling across a consent-mode change without accounting for modeling. After the June 2026 ads-data gating, observed counts drop and modeled counts rise. Compare observed-plus-modeled on both sides or the period-over-period read is meaningless.
- Blending spend the ad platforms cannot see incorrectly. If the client wants a true blended CPA including organic and email, include that spend and those conversions consistently, or state clearly that the blend is paid-media only.

## Sources

- [How Floodlight tracks conversions (Campaign Manager 360)](https://support.google.com/campaignmanager/answer/3027419?hl=en) (as of July 2026)
- [Floodlight counting methods (Campaign Manager 360)](https://support.google.com/campaignmanager/answer/2823400?hl=en) (as of July 2026)
- [Floodlight conversion windows and attribution (Campaign Manager 360)](https://support.google.com/campaignmanager/answer/2823351?hl=en) (as of July 2026)
- [Attribution and attribution models in GA4](https://support.google.com/analytics/answer/10596866?hl=en) (as of July 2026)
- [GA4 BigQuery Export schema and daily vs streaming tables](https://support.google.com/analytics/answer/9358801?hl=en) (as of July 2026)
- [Consent Mode and consent settings in GA4](https://support.google.com/analytics/answer/9976101?hl=en) (as of July 2026)
