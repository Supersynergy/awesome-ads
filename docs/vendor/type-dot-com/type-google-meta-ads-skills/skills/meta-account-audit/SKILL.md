---
name: Meta Account Audit
description: Run a read-only Meta Ads account audit across tracking, campaign structure, delivery, creative, audiences, placements, attribution, policy risk, and measurement quality. Use for first-run Meta Ads setup, health checks, monthly audits, Facebook or Instagram Ads account reviews, and "what should we fix first" questions.
---

# Meta Account Audit

Use this skill for a read-only Meta Ads health check. The goal is to identify the highest-leverage fixes before the Type AI teammate recommends ongoing optimizations.

## Start Here

1. Read any customized Meta account-audit instructions if available.
2. Discover connected Meta Ads, Events Manager, analytics, ecommerce, CRM, spreadsheet, and notification tools.
3. Confirm account, timezone, currency, date range, attribution setting, and primary event.
4. Pull account, campaign, ad set, ad, creative, delivery, breakdown, Pixel, CAPI, and revenue context when available.
5. Stop and report if a critical source errors or tracking is too broken to support performance judgment.
6. Score each audit dimension from 0 to 5.
7. Lead with the verdict and the top three fixes.
8. Recommend next specialist skills or follow-up tasks.
9. Do not mutate the account.

For formulas and interpretation rules, read `../meta-ads-command-center/references/meta-math.md`.

## Audit Dimensions

Score these dimensions:

- tracking and event quality
- campaign structure
- learning phase and delivery health
- creative coverage and fatigue risk
- audience and placement strategy
- measurement and attribution quality
- policy and account risk

Overall score is a plain-language assessment, not a fake precision metric. If a dimension cannot be scored from connected data, mark it as `unknown` and explain what connection or export is needed.

## Tracking Checks

Tracking is upstream of every optimization decision. Review:

- Pixel activity
- Conversions API status
- deduplication
- event match quality source
- primary event volume
- offline conversion import freshness
- event priority and attribution setting
- discrepancy between Meta, ecommerce, analytics, and CRM sources

If Pixel or CAPI signal is missing or stale, recommend fixing measurement before scaling.

## Structure Checks

Review:

- objective and optimization-event alignment
- CBO versus ABO use
- prospecting, retargeting, and retention separation
- ad set count and event volume per ad set
- active ads per ad set
- special ad category classification
- naming conventions
- budget concentration and single-point-of-failure campaigns

## Creative Checks

Review:

- active creative concepts
- format mix: image, video, carousel, Reels, Stories, feed
- aspect ratio coverage
- hook strength and video retention when available
- fatigued ads
- repeated assets across ad sets
- policy-sensitive copy or visuals

## Output Format

```text
Meta account audit: <account>, <date window>.
Verdict: <one-sentence account health>.
Top fixes: <1-3 prioritized fixes>.
Scorecard: <dimension scores or unknowns>.
Tracking: <health and blockers>.
Structure: <main issue>.
Creative: <main issue>.
Measurement: <Meta vs ground-truth caveat>.
Next: <specialist skill or approval request>.
```

Keep the report focused. Cite specific campaigns, ad sets, ads, events, and dollar amounts when connected data provides them.
