---
name: supply-chain-transparency-adstxt-sellersjson
description: Implement and audit the ad supply-chain transparency files (ads.txt v1.1, app-ads.txt, sellers.json v1.0, and the OpenRTB SupplyChain object) to verify who is authorized to sell an impression and prune unauthorized or opaque paths. Use when the user asks how to write or fix an ads.txt or app-ads.txt file, what OWNERDOMAIN / MANAGERDOMAIN / INVENTORYPARTNERDOMAIN mean, how to read sellers.json, what seller_type PUBLISHER / INTERMEDIARY / BOTH means, how the schain / SupplyChain object works, how to cross-check ads.txt against sellers.json against schain, how to catch a not-authorized or unverifiable seller, or how to run a supply-chain authorization audit.
---

# Supply-chain transparency: ads.txt, sellers.json, SupplyChain object

Write, read, and audit the four files that declare who is allowed to sell a given impression, so you can prove a path is authorized before you spend on it. A publisher declares its authorized sellers in `ads.txt` (web) or `app-ads.txt` (apps). Every ad system declares the accounts it represents in `sellers.json`. Each bid request carries a `SupplyChain` object (schain) naming the exact hops the impression took. Line these three up and an unauthorized reseller, a spoofed domain, or a hop that pays a node nobody declared falls out immediately.

This skill assumes you know CPM, take rate, PMP, Deal ID, and how an OpenRTB auction clears. For that math see the `programmatic-foundations` skill.

This skill is the files themselves: their fields, how to author them, and how to cross-check them. The decision of which surviving path to keep or drop for spend, DSP-side inventory-source and exchange controls, OpenPath, and Sincera-style path ranking live in the sibling `curation-and-supply-path-optimization` skill. Author and audit here, then hand the clean-path list there.

## When to use this skill

- "Write / fix our ads.txt (or app-ads.txt) file." / "Why is DV360 or the SSP saying we are not authorized?"
- "What does OWNERDOMAIN / MANAGERDOMAIN / INVENTORYPARTNERDOMAIN do?"
- "How do I read a sellers.json file?" / "What is seller_type PUBLISHER vs INTERMEDIARY vs BOTH?"
- "What is is_confidential / is_passthrough?"
- "How does the schain / SupplyChain object work? What does complete=1 and hp=1 mean?"
- "Cross-check our ads.txt against the SSP's sellers.json against the schain on the bid stream."
- "Audit a publisher or a supply path for unauthorized or unverifiable sellers."
- "Set up app-ads.txt for our CTV / mobile app." / "Where does the crawler find it?"

Boundaries with sibling skills:
- Which clean path to keep for spend, DSP exchange and inventory-source pruning, OpenPath, transparency-data ranking (Sincera / OpenSincera): `curation-and-supply-path-optimization`.
- Packaging data onto inventory and buying a curated Deal ID: `curation-and-curated-marketplaces`.
- Blocking unsafe or unsuitable content (as opposed to unauthorized paths): `brand-safety-and-suitability`.
- CTV pod, SSAI, and multi-seller-pod supply structure: `ctv-supply-and-ad-pods`.
- Plumbing a Deal ID into a line item once the path is clean: `dv360-deals-and-inventory`, `ttd-inventory-and-deals`, `amazon-dsp-inventory-and-supply`.

## Quick reference

| File | Published by | Answers | Located at |
| --- | --- | --- | --- |
| `ads.txt` v1.1 | The publisher (web) | Which ad systems may sell this domain, DIRECT or RESELLER | `https://root-domain/ads.txt` |
| `app-ads.txt` v1.1 | The app publisher | Which ad systems may sell this app | `https://developer-domain/app-ads.txt` (developer URL from the store listing) |
| `sellers.json` v1.0 | Every ad system (SSP, exchange, reseller) | Which seller accounts it represents, and each account's type | `https://ad-system-domain/sellers.json` |
| `SupplyChain` object v1.0 | Carried on the bid request | The exact ordered hops this impression took | OpenRTB `source.ext.schain` (or `source.schain`) |

The authorization chain you are proving:

`publisher ads.txt` names an ad system + account ID → that account exists in the ad system's `sellers.json` with a declared type → every hop on the bid request's `schain` matches a declared seller, and `complete=1` means the chain reaches back to the owner.

A path is authorized only if all three agree. Any break (account in schain not in ads.txt, seller_id in schain not in the ad system's sellers.json, or a chain that is not complete) is an unauthorized or opaque path to drop or investigate.

## Core process

1. Fetch the publisher's file first, because it is the root of authority. Pull `https://<root-domain>/ads.txt` for web or the developer's `app-ads.txt` for apps. Use the root domain (public suffix plus one label), follow same-root redirects, and honor one single-hop redirect off-root. A 404 means "no declarations, treat nothing as authorized"; a 200 with a placeholder record means "this publisher authorizes nobody" (see pitfalls).
2. Parse each data record as four comma-separated fields: ad-system domain, publisher account ID, relationship (DIRECT or RESELLER), and optional certification authority ID (TAG ID). Store variables (`OWNERDOMAIN`, `MANAGERDOMAIN`, `CONTACT`, `SUBDOMAIN`, `INVENTORYPARTNERDOMAIN`) separately; they are `VARIABLE=VALUE`, not records. Field map in `references/adstxt-v11-fields.md`.
3. For each ad system named in ads.txt, fetch its `sellers.json` at `https://<ad-system-domain>/sellers.json` and look up the account ID as a `seller_id`. Confirm the `seller_type` (PUBLISHER, INTERMEDIARY, or BOTH) and that `name`/`domain` are present unless `is_confidential=1`. A DIRECT line should map to a PUBLISHER or BOTH seller whose `domain` matches the publisher's `OWNERDOMAIN`. Field map in `references/sellersjson-and-schain.md`.
4. Read the `SupplyChain` object on a sample of live bid requests (from a DSP inventory report, a bid-stream sample, or a log-level feed). Walk the `nodes` array: each node's `asi` is an ad-system domain and `sid` is that system's seller account. Every `(asi, sid)` pair must resolve to a `seller_id` in that system's sellers.json. `complete=1` asserts the chain reaches the inventory owner; `complete=0` is an incomplete, lower-trust chain.
5. Cross-check the three sources against each other, because agreement is the whole point. For each path, confirm: the first (owner) node's declared domain matches the publisher `OWNERDOMAIN`; every intermediary node's `seller_id` exists in its sellers.json as INTERMEDIARY or BOTH; and every ad system that appears in the schain also appears (directly or via a RESELLER chain) in the publisher's ads.txt. The full audit table is in `references/cross-check-audit-workflow.md`.
6. Classify each path as authorized, unauthorized, or unverifiable, and produce a list. Authorized paths pass all three checks. Unauthorized paths have a node the publisher never declared (possible spoofing or unauthorized reselling). Unverifiable paths have a confidential or missing seller you cannot resolve. Read and recommend only. Hand the classified list to `curation-and-supply-path-optimization` for the actual keep/drop spend decision, and human-gate any change that removes a path from a live campaign.

## Decision rules and thresholds

### Authoring a publisher ads.txt or app-ads.txt

- List every ad system you let sell your inventory as its own line, with the exact account ID that system uses in bid requests (OpenRTB `publisher.id`). A missing or wrong account ID means the SSP reads you as unauthorized and buyers on transparency-only settings will not bid.
- Mark the relationship honestly. DIRECT means you hold the account and have a direct contract with that ad system. RESELLER means you authorized another party to sell through that system's account. Buyers weight DIRECT higher, so do not label a reseller path DIRECT.
- Always include `OWNERDOMAIN` set to your business's root domain (public suffix plus one, not a full URL), even when it equals the domain hosting the file. It ties your ads.txt to your `sellers.domain` entries in every SSP's sellers.json and lets buyers confirm the owner node of a complete schain.
- Use `MANAGERDOMAIN` only when a monetization partner, not you, is the primary or exclusive programmatic seller for the site, optionally per country with an ISO 3166-1 alpha-2 code (`MANAGERDOMAIN=partner.com, US`). One global default (no country) plus per-country overrides.
- Use `INVENTORYPARTNERDOMAIN` when your app or site carries inventory owned by another partner, to point the crawler at that partner's ads.txt instead of duplicating every partner line. This reference is followed to an ads.txt file only, never app-ads.txt.
- For an app, host `app-ads.txt` on the developer domain listed in the app store, not on a random domain. The crawler reads the developer URL from the store listing to find the file, so the store listing must carry a real developer website.

### Reading a sellers.json entry

- `seller_type` decides what a node is: PUBLISHER (the ad system pays this entity directly for inventory it owns), INTERMEDIARY (a reseller that does not own the inventory), or BOTH. Treat the value case-insensitively.
- `is_confidential=1` lets the ad system omit `name` and `domain`. A confidential seller is legal but unverifiable from the file alone; treat it as lower transparency and do not auto-authorize it on a transparency-strict buy.
- `is_passthrough=1` means the seller has an account-control relationship with the downstream system and is a facilitator, not the paid entity. Passthrough nodes are normal in header-bidding wrappers; do not count them as an extra take-rate hop by themselves.
- A DIRECT ads.txt line should resolve to a PUBLISHER or BOTH seller whose `domain` equals your `OWNERDOMAIN`. If the DIRECT line maps to an INTERMEDIARY, the label is wrong or the relationship is misdeclared.

### Reading the SupplyChain object

- `complete=1` means every node from the inventory owner forward is present. `complete=0` means at least one hop is missing, so you cannot fully attribute the path. Prefer complete chains; treat incomplete chains as lower trust.
- `hp=1` marks a node in the payment flow (the `asi` system pays the `sid` seller). Nodes where `hp=1` are the ones taking or passing money, so they are where fee leakage and unauthorized reselling hide.
- The first node in a complete chain is the originating publisher. Its declared `domain` should match the publisher's `OWNERDOMAIN` in ads.txt. A mismatch is a spoofing signal.
- Every `(asi, sid)` in the chain must resolve in that `asi`'s sellers.json. An `asi` with no reachable sellers.json, or a `sid` not listed in it, is unverifiable and should not be trusted on a transparency-strict buy.

### When to flag a path

- Account in the schain that the publisher never declared in ads.txt: unauthorized. Possible domain spoofing or unauthorized reselling. Escalate before spending.
- `seller_id` in the schain not present in the ad system's sellers.json: unverifiable. The ad system cannot vouch for the seller.
- DIRECT line resolving to an INTERMEDIARY seller, or an owner node whose domain does not match OWNERDOMAIN: misdeclaration or spoofing. Investigate.
- Confidential seller (`is_confidential=1`) on a path where the buyer requires full transparency: unverifiable for that buy even if legitimate.
- Incomplete chain (`complete=0`) on premium or regulated inventory where you must prove the full path: reject or require a complete-chain path.

### Freshness and caching

- Cache these files, but re-verify freshness before use. Honor the HTTP `Expires` header; if none is present, default to a 7-day expiry for both ads.txt and sellers.json. Stale authorization data is how a revoked seller keeps clearing.

## Reference material

- `references/adstxt-v11-fields.md`: the full ads.txt / app-ads.txt v1.1 record and variable field map, the DIRECT/RESELLER and all five variable semantics, the placeholder-empty-file record, and app-ads.txt discovery. Read this when authoring or parsing an ads.txt or app-ads.txt file.
- `references/sellersjson-and-schain.md`: the sellers.json v1.0 parent and seller object field map (seller_id, seller_type, is_confidential, is_passthrough, name, domain, identifiers), the OpenRTB SupplyChain object and node fields (asi, sid, hp, rid, complete, ver), and worked JSON. Read this when reading a sellers.json file or decoding a schain.
- `references/cross-check-audit-workflow.md`: the three-way cross-check decision table, a repeatable audit sequence, SQL and jq patterns for reconciling ads.txt against sellers.json against schain at scale, and the authorized / unauthorized / unverifiable classification rules. Read this when running a supply-chain authorization audit.

## Templates and examples

Publisher ads.txt for a directly sold site plus one reseller (real record syntax from the spec):

```
# ads.txt for example.com
greenadexchange.com, 12345, DIRECT, d75815a79
silverssp.com, 9675, RESELLER, f496211
blueadexchange.com, XF436, DIRECT
contact=adops@example.com
ownerdomain=example.com
```

Empty file that authorizes nobody (do not leave a real empty file, use the reserved placeholder record):

```
placeholder.example.com, placeholder, DIRECT, placeholder
```

App with a managed-monetization partner selling the US market:

```
# app-ads.txt on the developer domain
greenadexchange.com, 12345, DIRECT
ownerdomain=gamespublisher.com
managerdomain=partner-monetizer.com, US
```

sellers.json entry the DIRECT line above must resolve to (PUBLISHER, non-confidential):

```json
{
  "seller_id": "12345",
  "name": "Example Media",
  "domain": "example.com",
  "seller_type": "PUBLISHER"
}
```

A clean two-hop SupplyChain object (publisher, then SSP, complete):

```json
{
  "complete": 1,
  "ver": "1.0",
  "nodes": [
    { "asi": "greenadexchange.com", "sid": "12345", "hp": 1 },
    { "asi": "silverssp.com", "sid": "9675", "hp": 1 }
  ]
}
```

Audit verdict for that path: authorized if `greenadexchange.com` sellers.json lists seller_id 12345 as PUBLISHER with domain example.com matching OWNERDOMAIN, and example.com ads.txt lists greenadexchange.com 12345 DIRECT. If the schain also carried a node for `orangeexchange.com, 45678` and example.com ads.txt never listed orangeexchange.com, that path is unauthorized.

## Common pitfalls

- Wrong account ID in ads.txt. The account ID must be the exact `publisher.id` the ad system sends in bid requests. A typo reads as unauthorized and buyers on transparency settings stop bidding. Confirm the ID against the SSP's onboarding record, not from memory.
- Treating an empty ads.txt as "authorize everyone." A truly empty file is ambiguous and deprecated since March 2020. To authorize nobody, publish the reserved placeholder record. To authorize sellers, list them. Never assume a 200 with no records means open.
- Following an INVENTORYPARTNERDOMAIN reference into app-ads.txt. The reference is defined to point at an ads.txt file only. Following it to app-ads.txt is a parsing bug.
- Confusing hosting domain with OWNERDOMAIN. OWNERDOMAIN is the business owner's root domain and must match `sellers.domain` in the SSP's sellers.json, which is how a complete schain's owner node is verified. Set it explicitly even when it equals the file's host.
- Missing sellers.json on a reseller path. If an ad system in the schain has no reachable sellers.json, or the `sid` is not in it, the path is unverifiable, not authorized. Do not treat "we always bought it" as verification.
- Confidential sellers read as fraud. `is_confidential=1` is legitimate; the seller is just not disclosed in the file. Classify it as unverifiable-for-transparency, not unauthorized. Escalate to the SSP if you need the identity.
- Stale cache. Honoring no `Expires` header and never refreshing lets a revoked seller keep clearing. Default to a 7-day re-crawl.
- Spoofed domain in the schain. A first node whose declared domain does not match OWNERDOMAIN, or an account nobody declared, is a spoofing signal. Escalate; do not silently keep buying it.

## Sources

- [Ads.txt specification (IAB Tech Lab landing)](https://iabtechlab.com/ads-txt/) (as of July 2026)
- [Ads.txt v1.1 specification (PDF)](https://iabtechlab.com/wp-content/uploads/2022/04/Ads.txt-1.1.pdf) (as of July 2026)
- [Sellers.json (IAB Tech Lab landing)](https://iabtechlab.com/sellers-json/) (as of July 2026)
- [Sellers.json v1.0 specification (PDF)](https://iabtechlab.com/wp-content/uploads/2019/07/Sellers.json_Final.pdf) (as of July 2026)
- [OpenRTB SupplyChain object specification](https://github.com/InteractiveAdvertisingBureau/openrtb/blob/master/supplychainobject.md) (as of July 2026)
- [ads.cert 2.0 (Authenticated Connections)](https://iabtechlab.com/ads-cert/) (as of July 2026)
- [The trader's guide to supply path optimization (The Trade Desk)](https://www.thetradedesk.com/resources/the-traders-guide-to-supply-path-optimization-spo) (as of July 2026)
