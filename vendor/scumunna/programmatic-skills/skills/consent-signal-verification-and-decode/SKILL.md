---
name: consent-signal-verification-and-decode
description: Decode and validate IAB TCF v2.3 and GPP consent strings and prove that opted-out users were actually suppressed across DSPs and tags. Use when the user asks how to decode a TCF or GPP string, read a euconsent-v2 or __gpp value, check DisclosedVendors, verify a vendor got consent for a purpose, confirm a Global Privacy Control (GPC) opt-out was honored, audit that denied users saw no personalized ads, reconcile consent state with delivery logs, or debug why a consented user was dropped or an opted-out user was still targeted.
---

# Consent signal verification and decode

Take a raw consent signal (a TCF v2.3 string, a GPP string, or a GPC header) and answer two questions an auditor or a DPO will ask: does this string actually grant what a vendor relied on, and did the denied population truly get suppressed in delivery. This skill is the technical decode-and-prove layer. It parses the strings, checks the specific bits a purpose or vendor needs, then joins consent state against delivery logs to confirm suppression really happened.

This skill assumes you know what GDPR consent, CCPA opt-out, and Consent Mode are. For the legal bases and regional eligibility rules, see the `privacy-and-consent` skill. For configuring Google Consent Mode v2 signals and modeling, see `gtm-consent-mode-v2`. This skill owns the bit-level decode and the suppression proof; those skills own the law and the tag config.

## When to use this skill

- "Decode this TCF string / this `euconsent-v2` value / this `__gpp` string."
- "Does vendor 755 have consent for Purpose 1 and legitimate interest for Purpose 7 in this string?"
- "Is my vendor in DisclosedVendors, or did the CMP silently drop it?"
- "Read this GPP string and tell me which sections it carries and what California (usca) says."
- "A user sent Global Privacy Control. Prove we stopped selling or sharing their data."
- "Audit that everyone who denied consent saw zero personalized impressions on DV360 / TTD / Amazon DSP."
- "Reconcile consent state against the delivery log and find the leakage."
- "Why did a consented user get dropped, or an opted-out user still get targeted?"

Boundaries with sibling skills:
- Which legal basis applies in a region and whether you may target at all: `privacy-and-consent`.
- Setting Consent Mode v2 signals (`ad_storage`, `analytics_storage`, `ad_user_data`, `ad_personalization`) and default vs update ordering: `gtm-consent-mode-v2`.
- The 2026 signal-loss landscape (Privacy Sandbox retired, Chrome cookies stay) and durable identity strategy: `privacy-sandbox-and-signal-loss-2026`.
- Fulfilling a DSAR or deletion request and keeping the sub-processor register: `data-subject-rights-and-subprocessor-governance`.

## Quick reference

| You have | What it is | Decode target | Read this reference |
| --- | --- | --- | --- |
| `euconsent-v2` cookie or `tcData` | TCF v2.3 core string, base64url | Purpose consents, LI, vendor consents, DisclosedVendors segment | `tcf-v23-and-disclosedvendors.md` |
| `__gpp` value or `gppData` | GPP consolidated string | Header section IDs, then each section (usnat, usca, tcfeuv2) | `gpp-transport-and-state-sections.md` |
| `Sec-GPC: 1` header or `navigator.globalPrivacyControl` | Global Privacy Control | A binding opt-out of sale/sharing under US state law | `gpc-binding-opt-out.md` |
| Delivery log plus consent log | Two datasets to join | Rows where denied consent still got a personalized impression | `gpc-binding-opt-out.md` and process below |

Decode-then-prove flow:
1. Identify the signal type from the cookie or field name (`euconsent-v2` is TCF, `__gpp` is GPP, `Sec-GPC` is GPC).
2. Decode the string to structured fields (never eyeball base64url; run a decoder).
3. Check the exact bit a purpose or vendor relies on, not just "consent = true" at the top level.
4. Join decoded consent state to delivery logs and prove the denied set got suppressed.

## Core process

1. Classify the signal before decoding, because each format has a different bit layout. A cookie or field named `euconsent-v2` (or a `__tcfapi` `tcData.tcString`) is a TCF v2.3 string. A `__gpp` cookie or `__gppapi` `gppString` is a GPP string, which is a wrapper that carries one or more sections. An HTTP `Sec-GPC: 1` request header or a truthy `navigator.globalPrivacyControl` is GPC, which is not a string to decode but a boolean opt-out to honor. Misclassifying wastes a decode pass and hides the real signal.

2. Decode with a spec-compliant decoder, never by hand. TCF strings are base64url-encoded bitfields where a single flipped bit changes a purpose or a vendor. Run `scripts/decode_consent.py` (or an equivalent IAB-conformant library) to expand the string into named fields. Hand-decoding base64url is how teams convince themselves a vendor had consent it never had.

3. For a TCF string, check the purpose and vendor bits the specific vendor relies on, not the top-level flag. A vendor needs consent (or a valid legitimate-interest establishment) for each purpose it declares, and it must appear in the string's vendor consent or vendor LI section. Purpose 1 (store and access information on a device) is the gating purpose for cookies; a vendor without Purpose 1 consent should not be setting or reading identifiers. Confirm the vendor ID is present and the relevant `PurposeConsents` and `PurposeLegitimateInterests` bits are set.

4. Verify DisclosedVendors when the vendor is missing, because a silent CMP drop looks identical to a denial. The DisclosedVendors segment (an optional out-of-band segment appended to the core string) lists every vendor the CMP surfaced to the user. If your vendor is not in DisclosedVendors, the CMP never showed it, so the user never had a chance to consent, and the fix is CMP configuration, not the creative or the line item. See `tcf-v23-and-disclosedvendors.md`.

5. For a GPP string, split the header first, then decode each named section. The header lists which sections are present by their integer section IDs. A US buy typically carries `usnat` (Section ID 7) or a specific state such as `usca` (Section ID 8). Decode the relevant section, then read its opt-out fields (Sale, Sharing, Targeted Advertising) rather than assuming the presence of the section means opt-out. See `gpp-transport-and-state-sections.md`.

6. For GPC, treat a truthy signal as a completed opt-out request and confirm downstream honoring. Under California and other US state law, `Sec-GPC: 1` (or `navigator.globalPrivacyControl === true`) is a valid, legally binding request to stop selling or sharing that user's personal information. Confirm your stack read it, wrote it into the GPP `usca`/`usnat` opt-out fields where applicable, and passed a suppression flag to every downstream vendor. See `gpc-binding-opt-out.md`.

7. Prove suppression by joining consent state to delivery logs, because a decoded denial only matters if the log shows no personalized impression. Pull the delivery or log-level export from each DSP, key it to the same user or session identifier as the consent log, and count personalized impressions for the denied population. The correct answer is zero. Any nonzero count is leakage: name the DSP, the line item, and the consent field that should have blocked it. This is a read-and-report step; do not silently change live targeting to "fix" it, escalate the leakage instead.

8. Report decoded state and suppression result together, never one without the other. A decode that says "consent denied" plus a log that says "412 personalized impressions served" is the finding. Ship both, with the join key and the row count, so the DPO or the client can act.

## Decision rules and thresholds

- TCF top-level consent is not vendor consent. `gdprApplies = true` with a populated string tells you the framework is active, not that any given vendor may act. Always drop to the per-purpose and per-vendor bits for the vendor you care about.
- Purpose 1 gates identifiers. If Purpose 1 (store/access on device) consent is absent for a vendor, that vendor must not set or read a cookie or device ID, regardless of other purposes. Treat missing Purpose 1 as "no identifiers" and expect contextual-only delivery.
- Legitimate interest is not a wildcard. A vendor relying on legitimate interest for a purpose must appear in the vendor LI section and the purpose must allow LI. Purposes 3, 4, 5, and 6 (personalization and content selection) commonly require consent, not LI, so an LI-only vendor claiming personalization is a red flag. Confirm against the current TCF policy rather than assuming.
- Vendor missing from DisclosedVendors means CMP misconfiguration, not user denial. Fix the CMP vendor list; do not re-target the user as if they had denied.
- GPP presence is not opt-out. A GPP string carrying `usca` does not mean the user opted out. Decode the section and read the Sale, Sharing, and Targeted Advertising opt-out fields. Only a set opt-out field is an opt-out.
- GPC truthy is a hard opt-out. `Sec-GPC: 1` or `navigator.globalPrivacyControl === true` is binding in California and other opt-out states. Stop selling or sharing immediately and reflect it in the outgoing GPP string. GPC applies even when no banner was shown.
- Suppression tolerance is zero. For the denied or opted-out population, the acceptable count of personalized impressions is exactly zero. There is no "close enough." A nonzero count is a reportable leak, sized by rows.
- Timestamp the decode. Consent state changes; a string decoded last week may be stale. Record the consent-collection timestamp and compare it to the impression timestamp so you are proving suppression for the state in force at serve time.

## Reference material

- `references/tcf-v23-and-disclosedvendors.md`: the TCF v2.3 field map (core string segments, PurposeConsents, PurposeLegitimateInterests, vendor sections), the DisclosedVendors and AllowedVendors out-of-band segments, the `__tcfapi` command surface, and a decode checklist. Read this when decoding a `euconsent-v2` string or explaining why a vendor is or is not eligible.
- `references/gpp-transport-and-state-sections.md`: the full GPP section ID table (usnat, usca, usva, usco, usut, usct and the rest), the header structure, the `__gppapi` transport commands, and the opt-out fields inside the US sections. Read this when decoding a `__gpp` string or mapping a US state to its section.
- `references/gpc-binding-opt-out.md`: the GPC mechanics (`Sec-GPC` header, JS property), the legal binding under California and other states, how GPC maps into the GPP US sections, and the SQL join patterns to prove suppression against DSP delivery logs. Read this when honoring or auditing a GPC opt-out or when proving a denied population was suppressed.
- `scripts/decode_consent.py`: a standard-library decoder that expands a TCF v2.x core string (version, CMP, purpose consents and LI bitfields) or lists the sections in a GPP wrapper. Run it on a raw log string when you have no page-context CMP API. It reads the string from an argument or a file path, uses no credentials, and prints usage with `--help`.

## Templates and examples

Filled examples an operator would actually produce.

TCF vendor eligibility check. Vendor ID 755, string `CPa...` from the `euconsent-v2` cookie. Decode shows `PurposeConsents` has bits 1 and 7 set, `VendorConsents` includes 755, and 755 is present in DisclosedVendors. Verdict: 755 may store/access on device (Purpose 1) and measure ad performance (Purpose 7) by consent. It may not personalize ads, because Purpose 4 is not set. Report: "Vendor 755 consented for P1 and P7, not P4; personalization must be off for this user."

DisclosedVendors gap. Vendor ID 129 is absent from `VendorConsents` and also absent from DisclosedVendors. Verdict: the CMP never surfaced vendor 129, so the user had no chance to consent. Report: "Vendor 129 missing from DisclosedVendors; this is a CMP vendor-list gap, not a user denial. Add 129 to the CMP GVL configuration and re-collect consent. Do not treat as an opt-out."

GPP string with a California opt-out. `__gpp` string header lists sections 7 (usnat) and 8 (usca). Decoding usca shows `SaleOptOut = 1` and `SharingOptOut = 1`. Verdict: this California user opted out of sale and sharing. Report: "usca SaleOptOut and SharingOptOut both set. Suppress from any audience that constitutes a sale or share; pass the opt-out to every downstream vendor."

GPC honored, proof required. Request arrives with `Sec-GPC: 1`. The stack sets `usca.SaleOptOut = 1` and flags the session opted-out. Delivery log join on `session_id` for the opted-out set returns 0 personalized impressions across DV360 and TTD. Report: "GPC opt-out honored; 0 personalized impressions served to the opted-out session set (n=3,204). Suppression verified."

Suppression leak found. Consent log has 8,110 sessions with TCF Purpose 4 denied. Delivery log join returns 412 personalized impressions to that set, all on one DV360 line item. Report: "Leak: 412 personalized impressions served to Purpose-4-denied sessions, all on line item 88213004. Consent field P4 = 0 should have suppressed. Escalate to pause the line item and audit its consent-forwarding config." Do not silently pause it yourself; hand the finding to the owner.

## Common pitfalls

- Reading the top-level consent flag and stopping. `gdprApplies` or a populated string is not vendor consent. Always check the specific purpose and vendor bits.
- Confusing a missing vendor with a denial. If the vendor is not in DisclosedVendors, the CMP never showed it. That is a config bug, not a user choice; do not respond by suppressing as if denied.
- Assuming GPP presence equals opt-out. A `usca` section can carry no opt-out. Decode the actual Sale/Sharing/Targeted Advertising fields.
- Ignoring GPC because no banner fired. GPC is binding without any banner interaction in opt-out states. Honor it regardless.
- Treating legitimate interest as consent. LI and consent are separate signals with separate bits; a purpose that requires consent is not satisfied by an LI bit.
- Proving decode but never proving delivery. A decoded denial with no log join proves nothing about what was served. The suppression count is the deliverable.
- Joining on mismatched keys or time. If the consent log and the delivery log use different identifiers or you ignore timestamps, the join is meaningless. Align the key and compare consent time to serve time.
- Hand-decoding base64url. A single wrong bit flips a purpose. Run a conformant decoder.
- Changing live targeting to "fix" a leak mid-audit. Report the leak with DSP, line item, and count, then let the owner gate the change. Silent live edits during an audit destroy the evidence trail.

## Sources

- IAB Tech Lab, Global Privacy Platform (GPP): https://iabtechlab.com/gpp/ (as of July 2026)
- IAB Tech Lab, GPP Section Information (canonical section ID table): https://github.com/InteractiveAdvertisingBureau/Global-Privacy-Platform/blob/main/Sections/Section%20Information.md (as of July 2026)
- California Attorney General, Global Privacy Control (GPC): https://oag.ca.gov/privacy/ccpa/gpc (as of July 2026)
- Privacy Sandbox, status of the Privacy Sandbox APIs: https://privacysandbox.google.com/overview/status (as of July 2026)
- Privacy Sandbox, update on plans for Privacy Sandbox technologies: https://privacysandbox.google.com/blog/update-on-plans-for-privacy-sandbox-technologies (as of July 2026)
