---
name: lead-quality-feedback-loop-paid-ads
description: Connects paid ads platform leads to CRM, sales, call, or qualification feedback to identify lead quality problems, wrong optimization events, weak targeting, offer mismatch, and follow-up gaps. Use when ads generate leads but sales says they are poor.
---

# Lead Quality Feedback Loop - Paid Ads

When you need the shared quality bar, use `../references/paid-ads-output-standard.md` and `../references/paid-ads-principles.md` if they are available.

## Use this skill when

The user needs to understand lead quality from paid ads.

## Required input

- Platform lead volume and CPA.
- CRM stages or lead status.
- Sales notes.
- Disqualification reasons.
- Call recordings summary or call quality notes.
- Lead source and campaign mapping.
- Current optimization event.

## Analysis workflow

1. Map platform lead to sales outcome.
2. Calculate qualification rate where possible.
3. Cluster poor lead reasons.
4. Check if campaign, offer, form, tracking, or follow-up is likely responsible.
5. Recommend feedback signal improvements.

## Decision rules

Every threshold below is a starting heuristic, not a platform rule. Recalibrate against the account's own history, and say which threshold you adjusted and why.

- Qualification-rate claims need 30+ leads in the cohort [heuristic]; below that, sales feedback is directional and labeled anecdotal.
- Response-time confound first: if median first response exceeds a few hours, follow-up is a candidate cause and no targeting conclusion is drawn until it is ruled out [heuristic].
- A campaign is a lead-quality problem only when its qualification rate is materially below the account average at 30+ leads; one bad week or one angry sales note does not reclassify a source.
- Fix ladder, in order of cost: form friction (add a qualifying question), offer clarity on the page, optimization event depth (offline conversions / CRM value upload as the feedback signal), then targeting. Recommend the cheapest untried rung.
- The output names the feedback mechanism explicitly: which CRM stage, uploaded how often, mapped to which platform conversion - "improve the feedback loop" without mechanics is not a recommendation.

## Output format

Owner-decision labels in output tables use the shared enum from `../references/paid-ads-output-standard.md`: `do_now / test / investigate / monitor / ignore / approval_needed`. Evidence labels use `export / screenshot / url / notes / hypothesis / needs_data`.

| Lead issue | Evidence | Likely source | Business impact | Fix | Confidence |
|---|---|---|---|---|---|

### Missing data

Name the exact exports or fields that would change the diagnosis, and which finding each one would firm up.

### Approval gates

List what needs a human yes before anything moves: budget changes, pauses, negative lists, tracking edits, page changes. Nothing in this output is an instruction to execute.

## Practical example

Illustrative made-up case, not a real account.

Input: 120 platform leads last month at $38 CPL. CRM shows 31 reached "qualified" (26%). Sales says "the leads are bad." Median first response time: 9 hours. Campaign B: 40 leads, 5 qualified (12.5%).

| Lead issue | Evidence | Likely source | Business impact | Fix | Confidence |
|---|---|---|---|---|---|
| 9h median response confounds every quality read | CRM timestamps | follow-up | qual rate under-measured account-wide | response SLA before any targeting change | high |
| Campaign B qualification rate is 12.5% versus the account's 25.8% (48% of account rate) | 40 leads, 30+ floor met | form/offer on B | 40 leads at 12.5%; revenue impact needs qualified-lead value data | add one qualifying question to B's form (cheapest untried rung) | medium |

Feedback mechanism named per the rules: upload the CRM "qualified" stage weekly as an offline conversion mapped to the platform's secondary action; revisit optimization event depth only after 60 days of upload history. "Sales says leads are bad" alone changed nothing - the two numeric findings did.

## Guardrails

- Do not blame paid ads if sales feedback is anecdotal.
- Do not blame sales without response-time or follow-up data.
- Mark missing source mapping clearly.
