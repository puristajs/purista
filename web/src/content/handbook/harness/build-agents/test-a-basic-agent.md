---
title: Test a basic agent
description: Replace the live provider with a strict scripted adapter and verify one typed agent interaction end to end.
order: 370
---

Use `@purista/harness/testing` to test the real definition, session, schema,
and result path without credentials or network access.

```ts title="src/harness/createCaseHarness.ts"
import { defineAgent, defineHarness, type ModelProvider } from '@purista/harness'
import { z } from 'zod'

const classify = defineAgent('classifyCase', {
  model: 'classifier',
  input: z.object({ summary: z.string().min(1) }),
  output: z.object({ priority: z.enum(['low', 'high']) }),
  prompt: input => ({ role: 'user', content: input.summary }),
  instructions: 'Classify the support case priority.',
})
export function createCaseHarness(provider: ModelProvider) {
	return defineHarness({ name: 'case-management' }).addAgent(classify).getInstance({
		models: { classifier: { provider, model: 'classifier' } },
	})
}
```
```ts title="src/harness/createCaseHarness.test.ts"
import { expect, it } from 'vitest'
import { FakeModelProvider } from '@purista/harness/testing'
import { createCaseHarness } from './createCaseHarness.js'

it('returns the validated priority', async () => {
  const provider = new FakeModelProvider({ strict: true })
  provider.enqueueObject({ object: { priority: 'high' }, finishReason: 'stop' })
  const harness = await createCaseHarness(provider)
  try {
    const session = await harness.getSession('high-priority-case')
    await expect(session.agents.classifyCase.run({ summary: 'Customers cannot sign in.' })).resolves.toMatchObject({ status: 'completed', output: { priority: 'high' } })
    provider.assertExhausted()
  } finally { await harness.close() }
})
```
Strict fixtures reject unexpected model calls and `assertExhausted()` catches
unused responses. Add separate tests for invalid input/output, cancellation,
and timeout. This proves application flow, not live model quality.
