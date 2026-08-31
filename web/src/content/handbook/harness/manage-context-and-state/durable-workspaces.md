---
title: Use durable workspaces
description: Persist run artifacts separately from session history and sandbox execution.
order: 640
---

A durable workspace stores file snapshots and artifacts for a run. It is not
the same boundary as `HarnessStorage` (sessions, runs, events, checkpoints, and
waits) or the sandbox (execution and filesystem access).

The latest committed workspace checkpoint is the only recovery guarantee for
run files. A retained sandbox process, container, or volume may make a later
attachment possible, but it is not a checkpoint. On a resumed run, a compatible
workspace is bound before the sandbox is restored. If that binding or committed
state is unavailable, the invocation fails with `SandboxStateLostError`; it
does not continue with an empty workspace.

For local development, `localDurableExecution()` creates compatible storage,
workspace, and sandbox adapters under one root:

```ts title="src/createArtifactWorkspaceHarness.ts"
import { defineHarness, localDurableExecution } from '@purista/harness'

export function createArtifactWorkspaceHarness(root: string) {
	const local = localDurableExecution({ root, exec: false })

	return (
		defineHarness({ name: 'artifact-workspace' })
			.storage(local.storage)
			.workspace(local.workspace)
			.sandbox(local.sandbox)
			.requires(['storage.persistent', 'workspace.persistent'])
			// The runtime always requires one alias; this page does not invoke it.
			.models({
				local: { provider: { id: 'local', genAiSystem: 'local' }, model: 'not-called', capabilities: ['object'] },
			})
			.build()
	)
}
```

| Call or field | What it configures | Choice and failure boundary |
| --- | --- | --- |
| [`defineHarness({ name })`](/handbook/api/functions/_purista_harness.defineHarness/) | Creates the application-local composition root and assigns its diagnostic name. | The name is not a workspace identifier, tenant boundary, or persistent resource selector. |
| [`localDurableExecution(options)`](/handbook/api/functions/_purista_harness.localDurableExecution/) | Produces a matched SQLite `storage`, local durable `workspace`, and local sandbox bundle under one required filesystem `root`. `exec: false` keeps the sandbox files-and-search only. | Use it for one trusted Node/Bun host and deterministic restart tests. It is not an isolated execution service or a distributed coordination system. Keep `root` deployment-controlled and outside an ephemeral container layer. |
| [`.storage(local.storage)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#storage) | Registers the persistent session/run/checkpoint store. | Call it once. A second storage registration is invalid. This storage is required for durable workflow execution, but does not itself make sandbox files recoverable. |
| [`.workspace(local.workspace)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#workspace) | Registers the durable checkpoint store for artifacts. | Call it once and pair it with a sandbox that can bind the same checkpoint contract for restore. A compatible workspace is checked before a sandbox restore; missing state fails rather than starting empty. |
| [`.sandbox(local.sandbox)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#sandbox) | Registers the execution/filesystem boundary that receives workspace bindings. | `exec: false` is the safe local default for artifact persistence. Turning host execution on is a separate trusted-host decision, not a way to make model-directed commands isolated. |
| [`.requires([...])`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#requires) | Requires adapter capability IDs at build time. `storage.persistent` and `workspace.persistent` make this local example reject an accidental in-memory replacement. | Use requirements for invariants the application cannot safely degrade. Do not list a capability only because a later feature might use it; missing required capability makes composition fail. |
| [`.models(...)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#models) | Registers the minimal alias required by the current Harness configuration. The static provider has no invocation methods because this page does not execute an agent. | Replace `local` with a configured provider before adding an agent or workflow that invokes a model. Do not use this placeholder as a production provider adapter. |
| [`.build()`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#build) | Validates registrations and required adapter capabilities, then creates the runnable Harness. | Build-time validation catches an incompatible storage/workspace/sandbox combination before an artifact-bearing run is accepted. |

Create one composition per application process, not per artifact. The Harness
closes adapters that expose an owned `close()` lifecycle during `shutdown()`;
the application closes separately returned runtime clients after the Harness.

This local bundle is a single-host Node/Bun SQLite implementation, not a
distributed production workspace. For replicated services, pair
[`@purista/harness-storage-postgres`](/handbook/harness/manage-context-and-state/postgresql-harness-storage/)
with the sandbox and durable workspace returned by
[`kubernetesSandboxRuntime(...)`](/handbook/harness/secure-and-govern/kubernetes-sandbox/).
That production path stores control state in PostgreSQL and run files in PVC
generations with committed `VolumeSnapshot` checkpoints. It does not require
S3 or hide object storage behind either adapter.

Do not treat a local host directory as isolation for untrusted code. Define
which artifacts are retained, who can retrieve them, how they are deleted, and
how a worker reconciles partial uploads after a crash. Run
`durableWorkspaceContract` from `@purista/harness/testing` for custom adapters,
then exercise restart, missing snapshot, retention cleanup, and denied access.
The Kubernetes package already runs this portable contract; its live-gated
cluster suite must additionally prove CSI snapshot behavior and platform
isolation.

When a sandbox adapter cannot bind this checkpoint format—for example the
initial local Docker adapter—do not request sandbox restore. Keep the durable
workflow on a compatible workspace/sandbox pair or surface the state-loss error
to the application-owned retry or recovery flow.
