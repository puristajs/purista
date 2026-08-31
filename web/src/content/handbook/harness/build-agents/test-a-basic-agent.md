---
title: Test a basic agent
description: Replace the live provider with a strict scripted adapter and verify one typed agent interaction end to end.
order: 370
---

Test the agent boundary without credentials or network access. The test injects
the same `ModelProvider` port used in production, scripts one structured result,
and runs the real Harness session and schema validation path.

This proves that the application selects the agent, sends the expected request,
validates the result, and closes its resources. It does not prove that a live
model will classify representative cases correctly; that belongs in an
[evaluation](/handbook/harness/test-and-evaluate/evaluate-prompts-and-outputs/).

## Keep provider selection injectable

```ts title="src/harness/createCaseHarness.ts"
import { defineHarness, inMemorySandbox, type ModelProvider } from '@purista/harness'
import { z } from 'zod'

const caseInput = z.object({ summary: z.string().min(1) })
const caseOutput = z.object({ priority: z.enum(['low', 'high']) })

export function createCaseHarness(provider: ModelProvider) {
	return defineHarness({ name: 'case-management' })
		.sandbox(inMemorySandbox())
		.models({
			classifier: { provider, model: 'classifier', capabilities: ['object'] },
		})
		.agent('classify_case', {
			model: 'classifier',
			input: caseInput,
			output: caseOutput,
			instructions: 'Classify the support case priority.',
		})
		.build()
}
```

The production composition passes its selected provider adapter. The test
passes a fake at that same boundary; there is no test-only branch inside the
agent. An explicit `inMemorySandbox()` keeps the test independent of optional
packages installed on the machine.

The chain uses [`defineHarness(...)`](/handbook/api/functions/_purista_harness.defineHarness/),
[`.sandbox(...)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#sandbox),
[`.models(...)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#models),
[`.agent(...)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#agent),
and [`.build()`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#build)
in the same order as production. See [Define an agent](/handbook/harness/build-agents/agent-definition/)
for the full agent option contract; this page owns only the testing seam.

## Script and run one interaction

```ts title="src/harness/createCaseHarness.test.ts"
import { describe, expect, it } from 'vitest'
import { FakeModelProvider } from '@purista/harness/testing'
import { createCaseHarness } from './createCaseHarness.js'

describe('case classifier', () => {
	it('returns the validated priority', async () => {
		const provider = new FakeModelProvider({ strict: true })
		provider.enqueueObject({
			object: { priority: 'high' },
			usage: { inputTokens: 1, outputTokens: 1, totalTokens: 2 },
			finishReason: 'stop',
		})
		const harness = createCaseHarness(provider)

		try {
			const session = await harness.getSession('high-priority-case')

			await expect(session.agents.classify_case.run({ summary: 'Customers cannot sign in.' })).resolves.toEqual({
				priority: 'high',
			})

			expect(provider.requests).toHaveLength(1)
			provider.assertExhausted()
		} finally {
			await harness.shutdown()
		}
	})
})
```

`strict: true` rejects an unqueued request and a response queued for the wrong
operation. This catches an accidental extra model round instead of returning a
legacy empty fallback. `assertExhausted()` catches the opposite mistake: a
scripted response the implementation never consumed.

Use a fresh provider and session ID for each independent test. Always shut down
the Harness in `finally`, including after a failed assertion.

## Add the first failure cases

Keep each test focused on one boundary:

| Case | Setup | Expected evidence |
| --- | --- | --- |
| Invalid caller input | Invoke with data outside `caseInput` | Validation fails before provider I/O; `provider.requests` stays empty |
| Invalid model output | Queue an object outside `caseOutput` | The agent fails output validation without returning the raw invalid value |
| Missing model call fixture | Use strict mode without `enqueueObject` | The fake reports an unexpected `object` request |
| Extra application model round | Queue only the expected response | Strict mode rejects the second request |
| Unused fixture | Queue two results but execute once | `provider.assertExhausted()` fails |
| Cancellation or timeout | Pass an aborted signal or bounded invocation timeout | The normalized cancellation/timeout error reaches the caller |

Continue with [Test Harness applications](/handbook/harness/test-and-evaluate/test-harness-applications/)
for tools, workflows, storage, sandbox adapters, replay, and the boundary between
deterministic tests and live-provider evaluations.
