---
name: weekly-paid-ads-operator-readout
description: Produces a weekly paid ads operator update across Google Ads, Meta Ads, tracking, landing pages, lead quality, experiments, budget, and approval asks. Use when the user needs a short weekly performance readout for a founder, client, or team.
---

# Weekly Paid Ads Operator Readout

When you need the shared quality bar, use `../references/paid-ads-output-standard.md` and `../references/paid-ads-principles.md` if they are available.

## Use this skill when

The user needs a weekly paid ads update.

## Required input

- Week date range.
- Spend by channel.
- Main KPIs.
- Changes made.
- Tests running.
- Tracking or site changes.
- Lead quality or sales feedback.
- Questions or decisions needed.

## Analysis workflow

1. Summarize what changed.
2. Separate facts, hypotheses, and decisions.
3. Identify the biggest risk and biggest opportunity.
4. Create next actions with owners.
5. List approval asks.

## Decision rules

Every threshold below is a starting heuristic, not a platform rule. Recalibrate against the account's own history, and say which threshold you adjusted and why.

- A metric earns a row in "What changed" only if it moved more than 15% week over week AND rests on 30+ conversions per week (or 1,000+ clicks for pre-conversion metrics) [heuristic]. Below 30 conversions/week, widen the band to 25% and compare against a 4-week average.
- Spend changes are always reported regardless of the band - the reader owns the budget.
- Driver confidence: high only when the timing matches a logged change AND the metric pattern fits; medium when the pattern fits with no logged change; low when several drivers fit - then name the next check instead of picking one.
- Approval asks must name the amount, the trigger, and the rollback; a vague ask ("more budget for creative") does not enter the approval section.

## Output format

Owner-decision labels in output tables use the shared enum from `../references/paid-ads-output-standard.md`: `do_now / test / investigate / monitor / ignore / approval_needed`. Evidence labels use `export / screenshot / url / notes / hypothesis / needs_data`.

### Weekly verdict

One short paragraph.

### What changed

| Area | Change | Evidence | Meaning |
|---|---|---|---|

### Next actions

| Action | Owner | Priority | Approval needed |
|---|---|---|---|

### Missing data

Name the exact exports or fields that would change the diagnosis, and which finding each one would firm up.

### Approval gates

List what needs a human yes before anything moves: budget changes, pauses, negative lists, tracking edits, page changes. Nothing in this output is an instruction to execute.

## Practical example

Illustrative made-up account, not a real advertiser.

Input: this week vs last week. Spend $9,800 vs $9,100. Google Search CPA $78 vs $64 on 94 conversions. Meta leads 18 vs 15 per week. Bid target on Google Search changed Tuesday.

| Metric | Move | Rule | In "What changed" |
|---|---|---|---|
| Spend | +7.7% | always reported | yes |
| Google Search CPA | +21.9% | above 15% and 94 is above 30 conversions | yes |
| Meta leads | +20% | under 30 per week, so the band is 25% | no |

Driver: the Tuesday bid target change matches the timing and the pattern. Confidence high. Approval ask: raise Google Search budget by $300 per week for 2 weeks. Trigger: CPA back under $65. Rollback: revert if CPA stays above $75 for 7 days.

## Guardrails

- Do not create a long report if a short decision update is enough.
- Do not hide bad news.
- Do not ask for approval on vague actions.
