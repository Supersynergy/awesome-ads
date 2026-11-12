---
name: conversion-tracking-audit-google-ads
description: Reviews Google Ads conversion setup using data from Google Ads, GA4, and Google Tag Manager to identify duplicate conversions, missing primary actions, inconsistent naming, wrong attribution windows, poor event taxonomy, and tracking issues that can distort bidding or reporting. Use before performance audits, before Smart Bidding changes, after website or GTM changes, or when reported conversions differ between platforms.
---

# Conversion Tracking Audit — Google Ads

This skill audits Google Ads conversion accuracy. It pulls supporting data from GA4 and Google Tag Manager when available, since most Google Ads tracking issues originate in those upstream systems (duplicate imports, misconfigured tags, attribution mismatches).

## Use this skill when

The user wants to verify whether Google Ads conversion tracking is accurate and ready for optimization.

Common user requests:

- "Audit our conversion tracking."
- "GA4 and Google Ads numbers do not match."
- "Check if conversions are duplicated."
- "Are our primary conversions set correctly?"
- "Before switching bidding strategy, check tracking."

## Required input

Ask for any available source. Do not require all sources if the user only has exports or screenshots.

Recommended inputs:

- Google Ads conversion actions export.
- Google Ads campaign report showing primary conversion actions.
- GA4 key events / conversions list.
- GA4 event report.
- GTM container export, if available.
- Tag Assistant screenshots or diagnostics.
- Website funnel map.
- CRM or backend conversion definitions.
- Consent mode setup notes, if applicable.

Required fields where available:

- conversion action name
- source: website, GA4 import, phone, offline, enhanced conversion, app
- primary vs secondary status
- category
- counting method: one or every
- attribution model
- click-through conversion window
- engaged-view or view-through window, where applicable
- value settings
- include in conversions setting
- tag name
- trigger name
- event name
- parameters
- transaction ID or order ID
- user ID or lead ID, where applicable

## Before analysis

1. Identify business conversion hierarchy:
   - macro conversions,
   - micro conversions,
   - qualified conversions,
   - revenue events,
   - offline events.
2. Identify which conversions should optimize bidding.
3. Identify which conversions are reporting-only.
4. Confirm whether ecommerce, lead gen, SaaS, app, or offline sales is the business model.
5. Confirm whether GA4 imports, Google Ads native tags, or both are used.

## Analysis workflow

1. Map every conversion action across:
   - Google Ads,
   - GA4,
   - GTM,
   - CRM or backend, if provided.
2. Build a conversion taxonomy:
   - event name,
   - platform,
   - trigger,
   - funnel stage,
   - primary or secondary,
   - optimization role.
3. Check for duplication risk:
   - same user action tracked by both Google Ads tag and GA4 import,
   - multiple GTM triggers firing on the same action,
   - thank-you page reloads,
   - missing transaction ID,
   - form submit plus pageview conversion double-counting,
   - offline import duplicated with online lead event.
4. Check for missing or weak conversions:
   - key business actions not tracked,
   - micro conversions marked as primary,
   - offline qualified stages missing,
   - revenue or value missing where relevant.
5. Check attribution and windows:
   - conversion windows too short for the sales cycle,
   - windows too long for tactical optimization,
   - inconsistent attribution between GA4 and Google Ads,
   - mismatched timezone or reporting definitions.
6. Check naming and taxonomy:
   - inconsistent naming,
   - unclear source or funnel stage,
   - legacy conversion actions still active,
   - duplicate names across platforms.
7. Check bidding readiness:
   - enough primary conversion volume,
   - conversion action quality,
   - stable tracking history,
   - value accuracy for tROAS.

## Naming convention recommendation

Use a clear naming system, for example:

`[Platform] - [Funnel Stage] - [Action] - [Source/Method]`

Examples:

- `Ads - Lead - Form Submit - Native Tag`
- `GA4 - Purchase - Website - Import`
- `CRM - Qualified Lead - Offline Import`
- `Ads - Call - Phone Extension`

## Decision rules

Every threshold below is a starting heuristic, not a Google rule. When one does not fit the account's volume or vertical, say which one you adjusted and why.

Bidding-ready floors:

- Primary conversion action needs ~30 conversions in the last 30 days per campaign for tCPA / tROAS to be well fed [platform guidance range - verify current docs]; below that, recommend a shallower primary action or consolidation before any bid strategy change.
- One primary action per real business result; a second source for the same event (tag + import both primary) is a duplication finding at any volume.

Expected divergence (GA4 vs Google Ads should NOT match):

- A 20-40% count gap is normal - attribution model, window, and consent gating explain it [heuristic].
- Direction reads: platform far above GA4 suggests duplication or view-through inflation; platform far below suggests lost click IDs, redirects stripping GCLID, or consent gating. The direction picks the next check.

Post-fix proof (a fix is proven by counts, not configuration):

- Dedup or import fixes are verified by a before/after count comparison over matching windows with the conversion lag excluded, plus a transaction-ID spot check for purchases. Screenshots of settings prove intent, not outcome.

## Practical example

Lead-gen agency with $22K/month Google Ads spend, planning a switch to tCPA. Claude audits the tracking stack and surfaces: Form Submit tracked twice (Google Ads native tag and GA4 import both fire on the same submission), inflating reported conversions by ~38% and distorting bidding signals; missing transaction or lead ID prevents proper deduplication; primary conversion is set to Newsletter Signup (micro action, 4x volume of Free Trial Start) which means Smart Bidding optimizes toward low-quality leads; click-through window is 90 days while typical sales cycle is 14 days, stretching credit to early touchpoints. Issues table delivered: 3 high-priority fixes (deduplication, primary swap to Free Trial Start, attribution window adjustment to 30 days), 4 medium-priority (naming consistency, GA4 timezone alignment, legacy tag cleanup, consent mode verification). Verdict: account NOT ready for tCPA migration until duplication is resolved — would otherwise optimize toward inflated and noisy conversion data.

## Output format

### Executive summary

- Tracking health score: good / needs review / high risk.
- Main tracking risks.
- Whether data is suitable for Smart Bidding.
- Highest-priority fixes.

### Conversion map

For each conversion include:

- name
- platform
- source
- funnel stage
- primary or secondary
- counting method
- value setup
- attribution window
- optimization role
- risk level

### Issues table

For each issue include:

- issue type
- affected conversion
- evidence
- why it matters
- recommended fix
- priority
- expected impact

### Deduplication review

Identify:

- likely duplicates,
- possible duplicates,
- missing transaction or lead IDs,
- recommended deduplication key,
- events that should be primary vs secondary.

### Implementation checklist

Include exact actions for:

- Google Ads,
- GA4,
- GTM,
- CRM/offline imports,
- naming cleanup,
- post-fix QA.

### Route to next

Offline or CRM loop -> offline-conversion-import-audit-google-ads. Once the verdict is ready -> bidding-strategy-sanity-check-google-ads for strategy fit.

### Data gaps

Name the exports or fields that were missing and which verdict each one would firm up.

## Guardrails

- Do not assume GA4 and Google Ads should match exactly.
- Do not recommend deleting legacy conversions until historical reporting and bidding impact are considered.
- Do not mark micro conversions as primary unless the account lacks macro volume and the user accepts proxy optimization.
- Do not recommend Smart Bidding changes until primary conversion data is trustworthy.
