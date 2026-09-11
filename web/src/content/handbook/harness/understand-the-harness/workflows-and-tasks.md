---
title: Workflows and tasks
description: Put deterministic application orchestration around agents instead of hiding it in the model loop.
order: 130
---

A workflow receives typed input and coordinates agents, steps, application
writes, and review. Define agents first, then pass their direct references to a
workflow.

```ts title="src/policyAnalysis.ts"
import { defineAgent, defineHarness, defineWorkflow } from '@purista/harness'
import { z } from 'zod'

const input = z.object({ question: z.string().min(1) })
const output = z.object({ answer: z.string() })
const summarize = defineAgent('summarize', {
  input,
  output,
  model: 'summarization',
  prompt: value => ({ role: 'user', content: value.question }),
  instructions: 'Summarize the policy question in one answer.',
})
const answer = defineWorkflow('answerWithPolicy', {
  input,
  output,
  agents: [summarize],
  handler: async context => context.agents.summarize.run(context.input, { callId: 'summarize-policy' }),
})
export const definition = defineHarness({ name: 'policy-analysis' }).addAgent(summarize).addWorkflow(answer)
export const harness = await definition.getInstance({ models: { summarization: summarizationModel } })
```
Workflow delegation is explicit and bounded. A background task or external
queue remains application-owned delivery; a session is not a durable broker.
Use `context.step(...)` for replay-safe operations and
`context.externalWait.wait(...)` for persisted human or external decisions.

Next: [build a workflow](/handbook/harness/orchestrate-work/workflows/).
