---
name: rsa-ad-copy-review-google-ads
description: Audits existing Google Ads RSA headlines and descriptions to identify repetitive messaging, weak intent match, missing differentiators, poor CTA coverage, pinning issues, compliance risks, and asset diversity gaps. Use when reviewing Search campaigns, improving ad relevance, diagnosing CTR or CVR issues, or preparing new RSA tests.
---

# RSA Ad Copy Review — Google Ads

## Use this skill when

The user wants to review current Responsive Search Ads for quality, intent fit, asset diversity, or performance issues.

Common user requests:

- "Review these RSAs."
- "Why is ad relevance weak?"
- "Improve our ad copy."
- "Check headline diversity."
- "Audit existing headlines and descriptions before writing new ones."

## Required input

Recommended exports:

- RSA asset report.
- Ad report with headlines and descriptions.
- Campaign and ad group structure.
- Search terms report.
- Keyword report.
- Landing page URLs.
- Brand voice or positioning guide.
- Compliance rules or restricted claims, if relevant.

Required fields where available:

- campaign
- ad group
- ad ID
- final URL
- headline text
- description text
- pinning status
- asset performance label
- impressions
- clicks
- CTR
- conversions
- CPA or ROAS
- search terms or keyword theme
- landing page topic

## Before analysis

1. Identify the ad group's core search intent.
2. Identify the user's brand voice.
3. Identify must-use and must-avoid claims.
4. Identify the landing page promise.
5. Identify whether the goal is CTR, CVR, lead quality, revenue, or compliance.

## Analysis workflow

1. Map each RSA to its:
   - campaign,
   - ad group,
   - keyword theme,
   - search intent,
   - landing page.
2. Classify each asset by message role:
   - keyword relevance,
   - problem / pain point,
   - benefit,
   - proof,
   - offer,
   - CTA,
   - audience qualifier,
   - feature,
   - objection handler,
   - brand.
3. Evaluate asset diversity:
   - repeated wording,
   - duplicated meaning,
   - too many generic claims,
   - missing proof,
   - missing CTA,
   - missing audience qualifier,
   - overreliance on keyword stuffing.
4. Evaluate search intent alignment:
   - commercial intent,
   - comparison intent,
   - local intent,
   - urgent intent,
   - informational intent,
   - brand intent.
5. Evaluate landing page alignment:
   - headline promise matches page,
   - offer matches page,
   - product/category matches page,
   - CTA matches page action.
6. Evaluate performance signals:
   - low CTR assets,
   - low CVR ad groups,
   - high spend with weak asset variety,
   - assets labeled low performance.
7. Identify policy or trust risks:
   - unsupported superlatives,
   - unverified guarantees,
   - medical, financial, or legal claims,
   - misleading urgency,
   - competitor trademark risk.

## Review criteria

Score each RSA from 1–5 on:

- intent match,
- message diversity,
- clarity,
- differentiation,
- CTA strength,
- landing page alignment,
- compliance safety,
- testing usefulness.

## Decision rules

Every threshold below is a starting heuristic, not a Google rule. When one does not fit the account's volume or vertical, say which one you adjusted and why.

Score anchors (so a 2 and a 4 mean the same thing on every run):

- 5: fulfills the dimension with evidence (keyword present naturally, benefit concrete, proof specific).
- 4: fulfills it with minor polish possible.
- 3: present but generic - would fit any competitor's ad.
- 2: nominally present, materially weak (benefit claimed without substance, keyword stuffed).
- 1: absent or harmful.

Score to action (continuous bands, no holes): average below 2.5 -> rewrite the ad; 2.5 to 3.5 -> keep running, test a challenger; above 3.5 -> keep as the template for new variants.

Evidence floors: an asset needs ~500 impressions before its platform performance label (Low / Good / Best) is trusted [heuristic]; below that, judge on craft only and say so. Ad Strength is a coverage signal, not a performance verdict - report it, do not optimize toward it against evidence.

2026 exposure: campaigns with auto-created assets, Dynamic Search Ads, or campaign-level broad match auto-upgrade to AI Max from September 2026, and auto-created assets may already be serving Google-generated variants alongside these; review what actually served, not only what was authored.

## Practical example

B2B SaaS client running 14 ad groups in Search campaigns, total 47 RSAs, $11K/month spend. Claude reviews each RSA for intent match, message diversity, asset coverage, and compliance. Findings: 8 ad groups have 4+ duplicate-meaning headlines (same claim phrased five ways, blocking algorithmic asset rotation), 11 ad groups missing audience qualifier (no headline addressing buyer role or company size), all 47 RSAs missing proof asset (no statistics, customer counts, ratings, or named outcomes), 3 RSAs use "best in class" or "leading platform" superlatives without verifiable backing (Google policy risk). Quality score average: 2.8/5 across 8 dimensions. Top priorities: rewrite 23 redundant assets to free positions for differentiation, add 2 proof headlines per ad group (28 new assets), remove 3 superlative claims. Strongest assets identified: 7 RSAs with explicit ROI mention scored 4.5+ — keep unchanged and use as voice template for rewrites.

## Output format

### Executive summary

- Overall RSA quality score.
- Main messaging gaps.
- Highest-priority ad groups to improve.
- Expected impact area: CTR, CVR, lead quality, or compliance.

### RSA review table

For each RSA include:

- campaign
- ad group
- final URL
- core intent
- quality score
- main issue
- strongest assets
- weakest assets
- missing message roles
- recommended edits

### Asset-level feedback

For each weak asset include:

- original text
- issue
- suggested rewrite direction
- whether to remove, rewrite, or keep testing

### Diversity map

Show count of assets by message role:

- keyword relevance
- pain point
- benefit
- proof
- CTA
- offer
- qualifier
- objection handler

### Route to next

Rewrites -> rsa-ad-copy-generator-google-ads. Message-vs-page doubts -> landing-page-match-scorer-google-ads. Quality Score context -> quality-score-analysis-google-ads.

### Data gaps

Name the exports or fields that were missing and which verdict each one would firm up.

## Guardrails

- Do not judge ad copy only by CTR; consider CVR and lead quality.
- Do not recommend exaggerated or unverifiable claims.
- Do not remove all low-performing assets if impressions are too low to judge.
- Do not over-pin assets unless needed for compliance or message control.
- Do not rewrite copy away from the landing page promise.
