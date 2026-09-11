---
title: Configure OpenAI
description: Bind the OpenAI provider adapter to a stable Harness model alias.
order: 240
---

Install the separate provider package and keep `OPENAI_API_KEY`, optional
`OPENAI_MODEL`, and an approved compatible `baseURL` in application config.

```sh title="Openai example 1"
npm install @purista/harness @purista/harness-openai
```
```ts title="src/createOpenAIHarness.ts"
import { defineAgent, defineHarness } from '@purista/harness'
import { openai } from '@purista/harness-openai'
import { z } from 'zod'

const answer = defineAgent('answer', { model: 'answering', input: z.string(), output: z.object({ answer: z.string() }), instructions: 'Answer clearly.' })
const definition = defineHarness({ name: 'support' }).addAgent(answer)
export const harness = await definition.getInstance({ models: { answering: { provider: openai({ apiKey: process.env.OPENAI_API_KEY, api: 'responses' }), model: process.env.OPENAI_MODEL ?? 'gpt-5-mini' } } })
```
The adapter supports Chat Completions by default and Responses when `api:
'responses'` is selected. Use `defaults` for shared token and sampling limits;
provider options remain an explicit escape hatch. Verify the chosen model and
endpoint support every declared capability. Missing keys, denied model access,
unsupported settings, and network failures remain application errors.

Next: [select a provider](/handbook/harness/configure-the-runtime/provider-selection/) or [configure model settings](/handbook/harness/configure-the-runtime/configuration-and-model-settings/).
