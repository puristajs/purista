---
title: Configure Anthropic
description: Bind Anthropic Messages to a stable Harness model alias.
order: 250
---

```sh title="Anthropic example 1"
npm install @purista/harness @purista/harness-anthropic
```
Anthropic requires an application-owned `ANTHROPIC_API_KEY` and a selected model.
The adapter sends Harness `maxTokens` as the required Messages `max_tokens`.

```ts title="src/createAnthropicHarness.ts"
import { defineAgent, defineHarness } from '@purista/harness'
import { anthropic } from '@purista/harness-anthropic'
import { z } from 'zod'

const answer = defineAgent('answer', { model: 'primary', input: z.string(), output: z.object({ answer: z.string() }), instructions: 'Answer clearly.' })
const definition = defineHarness({ name: 'support' }).addAgent(answer)
export const harness = await definition.getInstance({ model: { provider: anthropic({ apiKey: process.env.ANTHROPIC_API_KEY }), model: process.env.ANTHROPIC_MODEL ?? 'claude-sonnet', defaults: { maxTokens: 700 } } })
```
Sampling controls vary by Claude family. Omit `temperature`, `topP`, and
`topK` unless the selected model documents them. Retry and timeout policy does
not make tool side effects idempotent.
