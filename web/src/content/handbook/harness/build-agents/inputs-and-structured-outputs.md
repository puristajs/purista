---
title: Inputs and structured outputs
description: Make the application contract explicit with schemas before a model call and after its result.
order: 330
---

Schemas turn an agent boundary into an application contract. Input validation
rejects malformed requests before the model runs. Output validation prevents an
unstructured completion from flowing directly into application logic. This
complete agent accepts a support question and returns only a short answer and a
bounded confidence label.

```ts title="src/harness/answerSupportQuestion.ts"
import { defineHarness, inMemorySandbox } from '@purista/harness'
import { z } from 'zod'

const input = z.object({ question: z.string().min(1) })
const output = z.object({
	answer: z.string(),
	confidence: z.enum(['low', 'high']),
})

export const supportQuestionHarness = defineHarness({ name: 'support-question' })
	.sandbox(inMemorySandbox())
	.agent('answerer', {
		input,
		output,
		// Keeps this focused example runnable without provider credentials.
		handler: async ({ input }) => ({
			answer: `We received: ${input.question}`,
			confidence: 'high',
		}),
	})
	.build()
```

`zod` must be installed by the application when this code imports `z`. Harness
does not make its transitive `zod` dependency a public re-export.

## Use one validator at every application boundary

Zod is the default for new Harness code and all pages use it for the smallest
path. The boundary is not Zod-only: any [Standard Schema](https://standardschema.dev/)
validator preserves its exact raw input and validated output types through
agents, workflows, tools, session methods, and handler context. A schema may
therefore coerce, apply defaults, or transform its input without losing the
type inferred by `run(...)`, `ctx.input`, a handler, or the final result.

The producer determines whether a `Schema` is enough. `ModelSchema` means a
Standard Schema validator that also implements Standard JSON Schema. Harness
projects its **input** form once during `.build()` as frozen Draft 2020-12 JSON
Schema; the configured provider receives that JSON value unchanged. The
original validator remains the authority for runtime validation.

| Application declaration | Required contract | Why |
| --- | --- | --- |
| `agent({ input })` | `Schema` | The application supplies the prompt value. |
| Default-loop `agent({ output })` | `ModelSchema` | The provider must create a structured result. |
| Custom-handler `agent({ output })` | `Schema` | The application handler returns the candidate result. |
| `tool({ input })` | `ModelSchema` | The provider creates tool arguments. |
| `tool({ output })` | `Schema` | The TypeScript handler returns the result. |
| `workflow({ input, output })` | `Schema` | Application code invokes and returns workflow values. |
| `defineGuardrailAction({ valueSchema })` | `Schema` | Harness validates the selected value before the application callback. |

This is the same rule in every provider adapter. A provider may reject a legal
Draft 2020-12 keyword it does not support; simplify that one model-facing
schema for the selected provider. Harness never converts, weakens, or rewrites
the validator or its projection.

| Validator | Use at validation boundaries | Use for default-loop output / TypeScript tool input |
| --- | --- | --- |
| Zod | Directly | Directly |
| ArkType | Directly | Directly |
| Valibot | Directly | Wrap only this model-facing schema with `toStandardJsonSchema(...)` from `@valibot/to-json-schema` |

These equivalent output declarations show the only vendor-specific code. Do
not wrap schemas for Harness or add a provider converter.

```ts title="src/harness/schemas.ts"
import { z } from 'zod'

export const answerOutput = z.object({ answer: z.string() })
```

```ts title="src/harness/schemas.ts"
import { type } from 'arktype'

export const answerOutput = type({ answer: 'string' })
```

```ts title="src/harness/schemas.ts"
import { toStandardJsonSchema } from '@valibot/to-json-schema'
import * as v from 'valibot'

export const answerOutput = toStandardJsonSchema(v.object({ answer: v.string() }))
```

For Valibot, install both packages with
`npm install valibot @valibot/to-json-schema`. The wrapper is unnecessary for a
custom-handler output, workflow boundary, agent input, tool output, or
Guardrail value that the model does not create. Start at
[requirements and installation](/handbook/harness/start/requirements-and-installation/)
when choosing another validator or checking compatibility.

| Field or call | Runtime effect | Decision boundary |
| --- | --- | --- |
| [`defineHarness({ name })`](/handbook/api/functions/_purista_harness.defineHarness/) | Starts the composition and gives logs, telemetry, and diagnostics a stable name. | The optional name defaults to `agent-harness`; do not treat it as request identity or authorization. |
| [`.sandbox(inMemorySandbox())`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#sandbox) | Binds the files-and-bounded-search sandbox returned by [`inMemorySandbox()`](/handbook/api/functions/_purista_harness.inMemorySandbox/) before any later tool definition could receive sandbox context. | The factory has no options and provides `sandbox.fs` plus `sandbox.text_search`; `exec` and process spawning are unavailable. It keeps this no-tool example independent of automatic adapter detection, but neither validates the schemas nor supplies persistent or isolated storage. |
| [`input`](/handbook/api/types/_purista_harness.AgentDefinition/#signature) | Rejects malformed application input before the agent handler/default loop receives it. | Use a narrow schema for application data, not as a substitute for caller authorization. |
| [`output`](/handbook/api/types/_purista_harness.AgentDefinition/#signature) | Validates the handler/model result before `run()` resolves. | A default-loop agent requires `ModelSchema` JSON Schema support; a custom handler needs only `Schema`. Use structured output when application code needs fields, enums, or bounds—not merely a readable sentence. |
| [`handler`](/handbook/api/types/_purista_harness.AgentDefinition/#signature) | Makes this tutorial deterministic and avoids a provider call. | Omit it for the standard model loop. A custom handler owns its own model/tool lifecycle and therefore does not declare `model`, `instructions`, loop controls, interceptors, or Guardrails. |
| [`.agent(...)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#agent) | Preserves the schemas in `session.agents.answerer.run(...)`. | Keep the definition inline instead of asserting a standalone generic type so the input/output contract remains inferable. |
| [`.build()`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#build) | Validates the registry and produces the Harness API. | A handler-only Harness does not need a model registry. When model-facing schemas exist, build compiles them once to frozen Draft 2020-12 JSON Schema; validation remains at input and result boundaries. |

No tool registry is declared because this task does not need one. Add tools only
when the agent needs an explicit application capability.

Do not use model confidence as authorization or a production risk decision. A
workflow or application policy must validate any decision that affects money,
permissions, data retention, or customer communication.

Test schema failure paths with a fake provider; see [Test a basic agent](/handbook/harness/build-agents/test-a-basic-agent/).
