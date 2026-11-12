---
name: campaign-structure-debt-audit-paid-ads
description: Audits paid ads account structure across Google Ads and Meta Ads to find fragmentation, duplicated campaign roles, stale tests, mixed intent, weak naming, and budget split issues. Use before account cleanup, scaling, or weekly planning.
---

# Campaign Structure Debt Audit - Paid Ads

When you need the shared quality bar, use `../references/paid-ads-output-standard.md` and `../references/paid-ads-principles.md` if they are available.

## Use this skill when

The user suspects the account structure is hurting performance or making decisions slow.

## Required input

- Campaign and ad group or ad set exports.
- Objective, bid strategy, budget, status, naming, date created.
- Spend and conversions by campaign.
- Audience, keyword, asset group, or placement notes where available.

## Analysis workflow

1. Map each campaign's job.
2. Identify duplicated roles.
3. Find under-volume campaigns that cannot learn.
4. Find over-consolidated campaigns with mixed intent or mixed offer.
5. Flag stale experiments and legacy debt.
6. Propose cleanup actions with risk.

## Decision rules

Every threshold below is a starting heuristic, not a platform rule. Recalibrate against the account's own history, and say which threshold you adjusted and why.

- Under-volume: a campaign on automated bidding with fewer than ~30 conversions in 30 days (Google) or an ad set under ~50 optimization events per week (Meta) cannot feed its own learning [heuristic / platform guidance].
- Merge is recommended only when the merged unit would clear those floors; merging two starving campaigns into one starving campaign is not a fix.
- Stale test: an experiment older than 6 weeks with no recorded decision is debt [heuristic] - propose archive with its result stated, or a decision deadline.
- Duplicated role: two campaigns with the same objective, overlapping targeting and the same funnel stage, both under the volume floor - merge candidates. Keep separate only for a named business reason (budget ownership, reporting, regulatory geo, genuinely different offers).
- Every merge proposal states the migration mechanics: what happens to negatives and audiences, learning reset on significant edits, budget carry, naming - and no more than 2-3 structural changes per week so reads stay clean [heuristic].

## Output format

Owner-decision labels in output tables use the shared enum from `../references/paid-ads-output-standard.md`: `do_now / test / investigate / monitor / ignore / approval_needed`. Evidence labels use `export / screenshot / url / notes / hypothesis / needs_data`.

| Campaign | Current role | Issue | Evidence | Proposed action | Risk |
|---|---|---|---|---|---|

End with:

- merge candidates
- keep separate candidates
- archive candidates
- needs_data

### Missing data

Name the exact exports or fields that would change the diagnosis, and which finding each one would firm up.

### Approval gates

List what needs a human yes before anything moves: budget changes, pauses, negative lists, tracking edits, page changes. Nothing in this output is an instruction to execute.

## Practical example

Illustrative made-up account, not a real advertiser.

Input: two Search campaigns with the same objective, overlapping keywords and the same funnel stage. Campaign A: 18 conversions in 30 days. Campaign B: 21. One experiment started 9 weeks ago with no recorded decision.

| Finding | Evidence | Action |
|---|---|---|
| A and B are both under the ~30 floor | 18 and 21 conversions | merge candidate: 18 + 21 = 39 clears 30 |
| Experiment older than 6 weeks with no decision | start date, 9 weeks | archive with its result stated, or set a decision date |

Migration mechanics: carry both negative lists, keep audiences, expect a learning reset on the merged campaign, carry the combined budget, rename once. Two structural changes this week, no more, so the next read stays clean. Approval needed before any merge.

## Guardrails

- Do not recommend consolidation only because there are many campaigns.
- Do not recommend splitting only because reporting is messy.
- Consider learning history before structural changes.
