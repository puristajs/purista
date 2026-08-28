---
title: Migrate to Harness 3
description: Replace split durability APIs with one storage boundary and perform an explicit data migration.
order: 1310
---

Harness 3 is a clean durability break: one `HarnessStorage` owns sessions,
runs, checkpoints, leases, and waits. Do not copy legacy runtime tables into a
new deployment.

| Harness 2 | Harness 3 |
| --- | --- |
| `.state(store)` | `.storage(storage)` |
| `.runtime(runtime)` / `.externalWait(adapter)` | Removed; `HarnessStorage` owns recovery and waits. |
| `.checkpoints(store)` / `ctx.checkpoints` | `ctx.step(...)` output or application storage. |
| `.workspaceStore(store)` | `.workspace(workspace)` |
| `stateStoreContract` | `harnessStorageContract` |

```ts title="Wire the Harness 3 local durable bundle"
import { defineHarness, localDurableExecution } from '@purista/harness'

const local = localDurableExecution({ root: './.harness' })

const harness = defineHarness()
  .storage(local.storage)
  .workspace(local.workspace)
  .sandbox(local.sandbox)
  .models({
    noop: { provider: { id: 'migration', genAiSystem: 'migration' }, model: 'not-called', capabilities: [] },
  })
  .build()
```

| Call or field | What it does in Harness 3 | Migration boundary |
| --- | --- | --- |
| [`defineHarness()`](/handbook/api/functions/_purista_harness.defineHarness/) | Starts the v3 composition; omitting a name uses `agent-harness` for diagnostics. | It does not discover or migrate legacy state. Add the durable adapters deliberately before building. |
| [`localDurableExecution({ root })`](/handbook/api/functions/_purista_harness.localDurableExecution/) | Creates compatible local SQLite storage, workspace, and sandbox adapters below one root. | Use it only to exercise the new single-host v3 shape or local migration tests. It does not read or upgrade legacy tables, and it is not a multi-worker production storage system. |
| [`.storage(local.storage)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#storage) | Registers the sole v3 durability boundary for sessions, runs, checkpoints, leases, and external waits. | Replace the old split state/runtime/checkpoint configuration with this one storage port. Build fails if the adapter cannot meet the requested durable path. |
| [`.workspace(local.workspace)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#workspace) | Registers committed artifact checkpoints separately from execution/session records. | Keep it when artifacts must survive a resumed run. It does not import old `workspaceStore` contents; move approved artifacts through an application migration. |
| [`.sandbox(local.sandbox)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#sandbox) | Registers the matching files/execution boundary. | A resume can restore files only when this adapter can bind the selected workspace checkpoint. Never treat an arbitrary retained volume as a v3 checkpoint. |
| [`.models(...)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#models) | Supplies the non-empty model registry required by a built Harness. | `noop` is inert and has no consumer, so this adapter migration check makes no provider call. Replace it with real model aliases before adding agents or workflows. |
| [`.build()`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#build) | Validates the durable composition and returns a Harness. | This adapter-only fragment has no agent or workflow yet. Add their real model registrations and behavior in the next migration step; building does not migrate legacy data. |

There is no automatic SQLite migration. Harness 3 rejects incompatible legacy
durable-run/checkpoint tables with `sqlite_schema_incompatible`. Stop v2
workers, export only application-approved data, create a new v3 database, and
import through a reviewed application migration—not direct table copying.

Before rollout, test lease contention, restart after each committed step, wait
registration and duplicate/terminal signal delivery, then resume the same run.
For PURISTA, keep its general `StateStore` separate from Harness storage.
Next: [plan retention, recovery, and migration](/handbook/harness/manage-context-and-state/retention-recovery-and-migration/).
