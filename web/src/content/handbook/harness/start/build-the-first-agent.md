---
title: Build the first agent
description: Define one schema-validated agent, invoke it through a session, and observe a typed result.
order: 40
---

By the end of this guide, a support-summary agent returns `{ answer: string }`.
The model is allowed to generate language, but the application accepts only an
object matching the output schema.

## Define the agent

```ts title="src/harness.ts"
import { defineHarness } from '@purista/harness'
import { openai } from '@purista/harness-openai'
import { z } from 'zod'

const input = z.object({ question: z.string().min(1) })
const output = z.object({ answer: z.string() })
const apiKey = process.env.OPENAI_API_KEY
if (!apiKey) {
	throw new Error('OPENAI_API_KEY is required to start the support Harness.')
}

export const harness = defineHarness({ name: 'support' })
	.models({
		assistant: {
			provider: openai({ apiKey }),
			model: process.env.OPENAI_MODEL ?? 'gpt-5-mini',
			capabilities: ['object'],
		},
	})
	.agent('summarize', {
		model: 'assistant',
		input,
		output,
		instructions: 'Give a concise, factual support summary.',
	})
	.build()
```

Built-in tools are disabled when `builtinTools` is omitted, so the first run
cannot read files or execute commands. Add a named capability only when its
sandbox, authorization, and failure behavior are ready.

| Call or field | What it establishes | Choice and failure boundary |
| --- | --- | --- |
| [`defineHarness({ name })`](/handbook/api/functions/_purista_harness.defineHarness/) | Starts an immutable composition with the optional name used in diagnostics, logs, and telemetry. | Omit `name` only when the default `agent-harness` is meaningful in your deployment. It creates a definition; it does not select a provider or start a session. |
| [`.models(...)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#models) | The `assistant` alias before any agent refers to it. | Its `object` capability matches the output schema. An alias/model mismatch is a configuration failure, not something an instruction can repair. |
| [`.agent(id, definition)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#agent) | Adds one schema-aware agent. The `summarize` ID becomes `session.agents.summarize`. | Prefer this form for an inline definition. The current builder state constrains `model`, `tools`, and `skills`, while the schemas type the session method. |
| [`model`](/handbook/api/types/_purista_harness.AgentDefinition/#signature) | Selects a previously registered alias. | It must be an alias key, not an SDK model name. Declare aliases before agents so this is type-checked. |
| [`instructions`](/handbook/api/types/_purista_harness.AgentDefinition/#signature) | Gives the model its task. | Keep it behavior-focused and free of secrets or caller authority. Use a function only when it derives text from the typed, already-authorized agent input. |
| [`builtinTools`](/handbook/api/types/_purista_harness.AgentDefinition/#signature) | Explicitly enables named built-in file or command tools. Omission enables none. | Use a minimal named allowlist only after the sandbox and authorization policy support it. |
| [`.build()`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#build) | Freezes and validates the definition. | It rejects an unknown model, tool, or skill before an invocation succeeds. |

The [agent definition reference](/handbook/harness/build-agents/agent-definition/)
owns loop limits, tools, skills, handlers, and interception options.

## Invoke through a session

```ts title="Run the support summarizer"
const session = await harness.getSession('support-demo')

try {
	const result = await session.agents.summarize.run({
		question: 'What does a model alias provide?',
	})

	console.log(result.answer)
} finally {
	await harness.shutdown()
}
```

Expected result: one concise answer. It need not match exact wording, but it
must satisfy the `output` schema. The session is the application API; do not
call a provider adapter directly from route handlers or business workflows.

## If the first run fails

| Evidence | Likely cause | Safe action |
| --- | --- | --- |
| Authentication or provider error | Missing key, endpoint, model access, or network policy | Fix application secrets and provider access; do not log the key. |
| Capability error | Agent asks for an operation not declared by the alias | Declare only verified adapter/model capabilities. |
| Schema error | Provider output does not match `output` | Narrow the schema or instructions; test with a fake provider. |

Next: [add the first tool](/handbook/harness/start/add-the-first-tool/) or [learn the runtime
model](/handbook/harness/understand-the-harness/).
