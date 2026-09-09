---
title: Child tasks and data flow
description: Delegate bounded asynchronous agent work with typed inputs, stable IDs, cancellation, and explicit ownership.
order: 520
---

A workflow may start a child task when the parent should continue before the
agent finishes. Pass the agent definition directly to the workflow and use the
workflow context to start, inspect, or cancel the task.

```ts title="src/harness/reviewWorkflow.ts"
import { defineAgent, defineHarness, defineWorkflow } from '@purista/harness'
import { z } from 'zod'

const reviewer = defineAgent('reviewer', {
  input: z.object({ report: z.string() }),
  output: z.object({ accepted: z.boolean() }),
  model: 'primary',
  prompt: value => ({ role: 'user', content: value.report }),
  instructions: 'Decide whether the report is accepted.',
})
const startReview = defineWorkflow('startReview', {
  input: z.object({ report: z.string() }),
  output: z.object({ taskId: z.string() }),
  agents: [reviewer],
  handler: async context => {
    const task = await context.childTasks.start('reviewer', context.input, { callId: 'review-1', mode: 'one_shot' })
    return { taskId: task.id }
  },
})
export const definition = defineHarness({ name: 'review' }).addAgent(reviewer).addWorkflow(startReview)
export const harness = await definition.getInstance({ model: primaryModel })
```
Use a stable unique call ID, bound child-agent allowlists, deadlines, and
cancellation. The application owns durable delivery and authorization. A task
ID is an operational handle, not a tenant or permission boundary.
