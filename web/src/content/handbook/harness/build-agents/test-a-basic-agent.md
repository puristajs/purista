---
title: Test a basic agent
description: Inject a deterministic provider to test schemas, session wiring, and error behavior without a live model.
order: 370
---

Build the Harness in a function that accepts a `ModelProvider`. Production passes
a real adapter; the test passes a deterministic adapter that returns a controlled
response. That tests the implementation around the model, rather than pretending
that a live model will produce identical wording twice.

```ts title="src/case-harness.ts"
import { defineHarness, inMemorySandbox, type ModelProvider } from '@purista/harness'
import { z } from 'zod'

const input = z.object({ summary: z.string().min(1) })
const output = z.object({ priority: z.enum(['low', 'high']) })

export function createCaseHarness(provider: ModelProvider) {
  return defineHarness({ name: 'case-test' })
    .sandbox(inMemorySandbox())
    .models({ test: { provider, model: 'test', capabilities: ['object'] } })
    .agents(({ agent }) => ({
      classify_case: agent({
        model: 'test',
        input,
        output,
        builtinTools: false,
        instructions: 'Classify the case priority.',
      }),
    }))
    .build()
}
```

```ts title="src/case-harness.test.ts"
import { describe, expect, it } from 'vitest'
import type { JsonValue, ModelProvider, ObjectRequest, ObjectResponse } from '@purista/harness'
import { createCaseHarness } from './case-harness.js'

class FakeProvider implements ModelProvider {
  readonly id = 'fake'
  readonly genAiSystem = 'fake'

  async object<T extends JsonValue = JsonValue>(_request: ObjectRequest<T>): Promise<ObjectResponse<T>> {
    return {
      object: { priority: 'high' } as T,
      usage: { inputTokens: 1, outputTokens: 1, totalTokens: 2 },
      finishReason: 'stop',
    }
  }
}

describe('case classifier', () => {
  it('returns the scripted object through the agent boundary', async () => {
    const harness = createCaseHarness(new FakeProvider())
    const session = await harness.getSession('case-test')

    await expect(session.agents.classify_case.prompt({ summary: 'A sign-in outage' }))
      .resolves.toEqual({ priority: 'high' })

    await harness.shutdown()
  })
})
```

| Composition call | What it verifies here | Boundary to keep in mind |
| --- | --- | --- |
| [`defineHarness({ name })`](/handbook/api/functions/_purista_harness.defineHarness/) | Creates the named test composition; a stable name makes failing session/trace diagnostics recognizable. | `name` defaults to `agent-harness` and is not a test isolation or authorization mechanism. Use distinct session IDs for independent cases. |
| [`.sandbox(inMemorySandbox())`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#sandbox) | Pins the test to the files-only adapter returned by [`inMemorySandbox()`](/handbook/api/functions/_purista_harness.inMemorySandbox/) instead of host-dependent auto-detection. | It accepts no options, exposes only `sandbox.fs`, and has no command executor or durable filesystem. Keep it for deterministic composition; use a dedicated adapter contract test when the application relies on sandbox persistence, execution, or isolation. |
| [`.models(...)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#models) | Binds the fake provider to the only alias the agent can select. | The non-empty model registry is required by `.build()`. Declare only `object`, because the test neither streams nor uses tools; a missing capability is a deterministic failure. |
| [`.agents(...)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#agents) | Registers the typed `classify_case` session API and preserves its schemas. | The callback helper restricts its `model` to `test`. Keep the definition inline so the test retains input/output inference. |
| [`.build()`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#build) | Runs configuration validation before the test opens a session. | It catches a missing model or invalid cross-registry reference; it does not prove the factual quality of a live model response. |

The maintained `ai-harness/examples/quickstart/src/index.test.ts` uses this
pattern. Add separate tests for invalid input, invalid model output, tool
failures, timeout/cancellation, and session-concurrency behavior before relying
on a live-provider smoke test.

This verifies our code and wiring deterministically: schemas, session behavior,
tool/workflow control flow, retries, cancellation, and configured persistence.
It does **not** prove that a nondeterministic model response is factually
correct, helpful, or safe for representative user input. Measure that agent
quality with [evaluations](/handbook/harness/test-and-evaluate/evaluate-prompts-and-outputs/)
using a reviewed dataset, scorers, and release threshold.
