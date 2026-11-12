---
name: sa360-account-structure-and-engines
description: Set up and navigate the new Search Ads 360 account hierarchy. Use when the user asks about SA360 managers, sub-managers, associate managers, client accounts, engine accounts vs engine track accounts, linking Google Ads or Microsoft Advertising or Yahoo! Japan, tracking non-integrated engines like Naver or Yandex, where an account sits in the tree, account_level values, or why an engine track account is stuck "Waiting for click events".
---

# SA360 account structure and engines

Lay out and read the new Search Ads 360 account tree so campaigns land in the right place and reporting rolls up cleanly. The hierarchy has two kinds of leaf: an engine account, which is a live sync to a supported platform (Google Ads, Microsoft Advertising, Yahoo! Japan), and an engine track account, which is a click-tracking shell for a platform SA360 does not manage (adMarketplace, Naver, Qihoo/360.cn, Yandex). Getting this wrong means duplicated spend, orphaned campaigns, or an engine that never records a click.

This skill covers only the new SA360 experience. The classic (legacy) SA360 is retired, so ignore any advice built around advertisers, engine instances, or the old "agency > advertiser > engine account" wording. Write for the new manager tree.

This skill assumes you know what a search campaign, keyword, and conversion are. For KPI math see the `programmatic-foundations` skill.

## When to use this skill

- "How does the new SA360 account hierarchy work?" / "What is a manager vs sub-manager vs associate manager?"
- "What is the difference between an engine account and an engine track account?"
- "How do I link Google Ads / Microsoft Advertising / Yahoo! Japan to SA360?"
- "How do I track Naver / Yandex / adMarketplace clicks in SA360?"
- "Where should I create this client account in the tree?"
- "My engine track account is stuck on 'Waiting for click events'. Why?"
- "What are the account_level values and how do I traverse the tree in the Reporting API?"

Boundaries with sibling skills:
- Choosing and configuring bid and budget strategies: `sa360-bidding-and-budget-management`.
- Wiring conversion sources (Floodlight, Google Ads, GA4) and pulling data with the Reporting API v0 query language: `sa360-conversions-and-reporting-api`. This skill only names the hierarchy fields the query language exposes.
- Google Ads account structure itself (the engine SA360 syncs from): the Google Ads family skills.

## Quick reference

Node types in the new SA360 tree, top to bottom:

| Node | What it is | Holds campaigns? | account_level enum |
| --- | --- | --- | --- |
| Manager | Top billing and access container (the SA360 equivalent of an MCC) | No | `MANAGER` |
| Sub-manager | Optional grouping under a manager (agency team, brand, region) | No | `SUB_MANAGER` |
| Associate manager | A manager account cross-linked in from another org for shared access | No | `ASSOCIATE_MANAGER` |
| Client account (engine account) | A live sync to Google Ads, Microsoft Advertising, or Yahoo! Japan | Yes (synced from the engine) | `CLIENT_ACCOUNT_GOOGLE_ADS`, `CLIENT_ACCOUNT_MICROSOFT`, `CLIENT_ACCOUNT_YAHOO_JAPAN` |
| Client account (engine track) | A tracking-only shell for a non-integrated engine | No synced campaigns; tracks clicks via URLs | `CLIENT_ACCOUNT_ENGINE_TRACK` |

Engine account vs engine track account, the one distinction that matters:

| | Engine account | Engine track account |
| --- | --- | --- |
| Platforms | Google Ads, Microsoft Advertising, Yahoo! Japan | adMarketplace, Naver, Qihoo/360.cn, Yandex, other non-integrated |
| Campaigns | Synced two-way from the engine | Not synced; you do not manage campaigns in SA360 |
| Bidding | SA360 can apply portfolio or native strategies | No bidding; tracking only |
| Data captured | Full campaign, keyword, cost, conversion data | Clicks and conversions via SA360 click-tracking URLs |
| Setup | Link credentials and authorize the sync | Create the shell, then deploy click-tracking URLs on the ads |
| First-run status | Syncs on link | "Waiting for click events" until a tracked URL fires |

## Core process

1. Confirm you are in the new SA360, not classic. The new experience mirrors the Google Ads UI (campaigns table, manager account switcher). If you see "advertisers" and "engine instances," you are in a retired product; stop and move to the new platform, because none of the tree below applies.
2. Start from a manager account. The manager is the top container that holds billing, user access, and every account below it. One organization usually has one root manager. Do not create client accounts loose at the top; they nest under a manager (or sub-manager).
3. Add sub-managers only when you need grouping. A sub-manager buys you a rollup level for an agency team, a brand, or a region, so that access and cross-account rules can be scoped there. Skip it for a single small advertiser; extra empty layers just slow navigation.
4. Decide engine account or engine track for each platform, because the two are not interchangeable. If SA360 integrates the platform (Google Ads, Microsoft Advertising, Yahoo! Japan), create an engine account and link it so campaigns sync. If it does not (Naver, Yandex, adMarketplace, Qihoo/360.cn), create an engine track account and plan to deploy click-tracking URLs.
5. Create the engine account and link credentials. Only an agency manager or advertiser manager has permission to create client accounts, so use an account with manager rights. Linking authorizes the two-way sync; once linked, campaigns, ad groups, keywords, and cost flow into SA360 and bid or budget changes flow back.
6. Set currency and time zone at the client-account level, because reporting and pacing math key off them. These are reported at the client account, not the manager. A mismatch against the engine causes spend and pacing to look wrong even when delivery is fine.
7. For an engine track account, deploy the click-tracking URLs, because nothing lands until a tracked click fires. A freshly created engine track account shows "Waiting for click events"; it clears only after the SA360 tracking URL is live on the ads and a user clicks. If it stays stuck, the URLs are not deployed or not firing (see pitfalls).
8. Verify the tree with the Reporting API before you trust rollups. Query the `customer` resource and read `account_level`, `manager_id`, `sub_manager_id`, and `associate_manager_id` to confirm each account nests where you expect. This catches an account linked under the wrong manager before it corrupts a rollup. Field detail is in `sa360-conversions-and-reporting-api`; the traversal map is in `references/manager-submanager-hierarchy.md`.

Safe-by-default: read and confirm the tree first. Creating or linking a client account changes billing and can start spend syncing, so treat account creation and engine linking as a human-gated step. Confirm the target manager, currency, and time zone with the account owner before you link.

## Decision rules and thresholds

### Engine account vs engine track account

- Platform is Google Ads, Microsoft Advertising, or Yahoo! Japan: engine account. You get full sync, reporting, and SA360 bidding.
- Platform is anything SA360 does not integrate (Naver, Yandex, adMarketplace, Qihoo/360.cn): engine track account. You get click and conversion tracking only, no campaign management, no bidding.
- You want SA360 to change bids on the platform: it must be an engine account. Engine track accounts cannot be bid on.

### When to add a sub-manager layer

- Add a sub-manager when a distinct team, brand, or region needs its own rollup, scoped access, or cross-account rules and labels. The new SA360 supports applying rules, labels, and changes across multiple accounts, and a sub-manager is the natural scope for that.
- Do not add a sub-manager for a single advertiser with a handful of accounts. Empty grouping layers add navigation cost and no rollup value.

### Currency and time zone

- Set currency and time zone once, at the client account, to match the engine. They are reported at the client-account level. Changing them later is disruptive to historical reporting, so get them right at creation.

### Reading the hierarchy programmatically

- `account_level` on the `customer` resource tells you exactly what a node is: `MANAGER`, `SUB_MANAGER`, `ASSOCIATE_MANAGER`, or one of the `CLIENT_ACCOUNT_*` values. Use it to walk the tree.
- `manager_id`, `sub_manager_id`, and `associate_manager_id` each hold the parent customer ID at that level, or `0` when there is no parent at that level. A client account with `manager_id` set and `sub_manager_id = 0` sits directly under the manager with no sub-manager between them.
- `account_type` and `engine_id` identify the external platform and the ID of the account inside that platform. Use them to reconcile an SA360 client account back to its Google Ads or Microsoft account.

## Reference material

- `references/manager-submanager-hierarchy.md`: the full node map, the `account_level` enum with each value's meaning, the parent-ID fields, a worked traversal example, and the permission model for who can create what. Read this when laying out a new tree or writing code that walks the hierarchy.
- `references/engine-vs-engine-track-accounts.md`: a side-by-side capability matrix, the supported-platform lists for each type, the engine-track click-tracking-URL lifecycle and the "Waiting for click events" states, and a decision flow for picking the account type. Read this when linking a new platform or debugging an engine track account.

## Templates and examples

- Single-brand advertiser, Google plus Microsoft search: one manager, no sub-manager, two engine accounts (`CLIENT_ACCOUNT_GOOGLE_ADS` and `CLIENT_ACCOUNT_MICROSOFT`) linked directly under the manager. Currency USD, time zone America/Los_Angeles set on each client account to match the engines.
- Agency with three brands: one manager, three sub-managers (one per brand), each holding that brand's engine accounts. Cross-account rules scoped at each sub-manager. Reporting rolls up per brand at the sub-manager and across all three at the manager.
- Advertiser also running Naver in Korea: add a `CLIENT_ACCOUNT_ENGINE_TRACK` account, deploy SA360 click-tracking URLs on the Naver ads, and expect "Waiting for click events" until the first tracked click. Naver bidding stays in Naver; SA360 only reports clicks and conversions.
- Two orgs sharing access: the partner's manager appears as an associate manager (`ASSOCIATE_MANAGER`) in your tree via cross-link, giving shared visibility without moving ownership.

## Common pitfalls

- Treating an engine track account like an engine account. Naver, Yandex, and adMarketplace do not sync campaigns or accept SA360 bids. If you expected campaign management there, you picked the wrong account type; there is no fix but tracking.
- Engine track account stuck on "Waiting for click events." The tracking URL is not deployed on the ads, is malformed, or no one has clicked yet. Confirm the SA360 click-tracking URL is live on the destination ads and fire a test click; the status clears only after a real tracked click.
- Client account created under the wrong manager or sub-manager. Reporting rolls up the wrong way and access is scoped wrong. Verify with `account_level` and the parent-ID fields before campaigns accumulate history.
- Currency or time zone mismatch against the engine. Spend, pacing, and dayparting look wrong even when delivery is correct. Set both at the client account to match the engine at creation, because fixing them later disrupts historical reporting.
- Non-manager user trying to create a client account. Only an agency manager or advertiser manager can create engine and engine track accounts. Use a manager-level account or the create action fails.
- Carrying over classic SA360 assumptions. The retired product used advertisers and engine instances; the new experience uses managers and client accounts. Advice built on the old model does not map.

## Sources

- [About manager accounts in Search Ads 360](https://support.google.com/sa360/answer/9158072?hl=en) (as of July 2026)
- [Create an engine track account](https://support.google.com/sa360/answer/14287791?hl=en) (as of July 2026)
- [Introducing the new Search Ads 360](https://blog.google/products/marketingplatform/360/introducing-new-search-ads-360/) (as of July 2026)
- [Search Ads 360 Reporting API release notes](https://developers.google.com/search-ads/reporting/api/reference/release-notes) (as of July 2026)
- [Search Ads 360 Reporting API customer resource fields (v0)](https://developers.google.com/search-ads/reporting/api/reference/fields/v0/customer) (as of July 2026)
