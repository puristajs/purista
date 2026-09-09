---
title: Configuration and model settings
description: Bind truthful model capabilities and safe generation defaults at the Harness runtime boundary.
order: 210
---

A model binding connects a provider adapter to a concrete provider model. Agent
and workflow definitions refer to stable aliases such as `primary`; they do not
contain credentials or provider clients.

```ts title="Bind a model at the composition root"
import { defineAgent, defineHarness } from '@purista/harness'
import { openai } from '@purista/harness-openai'
import { z } from 'zod'

const answer = defineAgent('answer', {
  model: 'primary',
  input: z.object({ question: z.string().min(1) }),
  output: z.object({ answer: z.string() }),
  prompt: input => ({ role: 'user', content: input.question }),
  instructions: 'Answer the question briefly and factually.',
})

const definition = defineHarness({ name: 'support' }).addAgent(answer)

export const harness = await definition.getInstance({
	model: {
		provider: openai({ apiKey: process.env.OPENAI_API_KEY }),
		model: process.env.OPENAI_MODEL ?? 'gpt-5-mini',
		defaults: { maxTokens: 600, temperature: 0.2 },
	},
})
```
The definition graph derives its required capabilities from response modes,
tools, and other selected features. Missing provider methods, unknown aliases,
and invalid defaults fail during composition or instance creation.
`temperature`, token limits, stop sequences, parallel tool calls, and retry
settings are provider-neutral requests; a provider may reject an unsupported
field.

| Binding | Purpose | Boundary |
| --- | --- | --- |
| `provider` | Adapter that performs the model operation | Credentials and endpoint policy remain application-owned |
| `model` | Concrete provider model ID | It is not the public agent alias |
| `defaults` | Safe per-call generation defaults | It is not a determinism guarantee |
| `retry` | Provider-neutral retry policy | Retries do not make side effects idempotent |

Use a deterministic fake model in unit tests and a separately gated live smoke
test for each deployed provider/model combination. Never place credentials,
raw prompts, completions, or tenant identifiers in logs or telemetry.

Next: [call model operations](../call-model-operations/) or [configure a provider](./provider-selection/).
