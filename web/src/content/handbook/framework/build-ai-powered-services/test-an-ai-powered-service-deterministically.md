---
title: Test an AI-powered service deterministically
description: Prove the implementation and service flow with deterministic adapters, then test selected real adapters separately; use Harness evaluations for non-deterministic agent quality.
order: 3992
---

Deterministic adapters prove that your implementation uses the right contract,
capabilities, identity, queue/result policy, and recovery path. They cannot
prove that a live LLM will be correct, useful, safe, or consistently worded.
That is an evaluation problem, not a unit-test assertion.

```ts title="src/service/support/v1/agent/triageTicket/triageTicket.test.ts"
import { createAgentTestHarness, createScriptedHarnessModel } from '@purista/core'
import { expect, it } from 'vitest'
import { triageTicketAgentBuilder } from './triageTicketAgentBuilder.js'

it('returns the validated result from a scripted provider', async () => {
	const model = createScriptedHarnessModel()
	model.enqueueObject({
		object: { priority: 'high', reason: 'Customer cannot sign in' },
		usage: { inputTokens: 0, outputTokens: 0, totalTokens: 0 },
		finishReason: 'stop',
	})

	const harness = await createAgentTestHarness(await triageTicketAgentBuilder.getDefinition(), {
		models: {
			primary: { provider: model, model: 'scripted-object-model', capabilities: ['object'] },
		},
	})

	await expect(harness.run({ payload: { ticketId: 'SUP-123', text: 'Cannot sign in' } })).resolves.toEqual({
		priority: 'high',
		reason: 'Customer cannot sign in',
	})
})
```

`createScriptedHarnessModel()` is a deterministic provider, so
`scripted-object-model` is only the runtime model identifier required by the
attached-agent binding; it does not select or call a live vendor model. Queue
the exact response before the invocation and assert the contract result, not
the wording of a probabilistic response.

## Configure the deterministic runtime boundary

| Helper / input | Parameters and defaults | What it returns or proves |
| --- | --- | --- |
| [`createAgentTestHarness(definition, options)`](/handbook/api/functions/_purista_core.createAgentTestHarness/) | A completed attached-agent definition and required `models` keyed by every declared alias. Optional `skills`, `logger`, `governance`, `storage`, `workspace`, `sandbox`, `sandboxOptions`, and `onSuspended` mirror the runtime dependencies the case needs. | A deterministic attached runtime for one definition. It is not a Service instance, EventBridge, queue bridge, or Hono server. |
| `harness.run({ payload?, parameter?, message? })` | Optional input; omitted `message` becomes `{ id: 'test-message' }`. | The aggregate runtime output after input/output validation and the attached execution. |
| `harness.stream({ payload?, parameter?, message? })` | The same input shape as `run`. | `{ chunks, final }`: captured generated stream chunks and the final validated value. It does not simulate a client disconnect unless the test calls the real stream boundary. |
| [`createScriptedHarnessModel()`](/handbook/api/functions/_purista_core.createScriptedHarnessModel/) | No options. Queue `enqueueObject`, `enqueueText`, `enqueueObjectStream`, `enqueueTextStream`, `enqueueEmbedding`, or `enqueueRerank` responses before the call. | A provider that records requests and returns the scripted response in order. It proves model-call shape and flow without network access. |
| [`createAgentContextMock(input?)`](/handbook/api/functions/_purista_core.createAgentContextMock/) | Optional typed payload, parameter, resources, model handles, skills, metrics, identity, and logger. | A direct run-function context only; it does not build the generated agent runtime or validate schemas. |

Pass `storage` and `workspace` only to exercise durable-workspace behavior;
pass `sandbox` only for a tool path that needs it. A normal classification with
no built-in tools needs neither. For a skill case, create an isolated
runtime with [`createAgentSkillTestRuntime(...)`](/handbook/api/functions/_purista_core.createAgentSkillTestRuntime/)
and pass its returned `skills` option.

## Use the smallest test boundary that proves the claim

| Boundary | What it proves | What it does not prove |
| --- | --- | --- |
| Direct logic: `createAgentContextMock(...)` | One run function’s branch logic with supplied resources/models/context. | Builder expansion, runtime input/output validation, generated command/stream/queue, or adapter delivery. |
| Deterministic runtime: `createAgentTestHarness(...)` and `createScriptedHarnessModel()` | Attached runtime input/output validation, model capability binding, session/runtime flow, and scripted run result. It can also use deterministic skill bindings. | Resources, invocation proxies, cancellation handles, the generated service command, Hono projection, queue bridge delivery, or a live provider’s behavior. |
| Selected real adapter | The selected EventBridge/QueueBridge/HTTP/provider integration, startup, delivery, and failure mapping. | General correctness of arbitrary model answers. Keep credentials and fixtures protected. |

Add deterministic runtime tests for required model aliases/capabilities, output
validation failure, durable workspace capability checks, and review handoff.
Use a Service/bridge or HTTP integration test for cancellation, declared tool
reach, tenant/resource authorization, duplicate queued delivery, and required
result-event failure. When a test binds a model, sandbox, storage, or workspace,
finish by calling `definition.runtime.current?.shutdown()`; the current harness
does not return a separate teardown helper.

Do not inline a production skill body or provider transcript into test
snapshots. The deterministic helper verifies that the named binding can be
mounted and reached; it does not make the real skill advice or model answer
correct.

## Evaluate live-agent quality separately

Use versioned evaluation cases, task-specific scoring, review, regression
thresholds, and controlled live-provider runs to assess answer correctness,
grounding, safety, cost, or prompt changes. Do not call a live model in a unit
test and assert exact prose. Continue with [Harness evaluations](/handbook/harness/test-and-evaluate/evaluate-prompts-and-outputs/).

For cross-service, bridge, and deployment verification, continue with [Test
applications](/handbook/framework/test-applications/) and [Secure and operate](/handbook/framework/secure-and-operate/).
