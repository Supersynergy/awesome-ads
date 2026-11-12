---
name: Meta Ads Command Center
description: Orchestrate a Type AI teammate's Meta Ads workflow across account audit, performance monitoring, creative fatigue, audience and delivery analysis, budget scaling, and revenue attribution. Use for broad Meta Ads sweeps, Facebook or Instagram Ads questions, skill customization, routing ambiguous paid-social requests, and setting change-control policy.
---

# Meta Ads Command Center

Use this skill as the operating layer for Meta Ads work in Type. It decides which connected sources to use, which specialist skill owns the request, what can be changed, and what should only be recommended.

## Customization

These skills are meant to be edited after import. If the user asks to customize the Meta Ads AI teammate, update the imported skill instructions with account-specific preferences instead of storing private details in this public repository.

Capture only details needed to run safely:

- Meta business manager and ad account names
- account timezone, currency, fiscal month, and reporting cadence
- Pixel ID, Conversions API status, and event match quality source
- primary conversion event, attribution setting, and optimization goal
- business model: ecommerce, lead generation, SaaS, marketplace, local service, or another model
- AOV, gross margin, LTV, lead-to-customer rate, or target CPA when available
- budget guardrails, scale limits, overspend threshold, and underspend threshold
- campaign types, products, audiences, geographies, and creative concepts to prioritize
- sensitive policy areas such as credit, employment, housing, social issues, health, finance, alcohol, dating, or weight loss
- revenue source such as Shopify, GA4, HubSpot, Salesforce, warehouse, or BI dashboard
- which changes the Type AI teammate may apply without approval
- which changes must always be drafted for approval

Do not put any user's private account data, customer data, credentials, API tokens, Pixel IDs, customer lists, or revenue data back into this public repository. Keep customization inside the imported Type skills.

For customization guidance, read `references/customization-guide.md`.

## Core Loop

For every broad Meta Ads sweep or ambiguous paid-social request:

1. Read any customized Meta Ads instructions in the imported skills or channel context.
2. Discover connected tools before acting. Do not assume Meta Ads Manager, Meta Marketing API, GA4, Shopify, HubSpot, Salesforce, Sheets, Slack, or email is connected.
3. Confirm account, date range, timezone, currency, attribution setting, and primary event.
4. Classify the request by domain:
   - account setup, tracking, structure, or first-run health -> Meta Account Audit
   - daily spend, pacing, ROAS or CPA, CPM, CTR, frequency, or anomalies -> Meta Performance Monitor
   - ad creative, hooks, formats, fatigue, or refresh briefs -> Meta Creative Fatigue
   - audience overlap, broad targeting, lookalikes, retargeting, placements, learning phase, or delivery constraints -> Meta Audience Delivery
   - budgets, CBO or ABO, scaling, forecasts, and profit headroom -> Meta Budget Scaling
   - Shopify, GA4, HubSpot, Salesforce, BI, MER, pipeline, or revenue attribution -> Meta Revenue Attribution
5. Apply the change-control policy.
6. Update the real source of truth only when authority is clear and the connected tool confirms success.
7. Report only what changed, what is recommended, what needs approval, and what is blocked by missing data.

Use `references/provider-tool-patterns.md` for connected-tool behavior. Use `references/change-control-policy.md` for edit permissions. Use `references/meta-math.md` for paid-social formulas and interpretation rules.

## Cadence Roster

| Skill | Cadence | Default output |
| --- | --- | --- |
| Meta Account Audit | First run, then monthly | Read-only health scorecard and top fixes |
| Meta Performance Monitor | Daily or weekly | Spend, pacing, anomaly, and delivery digest |
| Meta Creative Fatigue | Weekly | Creative fatigue diagnosis and refresh priorities |
| Meta Audience Delivery | Biweekly | Audience, placement, and learning-phase recommendations |
| Meta Budget Scaling | Weekly | Budget forecast, scale plan, and risk controls |
| Meta Revenue Attribution | Weekly or monthly | Spend to revenue, MER, pipeline, or CAC summary |

## Operating Standard

- Prefer grounded analysis over generic paid-social advice.
- Always name the account, date range, timezone, currency, attribution setting, and primary event used.
- Separate observation, recommendation, draft change, and applied change.
- Cite link clicks, not all clicks, when discussing CTR or CPC unless the user explicitly asks for all clicks.
- Treat reported Meta ROAS as in-platform attributed performance, not ground-truth revenue.
- Cross-check Meta-reported revenue against Shopify, GA4, CRM, or BI when connected.
- Treat Pixel, Conversions API, deduplication, event priority, final URLs, UTMs, budgets, bidding, audience lists, and CRM sync rules as high-risk.
- If tracking is broken, do not make confident scaling recommendations from the broken data.
- If tool access is missing, ask for the needed connection or produce a manual checklist instead of pretending to inspect the account.

## Action Modes

Use one of four modes:

- `observe` - Report performance and anomalies without recommending an account mutation.
- `recommend` - Explain the proposed change, evidence, expected impact, and risk.
- `draft-for-approval` - Prepare specific changes or briefs for a human to review.
- `apply-approved` - Apply changes only when imported skill instructions explicitly authorize the action or the user approves in the current thread.

## Principal Update Format

```text
Meta Ads: <account>. Window: <date range>. Found: <top finding>. Recommend: <specific action or none>. Needs approval: <change or none>. Blocked: <missing data or none>.
```

If a scheduled sweep finds no meaningful issues, stay silent unless the runner requires a response.
