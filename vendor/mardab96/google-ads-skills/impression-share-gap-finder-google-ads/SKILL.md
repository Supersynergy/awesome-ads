---
name: impression-share-gap-finder-google-ads
description: Separates impression share lost to budget from impression share lost to rank, quantifies the addressable opportunity behind each, and decides which campaigns deserve more funding versus which need competitiveness work first. Use when the user asks about lost impression share, whether to raise budgets, why campaigns are limited, or where the remaining growth in an account actually sits.
---

# Impression Share Gap Finder — Google Ads

## Use this skill when

The user wants to know where unclaimed volume sits and what it would take to claim it. The core distinction this skill enforces: share lost to budget is bought with money, share lost to rank is earned with relevance, bids, and landing page quality. Confusing the two produces the most common wasted budget increase in paid search.

Common user requests:

- "We're losing impression share. How much are we leaving on the table?"
- "Which campaigns should get more budget?"
- "Is this campaign limited by budget or by competition?"
- "How much more volume could we get at the current CPA?"
- "Client wants to spend 30% more. Where does it go?"

Do not use this skill to justify a budget increase on an account that has not passed measurement checks. Scaling on top of broken tracking multiplies the error.

## Required input

Minimum useful data:

- Campaign performance export including the impression share family of metrics.
- Date range: 30 to 90 days, ideally segmented by week or month.
- Stated goal: target CPA, target ROAS, or a volume target.
- Current daily budgets and bid strategies per campaign.

Recommended Google Ads exports:

- Campaign performance report with search impression share, search lost impression share (budget), search lost impression share (rank), and where relevant search absolute top impression share.
- Campaign settings export: type, status, bid strategy, daily budget, target.
- Ad group performance report with the same share metrics, for campaigns worth decomposing.
- Auction insights, where available, to read competitive pressure.
- Search terms report, to judge whether the unclaimed volume is worth having.

Required columns where available:

- campaign
- campaign type
- bid strategy and target
- daily budget
- cost
- impressions
- clicks
- conversions
- conversion value
- search impression share
- search lost impression share (budget)
- search lost impression share (rank)
- search top and absolute top impression share

Note that impression share metrics are reported for Search and Shopping campaigns. Performance Max and Demand Gen do not expose the same share family, so campaigns of those types are described qualitatively rather than modelled here.

If the Google Ads MCP server or API access is available, pull the campaign resource with its impression share fields and the budget resource directly.

## Before analysis

1. Confirm the goal first. Impression share is a headroom metric, not a performance metric. 100% share at an unprofitable CPA is a failure, not a win.
2. Confirm conversion tracking is trustworthy. If measurement is uncertain, route to a tracking audit before any funding recommendation.
3. Exclude data inside the conversion lag window from CPA judgements.
4. Check whether budgets or bid strategy targets changed during the window. A mid-window change makes the averaged share numbers describe two different campaigns at once.
5. Check whether shared budgets are in use. A campaign can be budget-limited by a pool it does not control alone.
6. Check 2026 upgrade exposure. Campaigns using Dynamic Search Ads, automatically created assets, or campaign-level broad match are subject to auto-upgrade to AI Max from September 2026, which will change their reach characteristics. Flag this before recommending a large funding commitment to those campaigns.

## Analysis workflow

### Step 1: Establish whether the campaign deserves more volume at all

Before measuring the gap, judge current performance against the target. A campaign losing share while missing its CPA target has no budget case. Its gap is a rank and efficiency problem, or it is a campaign that should shrink.

Split campaigns into three buckets:

- at or better than target
- close to target, within a stated tolerance
- materially worse than target

Only the first two are candidates for funding.

### Step 2: Split the lost share

For each campaign, read the two loss figures separately:

- lost to budget: the auction was eligible and the campaign ran out of money.
- lost to rank: the campaign was outranked or fell below the threshold to serve.

Never sum them into a single "lost share" number in a recommendation. The two require different responses.

### Step 3: Quantify the addressable opportunity

Model each type separately and label every figure an estimate.

For budget-driven loss, scale from observed performance: current impressions, current click-through rate, current conversion rate, and current CPA, extended across the share currently going unserved. State the assumption explicitly, that incremental volume performs like current volume.

For rank-driven loss, do not model volume the same way. Claiming rank-lost share requires higher bids, better relevance, or a better landing page, each of which changes the cost per click or the conversion rate. Express this as a directional opportunity with the required change named, not as a clean incremental forecast.

### Step 4: Apply the diminishing returns caution

Incremental impressions are usually worse than average impressions. The queries a campaign already wins are the ones it is best suited to. State this whenever you present an incremental estimate, and prefer conservative ranges over point figures.

### Step 5: Rank the funding decisions

Produce three lists:

- fund now: strong performance, share lost mainly to budget, healthy query mix.
- fix then fund: performance acceptable but share lost mainly to rank, or query mix weak.
- do not fund: performance below target, or measurement unresolved, or an upgrade is about to change the campaign.

## Decision rules

Export caveat first: Google floors and caps impression share values ("< 10%", "> 90%"). Treat those rows as bounds, not numbers - budget-vs-rank arithmetic built on a bounded value carries the bound into the conclusion, and the output says so on exactly those campaigns.

Use these as default heuristics, not hard laws. Adjust to the account's volume, vertical, and competitive intensity.

Treat a campaign as a **budget case** when:

- lost share to budget is clearly the larger of the two loss figures, roughly 10 percentage points or more as a starting threshold,
- CPA or ROAS sits at or better than target,
- the campaign spends its full daily budget on most days,
- the search terms it already wins are relevant rather than drifting.

Treat a campaign as a **rank case** when:

- lost share to rank dominates,
- the campaign does not exhaust its budget,
- top and absolute top share are low relative to competitors in auction insights,
- component-level quality weaknesses or weak creative are visible.

Raising budget on a rank case is the classic wasted increase. The money has nowhere to go.

Treat as **insufficient data** when:

- the campaign has recently launched or recently changed budget or target,
- conversion volume is too low to judge CPA,
- share metrics are unavailable for the campaign type.

Do not recommend funding on share alone. A campaign can lose share on queries it should never have won.

## Practical example

A lead-gen account spends roughly $28K a month with a target CPA of $95. The client wants to add $8K a month and asks which campaign should absorb it.

Four Search campaigns carry the spend. Claude splits the picture rather than ranking by lost share.

Campaign A spends $9,400 at a CPA of $78, exhausts its daily budget on 27 of 30 days, and shows 34% of share lost to budget against 11% lost to rank. Its search terms are on-theme. This is a clean budget case.

Campaign B shows the largest total lost share in the account at 61%, which is what the client had noticed. But the split is 8% budget and 53% rank, and the campaign spends only 62% of its allocated budget. Its CPA is $141. More money would not be spent. This is a rank and efficiency case, and funding it would move nothing.

Campaign C sits at a CPA of $88 with 19% lost to budget, a secondary funding candidate. Campaign D runs at a CPA of $210 and is recommended for reduction rather than growth.

The delivered allocation puts roughly $5,800 into Campaign A and $2,200 into Campaign C, both framed with an estimated incremental conversion range rather than a point forecast, and with the explicit caution that incremental volume typically converts below current average. Campaign B is routed to competitiveness work first, with a note that it can be reconsidered for funding once its CPA is inside tolerance.

## Output format

Return a funding decision, not an impression share table.

### Executive summary

- Total analysed spend and the account-level share picture.
- How much of the account's lost share is budget-driven versus rank-driven.
- The recommended funding allocation and the total it commits.
- Main caveat.

### Budget versus rank split

For each campaign include:

- campaign and type
- cost, conversions, CPA or ROAS
- performance versus target
- search impression share
- lost to budget
- lost to rank
- budget utilisation
- classification: budget case / rank case / reduce / insufficient data

### Funding recommendations

For each recommended change include:

- rank
- campaign
- current budget and proposed budget
- estimated incremental clicks and conversions, stated as a range
- estimated CPA at the higher spend, stated as a range with the diminishing returns assumption named
- confidence: high / medium / speculative
- risk note

### Rank work required

For campaigns classified as rank cases, name what has to change before funding: bid strategy target, creative, landing page, keyword and match type coverage, or structure.

### Route to next

- Budget cases approved for funding route to `scaling-planner-google-ads` for the increment schedule.
- Rank cases route to `quality-score-analysis-google-ads` for component diagnosis, then to `rsa-ad-copy-review-google-ads` where creative is the weakness.
- Campaigns whose bid strategy or target is throttling delivery route to `bidding-strategy-sanity-check-google-ads`.
- Campaigns whose unclaimed volume is low-quality route to `search-terms-hygiene-google-ads` and `wasted-spend-finder-google-ads` before any increase.
- Overlapping campaigns competing for the same auctions route to `account-structure-audit-google-ads`.
- If measurement is not yet verified, route to `conversion-tracking-audit-google-ads` and hold all funding.
- Performance Max campaigns, which do not expose the same share family, route to `pmax-performance-diagnosis-google-ads`.

### Monitoring plan

- Review 7, 14, and 30 days after each increase.
- Track CPA and conversion volume together. Volume gained at a broken CPA is not a win.
- Define the rollback threshold before the increase, not after.
- Expect the share figures to move slower than spend.

### Data gaps

Name the exports or fields that were missing and which verdict each one would firm up.

## Guardrails

- Never combine budget-lost and rank-lost share into one number in a recommendation.
- Never recommend a budget increase for a campaign that does not spend its current budget.
- Always label incremental volume and CPA figures as estimates, and always state the assumption behind them.
- Always state the diminishing returns caution alongside any incremental forecast.
- Never treat impression share as a goal. A campaign should not chase share it cannot afford.
- Do not model impression share for campaign types that do not report it.
- Do not recommend funding on top of unverified conversion tracking.
- Flag pending platform upgrades before committing budget to a campaign an upgrade will change.
- When a threshold in this skill does not fit the account, say which one you adjusted and why.
