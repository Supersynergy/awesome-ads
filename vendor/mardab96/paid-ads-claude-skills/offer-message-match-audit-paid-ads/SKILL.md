---
name: offer-message-match-audit-paid-ads
description: Checks whether paid ads, landing pages, lead forms, emails, and sales follow-up communicate the same offer, promise, audience, proof, CTA, and next step. Use when paid traffic gets clicks but low conversion or poor lead quality.
---

# Offer and Message Match Audit - Paid Ads

When you need the shared quality bar, use `../references/paid-ads-output-standard.md` and `../references/paid-ads-principles.md` if they are available.

## Use this skill when

The user wants to know whether the funnel sells one clear promise.

## Required input

- Ad copy and creative.
- Landing page copy.
- Lead form questions.
- Email or sales follow-up, if available.
- Customer segment and offer.
- Performance by angle, if available.

## Analysis workflow

1. Extract promise, audience, pain, proof, mechanism, and CTA from each funnel step.
2. Find mismatches between ad, page, form, and follow-up.
3. Identify overpromises, vague claims, and missing proof.
4. Recommend copy or funnel fixes.

## Decision rules

Every threshold below is a starting heuristic, not a platform rule. Recalibrate against the account's own history, and say which threshold you adjusted and why.

- Mismatch severity, in order: contradiction (ad promises X, page says not-X, or price/promo differs) > omission (ad promise absent from the page above the fold) > tone drift (same facts, different framing). Only contradictions and omissions justify funnel changes; tone drift is a note.
- A mismatch is material only on the primary conversion path; a footer inconsistency is minor by definition.
- Every fix names its owner surface: ad copy, landing page, form, or follow-up - one surface per fix, no "align messaging" items.
- Overpromise flag: any ad claim without proof on the page (numbers, named customers, mechanism) is listed even when consistent, because consistent overpromising still burns lead quality downstream.

## Output format

Owner-decision labels in output tables use the shared enum from `../references/paid-ads-output-standard.md`: `do_now / test / investigate / monitor / ignore / approval_needed`. Evidence labels use `export / screenshot / url / notes / hypothesis / needs_data`.

| Funnel step | Current message | Mismatch | Risk | Fix |
|---|---|---|---|---|

### Missing data

Name the exact exports or fields that would change the diagnosis, and which finding each one would firm up.

### Approval gates

List what needs a human yes before anything moves: budget changes, pauses, negative lists, tracking edits, page changes. Nothing in this output is an instruction to execute.

## Practical example

Illustrative made-up account, not a real advertiser.

Input: ad says "Free shipping over $50, 30-day returns, ships same day". Page above the fold says "Free shipping over $75". Footer says "14-day returns". Ad voice is playful, page voice is formal.

| Mismatch | Type | On primary path | Owner surface | Fix |
|---|---|---|---|---|
| $50 vs $75 free shipping | contradiction | yes | approval_needed | confirm the actual shipping policy, then assign one owner surface to align the other |
| "Ships same day" absent above the fold | omission | yes | landing page | add it near the buy button if true |
| 30 vs 14 day returns | contradiction | footer only | landing page | minor, fix with the policy page |
| Playful vs formal voice | tone drift | n/a | note only | none |

Overpromise flag: "ships same day" has no proof on the page. List it even if it is true.

## Guardrails

- Do not create new proof.
- Do not rewrite the full funnel unless asked.
- Keep recommendations tied to the existing offer.
