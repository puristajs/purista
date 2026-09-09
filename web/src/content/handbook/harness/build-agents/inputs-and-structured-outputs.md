---
title: Validate inputs and structured outputs
description: Keep application input and model-facing output schemas explicit at the agent boundary.
order: 320
---

Define input and output with a Standard Schema. A default-loop structured output
also needs JSON Schema so the provider can constrain its response.

```ts title="src/harness/answerSupportQuestion.ts"
import { defineAgent, defineHarness } from '@purista/harness'
import { z } from 'zod'

const answer = defineAgent('answerSupportQuestion', {
  model: 'primary',
  input: z.object({ question: z.string().min(1) }),
  output: z.object({ answer: z.string(), confidence: z.number().min(0).max(1) }),
  prompt: input => ({ role: 'user', content: input.question }),
  instructions: 'Answer the support question and report confidence.',
})
export const definition = defineHarness({ name: 'support' }).addAgent(answer)
```
Input validation runs before the model loop. Output validation
runs before the caller receives the result. Invalid caller input is actionable;
invalid application output is an internal contract failure and must not expose
the rejected value.

Keep received representations and domain values separate when transforms are
needed. Test valid input, invalid input, provider refusal, invalid output, and
cancellation with a deterministic fake.
