---
title: Migrate adapters and data
description: Decide which Harness 2.1.1 data can be converted, which Harness 3 adapters need new contracts, and where a clean namespace is required.
order: 1320
---

Code that compiles is not yet safe to deploy. Durable records, workspace
checkpoints, memory indexes, sandbox resources, MCP processes, and plugin
digests have separate compatibility boundaries.

## Build a migration decision table

<div class="overflow-x-auto" role="region" aria-label="Adapter and data migration decisions" tabindex="0">

| Data or adapter | Harness 3 compatibility | Required action |
| --- | --- | --- |
| In-memory session, run, and memory data | Process-local and disposable | Start clean; do not invent persistence for it during the upgrade. |
| Harness 2.1.1 local SQLite runtime | Incompatible schema | Stop 2.1.1 workers, back up the file, create a new Harness 3 database, and import only application-approved records through application code. |
| Active durable runs and external waits | Bound to the executing version and definitions | Drain or complete them on 2.1.1. Do not resume them with Harness 3. |
| Workspace files | Files may be business data; old checkpoint metadata is not a Harness 3 contract | Export approved files, scan them, and import through the new workspace API under a new checkpoint. |
| Sandbox-backed memory | No automatic reader | Export reviewed facts, transform to the new scope and record shape, and write through `MemoryFacade`. |
| Vector memory | Index descriptor and dimensions must match | Create a new namespace or index, re-embed from approved source data, verify count and sample searches, then switch configuration. |
| Custom Harness storage | Port changed materially | Implement `HarnessStorage`, run `harnessStorageContract`, and test database-specific locking, recovery, and cleanup. |
| Custom memory | Port changed materially | Implement `MemoryEngine`, run `memoryEngineContract`, and test provider-specific search and index behavior. |
| Custom sandbox | Ownership and administration are required | Implement the full `Sandbox` port, run `sandboxContract`, then test real isolation and cleanup separately. |
| Agent Plugin package | Digest and selected bindings are deployment evidence | Review the new package, calculate and approve its new SHA-256 digest, and bind only selected skills and MCP tools. |

</div>

## Keep old and new data separate

Use a new database file, schema, key prefix, bucket, or vector namespace for the
Harness 3 deployment. This enables comparison and rollback without asking two
major versions to share a mutable contract.

For a vector-memory migration:

1. provision a new namespace with the target distance metric and dimensions;
2. read only application-approved source records—not opaque old vectors;
3. generate embeddings with the target model alias;
4. write through the Harness 3 memory facade;
5. compare record counts and run representative searches;
6. switch one staging or canary deployment to the new namespace;
7. retain the old namespace until the rollback window closes.

An embedding model, dimension, distance metric, or extractor revision change is
a reindex even when the database product stays the same.

## Verify custom adapters at two levels

The shared contract proves portable Harness behavior. It does not prove the
external system's operational guarantees.

<div class="overflow-x-auto" role="region" aria-label="Adapter verification levels" tabindex="0">

| Level | Proves | Still required |
| --- | --- | --- |
| Shared adapter contract | Required methods, validation, lifecycle, and portable semantics | Run against the custom implementation in CI. |
| Provider integration test | Transactions, leases, reconnects, isolation, retention, and cleanup in the selected backend | Use an ephemeral real service with bounded credentials and deterministic fixtures. |
| Staging recovery drill | Process restart, worker contention, resume, backup and restore, and operator runbook | Use the same topology and configuration shape planned for production. |

</div>

See the focused [adapter test guide](/handbook/harness/test-and-evaluate/test-adapters/)
for contract boundaries. Never use a passing generic sandbox test to claim
container, VM, network, or tenant isolation.

## Do not convert hidden implementation records

Do not copy internal tables, serialized run events, provider continuation
payloads, sandbox provider references, leases, or checkpoint metadata between
majors. Export stable application data through an application-owned migration
format and validate it before import.

Next: [verify rollout and rollback](../verification-and-rollback/).
