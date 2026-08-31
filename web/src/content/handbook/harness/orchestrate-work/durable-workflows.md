---
title: Run durable workflows
description: Resume stable workflow runs from committed checkpoints after interruption.
order: 530
---

Durability is workflow-only. Configure a persistent `HarnessStorage` and a
durable workspace, then invoke a workflow with a stable, application-owned
run id. Direct agent calls reject `durable` options.

This local development flow survives a deliberate failure after the first
checkpoint, then resumes with the same run ID. `localDurableExecution()` is
built into the core package; it uses local SQLite and host files, so no extra
package is installed.

```ts title="src/createLocalDurableHarness.ts"
import { defineHarness, localDurableExecution } from '@purista/harness'
import { z } from 'zod'

const input = z.object({ reportId: z.string(), failAfterOutline: z.boolean().default(false) })
const output = z.object({ reportId: z.string(), status: z.literal('ready') })

export function createLocalDurableHarness(root: string) {
	const local = localDurableExecution({ root, exec: false })
	const harness = defineHarness({ name: 'durable-report' })
		.storage(local.storage)
		.workspace(local.workspace)
		.sandbox(local.sandbox)
		.requires(['storage.persistent', 'workspace.persistent'])
		// Every Harness definition needs a model alias, even though this workflow
		// itself performs only deterministic checkpointed work.
		.models({
			local: { provider: { id: 'local', genAiSystem: 'local' }, model: 'not-called', capabilities: ['object'] },
		})
		.workflow('prepare_report', {
			input,
			output,
			handler: async ctx => {
				await ctx.step('outline-v1', async () => ({ reportId: ctx.input.reportId }))
				if (ctx.input.failAfterOutline) throw new Error('Simulated restart after outline.')
				await ctx.step('render-v1', async () => ({ rendered: true }))
				return { reportId: ctx.input.reportId, status: 'ready' }
			},
		})
		.build()

	return { harness }
}
```

| Call or field | What it configures | Choice and failure boundary |
| --- | --- | --- |
| [`defineHarness({ name })`](/handbook/api/functions/_purista_harness.defineHarness/) | Creates this local composition root and assigns its diagnostic name. | The name does not make a run durable; persistence comes from the following compatible adapters. |
| [`.storage(local.storage)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#storage) and [`.workspace(local.workspace)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#workspace) | Register the persistent run/checkpoint store and the artifact checkpoint store exactly once. | Both are required for the local durable bundle. Duplicate registrations and invalid adapters fail composition instead of replacing state. |
| [`.sandbox(local.sandbox)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#sandbox) | Registers the sandbox that can bind the matching durable workspace. | `exec: false` leaves it files-and-search only. Do not turn on host execution to obtain durability or isolation. |
| [`.requires([...])`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#requires) | Requires the named adapter capabilities at build time. | Require `storage.persistent` and `workspace.persistent` when the workflow cannot safely degrade to in-memory state. |
| [`.models(...)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#models) | Supplies the mandatory alias registry, even for this deterministic workflow. | The placeholder is valid only because neither handler calls a model. Replace it before adding a default-loop agent or model operation. |
| [`.workflow(...)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#workflow) | Registers the schema-validated workflow and preserves `ctx.step` in its typed context. | Define workflows after agents when they delegate. A step ID is part of the replay contract, so change it only with a compatible run version. |
| [`.build()`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#build) | Validates adapter capabilities and the completed registry graph, then returns the runnable Harness. | Build before accepting work. An incompatible persistence setup fails before a durable invocation is admitted. |

```ts title="src/resumeLocalReport.ts"
import { createLocalDurableHarness } from './createLocalDurableHarness.js'

const root = '.purista/durable-report'
const runId = 'report:quarterly-42:v1'

// This catch is only a controlled crash simulation for the tutorial.
// Production code records and handles the failure at its queue/HTTP boundary.
let app = createLocalDurableHarness(root)
try {
	const session = await app.harness.getSession('report:quarterly-42')
	await session.workflows.prepare_report
		.run({ reportId: 'quarterly-42', failAfterOutline: true }, { durable: { runId } })
		.catch(() => undefined)
} finally {
	await app.harness.shutdown()
}

app = createLocalDurableHarness(root)
try {
	const session = await app.harness.getSession('report:quarterly-42')
	console.log(
		await session.workflows.prepare_report.run(
			{ reportId: 'quarterly-42', failAfterOutline: false },
			{ durable: { runId } },
		),
	)
} finally {
	await app.harness.shutdown()
}
```

```text title="Expected resumed workflow result"
{ reportId: 'quarterly-42', status: 'ready' }
```

## Configure the durable invocation

`durable` is accepted only by workflow `run(...)` and `stream(...)` calls:

| Field | Default | Use |
| --- | --- | --- |
| `runId` | required | Stable application-owned identity matching `^[A-Za-z0-9_.:-]{1,200}$`. Reuse it for every resume of the same logical run. |
| `workerId` | Harness worker ID | Identifies the process acquiring the durable lease. Set it when the deployment has a stable worker identity. |
| `stepId` | workflow ID | Initial lease step label. It is not a replacement for each `ctx.step(...)` ID. |
| `attempt` | storage/runtime assigned | Optional attempt hint; storage may increase it during recovery. Do not use it as an idempotency key. |
| `workspacePolicy` | adapter policy | Narrows retention, encryption, or quota constraints for a newly created durable workspace. The adapter rejects requirements it cannot enforce. |

`workspacePolicy` changes workspace storage and retention only. It cannot grant
a sandbox capability, borrow another owner, or weaken an adapter's platform
isolation. A resumed run uses the committed workspace and sandbox-policy digest;
an incompatible policy change fails instead of silently opening a different
workspace.

API reference: [`DurableInvokeOptions`](/handbook/api/interfaces/_purista_harness.DurableInvokeOptions/)
and [`DurableWorkspacePolicy`](/handbook/api/interfaces/_purista_harness.DurableWorkspacePolicy/).

Use `ctx.step('stable-id', fn)` around JSON-serializable work. A committed step
replays its saved output after resume instead of running again. The local
adapter uses Node/Bun SQLite and is suitable for development or single-host
testing; it is not a multi-worker production backend.

Production storage must implement transactional leases, events, checkpoints,
and waits across workers. Harness does not supply a scheduler, deployment
pinning, or generic distributed storage adapter. Make step IDs and output
schemas backward-compatible; start a new versioned run for incompatible work.

Next: [retries, compensation, and tests](/handbook/harness/orchestrate-work/retries-compensation-and-testing/).
