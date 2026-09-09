---
title: Use durable workspaces
description: Pair Harness control storage, checkpointed workspace files, and an appropriate sandbox for restartable work.
order: 630
---

`HarnessStorage` persists sessions, runs, steps, and waits. `DurableWorkspace`
persists checkpointed files. A `Sandbox` performs file or execution operations.
They are separate ports and must be configured as a compatible set.

```ts title="Durable Workspaces example 1"
import { defineHarness } from '@purista/harness'
import { localDurableExecution } from '@purista/harness'

const definition = defineHarness({ name: 'durable-support' }).addWorkflow(workflow)
const local = localDurableExecution({ root: './.harness' })
const harness = await definition.getInstance({
  storage: local.storage,
  workspace: local.workspace,
  sandbox: local.sandbox,
})
```
The local bundle is for a trusted single host and restart tests. PostgreSQL
control storage must be paired with a compatible workspace when runs use files.
A sandbox capability such as `sandbox.persistent_fs` does not itself prove
checkpoint recovery. Test restore, missing state, lease conflicts, cancellation,
and cleanup with the selected adapter.

Do not store business records in Harness control state, and do not treat a
workspace as a tenant boundary without verifying ownership and isolation in the
adapter deployment.
