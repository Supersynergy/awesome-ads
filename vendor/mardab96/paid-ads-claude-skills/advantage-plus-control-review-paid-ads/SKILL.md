---
name: advantage-plus-control-review-paid-ads
description: Reviews Meta Advantage+ campaigns for role, creative mix, audience controls, budget concentration, signal quality, catalog/product fit, learning behavior, and incrementality risk. Use when Advantage+ spends heavily or results are hard to explain.
---

# Advantage Plus Control Review - Paid Ads

When you need the shared quality bar, use `../references/paid-ads-output-standard.md` and `../references/paid-ads-principles.md` if they are available.

## Use this skill when

The user needs to diagnose Advantage+ without treating automation as the default problem.

## Required input

- Advantage+ campaign export.
- Ad and creative export.
- Product or catalog performance if relevant.
- Pixel/CAPI event quality.
- Budget allocation.
- New vs returning customer data if available.

## Analysis workflow

1. Define Advantage+ role in the account.
2. Check budget concentration and learning stability.
3. Review creative and catalog mix.
4. Check signal quality and optimization event.
5. Look for audience or remarketing overlap.
6. Recommend controls, creative changes, catalog fixes, or hold.

## Decision rules

Every threshold below is a starting heuristic, not a platform rule. Recalibrate against the account's own history, and say which threshold you adjusted and why.

- Budget concentration: one creative or product set absorbing 70%+ of spend [heuristic] - healthy if its own CPA / ROAS beats target, a constraint if it merely matches average. Post-promo concentration is expected for 7-14 days; do not call it structural inside that window.
- Learning stability: an ad set under ~50 optimization events per week is under-fed [platform guidance]; recommend broader events or consolidation before blaming the automation.
- Remarketing overlap: when Advantage+ overlaps an explicit remarketing campaign, the incrementality question is named in the output (Advantage+ may be re-capturing warm users and booking them as prospecting wins); recommend an audience-control check, not a rebuild.
- Manual rebuild is recommended only when a named signal benefit exists (cleaner event, better exclusions); "we want control back" alone is not a diagnosis.

## Output format

Owner-decision labels in output tables use the shared enum from `../references/paid-ads-output-standard.md`: `do_now / test / investigate / monitor / ignore / approval_needed`. Evidence labels use `export / screenshot / url / notes / hypothesis / needs_data`.

| Finding | Evidence | Risk | Action | Confidence |
|---|---|---|---|---|

### Missing data

Name the exact exports or fields that would change the diagnosis, and which finding each one would firm up.

### Approval gates

List what needs a human yes before anything moves: budget changes, pauses, negative lists, tracking edits, page changes. Nothing in this output is an instruction to execute.

## Practical example

Illustrative made-up account, not a real advertiser.

Input: one Advantage+ sales campaign, $12,000 spend in 30 days, target ROAS 3.0. One product set took $8,900 (74%) at 3.4 ROAS. Ad set logged 38 optimization events per week. An explicit remarketing campaign runs in the same account. No promo in the window.

| Finding | Evidence | Risk | Action | Confidence |
|---|---|---|---|---|
| 74% of spend sits on one product set | export, 8,900 / 12,000 | low: its 3.4 ROAS beats the 3.0 target, so this is a result, not a constraint | monitor | medium |
| 38 events per week is under the ~50 floor | export | learning stays unstable | test: move the optimization event one step up the funnel, or consolidate with a second ad set | medium |
| Overlap with the remarketing campaign | audience settings | Advantage+ may be re-capturing warm users and booking them as prospecting wins | investigate: run an audience-control check, no rebuild | low |

Missing data: customer-list exclusion settings and a 30-day new-customer share. No rebuild is recommended because no named signal benefit exists.

## Guardrails

- Do not assume Advantage+ is the issue.
- Do not recommend heavy changes during unstable learning without a reason.
- Do not scale if lead or purchase quality is unclear.
