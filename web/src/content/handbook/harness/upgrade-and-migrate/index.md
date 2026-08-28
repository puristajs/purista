---
title: Upgrade and migrate
description: Upgrade packages and durable data with explicit compatibility checks and rollback evidence.
order: 1300
---

Pin compatible first-party Harness package versions together and read package
release notes before changing provider, storage, memory, or guardrail behavior.
Run typecheck, deterministic tests, and a credential-scoped smoke test in a
staging environment before rollout.

For durable state, version workflow input, output, run IDs, and step IDs.
Committed checkpoints are data contracts: retain backward-compatible readers or
start a new run version. SQLite v3 storage rejects v2 schema rather than
silently interpreting it; plan an explicit migration/backup/restore step.

Memory vector descriptors/dimensions, PostgreSQL schemas, and Redis namespaces
also require a versioned target plus deliberate reindex. Test downgrade/rollback
against a data snapshot and ensure the old deployment never processes data it
cannot read. Agent Plugin upgrades require a new reviewed SHA-256 digest and
explicit re-binding.

Do not upgrade a local single-host durability adapter as if it were a rolling
multi-worker database migration. Coordinate operational ownership first.

For the concrete API and SQLite break, see
[Migrate to Harness 3](/handbook/harness/upgrade-and-migrate/migrate-to-v3/).
