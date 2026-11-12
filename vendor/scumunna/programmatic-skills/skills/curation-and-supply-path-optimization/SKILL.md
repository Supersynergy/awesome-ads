---
name: curation-and-supply-path-optimization
description: Optimize the path from bid to impression. Use when the user asks about supply path optimization, SPO, path explosion or duplicate paths, reducing SSPs or resellers, direct vs reseller supply, OpenPath, Blue Lists, DSP inventory-source or exchange controls, sellers.json / ads.txt / SupplyChain Object, schain, OpenSincera or supply transparency data, or why the same impression is being bought through many routes.
---

# Curation and supply path optimization

Optimize which route a bid takes to reach a given impression. The same ad slot is usually reachable through many SSPs and resellers, and each extra hop adds fees, loses metadata, and raises the odds of a duplicate or non-transparent path. SPO is the practice of choosing fewer, cleaner, mostly direct paths so more of the budget clears as working media and the signal that reaches the DSP is accurate.

This skill assumes you know CPM, take rate, and how an auction clears. For that math see the `programmatic-foundations` skill. Curation (packaging audience or contextual data onto inventory and buying it as a single Deal ID) is a sibling lever that rides on top of SPO. When the question is about building or buying curated deals, hand off to `curation-and-curated-marketplaces`. This skill is about the path itself.

## When to use this skill

- "What is SPO / supply path optimization and where do I start?"
- "The same impression is available through 12 SSPs. Which path do I keep?"
- "How do I cut resellers and favor direct paths?" / "Should I use OpenPath?"
- "How do I read sellers.json / ads.txt / the SupplyChain Object to see who is in the path?"
- "Set up DV360 exchange and inventory-source controls to prune supply."
- "How do I use OpenSincera or transparency data to rank paths?"
- "Is deduplicating SSPs going to hurt scale?" / "Why did reach drop after I pruned paths?"

Boundaries with sibling skills:
- Packaging data onto inventory and buying curated Deal IDs: `curation-and-curated-marketplaces`.
- The retail and commerce media network landscape (Amazon, Walmart, Instacart): `retailmedia-foundations-and-networks`.
- Choosing which DSP to run on at all: `dsp-selection`.
- Setting up specific deals and inventory in a DSP: `ttd-inventory-and-deals` for The Trade Desk, `dv360-deals-and-inventory` for DV360.
- Blocking unsafe or unsuitable inventory (as opposed to redundant paths): `brand-safety-and-suitability`.
- CTV pod and SSAI-specific supply structure: `ctv-supply-and-ad-pods`.

## Quick reference

| Situation | Do this | Why |
| --- | --- | --- |
| Top publisher reachable through many SSPs | Keep the direct or fewest-hop path, drop pure resellers | Each hop adds fees and loses page/user metadata |
| Path goes through a reseller you cannot verify in sellers.json | Deprioritize or exclude it | Unverifiable node means opaque fees and possible fraud |
| Publisher runs OpenPath or a direct DSP integration | Prefer it for that publisher | Direct path, cleaner metadata, fewer intermediaries |
| You need to rank paths objectively | Pull transparency data (OpenSincera, DSP path reports) | Turn "which path" into a measured decision, not a guess |
| Pruning drops reach on a key line item | Loosen back one tier, keep the worst resellers off | Over-pruning starves delivery; cut the tail, not the body |
| Buyer wants curation on top of clean paths | Build a curated Deal ID, then apply SPO to it | Curation and SPO stack; do SPO so the deal is not re-taxed |

Two levers, do not confuse them:
- SPO reduces the number and fee load of paths to the same inventory (this skill).
- Curation adds data or a publisher set and packages it as one Deal ID (`curation-and-curated-marketplaces`).

## Core process

1. Map the current paths before changing anything, because you cannot prune what you have not measured. Pull a supply-path or inventory report from the DSP that shows spend by SSP, by publisher, and ideally by seller node, and pull each publisher's sellers.json and ads.txt to see who is authorized to sell. The goal is a list of "publisher X is bought through SSPs A, B, C, D" so you can see the duplication.
2. Classify each node as direct or reseller using the seller type in sellers.json (PUBLISHER, INTERMEDIARY, or BOTH) and the SupplyChain Object nodes on the bid stream. Direct seller nodes are candidates to keep. Pure intermediaries that only resell another SSP's access are candidates to drop, because they add a take rate without adding unique supply.
3. Rank the surviving paths on price and quality, not just directness. Use transparency data (OpenSincera publisher metrics like ads-in-view and ads-to-content ratio, or the DSP's own path metrics) plus your own win-rate and outcome data per path. A slightly longer path to clean, viewable inventory can beat a "direct" path into a made-for-advertising site.
4. Prune in the DSP with the least-blunt tool that works. Prefer path or inventory-source targeting on the line item over disabling an exchange account-wide, because a global exchange toggle affects every campaign. Keep one good path per publisher rather than all of them. Human-gate any change that removes an exchange or path for a live campaign, since it moves real spend and can drop delivery.
5. Prefer direct integrations where the publisher offers one. OpenPath and similar direct-buy paths are automatically included in the DSP's marketplace and carry cleaner metadata, so use them for the publishers you buy most. Do not treat "direct" as automatically cheapest or best; verify with the same price and quality data as any other path.
6. Measure after, then hold. Compare working-media percentage, win rate, viewability, and outcome per dollar before and after pruning over a stable window (two weeks is a reasonable read). If reach or delivery fell on a priority line item, add back the best of the paths you cut, not all of them.

## Decision rules and thresholds

### Keep, deprioritize, or drop a path

- Keep: a direct publisher node (seller_type PUBLISHER) or the fewest-hop path to inventory you actually value, with acceptable price and quality data.
- Keep one, drop the rest: when the same publisher is reachable through many SSPs at similar quality, keep the one with the best net price and cleanest metadata and drop the duplicates. Reaching one impression through 24-plus SSPs is the norm for top publishers, and the number of distinct paths to a single impression can run into the hundreds, so most of that is redundant.
- Deprioritize: a path with a verifiable reseller node that still clears at a competitive net price. Do not delete it, but let the cleaner path win first.
- Drop: any node you cannot find in the seller's sellers.json (unauthorized or undisclosed), pure resellers that add a fee without unique supply, and paths into low-quality or made-for-advertising inventory regardless of directness.

### Do not over-prune

- Cut the tail, not the body. Removing the bottom resellers by spend usually recovers fees with little reach loss. Removing half your SSPs at once can starve delivery, especially on narrow targeting or scarce inventory (CTV, specific PMPs).
- If a line item's win rate or delivery drops after pruning, the target was likely reachable mainly through a path you cut. Add back the best cut path, then re-measure.
- On scarce or premium supply, keep more paths than you would on the open web, because each path may be the only route to some of that inventory.

### Direct is a default, not a dogma

- Prefer direct paths (publisher-direct SSP seats, OpenPath, publisher direct deals) as the starting assumption, because fewer hops means less fee leakage and less metadata loss.
- Override when the data disagrees: if a direct path clears at a worse net price, lower viewability, or into worse content than a one-hop reseller path, keep the better path. Rank on measured price and quality, then break ties on directness.

### Curation and SPO stack, in order

- Apply SPO first, then curate, so the curated Deal ID is not built on top of redundant, over-taxed paths. A curated deal still travels a supply path, and fees stack (publisher take, SSP take, curation fee, DSP fee). Pruning the path first keeps the curation fee from sitting on top of an already inefficient route. Fee-stacking mechanics and how to read the net working-media number live in `curation-and-curated-marketplaces`.

## Reference material

- `references/path-explosion-and-consolidation.md`: why one impression fans out into dozens or hundreds of paths, how to read ads.txt, sellers.json (with the field map and seller_type values), and the SupplyChain Object nodes (asi, sid, hp, complete), and a step-by-step consolidation playbook. Read this when you need to actually map and classify the paths to a publisher.
- `references/openpath-and-controversy.md`: what OpenPath is, how the direct integration works, where it fits against classic SSP paths, and the honest tradeoffs and industry debate (disintermediation, the DSP running a supply-side product). Read this when deciding whether to route a publisher through a direct DSP integration.
- `references/dsp-spo-controls-and-opensincera.md`: the concrete DV360 exchange and inventory-source controls, Blue List style path preferences, and how to pull and use OpenSincera transparency metrics to rank paths. Read this when you are about to make the change in the platform.

## Templates and examples

- News publisher bought 4 ways: spend report shows nytimes.com inventory clearing through SSP-A (direct seat, seller_type PUBLISHER), SSP-B (direct seat), SSP-C (reseller of SSP-A), and SSP-D (reseller, not in the publisher's sellers.json). Action: keep SSP-A as primary and SSP-B as backup on the line item's inventory-source targeting, deprioritize SSP-C, exclude SSP-D as unauthorized. Expected result: same reach, lower blended fee, cleaner metadata.
- Pruning starved a niche PMP: after cutting to two SSPs, a hobbyist-vertical line item stopped pacing. Diagnosis: that audience was mostly reachable through one of the cut resellers. Action: add that one path back, keep the other cuts. Delivery recovers without re-adding the full path set.
- OpenPath decision for a top-5 publisher: publisher offers OpenPath. It is auto-included in the marketplace. Action: enable it for that publisher, then compare net CPM, win rate, and viewability against the incumbent SSP path over two weeks. Keep whichever wins on measured net outcome, not on the "direct" label alone.
- SPO before curation: an agency wants an auto-intender curated deal across premium auto endemic sites. Action first: run SPO so each site is bought through its cleanest path, then have the curator build the Deal ID on those paths (handled in `curation-and-curated-marketplaces`), so the curation fee is not stacked on redundant reseller hops.

## Common pitfalls

- Pruning by SSP name instead of by path. The same SSP can be a direct seller for one publisher and a reseller for another. Classify per publisher-path using sellers.json and the SupplyChain Object, not by blanket-blocking an SSP.
- Treating a global exchange toggle as a scalpel. Disabling an exchange at the partner or account level stops every line item from buying it and can silently drop delivery on unrelated campaigns. Prune at the line item with inventory-source targeting first, and human-gate any account-wide change.
- Confusing SPO with brand safety. SPO removes redundant and opaque paths to inventory you want. Blocking unsafe or unsuitable content is a different job with different tools, in `brand-safety-and-suitability`. Do both, but do not expect one to do the other's work.
- Chasing "direct" past the point of value. A direct path into a made-for-advertising site is worse than a one-hop path into premium content. Rank on measured price and quality first, then use directness to break ties.
- Skipping the before-measurement. If you prune without a baseline of spend-by-path and working-media percentage, you cannot prove the change helped or safely reverse it. Map first, change second.
- Buying a curated deal without doing SPO. Curation packages inventory but does not remove the redundant paths underneath, so fees can stack. Do SPO first, then curate. See `curation-and-curated-marketplaces`.
- Trusting a node you cannot verify. If a seller node is not in the publisher's sellers.json or is marked confidential with no way to confirm authorization, treat it as opaque and deprioritize or exclude it.

## Sources

- [The trader's guide to supply path optimization (SPO)](https://www.thetradedesk.com/resources/the-traders-guide-to-supply-path-optimization-spo) (as of July 2026)
- [OpenPath](https://www.thetradedesk.com/our-demand-side-platform/openpath) (as of July 2026)
- [What is OpenSincera](https://www.thetradedesk.com/resources/what-is-opensincera) (as of July 2026)
- [sellers.json and SupplyChain Object, IAB Tech Lab](https://iabtechlab.com/sellers-json/) (as of July 2026)
- [Managing exchanges, Display & Video 360 Help](https://support.google.com/displayvideo/answer/9230278?hl=en) (as of July 2026)
- [Inventory source targeting, Display & Video 360 Help](https://support.google.com/displayvideo/answer/2726009?hl=en) (as of July 2026)
