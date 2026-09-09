---
title: Build the first agent
description: Define one schema-validated agent, bind a model, invoke it through a session, and observe a typed result.
order: 40
---

By the end of this guide, a support-summary agent returns `{ answer: string }`.
The application accepts only an object matching its output schema.

## Define and bind the agent

```ts title="src/harness.ts"
import { defineAgent, defineHarness } from '@purista/harness'
import { openai } from '@purista/harness-openai'
import { z } from 'zod'

const summarize = defineAgent('summarize', {
  model: 'primary',
  input: z.object({ question: z.string().min(1) }),
  output: z.object({ answer: z.string() }),
  prompt: input => ({ role: 'user', content: input.question }),
  instructions: 'Give a concise, factual support summary.',
})

const definition = defineHarness({ name: 'support' }).addAgent(summarize)
export const harnessPromise = definition.getInstance({
	model: {
		provider: openai({ apiKey: process.env.OPENAI_API_KEY }),
		model: process.env.OPENAI_MODEL ?? 'gpt-5-mini',
	},
})
```
Built-in tools are disabled until their definitions are added to `tools`. Add
one only when its sandbox, authorization, and failure behavior are ready.
The definition is portable; `getInstance(...)` is where credentials and
adapters are supplied.

## Invoke through a session

```ts title="Build The First Agent example 3"
const harness = await harnessPromise
const session = await harness.getSession('support-demo')
try {
  const outcome = await session.agents.summarize.run({
    question: 'What does a model alias provide?',
  })
  if (outcome.status === 'completed') console.log(outcome.output.answer)
} finally {
  await session.release()
  await harness.close()
}
```
`run(...)` returns a completed result or an interrupted outcome for an approval
or other resumable external wait. Use
[HarnessInstance.getSession](/handbook/api/interfaces/_purista_harness.HarnessInstance/#getsession),
[HarnessSession.release](/handbook/api/interfaces/_purista_harness.HarnessSession/#release),
and [HarnessInstance.close](/handbook/api/interfaces/_purista_harness.HarnessInstance/#close)
for the lifecycle boundaries.

If a model or schema fails, fix the binding or schema and test with a
 deterministic fake provider. Do not log keys, prompts, or raw completions.

Next: [add the first tool](/handbook/harness/start/add-the-first-tool/) or [learn the runtime model](/handbook/harness/understand-the-harness/).
