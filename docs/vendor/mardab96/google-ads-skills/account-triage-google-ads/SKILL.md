---
name: account-triage-google-ads
description: Runs a fast, ordered triage of an unfamiliar Google Ads account to establish what is actually broken before any deep analysis begins. Use when the user inherits an account, onboards a new client, asks where to start, reports that performance dropped without a known cause, or wants to know which deeper audit to run first.
---

# Account Triage — Google Ads

## Use this skill when

The user needs orientation in an account rather than a deep dive into one problem. This skill establishes sequence: what to check first, what can wait, and which specialised skill to run next.

Common user requests:

- "We just took over this account. Where do we start?"
- "Performance dropped and I don't know why."
- "Audit this account." (with no narrower scope given)
- "Client onboarding: what do I look at in the first hour?"
- "Is this account worth scaling or does it need fixing first?"

Do not use this skill when the user has already named the problem. If they ask about wasted spend, Quality Score, or a CPA spike, run the specific skill instead.

## Required input

Triage tolerates incomplete data. Ask for what exists, start with what you get, and name the gaps in the output.

Minimum useful data:

- Account currency and time zone.
- Date range: 90 days preferred, 30 days acceptable.
- Stated business goal: CPA target, ROAS target, lead volume, or revenue.
- Who managed the account previously and what changed recently.

Recommended exports, in priority order:

1. Campaign performance report, segmented by month.
2. Conversion action report, including status and attribution settings.
3. Campaign settings export: type, bid strategy, budget, status.
4. Search terms report, last 30 days.
5. Change history, last 90 days.
6. Asset or ad-level report where available.

Required columns where available:

- campaign
- campaign type
- campaign status
- bid strategy
- daily budget
- cost
- impressions
- clicks
- conversions
- conversion value
- conversion action name
- date or month

If the Google Ads MCP server or API access is available, pull campaign, `campaign_budget`, `conversion_action`, and `change_event` resources directly rather than asking for CSV exports.

## Before analysis

1. Establish the goal before reading a single metric. An account without a stated target cannot be triaged, only described.
2. Confirm which conversion actions are set to primary. Everything downstream depends on this.
3. Confirm the conversion lag window and exclude immature data from any performance judgement.
4. Check the account's 2026 upgrade exposure: campaigns using Dynamic Search Ads, automatically created assets, or campaign-level broad match are subject to auto-upgrade to AI Max from September 2026. Flag these before recommending structural work that the upgrade will invalidate.
5. Check change history before blaming performance on the market. Most unexplained drops have an entry in the log.

## Analysis workflow

Work in this order and do not skip forward. Each layer invalidates the ones below it if it fails.

### Layer 1: Measurement integrity

1. List every conversion action with status, category, counting method, and attribution window.
2. Identify which are primary and whether any duplicate the same user action.
3. Check for conversion actions that stopped recording, appeared recently, or changed counting method.
4. Compare conversion volume trend against click trend. A divergence points at tracking, not performance.

If measurement fails here, stop. Every metric below is unreliable and the correct output is a measurement fix plan, not an optimisation plan.

### Layer 2: Structure and settings

1. Map campaigns by type, status, budget, and bid strategy.
2. Flag campaigns whose bid strategy does not match their conversion volume.
3. Flag budget-constrained campaigns and campaigns spending far below budget.
4. Identify overlap: multiple campaigns competing for the same queries or products.
5. Note AI Max upgrade exposure from the pre-analysis check.

### Layer 3: Spend concentration

1. Rank campaigns by share of total spend.
2. Identify where the top 20% of spend sits and whether it performs at or above account average.
3. Separate brand from non-brand spend where identifiable. Blended account metrics hide this.

### Layer 4: Performance against goal

1. Compare account and campaign performance against the stated target, not against each other.
2. Segment by month to distinguish a trend from a spike.
3. Identify the two or three campaigns responsible for most of the gap to target.

### Layer 5: Headroom

1. Check impression share and where it is being lost.
2. Identify whether the account is budget-limited or rank-limited.
3. Judge whether the account is a fix case or a scale case.

## Decision rules

Use these as default heuristics, not hard laws. Thresholds are starting points and should be adjusted to the account's volume and vertical.

Classify the account as **fix first, do not scale** when:

- primary conversion actions are duplicated, missing, or recently changed,
- conversion tracking and click trends diverge without explanation,
- a majority of spend sits in campaigns performing materially below target,
- bid strategies are mismatched to conversion volume,
- change history shows recent structural edits whose effect has not yet matured.

Classify the account as **scale candidate** when:

- measurement is coherent and stable,
- performance sits at or better than target across the main spending campaigns,
- impression share loss is primarily budget-driven rather than rank-driven,
- no upgrade or deprecation event is about to change the campaigns being scaled.

Classify as **insufficient data** when:

- the account has recently launched,
- conversion volume is too low to judge any campaign individually,
- the date range sits inside the conversion lag window,
- exports are missing the conversion action or cost columns.

Do not issue a verdict when the stated goal is unknown. Ask for it instead.

## Practical example

An agency inherits a lead-gen account spending roughly $34K/month with a stated target CPA of $120. Triage runs in order rather than jumping to the obvious CPA question.

Layer 1 surfaces the real problem: three conversion actions are set to primary, and two of them fire on the same form submission, one via a thank-you page view and one via a click event added four months later. Reported conversions are inflated, and reported CPA is understated by roughly a third. No optimisation conclusion drawn from this account's history is trustworthy.

Layer 2 shows two campaigns on Target CPA with fewer than 15 conversions per month each, well below the volume those strategies need to stabilise. Layer 3 shows 61% of spend concentrated in one campaign that mixes brand and non-brand queries, hiding weak non-brand performance behind cheap brand conversions.

Triage verdict: fix first, do not scale. Routed next steps are the conversion tracking audit for the duplicate actions, the bidding strategy sanity check for the two under-volume campaigns, and the account structure audit for the brand and non-brand split. The CPA question the client originally asked is deliberately deferred, because the number they quoted is not real.

## Output format

Return a short triage brief. Length matters here: triage that reads like a full audit defeats its purpose.

### Verdict

One line: fix first / scale candidate / insufficient data, with the single most important reason.

### What is broken, ranked

For each finding include:

- rank
- layer: measurement / structure / concentration / performance / headroom
- finding
- evidence: the specific metric, campaign, or setting
- severity: blocking / material / minor
- confidence: confirmed / likely / needs data

### Route to next

Name the specific skills to run next and the order to run them in. Triage does not solve problems, it sequences them.

### Data gaps

List what was missing and what conclusion it prevented. Do not silently fill a gap with an assumption.

## Guardrails

- Never issue a performance verdict on top of unverified conversion tracking. Measurement failure outranks every other finding.
- Never recommend scaling an account that has not passed Layer 1.
- Do not present triage as a full audit. Its job is sequencing, not resolution.
- State the goal you are triaging against in the output. If it was assumed rather than given, say so.
- When a threshold in this skill does not fit the account's volume or vertical, say which one you adjusted and why.
- Flag pending platform upgrades before recommending structural work that an upgrade would undo.
