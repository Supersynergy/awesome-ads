---
name: bulk-change-governance-and-rollback
description: Govern cross-platform bulk edits with scope control, before-state exports, diff review, canary rollout, maker-checker approval, verification, and rollback evidence. Use for SDF uploads, editor imports, API batches, spreadsheet uploads, campaign clones, budget updates, targeting edits, taxonomy fixes, and any large account change.
---

# Bulk change governance and rollback

Bulk changes are where a good operator can save hours or break an account in one upload. This
skill gives the cross-platform control pattern for bulk edits. It complements
`change-management-and-incident-response`: that skill covers the broad incident and change
runbook; this skill turns a proposed bulk edit into an auditable change package with rollback.

## When to use this skill

- A spreadsheet, editor import, SDF, API batch, platform bulk upload, campaign clone, or mass
  edit is proposed.
- A change touches many campaigns, line items, ad groups, creatives, tags, budgets, bids,
  targeting settings, or taxonomy fields.
- The user asks for rollback, four-eyes, dry run, canary, change approval, or "how do we do
  this safely".
- A previous bulk change caused an incident and the team needs a safer pattern.

## Bulk-change gates

| Gate | Pass condition |
| --- | --- |
| Intent | The business reason and requested field changes are written down |
| Scope | Entity IDs are enumerated and counted |
| Snapshot | Before-state export exists for every changed entity |
| Diff | Only intended fields changed |
| Approval | Maker and checker are different people |
| Canary | Small slice applied or validate-only path passed where available |
| Verification | Post-change export matches expected state |
| Rollback | Exact rollback steps and artifacts are stored |

If any gate fails, do not apply the full change.

## Core process

1. **Write the change intent.** State who requested it, why, which fields change, what result is
   expected, and what must not change. "Update bids" is not enough. "Increase max bid from
   $12 to $14 on these 18 CTV line items because deal floors increased" is actionable.
2. **Enumerate the scope.** List exact entity IDs and names. Count them. Compare the count to
   the request. If the file contains more rows than expected, stop.
3. **Export the before-state.** Pull the exact entities and fields before editing. Store it as
   the rollback artifact. No snapshot means no rollback.
4. **Build the proposed file or batch.** Change only the intended fields. Preserve IDs,
   parent IDs, flights, budgets, status, targeting, tracking, and safety controls unless they
   are part of the approved change.
5. **Review the diff.** Compare proposed state to before-state. The checker verifies changed
   fields, unchanged fields, row count, parent relationships, budgets, dates, statuses, and
   tracking references.
6. **Canary or validate.** Use validate-only, preview, editor check, or one small slice first
   when the platform supports it. If no canary path exists, require desk-lead approval before
   full apply.
7. **Apply and read back.** After apply, export or query the changed entities. Reconcile
   success count, warnings, rejected rows, and final state. Do not rely on "upload complete".
8. **Document rollback.** Store before-state, proposed file, result file, approval, final
   export, and rollback instructions in the ticket.

## High-risk changes

Treat these as desk-lead or senior approval candidates through
`approval-and-escalation-governance`:

- Budget shifts, daily caps, pacing mode, bid strategy, max bid, or tCPA or tROAS targets.
- Activation status, pause, archive, delete, or flight date changes.
- Brand-safety, suitability, verification, sensitive-category, or inventory-source changes.
- Targeting expansions, geo changes, audience broadening, or exclusion removal.
- Tracking, Floodlight, pixel, UTM, landing-page, click macro, or redirect changes.
- Taxonomy changes that affect reporting joins, billing, or client-visible naming.

## Rollback package

```text
Bulk change package
Ticket:
Requester:
Maker:
Checker:
Approver:
Platform:
Advertiser:
Entity count:
Fields changed:
Business reason:
Before-state export:
Proposed file:
Diff summary:
Canary or validation result:
Full apply time:
Result export:
Verification:
Rollback file or steps:
Rollback owner:
```

## Decision rules

- The rollback must be executable by someone who did not make the change.
- A clone is a bulk change. It can duplicate bad settings just as fast as an upload.
- A field left blank by an upload may clear a platform value. Treat blanks as changes until the
  platform proves otherwise.
- Never bulk-edit active brand-safety controls without explicit approval.
- If the result file has partial failures, the change is not done. Reconcile the failed rows and
  decide whether to revert, retry, or hold.

## Common pitfalls

- Reviewing the proposed file without comparing it to a before-state export.
- Making a manual UI tweak after the bulk file and leaving it out of the change record.
- Applying a taxonomy cleanup that breaks dashboard joins or billing codes.
- Trusting a platform import preview without reading back the final state.
- Using "rollback" to mean "we could undo this later". Rollback needs a file or exact inverse
  operation now.

## Related artifacts

- `templates/ops/bulk-change-plan.md`
- `change-management-and-incident-response`
- `approval-and-escalation-governance`
- `cross-platform-taxonomy-governance`
- `bulk-change-safety-gate` loop
