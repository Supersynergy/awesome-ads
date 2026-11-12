---
name: paid-ads-account-triage
description: Reviews Google Ads, Meta Ads, landing page, tracking, and business context to identify the top paid ads issues worth acting on first. Use when the user says the account is messy, performance is unclear, or they need a first-pass diagnosis before deeper audits.
---

# Paid Ads Account Triage

When you need the shared quality bar, use `../references/paid-ads-output-standard.md` and `../references/paid-ads-principles.md` if they are available.

## Use this skill when

The user needs a first-pass paid ads diagnosis across channels.

Common requests:

- "Audit this paid ads account."
- "Where should we start?"
- "Performance is down and I do not know why."
- "Find the biggest issue before we go deeper."

## Required input

Ask for what is available:

- Google Ads and Meta Ads summaries.
- Campaign, ad set, ad group, ad, or asset exports.
- Spend, conversions, CPA, ROAS, CVR, CTR, CPC, CPM.
- Landing page URL or screenshots.
- Tracking notes.
- CRM or sales feedback.
- Business goal and constraints.

## Analysis workflow

1. Identify the business result that matters.
2. Map spend by channel, campaign, and objective.
3. Check whether the reported conversion matches the business result.
4. Look for the largest spend, signal, creative, page, or lead quality issue.
5. Separate platform issues from offer, page, tracking, and follow-up issues.
6. Pick the top 3 issues by business impact, confidence, and effort.

## Decision rules

Every threshold below is a starting heuristic, not a platform rule. Recalibrate against the account's own history, and say which threshold you adjusted and why.

Ranking rubric for the top 3 (the same export must produce the same top 3):

- Impact score per finding = the spend share it touches x the performance gap on that spend (for example, 30% of spend at CPA 2x target outranks 5% of spend at CPA 3x target).
- Confidence tiers: high = export evidence with closed conversion windows; medium = export evidence with open windows or one source; low = hypothesis. Low-confidence findings cannot enter the top 3 while a medium one is available.
- Conflicting layer tiebreak: measurement beats performance. If tracking or conversion-definition doubt exists at any material spend share, it is finding number one, because every other number depends on it.
- A finding below 5% of spend and below 10 conversions does not enter the top 3 regardless of how bad its ratios look [heuristic]; park it in the table with `monitor`.

Routing: this skill picks WHAT is broken, siblings go deep. Wasted spend -> wasted-spend-finder; structure -> campaign-structure-debt-audit; tracking doubt -> tracking-signal-quality-audit; creative -> creative-fatigue-angle-review; lead quality -> lead-quality-feedback-loop.

## Output format

Owner-decision labels in output tables use the shared enum from `../references/paid-ads-output-standard.md`: `do_now / test / investigate / monitor / ignore / approval_needed`. Evidence labels use `export / screenshot / url / notes / hypothesis / needs_data`.

### Executive verdict

- Account state: healthy / needs review / high risk.
- Top issue.
- What to check next.

### Triage table

| Priority | Finding | Evidence | Confidence | Business impact | Next step |
|---|---|---|---|---|---|

### Missing data

List data that would change the diagnosis.

### Approval gates

List what needs a human yes before anything moves: budget changes, pauses, negative lists, tracking edits, page changes. Nothing in this output is an instruction to execute.

## Practical example

Illustrative made-up case, not a real account.

Input: Google + Meta 30-day summaries, target CPA $60. Google $9,000 spend / 180 conv / CPA $50. Meta $6,000 / 40 conv / CPA $150. Note: Meta conversions counted by both Pixel and a CRM import.

| Priority | Finding | Evidence | Confidence | Business impact | Next step |
|---|---|---|---|---|---|
| 1 | Meta conversions possibly double-counted (Pixel + CRM import, dedup unknown) | export + notes | medium | Real Meta CPA unknown - could be $150 or $300; 40% of spend unreadable | Run tracking-signal-quality-audit before any Meta verdict |
| 2 | Meta CPA 2.5x target even as reported | export | medium (depends on 1) | $6,000/mo at 2.5x target | After the audit: wasted-spend-finder on Meta segments |
| 3 | Google healthy at scale | export | high | Scale candidate once 1 resolves | scale-readiness-check on the top campaign |

Measurement outranked performance: the triage did not rank the "bad Meta CPA" first, because the number itself is in doubt. Verdict: needs review; nothing scales until finding 1 closes.

## Guardrails

- Do not present a single metric as the cause.
- Do not recommend channel cuts without spend and conversion context.
- Do not recommend budget increases until tracking and conversion quality are understood.
