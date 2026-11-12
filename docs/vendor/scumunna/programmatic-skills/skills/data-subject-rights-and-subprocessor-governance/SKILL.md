---
name: data-subject-rights-and-subprocessor-governance
description: Fulfill data subject rights (DSAR access, deletion, correction, opt-out of sale or sharing, limit sensitive data) across every ad platform on deadline, and keep a live sub-processor and DPA register with an append-only evidence trail. Use when the user asks about DSARs, right to know or access, deletion or erasure requests, opt-out of sale or sharing, GPC, Article 15 or 17 requests, a records of processing activity (RoPA), sub-processors, data processing agreements, standard contractual clauses, vendor privacy audits, breach notification clocks, or proving to a regulator that a denied or deleted user was actually suppressed.
---

# Data subject rights and sub-processor governance

Turn a privacy request into a completed, provable action across every platform in the stack, and keep the vendor side of the house (who processes the data, under what contract, in which region) current enough to answer a regulator the same day they ask. Two jobs, one operating system: the request pipeline (intake, verify, fan out, confirm, log) and the register (sub-processors, DPAs, transfer mechanisms, evidence). Both live or die on the same append-only evidence trail, so they ship together.

This skill owns fulfillment and governance. It does not decide whether a given user may be targeted in the first place, that gate is `privacy-and-consent`, and it does not decode a consent string byte by byte, that is `consent-signal-verification-and-decode`. This skill is what happens after a person exercises a right: you execute it everywhere, then you can prove you did.

## When to use this skill

- "We got a DSAR / access request / right-to-know request, what do I actually do?"
- "A user asked us to delete their data. Which platforms do I have to hit?"
- "Someone opted out of sale or sharing" / "GPC is on, are we honoring it?"
- "Build a sub-processor list / RoPA / Article 30 record for the ad stack."
- "Do we have a DPA with this SSP / DSP / measurement vendor? Is there an SCC?"
- "A regulator asked us to prove we suppressed a deleted user. Can we?"
- "We had a vendor breach, what is our notification clock and to whom?"
- "Vendor privacy review / annual sub-processor audit."

Boundaries with sibling skills:

- Whether a user is targetable at all, and the legal basis per region: `privacy-and-consent`.
- Decoding and validating TCF v2.3 or GPP strings and confirming a denied user was suppressed at the signal level: `consent-signal-verification-and-decode`.
- The 2026 identity and measurement strategy after signal loss: `privacy-sandbox-and-signal-loss-2026`.
- Who may approve a deletion that also destroys billing or attribution data: `approval-and-escalation-governance`.
- The clean rooms (Ads Data Hub, Amazon Marketing Cloud) where deletion propagation is opaque: `dv360-advanced-analytics-adh` and `amazon-marketing-cloud`.

## Quick reference

| Request type | Governing right | Clock (start to done) | Ad-stack action |
| --- | --- | --- | --- |
| Access / know (EU GDPR Art. 15) | Access | 1 month, extend +2 | Export the profile, audiences, and derived segments the user is in |
| Access / know (CCPA/CPRA) | Right to know | 45 days, extend +45 | Same, limited to the 12-month lookback the request covers |
| Deletion (GDPR Art. 17) | Erasure | 1 month, extend +2 | Delete from CDP, then fan out deletion to every downstream platform |
| Deletion (CCPA/CPRA) | Right to delete | 45 days, extend +45 | Same, plus instruct service providers to delete |
| Correction | Rectification | 1 month / 45 days | Correct source of record, re-sync audiences |
| Opt-out of sale or sharing (CCPA) | Opt-out | 15 business days for opt-out signals | Suppress from all sale/share audiences, honor GPC as the request |
| Limit sensitive PI (CPRA) | Limit | Promptly, no fixed max | Stop using sensitive categories for targeting |
| Objection to processing (GDPR Art. 21) | Object | 1 month | Stop the objected-to processing (often direct marketing) |

Two loops, one ledger. Every row above ends the same way: write an immutable evidence record (who, what, when, which platforms, what proof of completion). If you cannot produce that record later, the request is not done, it is merely started.

## Core process

### A. Fulfill a data subject request

1. **Intake and classify, because the request type sets the clock and the scope.** Capture the request into one queue with a timestamp, the claimed identity, the jurisdiction, and the right invoked. Map free text to a type: "send me my data" is access, "forget me" is deletion, "stop selling my info" is opt-out. The clock starts at receipt, not at verification, so log receipt immediately (see `references/jurisdiction-rules-matrix.md` for exact deadlines per law).

2. **Verify identity proportionally, because over-collecting to verify is itself a violation.** Match the request to a known identity using data you already hold (the email or phone that identifies the account), not new sensitive documents. For an opt-out of sale or sharing you generally cannot require verification at all, the signal itself (including GPC) is the request. Deletion and access do require reasonable verification. Record the method used, not the documents.

3. **Resolve every identifier the person maps to, because ad platforms key on hashes, not names.** A single person is a raw email, a normalized-and-SHA-256 hashed email, one or more phone hashes, a mobile advertising ID (IDFA or GAID), first-party cookie or CDP IDs, and any deterministic identity token (UID2 or EUID) derived from those. Build the full identifier bundle first, or you will delete the CDP row and leave the person alive in five audiences. The field map is in `references/dsar-fulfillment-workflow.md`.

4. **Fan out to every platform that holds or derives the data, because deleting the source does not delete the copies.** Walk the sub-processor register (Section B): for each platform that received this person, call its deletion or suppression path with the matching identifier. Some are API deletions (GA4 User Deletion API, Meta, TikTok), some are audience removals, some are support tickets with an SLA. The platform-by-platform method table lives in `references/dsar-fulfillment-workflow.md`.

5. **Handle the hard cases explicitly, because "I sent it downstream" is not "it is deleted."** Clean rooms, log-level exports already handed to a partner, backups, and modeled audiences each have their own deletion semantics. Clean-room deletion is often eventual and partial; log-level data already exported must be deleted by the recipient under their DPA; backups may be exempted if you can prove they are not restored into production. Note each exception with its legal basis in the ledger rather than silently skipping it.

6. **Confirm completion and close within the clock, because an on-time partial is a breach dressed as compliance.** Collect the proof each platform returns (a deletion job ID, an API 200 with a request token, a support ticket resolution). If any platform cannot complete before the deadline, extend formally and notify the requester with the reason, do not let it lapse. Then respond to the requester in the required format.

7. **Write the immutable evidence record, because the request is not done until it is provable.** Append one record to the evidence ledger: request ID, type, jurisdiction, identity-verification method, the full identifier bundle, every platform hit with its per-platform proof, exceptions and their basis, and the close timestamp. This is what you hand a regulator. The ledger design and its append-only guarantee are in `references/evidence-ledger.md`.

### B. Maintain the sub-processor and DPA register

1. **Enumerate every processor and sub-processor, because you cannot govern what you have not listed.** A processor is any vendor that touches personal data on your behalf: DSPs, SSPs, CDP, measurement and MMPs, clean rooms, tag manager, email or SMS, and the cloud they run on. For each, list the data categories, the purpose, the regions where data is processed, and the sub-processors they in turn use. This is your Article 30 record of processing activities plus the sub-processor layer.

2. **Attach the contract and the transfer mechanism to each entry, because a vendor with no signed DPA is unpriced legal risk.** Every processor needs a written data processing agreement (GDPR Article 28). Cross-border transfers out of the EU or UK need a transfer mechanism (Standard Contractual Clauses, the EU-US Data Privacy Framework where the vendor is certified, UK IDTA or Addendum). Record the DPA date, version, and the transfer mechanism per entry. The field schema is in `references/subprocessor-dpa-register.md`.

3. **Wire sub-processor change notifications into the register, because Article 28 makes you liable for their sub-processors.** Most DPAs give you a window to object when a vendor adds a sub-processor. Subscribe to each vendor's sub-processor change list and diff it on a cadence, so a new sub-processor in a new country surfaces as a review item, not a surprise in an audit.

4. **Feed the register into deletion fan-out, because the register is the authoritative list of who to delete from.** The same register that satisfies the auditor is the routing table for step A.4. If a platform is in the register, deletion must reach it, if it is not in the register, either it holds no personal data or the register is wrong. Keep them in sync deliberately.

5. **Review on a cadence and on trigger, because a stale register is worse than none.** Re-verify the register quarterly and whenever a vendor is added, a breach is disclosed, or a sub-processor changes. Track each vendor's breach-notification SLA so that when a vendor reports an incident you already know your own downstream clock (72 hours to the supervisory authority under GDPR from your awareness).

## Decision rules and thresholds

- **The clock starts at receipt, full stop.** GDPR is one month from receipt, extendable by two more for complexity with notice inside the first month. CCPA/CPRA is 45 calendar days, extendable by 45 with notice. Opt-out of sale or sharing signals must be honored within 15 business days under the California regulations. Do not restart the clock at verification.

- **Opt-out needs no verification, deletion and access do.** You may not demand identity proof to honor an opt-out of sale or sharing, and GPC is itself a valid opt-out request you must honor. For deletion and access, verify to a "reasonable degree" (higher for sensitive data) using data you already hold. Never collect a government ID to satisfy a request for an email address you already have.

- **Delete the person, not the row.** Deletion is complete only when every identifier in the bundle is removed or suppressed everywhere in the register. A CDP delete that leaves the hashed email live in three DSP audiences is not compliant. Resolve identifiers first, fan out second.

- **GPC is a request, not a preference.** A Global Privacy Control browser signal is a legally valid opt-out of sale or sharing under California law. If your stack reads it and does nothing, you are non-compliant regardless of what your cookie banner says.

- **No DPA, no data.** A processor without a signed Article 28 DPA should not be receiving personal data. Treat a missing DPA as a stop-ship finding, not a paperwork backlog item.

- **Match the transfer mechanism to the destination.** EU or UK personal data leaving for a US vendor needs SCCs, or the vendor's active Data Privacy Framework certification, or (for the UK) the IDTA or the UK Addendum to the SCCs. A vendor with US data centers and no transfer mechanism is a transfer violation.

- **Breach clock: 72 hours to the authority, without undue delay to the vendor upstream.** Under GDPR you have 72 hours from becoming aware of a personal-data breach to notify the supervisory authority. If the breach is at a sub-processor, your clock starts when they tell you, which is exactly why their notification SLA belongs in the register.

- **Append, never overwrite.** The evidence ledger is write-once per event. If a fact changes, append a correcting record with a reason, do not edit history. A ledger you can rewrite is not evidence.

## Reference material

- `references/dsar-fulfillment-workflow.md`: the full identifier-resolution field map (email, hashed email, phone, MAID, cookie or CDP ID, UID2 or EUID) and a platform-by-platform deletion and suppression method table (GA4 User Deletion API, Google Ads, DV360, Meta, TikTok, The Trade Desk, Amazon, CDP, clean rooms) with the request path, the identifier each expects, and the proof it returns. Read this when actually executing a deletion or access request.

- `references/subprocessor-dpa-register.md`: the register schema (vendor, role, data categories, regions, sub-processors, DPA date and version, transfer mechanism, breach SLA, sub-processor change URL) with a filled example row per platform type and the Article 30 field mapping. Read this when building or auditing the vendor register or a RoPA.

- `references/jurisdiction-rules-matrix.md`: a law-by-law matrix (GDPR, UK GDPR, CCPA/CPRA, and the other US state laws) of which rights exist, the response deadline, the extension rule, verification standard, and the opt-out signal each recognizes. Read this when a request arrives and you need the exact clock and scope for that jurisdiction.

- `references/evidence-ledger.md`: the append-only evidence record schema, a hash-chaining pattern so records cannot be silently altered, retention guidance, and the exact fields a regulator expects to see for a completed request. Read this when designing the ledger or preparing an audit response.

## Templates and examples

**EU deletion request, mid-size retailer.** Intake logs receipt at 14:02 UTC on 2026-03-19, right invoked is Article 17 erasure, jurisdiction EU. Verify against the account email `jane.doe@example.com` (no ID demanded, the email identifies the account). Resolve the bundle: raw email, `sha256(normalize(email))` = `5e88...` , phone hash, GAID `38400000-8cf0-11bd-b23e-10b96e40000d`, CDP ID `cdp_9f2a`, EUID token. Fan out: CDP delete (job `del_7781`), GA4 User Deletion API by `user_id` (request token returned), DV360 and Google Ads Customer Match audience removal by hashed email, Meta by hashed email plus GAID, The Trade Desk suppression by UID2, measurement vendor support ticket (SLA 30 days). Clean-room (Ads Data Hub) deletion is eventual, note it as an exception. Confirm all within the one-month clock, respond to Jane in a portable format for the access portion, append the evidence record.

**California opt-out via GPC.** Server reads a `Sec-GPC: 1` header (and the GPP US string carries the opt-out too, decode via `consent-signal-verification-and-decode`). No verification required. Treat it as an opt-out of sale or sharing: suppress the visitor's identifiers from all sale/share audiences within 15 business days, and set the state so future audience syncs exclude them. Log the signal, the timestamp, and the suppression proof. GPC being on and the banner saying "we value your privacy" is not compliance, the suppression is.

**Sub-processor register row, one DSP.** Vendor: The Trade Desk. Role: processor (DSP). Data categories: hashed emails, UID2, device IDs, IP-derived geo. Regions processed: US, EU. Sub-processors: cloud and data-center providers per their published list. DPA: signed 2025-11, v2025.2. Transfer mechanism for EU data to US: SCCs plus supplementary measures. Breach SLA: notify within 48 hours of confirmation. Sub-processor change page: their public trust or sub-processor URL, diffed monthly. This row is both the audit answer and the deletion routing entry.

**Vendor sub-processor added in a new country.** The monthly diff flags that a measurement vendor added a sub-processor in a region outside your approved transfer mechanism. That is a review item: check whether an SCC or DPF covers it, and if not, raise an objection inside the DPA window or find an alternative before data flows. This is the whole point of wiring change notifications into the register.

## Common pitfalls

- **Deleting the CDP and calling it done.** The person is still live in every downstream audience keyed on their hashed email or MAID. Resolve the full identifier bundle and fan out to the entire register.
- **Restarting the clock at verification.** The deadline runs from receipt. Slow verification eats your own window, it does not extend it.
- **Demanding ID for an opt-out.** Opt-out of sale or sharing needs no verification, and GPC is itself the request. Requiring a login or ID to honor GPC is a violation.
- **Ignoring GPC because the cookie banner "handles consent."** GPC is a separate, legally binding opt-out signal. Read it server-side and honor it.
- **A vendor with no DPA still receiving data.** Missing Article 28 contract is a stop-ship, not a backlog ticket. No DPA, no data.
- **US transfer with no mechanism.** EU or UK data at a US vendor with no SCCs, DPF certification, or IDTA is a transfer violation even if everything else is perfect.
- **Assuming clean-room and backup deletion are instant and total.** They are eventual and partial. Document the exception and its basis rather than claiming a completeness you cannot prove.
- **A register that drifts from reality.** A vendor onboarded without a register entry is a deletion the fan-out will miss. Keep the register and the routing table the same object.
- **An editable evidence log.** If you can rewrite it, it is not evidence. Append-only with hash chaining, or a regulator discounts the whole trail.
- **Treating a sub-processor breach as the vendor's problem.** Their breach starts your 72-hour clock. Know their SLA in advance so you are not learning it during an incident.

## Sources

- [Right to know and other CCPA/CPRA consumer rights, California Attorney General](https://oag.ca.gov/privacy/ccpa) (as of July 2026)
- [Global Privacy Control (GPC) under the CCPA, California Attorney General](https://oag.ca.gov/privacy/ccpa/gpc) (as of July 2026)
- [GDPR Article 28, processor obligations](https://gdpr.eu/article-28-processor/) (as of July 2026)
- [IAB Tech Lab Global Privacy Platform (GPP)](https://iabtechlab.com/gpp/) (as of July 2026)
- [Update on plans for Privacy Sandbox technologies, October 2025](https://privacysandbox.google.com/blog/update-on-plans-for-privacy-sandbox-technologies) (as of July 2026)
- [Privacy Sandbox status overview](https://privacysandbox.google.com/overview/status) (as of July 2026)
- [UID2 documentation and consumer opt-out](https://unifiedid.com/docs/intro) (as of July 2026)
