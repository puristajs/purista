---
title: Configure the first model
description: Bind one provider model to the stable alias used by a Harness definition.
order: 30
---

A model alias is the provider-neutral name that a definition uses. Choose the
alias for its purpose, such as `answering`, `classification`, or `embedding`.
Harness does not reserve an alias or choose one for you. Every agent names its
alias explicitly, and `getInstance(...)` binds the same key under `models`.

The provider adapter, provider model ID, credentials, and safe defaults belong
at instance creation. The definition graph derives the operations that each
binding must support.

```ts title="src/harness.ts"
import { defineAgent, defineHarness } from '@purista/harness'
import { openai } from '@purista/harness-openai'
import { z } from 'zod'

const answer = defineAgent('answer', {
	model: 'answering',
  input: z.object({ question: z.string() }),
  output: z.object({ answer: z.string() }),
  prompt: input => ({ role: 'user', content: input.question }),
  instructions: 'Answer briefly and factually.',
})

const definition = defineHarness({ name: 'support' }).addAgent(answer)
export const harness = await definition.getInstance({
	models: {
		answering: {
			provider: openai({ apiKey: process.env.OPENAI_API_KEY }),
			model: 'gpt-5-mini',
		},
	},
})
```

The two uses of `model` describe different things:

| Place | Meaning |
| --- | --- |
| `defineAgent(..., { model: 'answering' })` | User-chosen purpose alias required by the definition. |
| `getInstance({ models: { answering: binding } })` | Runtime binding for that exact alias. |
| `{ provider: openai(...), model: 'gpt-5-mini' }` | Provider adapter and provider-specific model ID inside one binding. |

All bindings live under `models`. When a graph uses `answering` and
`classification`, supply both keys:

```ts title="Bind two purpose aliases"
const classify = defineAgent('classify', {
	model: 'classification',
	instructions: 'Classify the request before it is answered.',
})

const definition = defineHarness({ name: 'support' })
	.addAgent(answer)
	.addAgent(classify)

const provider = openai({ apiKey: process.env.OPENAI_API_KEY })
const harness = await definition.getInstance({
	models: {
		answering: { provider, model: process.env.OPENAI_ANSWERING_MODEL ?? 'gpt-5-mini' },
		classification: { provider, model: process.env.OPENAI_CLASSIFICATION_MODEL ?? 'gpt-5-mini' },
	},
})
```

The inferred instance type requires the exact aliases used by the graph. A
missing alias, extra alias, or unsupported provider capability fails before the
first model call. Aliases describe application roles; provider model IDs may
change between environments without changing the definition. See
[`HarnessInstanceConfig`](/handbook/api/types/_purista_harness.HarnessInstanceConfig/)
for the complete runtime contract. Keep credentials in application
configuration and never log them.

Next: [build the first agent](/handbook/harness/start/build-the-first-agent/).
