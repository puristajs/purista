---
title: Persist Harness state in PostgreSQL
description: Share durable sessions, workflow checkpoints, leases, and external waits safely between replicated application instances.
order: 641
---

Use `@purista/harness-storage-postgres` when more than one application instance
must continue the same Harness sessions or durable workflows. This adapter is
the Harness control-state store. It is not the PURISTA `StateStore`, a memory
engine, an artifact workspace, or an application review-task database.

## Install and configure

Keep the adapter on the same major as `@purista/harness`:

```sh title="Install the PostgreSQL Harness storage adapter"
npm install @purista/harness@^3 @purista/harness-storage-postgres@^3
```

```ts title="src/harness/createRuntime.ts"
import { defineHarness } from '@purista/harness'
import { postgresHarnessStorage } from '@purista/harness-storage-postgres'

const storage = postgresHarnessStorage({
	connectionString: process.env.DATABASE_URL!,
	leaseTtlMs: 120_000,
})

export const harness = defineHarness({ name: 'payments' })
	.storage(storage)
	.requires(['storage.persistent', 'storage.multi_instance'])
	.models(models)
	.workflows(workflows)
	.build()
```

The first operation applies the package-owned migration under a PostgreSQL
advisory lock. Concurrent replicas wait for the same initialization result.
Startup or the first request fails closed when PostgreSQL is unavailable or
the schema is incompatible.

| Option | Meaning | Ownership |
| --- | --- | --- |
| `connectionString` | Creates a package-owned `pg.Pool`. | Harness shutdown closes it idempotently. |
| `pool` | Reuses one caller-owned `pg.Pool`. | The adapter never closes it. The application closes it after every consumer. |
| `leaseTtlMs` | Time after which another worker may take over an abandoned durable run. | Set it above normal scheduling pauses but below the recovery objective. A stale worker remains fenced after takeover. |

Provide exactly one of `connectionString` or `pool`. Keep credentials in the
application secret provider and require TLS according to the database trust
boundary. Do not put credentials in Harness definitions, logs, or Kubernetes
manifests.

## Know what becomes distributed

The adapter persists sessions, run records, messages, events, step
checkpoints, external waits, workspace checkpoint references, and run leases.
Transactions and fencing make duplicate delivery, concurrent first
acquisition, checkpoint replay, and expired-lease takeover deterministic.

It does not store workspace files. Pair it with a compatible durable workspace
when a resumed workflow needs artifacts:

```ts title="src/harness/createArtifactRuntime.ts"
const harness = defineHarness({ name: 'artifact-worker' })
	.storage(storage)
	.workspace(workspace)
	.sandbox(sandbox)
	.requires([
		'storage.persistent',
		'storage.multi_instance',
		'storage.workspace_checkpoint',
		'workspace.durable',
	])
	.models(models)
	.workflows(workflows)
	.build()
```

For Kubernetes, use the matched sandbox/workspace bundle documented in
[run a Kubernetes sandbox](/handbook/harness/secure-and-govern/kubernetes-sandbox/).
For one trusted development host, use
[`localDurableExecution()`](/handbook/harness/manage-context-and-state/durable-workspaces/)
instead.

## Operate and verify

Run migrations with a database role that can create the package schema objects,
then use a narrower runtime role if your platform separates migration and
runtime authority. Back up the PostgreSQL database according to the same
recovery point objective as application-owned review and outbox data.

Before rollout, prove:

1. two independent pools can read and continue the same run;
2. concurrent acquisition has one winner;
3. an expired lease can be taken over and the old lease cannot commit;
4. duplicate checkpoint and external-wait signals are idempotent;
5. shutdown closes a package-owned pool once and leaves an injected pool open.

The package runs the shared `harnessStorageContract`; credential-gated live
tests add real PostgreSQL contention and restart evidence. Normal telemetry is
content-free and uses the existing `harness.storage.*` operations.
