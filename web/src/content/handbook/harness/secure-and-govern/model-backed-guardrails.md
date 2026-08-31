---
title: Use a model-backed guardrail
description: Register a separate model alias for a semantic content check and compose it with deterministic rails.
order: 754
---

Use a model-backed rail when a rule depends on meaning rather than a stable
deterministic check. Keep deterministic checks first: they are faster, easier
to audit, and do not introduce a second nondeterministic decision. A model rail
is still fail-closed enforcement, not proof that the policy is correct.

This feature is part of the optional `@purista/harness-guardrails` package. By
the end of this guide, one model answers the application request while a
separate `safety` model alias decides whether input and output content may cross
their boundaries.

## 1. Install the Guardrails addon

```sh title="Install model-backed Guardrails support"
npm install @purista/harness-guardrails
```

No provider is installed automatically. Supply a provider through the normal
Harness model composition and declare the `object` capability because the rail
expects a structured `{ allow: boolean }` result.

## 2. Register the guardrail model beside the application model

`modelCheckRail(...)` references a Harness model alias with the `object`
capability. Register that alias before the agent. It may use the same provider
as the application model or a smaller, separately operated provider/model.

```ts title="src/createClaimsHarness.ts"
import { defineHarness, type ModelProvider } from '@purista/harness'
import { defineGuardrails, modelCheckRail } from '@purista/harness-guardrails'
import { z } from 'zod'

export function createClaimsHarness(assistantProvider: ModelProvider, guardrailProvider: ModelProvider) {
	const claimsRails = defineGuardrails({
		config: {
			rails: {
				input: { flows: ['claims policy check'] },
				output: { flows: ['public answer check'] },
			},
		},
		actions: {
			'claims policy check': modelCheckRail({
				phase: 'input',
				model: 'safety',
				instructions: 'Allow only synthetic insurance-claim questions without personal data.',
			}),
			'public answer check': modelCheckRail({
				phase: 'output',
				model: 'safety',
				instructions: 'Allow only answers that contain no private claim details.',
			}),
		},
		actionTimeoutMs: 2_000,
	})

	return defineHarness({ name: 'claims' })
		.telemetry({ contentCaptureMode: 'NO_CONTENT' })
		.models({
			assistant: {
				provider: assistantProvider,
				model: 'runtime-selected-assistant',
				capabilities: ['object'],
			},
			safety: {
				provider: guardrailProvider,
				model: 'runtime-selected-safety-model',
				capabilities: ['object'],
			},
		})
		.agent('answer_claim', {
			model: 'assistant',
			input: z.string().min(1).max(2_000),
			output: z.string(),
			instructions: 'Answer the synthetic claim question concisely.',
			guardrails: claimsRails,
		})
		.build()
}
```

The chain registers [`defineHarness(...)`](/handbook/api/functions/_purista_harness.defineHarness/),
[`.telemetry(...)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#telemetry),
[`.models(...)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#models),
[`.agent(...)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#agent),
and [`.build()`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#build).
The `safety` alias exists before the guarded definition contributes its build
requirement.

| Option | Meaning |
| --- | --- |
| `phase` | `input`, `output`, `tool_input`, `tool_output`, or `retrieval`; the protected value follows that phase |
| `model` | Direct registered Harness model alias; no second alias registry or provider-specific identifier |
| `instructions` | The policy question. The helper asks the model for `{ allow: boolean }` and blocks with `model_denied` when false |

The Guardrails interceptor contributes a build requirement for the selected
alias and `object` capability. A missing alias or capability fails at
`.build()`. A provider error, invalid response, timeout, or cancellation fails
the rail closed. The nested model call emits the normal `LLM` span and usage;
the parent `GUARDRAIL` span records only the decision. Do not copy the inspected
content into either span.

## 3. Compose deterministic and model checks

Order flows from cheapest and most certain to most expensive:

1. strict schema or length check;
2. deterministic pattern or privacy detector;
3. model-backed semantic check;
4. application model or selected tool.

A block skips all later rails and the protected effect. Keep an independent
test for this ordering.

## 4. Verify enforcement, then evaluate quality

Use a fake guardrail model to script three results: `{ allow: true }`,
`{ allow: false }`, and an invalid response. Assert that the application model
runs only for the allowed case. Provider errors, invalid responses, timeouts,
and cancellation must fail the rail closed.

Those deterministic tests prove wiring and side-effect prevention. They do not
prove the semantic reviewer is accurate. Use an
[evaluation dataset](/handbook/harness/test-and-evaluate/evaluation-datasets-and-ci/)
with the real pinned guardrail model to measure false accepts, false rejects,
latency, and cost before promotion.

See [`modelCheckRail`](/handbook/api/functions/_purista_harness-guardrails.modelCheckRail/)
and [test Guardrail enforcement](/handbook/harness/secure-and-govern/test-guardrails/).
