---
name: offline-conversion-import-audit-google-ads
description: Audits the loop that sends real lead quality back into Google Ads, covering click identifier capture and storage, CRM stage mapping, import latency against conversion lag, value assignment, and whether Smart Bidding is being trained on qualified outcomes rather than raw form fills. Use when a lead-gen account produces volume but poor lead quality, when offline imports are set up but unverified, or before letting automated bidding optimise toward form submissions.
---

# Offline Conversion Import Audit — Google Ads

## Use this skill when

The user runs lead generation and wants to know whether the signal reaching Google Ads reflects business outcomes or merely form submissions. This skill audits the whole loop, not one step of it, because the loop fails silently at whichever step is weakest.

Common user requests:

- "We get plenty of leads and almost no customers."
- "We set up offline conversion imports. Is it actually working?"
- "Smart Bidding is optimising for junk. How do we fix it?"
- "Should we import qualified leads or closed deals?"
- "Our CRM says these campaigns are the good ones but Google says the opposite."
- "Audit our offline conversion tracking before we scale budget."

Do not use this skill for on-site conversion tag problems. Route those to the conversion tracking audit. Use this skill for what happens after the form is submitted.

## Why this loop matters

Say this plainly to the user, because most accounts skip it and then blame bidding.

Smart Bidding optimises toward the conversions it is given. If the only conversion it receives is a form submission, it will find the cheapest possible form submissions. That is not a malfunction. It is the system doing exactly what it was told, using an objective the business does not care about.

Every lead-gen account therefore faces one choice: teach the bidding system what a good lead looks like, or accept that it optimises toward the wrong thing. Offline conversion import is the mechanism for that teaching. Auditing it means checking that qualified outcomes arrive back in the account, attached to the right click, soon enough to influence bidding, and carrying a value that reflects their worth.

## Required input

Minimum useful data:

- How leads are captured: form platform, call tracking, chat, or a mix.
- Where lead records are stored: CRM name and the stages a lead moves through.
- Whether click identifiers are currently stored on the lead record.
- The conversion actions configured in Google Ads, with their categories and whether they are primary.
- The typical time from click to lead, and from lead to qualification, and from qualification to close.
- The business goal: qualified lead volume, pipeline value, revenue, or ROAS.

Recommended exports:

- Conversion action report with status, counting method, attribution setting, and the last date each action recorded data.
- A CRM export of leads over 90 days or more, with creation date, stage, stage change dates, value where known, and any stored click identifier.
- Campaign performance over the same period, plus the import log or upload history if imports already run.
- The form or landing page code, or a description of how hidden fields are populated.

Required columns where available:

- lead ID and creation timestamp
- stored click identifier and its capture timestamp
- current stage and stage history with dates
- qualification outcome and deal value, if any
- source campaign as recorded by the CRM
- conversion action name used on import

If the user cannot supply a CRM export, the audit can still evaluate capture and configuration, but it cannot verify match rate. Say so rather than implying the loop is healthy.

## Before analysis

1. Establish which decision the loop is meant to inform. Importing data that nothing bids on is a reporting exercise, not an optimisation one.
2. Establish the full lag chain: click to lead, lead to qualified, qualified to closed. This chain determines everything about what is importable and what is not.
3. Confirm which identifier the site captures. Google Ads click tracking may present a click identifier in the URL, and iOS app traffic may present a different one. A capture implementation that only reads one parameter will silently lose the other.
4. Confirm whether auto-tagging is enabled. Without it, no click identifier reaches the landing page at all and the entire loop is impossible in its identifier-based form.
5. Confirm what the current primary conversion action is. If a raw form fill is primary and an offline action is secondary, bidding is still training on form fills regardless of what is being imported.
6. Note the 2026 format context. Call-only ads were deprecated in February 2026, so phone leads now arrive through landing pages or call extensions rather than that format, and call capture must be checked accordingly.

## Analysis workflow

Audit the loop in sequence. A failure at an early step makes every later step untestable.

### Step 1: Capture

There are three click identifiers, not one, and an implementation that reads only the first will silently lose whole traffic segments:

- `gclid` is the standard identifier captured from the ad click URL.
- `gbraid` is present when a user clicks an ad on the web and is directed to an iOS app.
- `wbraid` is present when a user clicks an ad in an iOS app and is directed to a webpage.

A capture script that reads only `gclid` will look healthy in aggregate while dropping iOS-related paths entirely. Check the parameter list in the capture code before trusting any capture rate.

1. Verify auto-tagging status.
2. Verify that the landing page reads all three identifiers from the URL and writes them to hidden form fields or first-party cookies.
3. Check cookie lifetime against the click to lead lag. A cookie that expires before the typical lead arrives loses the identifier for slow-converting traffic.
4. Check every entry path, not the main one. Multi-step forms, chat widgets, phone calls, and paths that pass through a redirect, an intermediate domain, or a third-party booking tool are the usual places the identifier is dropped.
5. Verify that the identifier survives whatever consent mechanism the site uses.
6. Confirm the conversion action used for click uploads is of the upload-clicks type. A mismatch here rejects the whole import regardless of capture quality.

### Step 2: Storage

1. Confirm the identifier reaches the CRM record and is stored in a queryable field, not only in a note or a form submission archive.
2. Measure capture rate: the share of paid-source leads holding an identifier. Compare that share to Google Ads click volume for sanity.
3. Check whether the identifier is overwritten on subsequent visits, and whether that is intended.
4. Check for identifier truncation or reformatting by the CRM, which is common and quietly breaks matching.

### Step 3: Stage mapping

1. List the CRM stages and decide, with the user, which stage represents a meaningful outcome worth optimising toward.
2. Distinguish stages that reflect lead quality from stages that reflect sales team activity. Optimising toward a stage the sales team controls teaches bidding about staffing, not about lead quality.
3. Decide whether to import one stage or several. Importing multiple stages as separate actions gives richer signal but only if volume supports it.
4. Check that stage definitions are applied consistently by the people who set them. Inconsistent stage hygiene produces inconsistent training data.

### Step 4: Latency

1. Measure the distribution of time from click to the chosen stage, not the average. Averages hide the tail that matters.
2. Compare that distribution to the conversion window configured on the conversion action. Outcomes occurring after the window closes cannot be attributed at all.
3. Measure import cadence: how often uploads actually run, and whether they run automatically or depend on someone remembering.
4. Assess whether the chosen stage arrives soon enough to be usable. A stage that typically completes long after the click may be correct for reporting yet unusable for bidding, in which case recommend an earlier proxy stage as the bidding signal and keep the later stage for reporting.

### Step 5: Value assignment

1. Check whether imported conversions carry a value or a flat default.
2. If flat, assess whether that is deliberate. A flat value turns value-based bidding into volume-based bidding on a filtered set, which is still a large improvement over raw form fills but is not value optimisation.
3. If variable, check where the value comes from: actual deal value, expected value based on stage probability, or a static value per lead type. Each is defensible. Undocumented mixing of the three is not.
4. Check for value inflation, such as importing full contract value on a stage that closes at a fraction of the time.
5. Check currency consistency between CRM and account.

### Step 6: What bidding actually learns

1. Confirm which conversion actions are marked primary and therefore used by bidding.
2. Check whether the raw form fill and the qualified outcome are both primary, which double counts the same user and dilutes the signal.
3. Check conversion volume of the qualified action per campaign per month. Below a workable volume, a bid strategy cannot stabilise on it.
4. Compare campaign ranking by raw leads to campaign ranking by qualified outcomes. Where the two rankings disagree materially, that gap is the value of this whole exercise, and it is worth quantifying explicitly.

### Step 7: Rejected uploads

Silent rejection is the most common failure in a loop that looks correctly built. Ask for the partial failure output from recent uploads rather than assuming success, and read it against the usual causes:

- An upload carrying more than one click identifier on a single conversion is rejected. Exactly one identifier belongs on each conversion record.
- Custom variables are not accepted alongside the iOS-related identifiers, so a payload built once for web and reused for iOS traffic will fail on the iOS rows only.
- A click older than the conversion action's click-through lookback window is rejected as expired, and widening the window affects future clicks rather than recovering past ones.
- A conversion timestamped before its own click is rejected, which usually means a timezone or format mismatch between CRM and account rather than a genuine data problem.

Partial failure means some rows land and others do not, so a loop can appear to work while quietly losing a whole segment. Quantify the rejection rate before drawing any conclusion about lead quality.

## Decision rules

Use these as default heuristics, not hard laws. Adjust to sales cycle length, lead volume, and CRM maturity.

Classify the loop as **broken, bidding is untrained** when:

- auto-tagging is off or the identifier is not captured on the main lead paths,
- the identifier is captured but not stored in a retrievable field,
- imports were configured once and have not run recently,
- the qualified action exists but is not primary while the raw form fill is.

Classify as **partially working** when:

- capture rate is meaningfully below the share of leads that come from paid,
- some entry paths capture and others do not,
- imports run manually and irregularly,
- values are flat where variable values are available,
- the qualified action is primary but volume is too thin for the bid strategy in use.

Classify as **healthy** when:

- capture covers all lead paths,
- imports run automatically on a cadence shorter than the bidding system's useful feedback interval,
- the imported stage is the one the business actually cares about and arrives within the conversion window,
- values reflect a documented and consistent method,
- bidding is optimising toward the qualified action and not toward raw fills as well.

Recommend an **earlier proxy stage** rather than the true outcome when the true outcome routinely arrives after the conversion window closes, or when its monthly volume is too low to train on. Say clearly that this is a deliberate trade of precision for trainability.

Do not recommend switching bidding onto a qualified action until that action has demonstrated stable recording for a period covering the full lag chain.

Rescue path when GCLID is lost: enhanced conversions for leads (hashed email as the join key) is the standard fallback for exactly the broken loops this skill finds - check eligibility before recommending a custom click-ID pipeline.

## Practical example

A B2B services firm spends roughly $28K per month on Search with a target cost per lead of $90. Reported cost per lead is $76, which looks like a win. The sales director says almost none of the leads are worth calling.

Step 1 finds auto-tagging enabled and the click identifier written into a hidden field on the main contact form. It also finds that the demo booking flow, which produces the best leads, runs through a third-party scheduling tool on a separate subdomain, and the identifier is not passed to it. Roughly 40% of leads come through that flow.

Step 2 measures capture rate at 58% of paid-source leads, which matches the gap the booking flow explains.

Step 3 finds a CRM with stages of New, Contacted, Qualified, Proposal, and Closed Won. Contacted is a sales activity stage rather than a quality signal. Qualified is the meaningful outcome.

Step 4 measures the lag distribution. Click to Qualified has a median of 11 days and a long tail to 40 days. Closed Won has a median of 74 days, well beyond a practical bidding feedback loop for this account. Imports are being run by hand, roughly monthly, and were last run seven weeks ago.

Step 5 finds every import carrying a flat value, so value-based bidding has nothing to work with.

Step 6 finds the raw form fill still set as primary alongside the imported action, so the same lead is counted twice and bidding still chases cheap fills. Ranking campaigns by raw leads against ranking them by Qualified reverses the top and bottom: the campaign producing the cheapest leads at $41 produces a 4% qualification rate, while the campaign the client nearly paused at $148 per lead qualifies at 31%. True cost per qualified lead is $1,025 versus $477.

Verdict: broken, bidding is untrained. Sequenced fixes are passing the identifier through to the scheduling subdomain, automating the import on a daily cadence, importing Qualified as the bidding signal while keeping Closed Won for reporting only, assigning expected value per qualified lead by service line, and demoting the raw form fill to secondary once the qualified action has recorded stably across a full lag cycle.

## Output format

Return an audit organised by the step that fails first.

### Verdict

One line: broken / partially working / healthy, with the single strongest piece of evidence and what bidding is currently being trained on.

### Loop findings, step by step

For each finding include:

- step: capture / storage / stage mapping / latency / value / bidding signal
- finding
- evidence: the specific field, path, rate, or lag measurement
- leads or spend affected
- severity: blocking / material / minor
- confidence: confirmed / likely / needs data

### Ranking comparison

Where CRM data allows, show campaigns ranked by raw conversions beside the same campaigns ranked by qualified outcomes, with cost per raw lead and cost per qualified outcome. This table is usually the most persuasive artefact in the whole audit.

### Fix plan, sequenced

Group by owner, because this loop crosses teams:

- website or landing page changes for capture
- CRM configuration for storage and stage hygiene
- automation or integration work for import cadence
- Google Ads changes for conversion actions, primary flags, and bid strategy
- commercial decisions on which stage to optimise toward and what value to assign

State which fixes are prerequisites for others, and which must wait a full lag cycle before their effect can be judged.

### Route to next

Name the sibling skills to run next. Typical routing:

- conversion-tracking-audit-google-ads when the on-site tagging itself is suspect,
- bidding-strategy-sanity-check-google-ads once the qualified action is stable and bidding should be moved onto it,
- account-triage-google-ads when this audit reveals that the whole account's reported history is unreliable,
- wasted-spend-finder-google-ads using qualified outcomes rather than raw leads as the benchmark,
- search-terms-hygiene-google-ads when the qualification gap traces back to query intent,
- landing-page-match-scorer-google-ads when low-quality leads trace back to a page attracting the wrong visitor,
- scaling-planner-google-ads only once the loop is classified healthy.

### Data gaps

List what was missing and which step could not be verified. Never describe an unverified loop as working.

## Guardrails

- Never state that offline imports are working without evidence that recent uploads recorded conversions in the account.
- Never claim a specific match rate you have not measured. Report capture rate and measured matches separately.
- Do not name a specific Google Ads UI element or import setting you have not verified exists. Describe the operator behaviour instead.
- Do not recommend importing customer personal data without naming the consent and data protection obligations that apply, and defer to the client's own legal position.
- Never recommend switching a bid strategy onto a conversion action that has not yet recorded stably across a full lag cycle.
- Do not present a cost per qualified lead as comparable to a cost per raw lead. State clearly which denominator each number uses.
- Every lag figure and volume threshold in this skill is a heuristic. Say which one you adjusted for the account and why.
- Do not describe deprecated formats as current. Call-only ads ended in February 2026, and Video Action and Discovery campaigns have been replaced by Demand Gen.
- When a threshold in this skill does not fit the account's volume or vertical, say which one you adjusted and why.
