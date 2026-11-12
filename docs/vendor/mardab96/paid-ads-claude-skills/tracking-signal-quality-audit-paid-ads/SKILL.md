---
name: tracking-signal-quality-audit-paid-ads
description: Audits paid ads tracking and signal quality across Google Ads, Meta Ads, GA4, GTM, Pixel, Conversions API, offline conversions, CRM stages, and native platform integrations. Use before scaling, after tracking changes, or when reported results look suspicious.
---

# Tracking and Signal Quality Audit - Paid Ads

When you need the shared quality bar, use `../references/paid-ads-output-standard.md` and `../references/paid-ads-principles.md` if they are available.

## Use this skill when

The user needs to know whether ad platforms are receiving the right conversion signal.

## Required input

Ask for any available source:

- Google Ads conversion actions.
- Meta Events Manager diagnostics.
- GA4 key events.
- GTM notes or container export.
- Pixel and CAPI status.
- CRM or offline conversion imports.
- Shopify, WooCommerce, HubSpot, CallRail, or other native integration notes.
- Auto-tagging, GCLID, GBRAID, WBRAID, UTM, redirect, or tracking template notes.
- Consent mode, enhanced conversions, server-side tagging, or custom domain notes.
- Business conversion hierarchy.

## Analysis workflow

1. Map the business conversion ladder.
2. Map each platform event and source.
3. Check primary optimization event fit.
4. Check duplication risk across tags, imports, server events, and native apps.
5. Check missing deeper outcomes such as qualified lead, purchase value, call quality, or closed won.
6. Check whether click IDs and UTMs survive redirects, templates, cookie banners, and landing page changes.
7. Check data delays and attribution differences before calling a platform mismatch an error.
8. If server-side tagging is used, check ownership, custom domain, consent handling, and redundancy.
9. Decide if the account is ready for bidding or budget changes.

## Decision rules

Every threshold below is a starting heuristic, not a platform rule. Recalibrate against the account's own history, and say which threshold you adjusted and why.

Verdict criteria:

| Verdict | Criteria |
|---|---|
| Ready | Primary optimization event matches the business result, deduplication verified (not just configured), event volume fits the selected bid strategy (for example, ~30 conversions/30d for Google tCPA/tROAS; Google Max Conversions/Max Value without a target may operate below that but is volatile; ~50 events/week for a Meta ad set [platform guidance]), and click IDs survive the redirect chain |
| Needs review | One source only where two are expected, dedup configured but unverified, GA4-vs-platform divergence outside the expected band, or optimization event shallower than the business result |
| High risk | Duplication confirmed or strongly suspected at material volume, click IDs stripped, conversions imported twice, or the optimized event does not represent value |

- Expected divergence: GA4 and platform counts should NOT match; a gap up to roughly 20-40% is normal (attribution model, window, consent) [heuristic]. Direction matters: platform far above GA4 suggests duplication or view-through; platform far below suggests lost click IDs or consent gating.
- Dedup verification: same event_id on browser and server copies, deduplicated count visible in the platform, transaction-ID spot check across a defined window for purchases.
- Post-fix proof: a dedup or import fix is proven by a before/after count comparison with the lag window excluded, not by configuration screenshots.

## Output format

Owner-decision labels in output tables use the shared enum from `../references/paid-ads-output-standard.md`: `do_now / test / investigate / monitor / ignore / approval_needed`. Evidence labels use `export / screenshot / url / notes / hypothesis / needs_data`.

### Signal verdict

Ready / needs review / high risk.

### Event map

| Event | Source | Platform | Business value | Used for optimization | Issue |
|---|---|---|---|---|---|

### Issues

| Priority | Issue | Evidence | Why it matters | Owner |
|---|---|---|---|---|

### Missing data

Name the exact exports or fields that would change the diagnosis, and which finding each one would firm up.

### Approval gates

List what needs a human yes before anything moves: budget changes, pauses, negative lists, tracking edits, page changes. Nothing in this output is an instruction to execute.

## Practical example

Illustrative made-up case, not a real account.

Input: Google Ads shows 240 conversions in 30 days; GA4 shows 150 for the same action. Both a website tag and a CRM offline import are marked primary. Meta not in scope this run.

Event map row: `Lead | website tag | Google Ads | primary | yes | duplication risk with CRM import`.

Reading: platform 60% above GA4 is outside the normal 20-40% band AND the direction (platform far above) matches duplication, not attribution. Two primary sources for the same action is the likely cause.

| Priority | Issue | Evidence | Why it matters | Owner |
|---|---|---|---|---|
| 1 | Same lead counted by tag and import, both primary | conversion actions export | Smart Bidding learns from ~2x real volume; CPA reads better than reality | tracking owner |

Verdict: high risk. Post-fix proof defined up front: set import to secondary or dedupe on GCLID + transaction ID, then compare a 14-day window before/after with the lag window excluded; expect reported conversions to drop toward the GA4-adjusted band. Not a screenshot check.

## Guardrails

- Do not claim tracking is broken without evidence.
- Do not assume GA4, Google Ads, and Meta should match exactly.
- Do not recommend scaling if the optimization event is weak or duplicated.
