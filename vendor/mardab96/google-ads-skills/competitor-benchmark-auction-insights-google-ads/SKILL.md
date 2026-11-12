---
name: competitor-benchmark-auction-insights-google-ads
description: Reads Google Ads auction insights over time to describe competitive pressure, separate a genuine competitor shift from an internal account change, and recommend where to defend and where to concede. Use when the user reports rising CPCs, falling impression share, a new competitor, or asks who is beating them in the auction.
---

# Competitor Benchmark and Auction Insights — Google Ads

## Use this skill when

The user wants to understand competitive pressure in the auction rather than internal efficiency. This skill reads auction insights alongside the account's own metrics and answers one question: did the market change, or did we?

Common user requests:

- "Who is competing with us and are they getting more aggressive?"
- "Our impression share dropped. Is that a competitor or us?"
- "CPCs went up 30% this quarter. What is happening in the auction?"
- "A new competitor showed up. How much are they actually taking?"
- "Which keywords should we defend and which should we let go?"

Do not use this skill to diagnose internal efficiency problems. If the question is about wasted spend, structure, or tracking, run the matching skill instead. Auction insights cannot explain a problem that lives inside the account.

## Required input

Auction insights are reported for a chosen scope and date range. Ask for the scope that matches the question, and always ask for more than one period so change can be measured.

Minimum useful data:

- Auction insights for at least two comparable periods, ideally three or more consecutive months.
- The scope of each report: account, campaign, ad group, or keyword. Reports at different scopes are not comparable to each other.
- The account's own performance for the same periods.
- Stated business goal: CPA target, ROAS target, or a defend or grow position on specific terms.

Auction insights columns to request:

- competitor domain
- impression share
- overlap rate
- position above rate
- top of page rate
- absolute top of page rate
- outranking share

Account-side data to request alongside it:

- campaign or keyword cost, impressions, clicks, conversions, conversion value
- average CPC
- search impression share and the two loss reasons: budget and rank
- daily budget and bid strategy per campaign
- change history for the same window

Note that auction insights availability varies by campaign type and by whether the selected scope has enough auction volume. If a report is empty or partial, say so rather than treating absence as evidence of no competition.

## Before analysis

1. Confirm the scope. Account-level auction insights blend brand and non-brand and will hide almost everything interesting. Push for campaign, ad group, or keyword scope.
2. Confirm the periods are comparable in length, seasonality, and campaign set. A month against a fortnight is not a trend.
3. Pull the account's own change history first. If budget, bids, bid strategy, targeting, or ad copy changed in the window, an internal cause is live until it is ruled out.
4. Check whether impression share loss is attributed to budget or to rank. This single split decides most of the diagnosis.
5. Check 2026 platform exposure before recommending structural defence. Campaigns using Dynamic Search Ads, automatically created assets, or campaign-level broad match are subject to auto-upgrade to AI Max from September 2026, which changes the query surface and therefore the competitive set.
6. Confirm the user understands what these metrics are: they describe auctions the account also entered, not total market share. Never present them as market share.

## Analysis workflow

Work through the layers in order. The internal check comes first on purpose.

### Layer 1: Rule out the internal cause

1. Plot the account's own impression share, spend, and average CPC across the periods.
2. Split impression share loss into budget-driven and rank-driven.
3. Cross-check change history against the inflection date.
4. If impression share fell while budget-driven loss rose and spend hit the daily cap, the cause is internal budget, not a competitor. Stop and route accordingly.

### Layer 2: Describe the competitive set

1. List competitor domains present in each period.
2. Mark each as persistent, new, growing, shrinking, or gone.
3. Note which appear only in some campaigns or ad groups. A competitor concentrated in one segment is a different problem than one present everywhere.

### Layer 3: Measure pressure over time

For each competitor, track across periods:

- impression share trend
- overlap rate trend, which shows how often you meet them at all
- position above rate trend, which shows how often they beat you when you meet
- outranking share trend, which combines showing up and ranking higher
- top of page and absolute top of page rate trend

Read them together. Rising overlap with flat position above rate means a competitor is entering more of your auctions but not beating you more often. Flat overlap with rising position above rate means the same opponent is simply outbidding or outranking you.

### Layer 4: Attribute the shift

Classify the observed change as one of:

- competitor entry: a new domain with meaningful impression share appears
- competitor escalation: existing domain rises on outranking share and position above rate
- competitor retreat: a domain falls or disappears, usually with your CPC easing
- internal change: your own budget, bid strategy, ad rank inputs, or targeting moved
- measurement artefact: scope changed, campaign set changed, or volume is too thin to read

### Layer 5: Decide defend or concede

1. Map each contested segment to its business value: revenue, margin, CPA against target, strategic role.
2. Estimate the cost of holding position, using observed CPC movement rather than a modelled bid figure.
3. Rank segments by value per unit of defence cost.

## Decision rules

Use these as default heuristics, not hard laws. Every threshold below is a starting point to adjust to the account's volume, vertical, and margin.

Treat the shift as a **real competitive change** when:

- the movement appears across several campaigns or ad groups rather than one,
- impression share loss is predominantly rank-driven rather than budget-driven,
- outranking share moves against you while your own bids, budget, and ad assets were stable,
- change history shows no relevant internal edit near the inflection point,
- the pattern persists across at least two consecutive periods rather than one spike.

Treat it as an **internal change** when:

- budget-driven impression share loss rose in step with the drop,
- a bid strategy, target CPA, or target ROAS value was edited in the window,
- ad assets, landing pages, or tracking changed near the inflection point,
- only campaigns you touched are affected.

Recommend **defend** when:

- the segment converts at or better than target,
- it carries brand, high margin, or high lifetime value,
- rank loss is recoverable within a cost you can quantify,
- conceding it would hand a competitor an entry point into terms you still profit from.

Recommend **concede or reduce** when:

- the segment already sits materially above target CPA before any escalation,
- holding position requires CPC growth that breaks the goal at current conversion rates,
- the competitor shows a persistent structural advantage such as consistently higher top of page rate over several periods,
- the same budget has a documented better use elsewhere in the account.

Classify as **insufficient data** when:

- auction insights are empty or partial for the scope,
- only one period is available,
- the scope changed between periods,
- auction volume in the segment is too thin for the rates to be stable.

Validity caveats: auction insight shares on under ~1,000 impressions in the window are unstable - no verdict below that [heuristic]. A campaign-set change mid-window silently invalidates the period comparison; confirm the campaign list is constant before trending shares. Floored/capped IS values ("< 10%") are bounds, not numbers.

## Practical example

An ecommerce account spending roughly $26K/month reports that non-brand CPCs rose from $1.85 to $2.60 over one quarter while conversions fell 14%. The obvious reading is a competitor squeeze.

Layer 1 partly contradicts that. Search impression share fell from 42% to 31%, but the loss split shows budget-driven loss rose from 9% to 22% while rank-driven loss moved only from 49% to 47%. Change history shows the daily budget on the two largest campaigns was cut 20% eleven weeks ago during a cash-flow month. A meaningful share of the drop is self-inflicted.

Layer 3 still finds a real competitor story underneath it, but narrower than assumed. Across three months, one new domain appears in the shoes category only: overlap rate 12% to 31% to 44%, position above rate 38% to 51% to 57%, outranking share against the account falling from 71% to 49%. The other four persistent competitors are flat within noise.

Layer 5 splits the response. The shoes category converts at $41 CPA against a $55 target and carries the account's best margin, so it is a defend segment and the budget cut is reversed there first. A second contested category already sat at $78 CPA before the competitor arrived, and holding rank would require roughly 30% more CPC at an unchanged conversion rate, so it is marked concede and its budget moves to shoes.

Verdict delivered: mixed cause, majority internal on volume, genuine competitor escalation isolated to one category. Defend one, concede one, restore budget before bidding harder.

## Output format

Return a competitive readout, not a metric dump. Every number needs an interpretation next to it.

### Verdict

One line: real competitive shift / internal change / mixed / insufficient data, with the single strongest piece of evidence.

### Internal versus external split

State plainly how much of the observed change is attributable to the account's own edits and how much to the auction. If the split cannot be quantified, say that and give the direction only.

### Competitor movement table

For each competitor domain include:

- domain
- scope: campaign, ad group, or keyword
- status: persistent / new / growing / shrinking / gone
- impression share by period
- overlap rate by period
- position above rate by period
- outranking share by period
- interpretation in one sentence
- confidence: confirmed / likely / needs data

### Defend and concede map

For each contested segment include:

- segment
- business value and why
- current performance against target
- estimated cost of defending, framed as an estimate
- recommendation: defend / hold / reduce / concede
- reason
- what would change the recommendation

### Route to next

Name the sibling skills to run next and the order:

- restore or rebalance budget before bidding harder: scaling-planner-google-ads
- rank loss with unclear bid behaviour: bidding-strategy-sanity-check-google-ads
- competitor pressure concentrated in one campaign or overlapping campaigns: account-structure-audit-google-ads
- suspicion that new competitor queries are entering via broad match: search-terms-hygiene-google-ads
- position above rate driven by weaker ad relevance rather than bids: rsa-ad-copy-review-google-ads
- unexplained conversion movement alongside the auction shift: conversion-tracking-audit-google-ads
- sudden single-day inflection rather than a trend: anomaly-detection-google-ads

### Data gaps

List what was missing and which conclusion it prevented. Do not fill a gap with an assumption.

## Guardrails

- Auction insights describe auctions your account entered. Never present impression share or overlap rate as market share, and never estimate a competitor's total budget from them.
- Never name a competitor's bid, spend, CPA, or strategy. These metrics do not contain that information.
- Always rule out the internal cause before attributing a change to competitors. Most reported competitor squeezes have an entry in change history.
- One period is not a trend. Refuse to declare escalation from a single comparison.
- Do not compare auction insights across different scopes or different campaign sets and call the difference a change.
- Rates computed on thin auction volume are unstable. Say so rather than reading noise as a pattern.
- Every cost-of-defence figure is an estimate built on the stated assumptions. Say which assumptions.
- Flag pending platform upgrades before recommending structural defence work that an upgrade would undo.
- When a threshold in this skill does not fit the account's volume or vertical, say which one you adjusted and why.
