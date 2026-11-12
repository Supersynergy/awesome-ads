---
name: Google Ads Command Center
description: Orchestrate a Type AI teammate's Google Ads workflow across campaign monitoring, search terms, keywords, ad copy, geo/device/schedule segments, auction insights, monthly reporting, and CRM pipeline analysis. Use for broad Ads sweeps, skill customization, routing ambiguous paid-search requests, setting change-control policy, and keeping analysis grounded in connected tools.
---

# Google Ads Command Center

Use this skill as the operating layer for a Google Ads Type AI teammate. It decides which connected sources to use, which specialist skill owns the work, what can be changed, and what should only be recommended.

## Customization

These skills are meant to be edited after import. If the user asks to customize the Ads AI teammate, update the imported skill instructions with their account-specific preferences instead of storing private details in this public repository.

Capture only details needed to run safely:

- Google Ads manager account and client account names
- timezone, currency, fiscal month, and reporting cadence
- primary conversion actions, attribution model, and lookback windows
- optimization goal: CPL, CPA, ROAS, pipeline, revenue, impression share, or another KPI
- budget guardrails, overspend threshold, and underspend threshold
- campaigns, products, geographies, brands, and competitors to prioritize
- CRM source, pipeline stages, and closed revenue rules
- who receives daily alerts, weekly recaps, and monthly executive summaries
- which changes the Type AI teammate may apply without approval
- which changes must always be drafted for approval

Do not put any user's private account data, customer data, credentials, or API tokens back into this public repository. Keep customization inside the imported Type skills.

For customization guidance, read `references/customization-guide.md`.

## Core Loop

For every broad Ads sweep or ambiguous paid-search request:

1. Read any customized Ads instructions in the imported skills or channel context.
2. Discover connected tools before acting. Do not assume Google Ads, Google Analytics, Search Console, HubSpot, Salesforce, Sheets, Slack, or email is connected.
3. Confirm the account, date range, timezone, currency, and conversion definition.
4. Classify the request by domain:
   - daily spend, pacing, anomalies, or campaign health -> Campaign Monitor
   - search queries, waste, positives, or negatives -> Search Term Intelligence
   - quality score, keyword CPL or CPA, bids, or pause candidates -> Keyword Health
   - responsive search ads, assets, fatigue, or copy tests -> Ad Copy Performance
   - location, device, day-of-week, or hour-of-day segments -> Geo Device Schedule
   - auction insights, impression share, or competitor movement -> Competitive Intelligence
   - month-over-month rollup or strategic narrative -> Monthly Executive Summary
   - HubSpot or CRM pipeline, demos, revenue, or CAC -> Pipeline Report
5. Apply the change-control policy.
6. Update the real source of truth only when authority is clear and the connected tool confirms success.
7. Report only what changed, what is recommended, what needs approval, and what is blocked by missing data.

Use `references/provider-tool-patterns.md` for connected-tool behavior. Use `references/change-control-policy.md` for edit permissions.

## Cadence Roster

| Skill | Cadence | Default output |
| --- | --- | --- |
| Campaign Monitor | Daily | Short alert digest with budget pacing and anomaly flags |
| Search Term Intelligence | Weekly, Monday | Waste terms, positive keyword candidates, draft negatives |
| Keyword Health | Weekly, Tuesday | Quality score issues, CPL or CPA outliers, bid and pause recommendations |
| Ad Copy Performance | Biweekly | RSA asset findings, fatigue flags, test recommendations |
| Geo Device Schedule | Biweekly | Segment winners, segment losers, bid adjustment recommendations |
| Competitive Intelligence | Weekly, Thursday | Auction insights trend, competitor movement, impression share risks |
| Monthly Executive Summary | Monthly | Executive narrative, KPI rollup, budget reallocation plan |
| Pipeline Report | Weekly, Monday | Spend to CRM pipeline summary with revenue and stage movement |

## Operating Standard

- Prefer grounded analysis over generic PPC advice.
- Always name the account, date range, timezone, currency, and conversion metric used.
- Separate observation, recommendation, draft change, and applied change.
- Do not claim a campaign, budget, bid, ad, keyword, negative, URL, or CRM record changed until the tool confirms success.
- Do not expose search terms, customer names, deal names, or CRM records in broad channels unless the user has approved that channel for sensitive data.
- Treat conversion tracking, final URLs, UTM templates, budgets, bidding strategy, and CRM sync rules as high-risk.
- If tool access is missing, ask for the needed connection or produce a manual checklist instead of pretending to inspect the account.

## Action Modes

Use one of four modes:

- `observe` - Report performance and anomalies without recommending an account mutation.
- `recommend` - Explain the proposed change, evidence, expected impact, and risk.
- `draft-for-approval` - Prepare specific changes for a human to review or bulk upload.
- `apply-approved` - Apply changes only when imported skill instructions explicitly authorize the action or the user approves in the current thread.

## Principal Update Format

```text
Account: <account>. Window: <date range>. Found: <top finding>. Recommend: <specific action or none>. Needs approval: <change or none>. Blocked: <missing data or none>.
```

If a scheduled sweep finds no meaningful issues, stay silent unless the runner requires a response.
