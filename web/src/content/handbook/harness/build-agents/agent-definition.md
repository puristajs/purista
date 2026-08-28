---
title: Define an agent
description: Keep one model-driven job small, typed, and explicit about its allowed capabilities.
order: 310
---

An agent definition names one model alias, validates input and output, declares
its tools and skills, and bounds its model loop. It should describe one job such
as classifying a support case or extracting an invoice field, not an entire
business process. The following definition stays intentionally capability-free:
the model classifies a case but cannot read files, call tools, or take action.

```ts title="src/harness/classifyCase.ts"
import { defineHarness, inMemorySandbox } from '@purista/harness'
import { z } from 'zod'

const caseInput = z.object({ summary: z.string().min(1) })
const caseOutput = z.object({ priority: z.enum(['low', 'normal', 'high']) })

export const classifyCaseHarness = defineHarness({ name: 'support-classification' })
  .sandbox(inMemorySandbox())
  .models({
    assistant: { provider: { id: 'local', genAiSystem: 'local' }, model: 'not-called', capabilities: ['object'] },
  })
  .agents(({ agent }) => ({
    classify_case: agent({
      model: 'assistant',
      input: caseInput,
      output: caseOutput,
      builtinTools: false,
      instructions: 'Classify the support case by urgency only.',
      handler: async ({ input }) => ({
        priority: input.summary.includes('cannot sign in') ? 'high' : 'normal',
      }),
    }),
  }))
  .build()
```

The deterministic handler makes this exact example runnable without credentials.
Replace it with a configured live provider-backed agent before using model
reasoning. The alias must declare the capabilities an agent uses. An agent can
use TypeScript tools, built-ins, skills, or MCP tools only after those are
explicitly configured; each adds a different trust boundary.

| Builder call or field | What it declares | Use it this way |
| --- | --- | --- |
| [`defineHarness({ name })`](/handbook/api/functions/_purista_harness.defineHarness/) | Starts this immutable composition and assigns its diagnostic name. | The name defaults to `agent-harness`; it is not an agent ID, caller identity, or permission boundary. |
| [`.sandbox(inMemorySandbox())`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#sandbox) | Explicitly binds the fixed files-only sandbox returned by [`inMemorySandbox()`](/handbook/api/functions/_purista_harness.inMemorySandbox/). | The factory takes no options and exposes only `sandbox.fs`; its session executor is unavailable. Passing it avoids environment-dependent auto-detection. This classifier has no tool authority, so do not mistake the sandbox for durable storage, command execution, or tenant isolation. |
| [`.models(...)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#models) | The `assistant` alias the agent may select. | Define models before agents. The callback helper then restricts `model` to registered alias keys. |
| [`.agents(...)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#agents) | The `classify_case` session API. | The inline `agent(...)` helper carries `caseInput` and `caseOutput` through the fluent definition; a separate cast would lose useful checking. |
| [`handler`](/handbook/api/interfaces/_purista_harness.AgentDefinition/#handler) | A deterministic implementation instead of the default model/tool loop. | Use it for deterministic business logic or a custom integration. Do not attach default-loop-only features such as Guardrails to a handler agent. Omit it to invoke the selected model. |
| [`builtinTools: false`](/handbook/api/interfaces/_purista_harness.AgentDefinition/#builtintools) | No built-in file or command tool is enabled. | This is the safe default for a classifier. Add named built-ins only after configuring the matching sandbox boundary. |
| [`.build()`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#build) | Runs composition validation and returns the session-facing Harness. | It requires a non-empty model registry and rejects unknown agent model/tool references and invalid policies before the first prompt. It does not invoke the model. |

There is no empty `.tools(...)` call: an agent without `tools` has no custom
tool authority. Add the registry and an agent allowlist together on
[Create typed tools](/handbook/harness/add-capabilities/tools/) when that is
needed.

## Keep agent and workflow jobs separate

| Agent owns | Workflow/application owns |
| --- | --- |
| One model conversation, tool loop, schema-valid result | Sequencing, approval, retries around side effects, durable writes, queue delivery |

Next: [instructions and runtime context](/handbook/harness/build-agents/instructions-and-runtime-context/).
