---
title: Configure the first model
description: Bind one provider model to the stable alias used by a Harness definition.
order: 30
---

A model alias is the provider-neutral name that a definition uses. `primary`
is the reserved default alias. When an agent omits `model`, it uses `primary`,
and the singular `model` field passed to `getInstance(...)` binds that alias.

The provider adapter, provider model ID, credentials, and safe defaults belong
at instance creation. The definition graph derives the operations that each
binding must support.

```ts title="src/harness.ts"
import { defineAgent, defineHarness } from '@purista/harness'
import { openai } from '@purista/harness-openai'
import { z } from 'zod'

const answer = defineAgent('answer', {
  input: z.object({ question: z.string() }),
  output: z.object({ answer: z.string() }),
  prompt: input => ({ role: 'user', content: input.question }),
  instructions: 'Answer briefly and factually.',
})

const definition = defineHarness({ name: 'support' }).addAgent(answer)
export const harness = await definition.getInstance({
	// The singular field binds the reserved "primary" alias.
	model: { provider: openai({ apiKey: process.env.OPENAI_API_KEY }), model: 'gpt-5-mini' },
})
```

The two uses of `model` describe different things:

| Place | Meaning |
| --- | --- |
| `defineAgent(..., { model: 'fast' })` | Stable alias selected by the definition. |
| `getInstance({ model: binding })` | Runtime binding for the reserved `primary` alias. |
| `{ provider: openai(...), model: 'gpt-5-mini' }` | Provider adapter and provider-specific model ID inside one binding. |

Use `models` for named aliases. When a graph uses `primary` and `fast`, supply
both fields:

```ts title="Bind primary and named aliases"
const fastAnswer = defineAgent('fastAnswer', {
	model: 'fast',
	instructions: 'Answer in one sentence.',
})

const definition = defineHarness({ name: 'support' })
	.addAgent(answer)
	.addAgent(fastAnswer)

const provider = openai({ apiKey: process.env.OPENAI_API_KEY })
const harness = await definition.getInstance({
	model: { provider, model: process.env.OPENAI_PRIMARY_MODEL ?? 'gpt-5-mini' },
	models: {
		fast: { provider, model: process.env.OPENAI_FAST_MODEL ?? 'gpt-5-mini' },
	},
})
```

If every definition uses named aliases and none uses `primary`, omit the
singular `model` field and bind every alias under `models`. The inferred
instance type requires the exact aliases used by the graph. A missing alias or
provider capability fails before the first model call. See
[`HarnessInstanceConfig`](/handbook/api/types/_purista_harness.HarnessInstanceConfig/)
for the complete runtime contract. Keep credentials in application
configuration and never log them.

Next: [build the first agent](/handbook/harness/start/build-the-first-agent/).
