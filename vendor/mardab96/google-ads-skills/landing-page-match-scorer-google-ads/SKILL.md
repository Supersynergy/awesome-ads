---
name: landing-page-match-scorer-google-ads
description: Scores landing pages against the ads and search queries that send traffic to them, across message match, keyword presence, intent alignment, CTA clarity, trust signals, mobile experience, and form friction. Use when the user asks why clicks are not converting, wants a landing page reviewed against ad copy, needs to choose between pages for a campaign, or wants specific rewrites for the weakest pages.
---

# Landing Page Match Scorer — Google Ads

## Use this skill when

The user has traffic arriving from Google Ads and wants to know whether the destination page matches the promise that earned the click. This skill scores pages comparatively and then rewrites the weakest ones.

Common user requests:

- "CTR is fine but nothing converts. Is it the landing page?"
- "Score these landing pages against the ads pointing at them."
- "Which page should this campaign send traffic to?"
- "Our ad says one thing and the page says another. Fix it."
- "Rewrite the headline and CTA on our worst-performing page."

Do not use this skill to diagnose tracking. If conversions may not be recorded at all, run the conversion tracking audit first, because a page that looks broken may simply be unmeasured.

## Required input

Scoring requires the three sides of the triangle: query, ad, page. Missing any one of them reduces the output to a generic page critique, which is worth much less. Say so if you are working with fewer than three.

Minimum useful data:

- The landing page URL or its full copy, including above-the-fold content.
- The ad copy pointing at it: headlines, descriptions, and the display path.
- The top search terms driving clicks to that ad group or campaign.
- The conversion action the page is supposed to produce.

Recommended exports:

- Search terms report for the ad group, last 30 to 90 days.
- Ad or asset level report with impressions, clicks, CTR, conversions, and cost.
- Landing page report showing clicks and conversion rate per final URL.
- Device split for the same URLs, since mobile and desktop often diverge sharply.
- Form analytics or session recordings, if the user has them.

Required columns where available:

- final URL
- campaign and ad group
- search term
- clicks
- impressions
- CTR
- conversions
- conversion rate
- cost
- device

If a page is behind a login, gated, or not yet live, ask for a copy export or a staging URL rather than guessing at its content.

## Before analysis

1. Confirm what a conversion on this page actually is: form fill, call, purchase, booking, or download. Score against that action, not a generic notion of engagement.
2. Confirm the traffic temperature. A page receiving high-intent bottom-funnel queries is judged differently from one receiving broad research queries.
3. Read the page on mobile first if the device split shows mobile is the majority of clicks. Most Google Ads traffic in most accounts is mobile.
4. Note the 2026 ad format context. Call-only ads were deprecated in February 2026, so phone-led campaigns now route to pages and the page must carry the call action that the ad format used to carry alone.
5. Check whether the ad group uses Dynamic Search Ads or automatically created assets. In those cases the headline the user sees may be generated from page content, which makes message match a function of the page itself rather than a separate creative choice. These formats are subject to auto-upgrade to AI Max from September 2026, so page content will matter more, not less.
6. Establish a baseline conversion rate from the account before calling any page weak. A page converting at 3% is strong in one vertical and poor in another.

## Analysis workflow

Score each page on seven dimensions. Use a 0 to 5 scale per dimension, where 0 is absent and 5 is exemplary. Weight the dimensions to the page's job rather than applying one fixed weighting to every page.

### 1. Message match

Compare the ad's primary headline promise to the page's above-the-fold headline. Ask whether a visitor could tell within three seconds that they landed in the right place. Score down for a page that changes the noun, the offer, or the audience between ad and page.

### 2. Keyword presence

Check whether the dominant search terms appear naturally in the headline, subheadline, and first body block. This is about visitor recognition, not density. Score down for keyword stuffing as hard as for absence.

### 3. Intent alignment

Map the query intent to the page type. Transactional queries need a page that lets the visitor transact. Comparison queries need comparison content. Research queries pointed at a hard-sell page will underperform regardless of copy quality.

### 4. CTA clarity

Assess the primary action: is there exactly one, is it visible without scrolling, does its label describe the outcome rather than the mechanic, and is it repeated at a sensible interval down the page. Score down for competing CTAs of equal visual weight.

### 5. Trust signals

Look for proof close to the point of decision: named clients, specific outcomes, review counts, certifications, guarantees, pricing transparency, and a real physical or contact presence. Score down when proof exists but sits far below the CTA.

### 6. Mobile experience

Check tap target size, above-the-fold content on a small viewport, load weight, intrusive interstitials, and whether the CTA remains reachable while scrolling. Score this dimension against the actual mobile click share.

### 7. Form friction

Count required fields, note any field that asks for information the visitor cannot supply early, check for unexplained mandatory phone numbers, and look for error handling that loses entered data. Score down for every field that does not change what happens next.

### Comparative pass

1. Score every page supplied.
2. Rank by weighted total.
3. Cross-check the ranking against actual conversion rate per URL. Where the score and the data disagree, investigate rather than trusting the score.
4. Isolate the two or three weakest dimensions across the whole set. Recurring weakness is a template problem, not a page problem, and should be fixed once.

### Rewrite pass

For the lowest scoring pages, produce concrete replacement copy rather than advice. Rewrite the headline, the subheadline, the primary CTA label, and the first proof block. Give two variants where a genuine strategic choice exists.

## Decision rules

Use these as default heuristics, not hard laws. Adjust every threshold to the account's vertical and volume.

Treat a page as **the primary bottleneck** when:

- CTR on the ad is at or above the ad group average while conversion rate sits materially below it,
- the same ad copy converts better against a different URL,
- mobile conversion rate is a small fraction of desktop on the same page,
- message match scores at or below 2 while the other dimensions score well.

Treat the page as **not the bottleneck** when:

- conversion rate is roughly at account average and the complaint is about volume rather than efficiency,
- the search terms arriving are largely irrelevant to the offer, which is a query problem,
- conversion tracking on the page is unverified,
- click volume to the URL is too small to distinguish a real difference from noise.

Recommend a **new page rather than a rewrite** when:

- intent alignment scores 1 or 0, meaning the page type is wrong for the query,
- one page is being asked to serve several distinct offers or audiences,
- the required rewrite would change the page's purpose rather than its wording.

Do not issue a verdict on a page you have not read in full, including the content below the fold and the form itself.

Default weight sets over the seven scored dimensions [heuristic] - state which set was used or what replaced it:

| Dimension | Lead gen form page | Ecommerce product page |
|---|---:|---:|
| Message match | 25% | 20% |
| Keyword presence | 5% | 5% |
| Intent alignment | 15% | 15% |
| CTA clarity | 15% | 15% |
| Trust and proof | 15% | 20% |
| Mobile experience | 10% | 15% |
| Form / checkout friction | 15% | 10% |

CVR comparisons per URL need ~200 clicks before they carry a claim [heuristic].

## Practical example

An account for a commercial roofing contractor spends roughly $12K per month and sends four campaigns to two landing pages. The client's complaint is that CTR looks healthy but the phone is quiet.

Scoring across the seven dimensions surfaces a clean split. The emergency repair campaign runs ads promising 24 hour response, but its clicks land on a general services page whose headline reads "Quality Commercial Roofing Since 1998". Message match scores 1, intent alignment 2. The page converts at 1.4% against an account average of 4.1%. The re-roofing campaign points at the same page and converts at 3.9%, which confirms the page itself is not broken, only mismatched for urgent queries.

Mobile experience scores 2 across both pages. Mobile is 71% of clicks, and the quote form sits below a 900 pixel hero image, so a phone visitor must scroll through two full screens before seeing any action. Form friction scores 2 as well: the form requests roof square footage and building age, which an owner facing an active leak cannot supply from a parking lot.

Estimated impact is framed as a range rather than a promise. Moving emergency traffic to a dedicated page with matched headline copy, a tap-to-call button in the mobile viewport, and a three field form, would plausibly lift that campaign's conversion rate toward the account average. At current click volume of roughly 480 monthly clicks on the emergency campaign, closing even half the gap between 1.4% and 4.1% represents about six additional leads per month.

Delivered rewrites: a new headline reading "24 Hour Emergency Commercial Roof Repair", a subheadline naming the service area, a call CTA above the fold on mobile, a three field form of name, phone, and building address, and the square footage and building age fields moved to a post-submission follow-up.

## Output format

Return a scored comparison followed by concrete rewrites.

### Verdict

One line naming whether the landing page is the primary bottleneck, a contributing factor, or not the issue, with the single strongest piece of evidence.

### Score table

For each page include:

- URL
- campaigns and ad groups pointing at it
- clicks and conversion rate
- score per dimension: message match, keyword presence, intent alignment, CTA clarity, trust signals, mobile experience, form friction
- weighted total
- rank
- the single weakest dimension

### Rewrites for the weakest pages

For each page in the bottom group provide:

- current headline and replacement headline
- current subheadline and replacement
- current primary CTA label and replacement
- one proof block to add and where to place it
- form fields to remove, with the reason each one costs more than it returns

### Template-level findings

Any weakness appearing on most or all pages, fixed once rather than per page.

### Route to next

Name the sibling skills to run next and why. Typical routing:

- conversion-tracking-audit-google-ads when page conversions may not be recorded correctly,
- rsa-ad-copy-review-google-ads when the mismatch is better fixed in the ad than the page,
- rsa-ad-copy-generator-google-ads once the page copy is settled and ads should be aligned to it,
- search-terms-hygiene-google-ads when irrelevant queries, not the page, explain the weak conversion rate,
- account-structure-audit-google-ads when one page is serving campaigns that should be separated,
- pmax-performance-diagnosis-google-ads when the traffic in question comes from Performance Max rather than Search.

### Data gaps

List what was missing and which score you could not issue because of it. Never fill a gap with an assumption and present the result as a score.

## Guardrails

- Never score a page you have only seen described. Read the page or ask for its copy.
- Never present a projected conversion rate lift as a guarantee. Frame it as a range against a stated baseline.
- Do not judge a page against a generic best-practice conversion rate. Use the account's own baseline.
- When score and observed conversion rate disagree, trust the data and explain the discrepancy rather than defending the score.
- Do not recommend removing a form field that the business needs to qualify leads without saying what the qualification cost will be.
- Score mobile experience proportionally to the actual mobile click share, not as a fixed sub-item.
- When a threshold or weighting here does not fit the vertical, say which one you adjusted and why.
- Do not describe deprecated formats as current. Call-only ads ended in February 2026, and Video Action and Discovery campaigns have been replaced by Demand Gen.
