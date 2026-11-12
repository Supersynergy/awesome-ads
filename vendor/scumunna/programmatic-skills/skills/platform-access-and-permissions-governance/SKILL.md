---
name: platform-access-and-permissions-governance
description: Govern platform access for programmatic operations, including least privilege, new user intake, role assignment, approval, offboarding, quarterly access review, break-glass access, shared-login prohibition, and evidence collection across DSPs, ad servers, analytics tools, tag managers, and reporting systems.
---

# Platform access and permissions governance

Access is an operational control, not an IT afterthought. The wrong person with edit access can
change budgets, relax brand safety, expose data, or break tracking. This skill gives the
programmatic desk a repeatable access process across platforms and supporting systems.

## When to use this skill

- A user asks who should have access, which role to grant, or how to remove a user.
- A new trader, analyst, client, partner, vendor, or agency teammate needs access.
- A person leaves, changes teams, or no longer needs a platform.
- A quarterly access review or audit is due.
- A temporary break-glass access request is needed during an incident.

## Access principles

- Least privilege by default. Grant the minimum role needed for the task.
- No shared logins. Every action needs a person-level identity where the platform supports it.
- Client and vendor access expires unless explicitly renewed.
- Access approval is separate from access creation.
- Emergency access expires and is reviewed after use.
- Evidence is part of the work: request, approval, role granted, date, owner, and removal date.

## Role model

| Role class | Typical permissions | Use for |
| --- | --- | --- |
| Viewer | Read-only reports and setup | Clients, junior observers, auditors |
| Analyst | Reporting exports and dashboards, no live campaign edits | Analysts and measurement users |
| Builder | Campaign creation and edit inside assigned scope | Traders and ad ops |
| Admin | User management, billing, partner settings, account-level controls | Named ops leads only |
| Break-glass | Temporary elevated access with expiry | Incidents or urgent platform blockers |

Map these role classes to the platform's actual roles. If a platform offers only coarse roles,
choose the lower-risk role and document the limitation.

## Core process

1. **Capture the request.** Required fields: requester, user email, organization, platform,
   advertiser or account scope, requested role, business reason, start date, expiry date, and
   approver.
2. **Check authority.** Use `approval-and-escalation-governance`. Admin, billing, user
   management, and cross-client access should require a desk lead or account owner.
3. **Assign least privilege.** Pick the lowest role that enables the task. Separate reporting
   users from edit users. Avoid account-wide scope when advertiser-level scope is enough.
4. **Grant and verify.** Add the user, confirm the role and scope, and record evidence.
5. **Set expiry and review.** External, client, vendor, trainee, and break-glass access needs
   an expiry date. Internal long-term access needs review at the desk cadence.
6. **Offboard fast.** Remove access when a person leaves, changes role, no longer supports the
   client, or a vendor contract ends. Record who removed it and when.
7. **Review quarterly.** Export the user list, compare it to the active roster, remove stale
   users, downgrade excess access, and document exceptions.

## Break-glass access

Use only when normal access would delay containment of a live incident.

```text
Break-glass request
Incident:
User:
Platform and account:
Temporary role:
Reason:
Approved by:
Start:
Expiry:
Actions taken:
Removed by:
Post-incident review:
```

Break-glass access should expire as soon as the incident is contained. Do not let it become a
permanent admin grant.

## Access review checklist

- User still works on this client, account, or platform.
- Role class matches current job.
- No dormant users with edit or admin access.
- No generic, shared, former employee, vendor, or personal email accounts.
- External access has a future expiry or is removed.
- Admin count is intentionally small and named.
- Evidence file includes request, approval, grant, changes, and removals.

## Common pitfalls

- Giving admin because it is faster than finding the right role.
- Leaving client or vendor users active after a launch, pitch, or contract ends.
- Treating reporting access as harmless when it exposes client data.
- Forgetting connected systems: ad server, tag manager, analytics, clean room, warehouse,
  BI tool, file storage, and support portal.
- Failing to remove emergency access after the incident.

## Related artifacts

- `templates/ops/access-review-template.csv`
- `approval-and-escalation-governance`
- `privacy-and-consent`
- `data-subject-rights-and-subprocessor-governance`
- `change-management-and-incident-response`
