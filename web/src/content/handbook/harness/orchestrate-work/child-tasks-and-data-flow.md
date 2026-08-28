---
title: Use child tasks and data flow
description: Start isolated agent work with bounded concurrency and explicit result retrieval.
order: 520
---

Start a child task when a workflow must return before an agent finishes. The
task retains the selected agent's allowlists and never inherits parent history.
Sandbox sharing is explicit business policy: without a policy it gets a fresh
task-run shared partition; use `inherit`, `private`, or an
application-authorized `group` when the workflow needs a different boundary.
The adapter's instance topology is never part of the workflow code.

By the end of this example, a document-review request returns a task ID. The
application can later look up the finished result without sharing the caller's
conversation history with the review task.

```ts title="src/createDocumentReviewHarness.ts"
import { defineHarness, inMemorySandbox } from '@purista/harness'
import { z } from 'zod'

export function createDocumentReviewHarness() {
  return defineHarness({ name: 'document-review' })
    .sandbox(inMemorySandbox())
    .models({ local: { provider: { id: 'local', genAiSystem: 'local' }, model: 'not-called', capabilities: ['object'] } })
    .agents(({ agent }) => ({
      reviewer: agent({
        model: 'local',
        input: z.object({ documentId: z.string() }),
        output: z.object({ documentId: z.string(), verdict: z.enum(['approved', 'needs-changes']) }),
        builtinTools: false,
        instructions: 'Review the document.',
        handler: async ({ input }) => ({ documentId: input.documentId, verdict: 'approved' }),
      }),
    }))
    .workflows(({ workflow }) => ({
      start_review: workflow({
        input: z.object({ documentId: z.string() }),
        output: z.object({ taskId: z.string() }),
        delegation: { agents: ['reviewer'], maxParallelChildAgentCalls: 2 },
        handler: async (ctx) => {
          const task = await ctx.childTasks.start('reviewer', { documentId: ctx.input.documentId })
          return { taskId: task.id }
        },
      }),
    }))
    .build()
}
```

| Call or field | What it declares | Use it this way |
| --- | --- | --- |
| [`defineHarness({ name })`](/handbook/api/functions/_purista_harness.defineHarness/) | Creates the named local composition root. | The name identifies diagnostics; it does not grant a child task access to parent history or files. |
| [`.sandbox(...)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#sandbox) | Registers the sandbox contract before agent and workflow sandbox policy is inferred. | The in-memory adapter creates ephemeral files only; choose an explicit workflow/agent policy when a child must not receive the default fresh partition. |
| [`.models(...)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#models) | Registers `local` before the reviewer names it. | The static local provider is suitable for this deterministic custom handler only. It cannot service a default-loop model call. |
| [`.agents(...)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#agents) | Registers `reviewer`, its schemas, and its allowlists before the workflow may delegate to it. | Keep `builtinTools: false` for this no-action review. An agent must exist before a delegation allowlist can safely name it. |
| [`.workflows(...)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#workflows) | Registers `start_review` and its child-task delegation policy. | Use `delegation.agents` as an allowlist and bound `maxParallelChildAgentCalls` where fan-out can consume provider capacity. |
| [`.build()`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#build) | Performs cross-registry validation and makes the Harness runnable. | Invalid model or delegation references fail before task creation, not after unbounded child work has started. |

```ts title="src/runDocumentReview.ts"
import { createDocumentReviewHarness } from './createDocumentReviewHarness.js'

const harness = createDocumentReviewHarness()

try {
  const session = await harness.getSession('review:document-42')
  const { taskId } = await session.workflows.start_review.prompt({ documentId: 'document-42' })
  const review = await (await session.childTasks.get(taskId))?.result()
  console.log(review)
} finally {
  await harness.shutdown()
}
```

```text title="Expected document-review result"
{ documentId: 'document-42', verdict: 'approved' }
```

Replace the deterministic `handler` with a provider-backed agent only after its
model, tools, and authorization controls are ready. The workflow must allow the
agent and any per-call model alias in its
delegation policy. Task creation consumes the total child-call budget and work
queues under the parallel limit; build a user-facing status model instead of
assuming immediate completion.

`mode: 'continuable'` provides sequential follow-up turns in one process. It
is not durable and cannot run inside a durable workflow. Use your queue/worker
integration for work that must survive restart, and store only task identifiers
and safe status data in its transport messages.

When a task shares a sandbox partition, it may only detach from that partition.
It cannot terminate the parent workflow's resource. The application chooses
tenant/principal authorization and any sharing group; it never needs to manage
provider IDs, leases, or machine instances.

Test cancellation before start, a timed-out task, denied model alias, duplicate
delivery, and the missing-task path. For shared findings across workers, use
the application pattern in [shared context](/handbook/harness/manage-context-and-state/shared-context/).
