---
title: Configure the first model
description: Bind one provider model to the stable alias used by a Harness definition.
order: 30
---

A model alias is a provider-neutral name used by an agent definition. Bind the
provider, model ID, and safe defaults at instance creation. The definition
graph derives the capabilities the provider must implement.

```ts title="src/harness.ts"
import { defineAgent, defineHarness } from '@purista/harness'
import { openai } from '@purista/harness-openai'
import { z } from 'zod'

const answer = defineAgent('answer', {
  model: 'primary',
  input: z.object({ question: z.string() }),
  output: z.object({ answer: z.string() }),
  prompt: input => ({ role: 'user', content: input.question }),
  instructions: 'Answer briefly and factually.',
})

const definition = defineHarness({ name: 'support' }).addAgent(answer)
export const harness = await definition.getInstance({
	model: { provider: openai({ apiKey: process.env.OPENAI_API_KEY }), model: 'gpt-5-mini' },
})
```
The alias must expose every operation the definition requests. A missing key or
capability fails before the first model call. Keep credentials in application
configuration and never log them.

Next: [build the first agent](./build-the-first-agent/).
