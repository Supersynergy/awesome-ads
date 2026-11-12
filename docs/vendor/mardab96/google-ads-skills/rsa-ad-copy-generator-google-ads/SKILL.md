---
name: rsa-ad-copy-generator-google-ads
description: Creates 15 RSA headlines and 4 descriptions for Google Ads Search campaigns using the user's brand voice, target intent, landing page, offer, differentiators, and compliance constraints. Use when the user asks to create new RSA copy, refresh underperforming ads, launch a new ad group, or test new messaging angles.
---

# RSA Ad Copy Generator — Google Ads

## Use this skill when

The user wants new Responsive Search Ad copy.

Common user requests:

- "Write RSA ads for this ad group."
- "Generate 15 headlines and 4 descriptions."
- "Create Google Ads copy for these keywords."
- "Use this brand voice and landing page."
- "Give me new ad copy angles to test."

## Required input

Minimum required:

- product or service,
- target audience,
- keyword theme or search intent,
- landing page URL or landing page summary,
- brand voice,
- offer or CTA,
- geographic market and language.

Recommended inputs:

- existing best-performing ads,
- search terms report,
- competitor positioning,
- differentiators,
- proof points,
- pricing or promo,
- compliance constraints,
- claims that are allowed or forbidden,
- words or phrases to avoid.

## Before writing

1. Identify the dominant search intent:
   - brand,
   - category,
   - competitor,
   - problem-aware,
   - solution-aware,
   - local,
   - urgent,
   - comparison,
   - price-sensitive.
2. Identify brand voice:
   - direct,
   - premium,
   - technical,
   - friendly,
   - authoritative,
   - playful,
   - enterprise,
   - minimalist.
3. Identify the landing page promise.
4. Identify proof points and allowed claims.
5. Identify compliance restrictions.

## Copy constraints

Google RSA limits:

- 15 headlines maximum.
- 30 characters maximum per headline.
- 4 descriptions maximum.
- 90 characters maximum per description.

When writing, ensure:

- every headline is within 30 characters,
- every description is within 90 characters,
- headlines are meaningfully distinct,
- at least 2–3 headlines include keyword or intent relevance,
- at least 2 headlines include proof or differentiation,
- at least 2 headlines include CTA or action framing,
- descriptions cover benefit, proof, offer, and CTA.

## Generation workflow

1. Extract keyword theme and user intent.
2. Extract landing page promise and offer.
3. Build messaging angles:
   - keyword relevance,
   - core benefit,
   - pain point,
   - proof,
   - feature,
   - outcome,
   - CTA,
   - audience qualifier,
   - objection handler,
   - offer.
4. Generate candidate headlines.
5. Remove duplicates and near-duplicates.
6. Check character limits.
7. Generate candidate descriptions.
8. Check character limits.
9. Label each asset by message role.
10. Provide optional pinning recommendations only when justified.

## Verification pass

Mandatory, after every generated set and before showing output:

1. Re-count every headline and description character by character, including spaces and punctuation. Headlines: 30 characters max. Descriptions: 90 characters max. Any overflow -> rewrite that asset and re-count; never trim by truncation.
2. Non-English markets run long: German and Polish translations of an English draft typically grow 20-30%, so draft against a ~25-character headline budget in those languages [heuristic].
3. Missing-input paths: no brand voice supplied -> derive tone from the landing page copy and label the assumption; no proof points supplied -> ask, never invent numbers, customers, or awards; no keyword list -> generate from the landing page's own vocabulary and say so.
4. Verify no asset duplicates another's first 20 characters (near-duplicates waste asset slots).

2026 note: call-only ads were deprecated in February 2026 - never generate them. Campaigns with auto-created assets, DSA, or campaign-level broad match auto-upgrade to AI Max from September 2026; with auto-created assets on, Google may serve its own variants next to this set.

## Practical example

Local services client (HVAC contractor) launching new ad group for "emergency furnace repair". Inputs provided: landing page promise "24/7 service, 1-hour response time", brand voice "trustworthy, urgent, family-owned", target market: Chicago metro, must-mention 4.9-star rating from 850+ reviews, must-avoid medical-style guarantees. Claude generates 15 headlines spanning message roles: 4 keyword-relevance ("Emergency Furnace Repair", "Furnace Not Working?"), 3 proof ("4.9★ from 850+ Reviews", "Family-Owned Since 1998"), 3 CTA ("Call Now - 1hr Response", "Schedule Service 24/7"), 3 urgency ("Today's Service Available", "24/7 Emergency Calls"), 2 audience qualifier ("Chicago Metro - Local Tech"). All 15 within 30 chars. Plus 4 descriptions combining benefit + offer + proof + CTA, all within 90 chars. Pinning recommendation: pin "Emergency Furnace Repair" to H1 only if compliance requires keyword presence (otherwise leave unpinned for full asset rotation). Testing notes: hypothesis is that proof + speed combination outperforms pure urgency in this category.

## Output format

### RSA copy set

Return a table with 15 headlines:

- number
- headline
- character count
- message role
- notes

Return a table with 4 descriptions:

- number
- description
- character count
- message role
- notes

### Suggested pinning

Only include if necessary:

- H1 pin recommendation,
- H2 pin recommendation,
- reason,
- risk.

### Testing notes

Include:

- primary hypothesis,
- what this RSA is testing,
- expected impact: CTR, CVR, lead quality, or relevance,
- what to compare against.

### Route to next

Grading what already runs -> rsa-ad-copy-review-google-ads. Page alignment for the new copy -> landing-page-match-scorer-google-ads.

### Data gaps

Name the exports or fields that were missing and which verdict each one would firm up.

## Guardrails

- Do not exceed character limits.
- Do not make unsupported claims.
- Do not invent awards, ratings, pricing, guarantees, inventory, certifications, or compliance claims.
- Do not use competitor names unless the user explicitly approves competitor advertising.
- Do not create repetitive headlines that only rephrase the same claim.
- Do not recommend excessive pinning unless needed for compliance, brand, or message control.
- When a threshold in this skill does not fit the account's volume or vertical, say which one you adjusted and why.
