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
	.agent('classify_case', {
		model: 'assistant',
		input: caseInput,
		output: caseOutput,
		instructions: 'Classify the support case by urgency only.',
		handler: async ({ input }) => ({
			priority: input.summary.includes('cannot sign in') ? 'high' : 'normal',
		}),
	})
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
| [`.sandbox(inMemorySandbox())`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#sandbox) | Explicitly binds the fixed files-and-bounded-search sandbox returned by [`inMemorySandbox()`](/handbook/api/functions/_purista_harness.inMemorySandbox/). | The factory takes no options and exposes `sandbox.fs` plus `sandbox.text_search`; its session executor is unavailable. Passing it avoids environment-dependent auto-detection. This classifier has no tool authority, so do not mistake the sandbox for durable storage, command execution, or tenant isolation. |
| [`.models(...)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#models) | The `assistant` alias the agent may select. | Define models before agents so `model` is restricted to registered alias keys. |
| [`.agent(id, definition)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#agent) | The `classify_case` definition and session API. | The inline definition carries `caseInput` and `caseOutput` through the fluent chain; a separate cast would lose useful checking. |
| [`.build()`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#build) | Runs composition validation and returns the session-facing Harness. | It requires a non-empty model registry and rejects unknown agent model/tool references and invalid policies before the first prompt. It does not invoke the model. |

## Choose every agent field deliberately

[`agent(id, definition)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#agent)
preserves the model, tool, skill, input, and output types in the same builder
chain. The ID is also the typed key exposed through `session.agents`.

## Register one agent or a related group

Both registration forms are repeatable and accumulate definitions:

| Method | Use it for | Result |
| --- | --- | --- |
| [`.agent(id, definition)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#agent) | The normal case: one inline agent with the strongest contextual typing. | Adds one typed ID without replacing earlier agents. |
| [`.agents(definitions)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#agents) | A non-empty, already typed record of related agents. | Adds every record key without replacing earlier agents. |

Register models, tools, and skills before an agent refers to them. Registration
order otherwise does not determine invocation order. Reusing an existing agent
ID is a configuration error instead of silently replacing the first definition.
The plural method accepts a definition record directly; it does not use an
identity-helper callback.

| Agent field | Required/default | Runtime effect | Detailed guide |
| --- | --- | --- | --- |
| `model` | Required registered alias | Selects the provider-neutral alias used by the default loop and available to typed loop controls. The field is still required for a custom handler even though the handler decides whether to call a model. | [Models and capabilities](/handbook/harness/configure-the-runtime/configuration-and-model-settings/) |
| `input` | Optional; defaults to a string schema | Validates application input before instructions, handler, model, or tools receive it. | [Inputs and structured outputs](/handbook/harness/build-agents/inputs-and-structured-outputs/) |
| `output` | Optional; defaults to a string schema | Validates the final candidate before the caller receives it. A default-loop output must also project to JSON Schema. | [Inputs and structured outputs](/handbook/harness/build-agents/inputs-and-structured-outputs/) |
| `instructions` | Required string or synchronous callback | Defines the model-facing job for the default loop. A custom handler does not automatically execute this text. | [Instructions and context](/handbook/harness/build-agents/instructions-and-runtime-context/) |
| `tools` | Optional; defaults to none | Allowlists registered TypeScript or MCP tool IDs for this agent. It cannot add unregistered tools. | [Create typed tools](/handbook/harness/add-capabilities/tools/) |
| `builtinTools` | Optional; omission or `false` enables none | Allowlists `bash`, `read`, `write`, `edit`, `glob`, `grep`, or `list`. Skills require explicit `read`. | [Set tool permissions](/handbook/harness/secure-and-govern/tool-permissions/) |
| `skills` | Optional; defaults to none | Binds registered reviewed skills and appends their index to default-loop instructions. It does not grant tool authority. | [Add skills](/handbook/harness/add-capabilities/skills/) |
| `permissions` | Optional | Adds allow, deny, path/command patterns, or approval interruption to selected mutating built-ins. It does not authorize application tools. | [Set tool permissions](/handbook/harness/secure-and-govern/tool-permissions/) |
| `sandbox` | Optional; inherits caller/Harness policy | Selects `inherit`, `private`, or a configured sharing group for this agent's filesystem/execution partition. | [Isolate agent execution](/handbook/harness/secure-and-govern/sandbox-and-mcp/) |
| `maxSteps` | Optional; Harness default is `16` | Caps default-loop model calls with a positive integer. Exhaustion raises `AgentLoopBudgetError`. | [Control the model loop](/handbook/harness/build-agents/control-the-model-loop/) |
| `prepareStep` | Optional | Returns per-model-call alias, instructions, active tools, messages, or generation overrides before governance exposure. | [Control the model loop](/handbook/harness/build-agents/control-the-model-loop/) |
| `stopWhen` | Optional | Stops after a model response but before its proposed tools execute, then validates the response object as final output. | [Control the model loop](/handbook/harness/build-agents/control-the-model-loop/) |
| `interceptors` | Optional; defaults to none | Runs ordered, fail-closed default-loop boundaries around model, tool, retrieval, or final output values. | [Protect content with Guardrails](/handbook/harness/secure-and-govern/guardrails/) |
| `guardrails` | Optional; defaults to none | Binds a compatible Guardrails policy set to the default loop after explicitly declared interceptors. | [Protect content with Guardrails](/handbook/harness/secure-and-govern/guardrails/) |
| `handler` | Optional | Replaces the entire default model/tool loop with application code. The returned value still passes output validation. Default-loop tools, permissions, governance, skills, and interceptors do not run automatically. | [Instructions and handler context](/handbook/harness/build-agents/instructions-and-runtime-context/#3-use-the-custom-handler-context) |

Use the smallest definition that completes the job. An optional field does not
enable itself merely because the related adapter or package is installed.
Unknown model/tool/skill references, invalid sandbox groups, incompatible
interceptor requirements, and non-positive `maxSteps` fail during `.build()`.

There is no empty `.tools(record)` call: an agent without `tools` has no custom
tool authority. Add an inline `.tool(id, definition)` registration or a reusable
catalog and an agent allowlist together on
[Create typed tools](/handbook/harness/add-capabilities/tools/) when that is
needed.

## Keep agent and workflow jobs separate

| Agent owns | Workflow/application owns |
| --- | --- |
| One model conversation, tool loop, schema-valid result | Sequencing, approval, retries around side effects, durable writes, queue delivery |

Next: [instructions and runtime context](/handbook/harness/build-agents/instructions-and-runtime-context/).
