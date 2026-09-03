---
title: Plan retention, recovery, and migration
description: Operate state with explicit ownership, versioning, deletion, and restore paths.
order: 650
---

Before storing customer or agent state, write an operations policy for each
store: owner, scope, purpose, retention deadline, backup/restore procedure,
deletion path, and access controls. Harness offers adapters and contracts; it
does not choose legal retention or perform a cross-system migration.

For a support-case assistant, make the separation explicit before enabling
stateful features:

| Asset | Purpose | Example retention/deletion decision | Owner |
| --- | --- | --- | --- |
| Conversation history | Continue the active support case | Retain for the case window; delete through the case-data deletion workflow | Application data owner |
| Memory fact | Reuse a verified product preference | Version it; expire or delete when the preference changes | Product/domain service |
| Durable workflow checkpoint | Resume one report/review run | Retain until completion plus the operational recovery window | Workflow operator |
| Workspace artifact | Preserve a generated report | Retain only when the product exposes it; enforce tenant-scoped download and cleanup | Artifact service |

This is an application policy, not Harness configuration. Do not put a legal
retention duration into an agent instruction or assume that `release()` deletes
persisted state.

## Recover safely

- Use stable durable run IDs and stable `ctx.step` IDs to resume workflows.
- Reconcile external side effects using domain idempotency keys after an
  interrupted run.
- Keep workspace artifacts, storage records, and memory under independently
  testable backup and restore procedures.
- Expose safe status and run identifiers to operators, not prompts or secrets.

## Change without corrupting history

Keep committed step outputs backward-compatible. For incompatible workflows,
start a new versioned run rather than reinterpreting checkpoints. Memory vector
dimensions, descriptors, schemas, and Redis namespaces are immutable contracts:
create a versioned target, reindex, validate queries, switch traffic, then
retain or delete the old data according to policy.

Test restore into an empty environment, a process restart during a durable run,
expired TTL visibility, deletion authorization, and an attempted downgrade.
`localDurableExecution` and SQLite storage are useful for deterministic local
recovery tests, but they do not prove multi-instance production recovery.
