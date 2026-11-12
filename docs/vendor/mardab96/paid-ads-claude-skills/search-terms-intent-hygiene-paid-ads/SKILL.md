---
name: search-terms-intent-hygiene-paid-ads
description: Reviews Google Ads search terms and intent quality to build a negative keyword and query cleanup plan. Use when broad match, PMax search themes, search campaigns, or lead quality suggest poor query intent.
---

# Search Terms and Intent Hygiene - Paid Ads

When you need the shared quality bar, use `../references/paid-ads-output-standard.md` and `../references/paid-ads-principles.md` if they are available.

## Use this skill when

The user wants to clean search intent.

## Required input

- Search terms report.
- Campaign and ad group names.
- Match type, clicks, cost, conversions, CPA, revenue, and value where available.
- Business model and offer.
- Negative keyword lists.
- Target CPA and sales-cycle or conversion-lag window. Without them, performance
  negation decisions are `needs_data`.

## Analysis workflow

1. Group search terms by intent.
2. Mark irrelevant, weak, ambiguous, strong, and expansion terms.
3. Build negative keyword recommendations by level.
4. Identify queries worth isolating or testing.
5. Flag terms that need sales or CRM quality review.

## Decision rules

Every threshold below is a starting heuristic, not a platform rule. Recalibrate against the account's own history, and say which threshold you adjusted and why.

Evidence floors before a negation (nothing gets negated on 3 clicks):

- A single term needs 10+ clicks or spend of 1x target CPA or more with zero conversions before it can be negated on performance [heuristic]. Below that, it can only be negated on relevance (the term is unambiguously not the business).
- An n-gram cluster (terms sharing a token pattern) can be negated as a group when the cluster totals 20+ clicks or 2x target CPA with zero conversions [heuristic] - this is how low-volume junk gets caught without per-term floors.
- Long sales cycles: extend judgment to the sales-cycle window; a zero-conversion term inside an open window is `needs_data`.

Negative placement rules:

- Exact-match negative for a specific bad query; phrase-match negative for a bad token pattern.
- Ad group level when the term is wrong for that ad group but right elsewhere; campaign level when wrong for the campaign; shared list when wrong for the whole account (competitor research, jobs, free-seekers).
- Brand, competitor and research intent are classified separately and never mixed into one negative list.

For raw search-term CSVs, run `../scripts/ngram_terms.py` to aggregate 1-3 gram clusters with summed cost and conversions, ranked by wasted spend.

## Output format

Owner-decision labels in output tables use the shared enum from `../references/paid-ads-output-standard.md`: `do_now / test / investigate / monitor / ignore / approval_needed`. Evidence labels use `export / screenshot / url / notes / hypothesis / needs_data`.

| Term or cluster | Intent | Spend | Result | Recommendation | Level |
|---|---|---:|---|---|---|

### Missing data

Name the exact exports or fields that would change the diagnosis, and which finding each one would firm up.

### Approval gates

List what needs a human yes before anything moves: budget changes, pauses, negative lists, tracking edits, page changes. Nothing in this output is an instruction to execute.

## Practical example

Illustrative made-up account, not a real advertiser.

Input: target CPA $40. Search terms with zero conversions: "free crm template" 12 clicks, "crm jobs" 4 clicks and $6, "crm for dentists" 3 clicks. Terms containing "free": 26 clicks in total. Sales cycle 45 days, window still open for the dentist term.

| Term | Evidence | Verdict |
|---|---|---|
| free crm template | 12 clicks, 0 conversions, above 10 clicks | exact negative |
| crm jobs | 4 clicks, but unambiguously not the business | exact negative on relevance |
| "free" cluster | 26 clicks, 0 conversions, above 20 | phrase negative at campaign level |
| crm for dentists | 3 clicks, window open | needs_data, do not negate |

Approval needed before any negative list changes.

## Guardrails

- Do not block ambiguous terms without enough evidence.
- Do not treat all low-converting terms as bad if the sales cycle is long.
- Keep brand, competitor, and research intent separate.
