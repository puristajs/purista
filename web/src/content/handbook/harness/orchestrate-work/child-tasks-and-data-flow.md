---
title: Use child tasks and data flow
description: Start isolated agent work with bounded concurrency and explicit result retrieval.
order: 520
---

Start a child task when a workflow must return before an agent finishes. The
task retains the selected agent's allowlists and never inherits parent history.
Conversation context and sandbox sharing are separate choices:

- Child-task conversation context is always `isolated`. The task receives its
  explicit input, not the parent workflow or session message history.
- The `sandbox` option may use `inherit`, `private`, or an
  application-authorized `{ group }` policy. Without an override, the task gets
  a fresh task-run partition according to the registered sandbox binding.

The adapter's container, VM, or process identity is never part of workflow
code.

By the end of this example, a document-review request returns a task ID. The
application can later look up the finished result without sharing the caller's
conversation history with the review task.

```ts title="src/createDocumentReviewHarness.ts"
import { defineHarness, inMemorySandbox } from '@purista/harness'
import { z } from 'zod'

export function createDocumentReviewHarness() {
	return defineHarness({ name: 'document-review' })
		.sandbox(inMemorySandbox())
		.models({
			local: { provider: { id: 'local', genAiSystem: 'local' }, model: 'not-called', capabilities: ['object'] },
		})
		.agent('reviewer', {
			model: 'local',
			input: z.object({ documentId: z.string() }),
			output: z.object({ documentId: z.string(), verdict: z.enum(['approved', 'needs-changes']) }),
			instructions: 'Review the document.',
			handler: async ({ input }) => ({ documentId: input.documentId, verdict: 'approved' }),
		})
		.workflow('start_review', {
			input: z.object({ documentId: z.string() }),
			output: z.object({ taskId: z.string() }),
			delegation: { agents: ['reviewer'], maxParallelChildAgentCalls: 2 },
			handler: async ctx => {
				const task = await ctx.childTasks.start('reviewer', { documentId: ctx.input.documentId })
				return { taskId: task.id }
			},
		})
		.build()
}
```

| Call or field | What it declares | Use it this way |
| --- | --- | --- |
| [`defineHarness({ name })`](/handbook/api/functions/_purista_harness.defineHarness/) | Creates the named local composition root. | The name identifies diagnostics; it does not grant a child task access to parent history or files. |
| [`.sandbox(...)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#sandbox) | Registers the sandbox contract before agent and workflow sandbox policy is inferred. | The in-memory adapter creates ephemeral files only; choose an explicit workflow/agent policy when a child must not receive the default fresh partition. |
| [`.models(...)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#models) | Registers `local` before the reviewer names it. | The static local provider is suitable for this deterministic custom handler only. It cannot service a default-loop model call. |
| [`.agent(...)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#agent) | Registers `reviewer`, its schemas, and its allowlists before the workflow may delegate to it. | Omit `builtinTools` for this no-action review. An agent must exist before a delegation allowlist can safely name it. |
| [`.workflow(...)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#workflow) | Registers `start_review` and its child-task delegation policy. | Use `delegation.agents` as an allowlist and bound `maxParallelChildAgentCalls` where fan-out can consume provider capacity. |
| [`.build()`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#build) | Performs cross-registry validation and makes the Harness runnable. | Invalid model or delegation references fail before task creation, not after unbounded child work has started. |

```ts title="src/runDocumentReview.ts"
import { createDocumentReviewHarness } from './createDocumentReviewHarness.js'

const harness = createDocumentReviewHarness()

try {
	const session = await harness.getSession('review:document-42')
	const { taskId } = await session.workflows.start_review.run({ documentId: 'document-42' })
	const review = await (await session.childTasks.get(taskId))?.result()
	console.log(review)
} finally {
	await harness.shutdown()
}
```

```text title="Expected document-review result"
{ documentId: 'document-42', verdict: 'approved' }
```

## Configure one task start

`ctx.childTasks.start(agentId, input, options?)` validates the agent ID and
input from the registered agent. Its options change only this task:

| Option | Default | What it controls |
| --- | --- | --- |
| `idempotencyKey` | generated task ID | Stable start identity matching `^[A-Za-z0-9_.:-]{1,128}$`. It is required in a durable workflow and lets a repeated start find the same persisted task. |
| `timeoutMs` | remaining parent workflow deadline | Task-specific timeout in milliseconds. `0` adds no task timeout but cannot extend the parent deadline. |
| `model` | agent's declared model alias | Per-task alias override. The alias must exist and be allowed by the workflow delegation policy. |
| `context` | `isolated` | Only `isolated` is supported. Raw parent-history inheritance is intentionally unavailable. |
| `sandbox` | fresh task-run policy derived from the binding | Select `inherit`, `private`, or an authorized `{ group: 'name' }` partition. This affects files/resources, not conversation history. |
| `mode` | `one_shot` | Use `continuable` only for an in-process task that needs explicit follow-up turns. Durable workflows reject it. |

A bad option, unknown model, denied delegation, exhausted total-call budget, or
cancelled parent fails before the agent turn starts. The total child-call
budget is reserved when the task is created; the parallel budget is consumed
only while a turn is running.

API reference: [`WorkflowChildTasks`](/handbook/api/interfaces/_purista_harness.WorkflowChildTasks/),
[`ChildTaskStartOptions`](/handbook/api/types/_purista_harness.ChildTaskStartOptions/), and
[`SandboxPolicy`](/handbook/api/types/_purista_harness.SandboxPolicy/).

## Read status, result, or cancel

The start call returns a typed handle immediately:

| Handle member | Result |
| --- | --- |
| `id` | Stable task ID to return or persist in application state |
| `status()` | Content-free descriptor and `running`, `succeeded`, `failed`, or `cancelled` status |
| `result()` | Waits for and returns the schema-validated agent output; rejects with the original live failure |
| `cancel(reason?)` | Idempotently requests cancellation and waits for terminal settlement |

Outside the workflow, `session.childTasks.get(taskId)` returns a live handle or
a terminal persisted handle owned by that session. It returns `undefined` for
an unknown or different-session task. A persisted task still marked `running`
after process loss is visible, but `result()` and `cancel()` reject because no
resident worker owns it. `session.childTasks.list({ limit, before })` returns
content-free status snapshots for application status pages.

API reference: [`ChildTaskHandle`](/handbook/api/interfaces/_purista_harness.ChildTaskHandle/)
and [`SessionChildTasks`](/handbook/api/interfaces/_purista_harness.SessionChildTasks/).

Replace the deterministic `handler` with a provider-backed agent only after its
model, tools, and authorization controls are ready. The workflow must allow the
agent and any per-call model alias in its
delegation policy. Task creation consumes the total child-call budget and work
queues under the parallel limit; build a user-facing status model instead of
assuming immediate completion.

## Continue a task in one process

`mode: 'continuable'` returns a handle with `send(input)` and `close()` in
addition to the common task methods:

```ts title="Workflow handler: continue an isolated review"
const task = await ctx.childTasks.start(
	'reviewer',
	{ documentId: ctx.input.documentId },
	{ mode: 'continuable', timeoutMs: 60_000 },
)

await task.send({ documentId: `${ctx.input.documentId}:revision-2` })
const finalReview = await task.close()
```

Turns run sequentially and share only the task-owned in-memory conversation
and selected sandbox. `close()` settles successfully after queued turns;
`cancel()` stops the task. This mode is not durable and cannot run inside a
durable workflow. Use a queue/worker integration for work that must survive
restart, and store only task identifiers and safe status data in transport
messages.

When a task shares a sandbox partition, it may only detach from that partition.
It cannot terminate the parent workflow's resource. The application chooses
tenant/principal authorization and any sharing group; it never needs to manage
provider IDs, leases, or machine instances.

Test cancellation before start, a timed-out task, denied model alias, duplicate
delivery, and the missing-task path. For shared findings across workers, use
the application pattern in [shared context](/handbook/harness/manage-context-and-state/shared-context/).
