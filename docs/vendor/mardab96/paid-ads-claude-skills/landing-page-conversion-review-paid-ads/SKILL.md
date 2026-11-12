---
name: landing-page-conversion-review-paid-ads
description: Reviews landing pages for paid traffic conversion issues: message match, offer clarity, trust, proof, objections, mobile friction, form friction, speed symptoms, and CTA clarity. Use when paid traffic gets clicks but does not convert.
---

# Landing Page Conversion Review - Paid Ads

When you need the shared quality bar, use `../references/paid-ads-output-standard.md` and `../references/paid-ads-principles.md` if they are available.

## Use this skill when

The user needs to review a paid traffic landing page.

## Required input

- Landing page URL or screenshots.
- Ad copy and creative that send traffic to the page.
- Funnel metrics: sessions, CTR, CVR, CPA, bounce or engagement where available.
- Target audience and offer.
- Form or checkout screenshots.

## Analysis workflow

1. Check message match from ad to page.
2. Review above-the-fold clarity.
3. Check whether the ad promise, offer, promotion, price, and CTA are visible on the page.
4. Check proof, trust, objections, and risk reversal.
5. Review form, CTA, mobile, and page flow friction.
6. Separate page issues from traffic quality and tracking issues.

## Decision rules

Every threshold below is a starting heuristic, not a platform rule. Recalibrate against the account's own history, and say which threshold you adjusted and why.

- Severity scale: blocker = the visitor cannot complete or cannot understand the offer (broken form, missing price where required, promise contradiction); major = above-the-fold clarity or trust gaps on the primary path; minor = polish below the fold. One-word severity, from this scale only.
- Priority = severity first, then effort; a minor one-line fix never outranks an unaddressed blocker.
- Expected-impact honesty: impact estimates are labeled directional; a numeric lift claim requires a comparable change on this site or a named external benchmark, otherwise write "direction only".
- CVR claims per URL need ~200 clicks minimum [heuristic]; below that, findings stand on heuristics and are labeled so.
- Route out: if CTR is healthy and the page passes this review, the problem is traffic intent - route to search-terms-intent-hygiene or creative-fatigue-angle-review rather than polishing the page further.

## Output format

Owner-decision labels in output tables use the shared enum from `../references/paid-ads-output-standard.md`: `do_now / test / investigate / monitor / ignore / approval_needed`. Evidence labels use `export / screenshot / url / notes / hypothesis / needs_data`.

| Issue | Evidence | Severity | Suggested fix | Expected impact | Confidence |
|---|---|---|---|---|---|

### Missing data

Name the exact exports or fields that would change the diagnosis, and which finding each one would firm up.

### Approval gates

List what needs a human yes before anything moves: budget changes, pauses, negative lists, tracking edits, page changes. Nothing in this output is an instruction to execute.

## Practical example

Illustrative made-up account, not a real advertiser.

Input: one landing page URL, 140 ad clicks, CTR 4.1%, mobile form screenshot.

| Finding | Severity | Owner surface | Fix |
|---|---|---|---|
| Phone keyboard covers the submit button on mobile | blocker | form | move the button above the keyboard fold |
| Headline does not state the offer | major | landing page | lead with the offer and who it is for |
| Testimonials sit under three screens of copy | minor | landing page | move up after the blocker and major fixes |

140 clicks is under the ~200 floor, so conversion rate claims are withheld and
the findings are labeled as heuristics. Expected impact: direction only. CTR is
healthy, but the page does not pass this review; fix the blocker and major issue
before routing the diagnosis to traffic intent.

## Guardrails

- Do not claim the page is the bottleneck without traffic and conversion context.
- Do not invent proof, testimonials, or guarantees.
- Do not recommend a full redesign when a smaller fix is enough.
