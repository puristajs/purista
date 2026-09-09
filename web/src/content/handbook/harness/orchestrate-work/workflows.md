---
title: Build a workflow
description: Coordinate typed agents and durable steps with explicit data flow and policy.
order: 510
---

A workflow is deterministic application orchestration around agents. It owns
sequencing, branching, durable steps, approvals, and domain side effects.

```ts title="src/harness/incidentReview.ts"
import { defineAgent, defineHarness, defineWorkflow } from '@purista/harness'
import { z } from 'zod'

const input = z.object({ report: z.string() })
const output = z.object({ level: z.enum(['low', 'medium', 'high']) })
const facts = defineAgent('facts', {
  input,
  output,
  model: 'primary',
  prompt: value => ({ role: 'user', content: value.report }),
  instructions: 'Assess the incident report as low, medium, or high risk.',
})
const review = defineWorkflow('reviewIncident', {
  input,
  output,
  agents: [facts],
  handler: async context => context.agents.facts.run(context.input, { callId: 'facts-review' }),
})
export const definition = defineHarness({ name: 'incident-review' }).addAgent(facts).addWorkflow(review)
export const harness = await definition.getInstance({ model: primaryModel })
```
Bind storage, workspace, models, and other adapters with `getInstance(...)`.
Use `context.step(id, operation)` for replay-safe work and
`context.externalWait.wait(...)` for a persisted external decision. A workflow
is not a queue; application queues own delivery and retry.

The handler receives validated input, typed agent clients, model aliases,
scoped memory, step and child-task controls, external waits, logging, metrics,
and an abort signal. Return the final value instead of mutating an output slot.
Unknown agents, invalid schemas, and disallowed delegation fail before the
handler or before a child call.

Next: [child tasks and data flow](./child-tasks-and-data-flow/) and [durable workflows](./durable-workflows/).
