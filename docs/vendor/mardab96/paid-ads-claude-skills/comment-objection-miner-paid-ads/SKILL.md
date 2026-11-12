---
name: comment-objection-miner-paid-ads
description: Mines paid ads comments, replies, DMs, reviews, and sales objections to find repeated concerns, FAQ gaps, creative hooks, landing page fixes, offer issues, and response priorities. Use when comments or sales feedback can improve ads and pages.
---

# Comment and Objection Miner - Paid Ads

When you need the shared quality bar, use `../references/paid-ads-output-standard.md` and `../references/paid-ads-principles.md` if they are available.

## Use this skill when

The user wants to turn comments or objections into better paid ads.

## Required input

- Ad comments.
- Replies or DMs.
- Review snippets.
- Sales objections.
- Landing page URL.
- Ad copy and offer.

## Analysis workflow

1. Cluster comments and objections.
2. Separate buying questions, distrust, confusion, price concerns, and product fit issues.
3. Map each cluster to ad copy, creative, landing page, FAQ, or sales follow-up.
4. Suggest response and content priorities.

## Decision rules

Comments are qualitative signal; these rules keep the output honest about how much signal there is. Thresholds are heuristics; say which one you adjusted.

- Recurring theme: 3+ independent commenters (not one thread) raising the same objection [heuristic]; one vivid comment is an anecdote and is labeled as such.
- Sample floor: under ~30 genuine (non-spam) comments, the whole output is "directional, low sample" and no fix gets high confidence [heuristic].
- Fix routing by cluster share of genuine comments: 20%+ -> ad or landing page change; 5-20% -> FAQ or reply material; under 5% -> log only [heuristic].
- "Change the offer" requires the objection to be about substance (price, terms, availability) AND the largest cluster; copy fixes come first everywhere else.
- Human response queue: legal / medical / finance claims, unresolved support complaints, and plausibly high-intent questions. Everything else batches.

## Output format

Owner-decision labels in output tables use the shared enum from `../references/paid-ads-output-standard.md`: `do_now / test / investigate / monitor / ignore / approval_needed`. Evidence labels use `export / screenshot / url / notes / hypothesis / needs_data`.

| Cluster | Evidence | Meaning | Fix | Owner |
|---|---|---|---|---|

### Missing data

Name the exact exports or fields that would change the diagnosis, and which finding each one would firm up.

### Approval gates

List what needs a human yes before anything moves: budget changes, pauses, negative lists, tracking edits, page changes. Nothing in this output is an instruction to execute.

## Practical example

Illustrative made-up account, not a real advertiser.

Input: 84 comments on one ad, 12 spam, so 72 genuine (above the ~30 floor).

| Cluster | Genuine comments | Share | Routing |
|---|---|---|---|
| Price too high | 18 | 25% | ad or landing page change |
| Slow delivery | 7 | 10% | FAQ or reply material |
| Safety question | 3 | 4% | log only |
| Praise, tags, other | 44 | 61% | no action, except the queue below |

Price is about substance and is the largest cluster, so an offer test is allowed. Copy and landing page proof come first. Inside the 44, two comments mention a skin reaction and one is an unresolved support complaint. Those three go to the human response queue.

## Guardrails

- Do not reveal private customer data.
- Do not answer legal, medical, financial, or policy-sensitive claims without review.
- Do not invent testimonials or proof.
