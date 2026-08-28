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
  .models({
    assistant: { provider: { id: 'local', genAiSystem: 'local' }, model: 'not-called', capabilities: ['object'] },
  })
  .agents(({ agent }) => ({
    answerer: agent({
      model: 'assistant',
      input,
      output,
      builtinTools: false,
      instructions: 'Answer briefly and set confidence to low or high.',
      // Keeps this focused example runnable without provider credentials.
      handler: async ({ input }) => ({
        answer: `We received: ${input.question}`,
        confidence: 'high',
      }),
    }),
  }))
  .build()
```

`zod` must be installed by the application when this code imports `z`. Harness
does not make its transitive `zod` dependency a public re-export.

| Field or call | Runtime effect | Decision boundary |
| --- | --- | --- |
| [`defineHarness({ name })`](/handbook/api/functions/_purista_harness.defineHarness/) | Starts the composition and gives logs, telemetry, and diagnostics a stable name. | The optional name defaults to `agent-harness`; do not treat it as request identity or authorization. |
| [`.sandbox(inMemorySandbox())`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#sandbox) | Binds the files-only sandbox returned by [`inMemorySandbox()`](/handbook/api/functions/_purista_harness.inMemorySandbox/) before any later tool definition could receive sandbox context. | The factory has no options and provides only `sandbox.fs`; `exec` and process spawning are unavailable. It keeps this no-tool example independent of automatic adapter detection, but neither validates the schemas nor supplies persistent or isolated storage. |
| [`.models(...)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#models) | Registers `assistant` before the agent selects it. | The `object` capability is the operation needed for a schema-validated default-loop result. Keep capabilities minimal; a live provider mismatch raises a capability error when invoked. |
| [`input`](/handbook/api/interfaces/_purista_harness.AgentDefinition/#input) | Rejects malformed application input before the agent handler/default loop receives it. | Use a narrow schema for application data, not as a substitute for caller authorization. |
| [`output`](/handbook/api/interfaces/_purista_harness.AgentDefinition/#output) | Validates the handler/model result before `prompt()` resolves. | Use structured output when application code needs fields, enums, or bounds—not merely a readable sentence. |
| [`handler`](/handbook/api/interfaces/_purista_harness.AgentDefinition/#handler) | Makes this tutorial deterministic and avoids a provider call. | Omit it for the standard model loop. A custom handler owns its own model/tool lifecycle. |
| [`.agents(...)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#agents) | Preserves the schemas in `session.agents.answerer.prompt(...)`. | Use the `agent(...)` helper instead of asserting a standalone generic type; it keeps the input/output contract inferable. |
| [`.build()`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#build) | Validates the registry and produces the Harness API. | It fails fast for a missing model registry or invalid agent references; schema validation remains at prompt and result boundaries, not at definition time. |

No tool registry is declared because this task does not need one. Add tools only
when the agent needs an explicit application capability.

Do not use model confidence as authorization or a production risk decision. A
workflow or application policy must validate any decision that affects money,
permissions, data retention, or customer communication.

Test schema failure paths with a fake provider; see [Test a basic agent](/handbook/harness/build-agents/test-a-basic-agent/).
