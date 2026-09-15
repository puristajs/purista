---
title: Configuration and model settings
description: Bind truthful model capabilities and safe generation defaults at the Harness runtime boundary.
order: 210
---

A model binding connects a provider adapter to a concrete provider model. Agent
and workflow definitions refer to user-chosen purpose aliases such as
`answering`; they do not contain credentials or provider clients.

```ts title="Bind a model at the composition root"
import { defineAgent, defineHarness } from '@purista/harness'
import { openai } from '@purista/harness-openai'
import { z } from 'zod'

const answer = defineAgent('answer', {
	model: 'answering',
  input: z.object({ question: z.string().min(1) }),
  output: z.object({ answer: z.string() }),
  prompt: input => ({ role: 'user', content: input.question }),
  instructions: 'Answer the question briefly and factually.',
})

const definition = defineHarness({ name: 'support' }).addAgent(answer)

export const harness = await definition.getInstance({
	models: {
		answering: {
			provider: openai({ apiKey: process.env.OPENAI_API_KEY }),
			model: process.env.OPENAI_MODEL ?? 'gpt-5-mini',
			defaults: { maxTokens: 600, temperature: 0.2 },
		},
	},
})
```
Every agent declares its model alias explicitly. Harness assigns no special
meaning to names such as `primary` or `default`. Bind every required alias under
`getInstance({ models: { alias: ... } })`; the keys must match the definition
graph exactly.

The definition graph derives its required capabilities from response modes,
tools, and other selected features. Missing provider methods, unknown aliases,
and invalid defaults fail during composition or instance creation.
`temperature`, token limits, stop sequences, parallel tool calls, and retry
settings are provider-neutral requests; a provider may reject an unsupported
field.

| Binding | Purpose | Boundary |
| --- | --- | --- |
| `provider` | Adapter that performs the model operation | Credentials and endpoint policy remain application-owned |
| `model` | Concrete provider model ID | It is not the public agent alias |
| `defaults` | Safe per-call generation defaults | It is not a determinism guarantee |
| `retry` | Provider-neutral retry policy | Retries do not make side effects idempotent |

## Bind concurrency at the runtime boundary

Concurrency is runtime infrastructure, not agent metadata. Keep the two
independent controls under one `concurrency` object:

```ts title="Limit roots and provider operations"
import { inMemoryRunConcurrency } from '@purista/harness'

const harness = await definition.getInstance({
  models,
  concurrency: {
    runs: inMemoryRunConcurrency({ maxConcurrent: 8, maxQueued: 32 }),
    modelCalls: providerRateAdmission,
  },
})
```

`runs` admits complete root execution trees.
[`inMemoryRunConcurrency(...)`](/handbook/api/functions/_purista_harness.inMemoryRunConcurrency/)
is
process-local and does not replace a durable queue. `modelCalls` admits each
provider operation and can coordinate by provider, model, credential scope,
and operation. Supply an application or adapter implementation of
[`ModelCallConcurrency`](/handbook/api/interfaces/_purista_harness.ModelCallConcurrency/)
when provider quotas require it. Both ports receive the
invocation deadline and cancellation signal and return a lease that is released
when the admitted work finishes.

Use a durable queue before the Harness when a complete invocation must survive
process loss, retry later, or be controlled across a fleet. Model-call
concurrency still protects the provider after a queued invocation starts.

## Choose a retry policy for the caller

Configure short provider retries on the model binding only for transient model
failures. Keep the attempt count and total delay within the caller's timeout.
The application must still decide whether an entire agent or workflow run is
safe to repeat after a timeout or an uncertain tool side effect.

Use a deterministic fake model in unit tests and a separately gated live smoke
test for each deployed provider/model combination. Never place credentials,
raw prompts, completions, or tenant identifiers in logs or telemetry.

Next: [call model operations](/handbook/harness/configure-the-runtime/call-model-operations/) or [configure a provider](/handbook/harness/configure-the-runtime/provider-selection/).
