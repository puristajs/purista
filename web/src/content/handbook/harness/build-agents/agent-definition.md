---
title: Define an agent
description: Keep one model-driven job small, typed, and explicit about its allowed capabilities.
order: 310
---

An agent definition describes one bounded model and tool loop. It owns
input and output schemas, instructions, tools, skills, subagents, guardrails,
and loop limits. Provider credentials, storage, memory, sandbox, and telemetry
are runtime bindings.

```ts title="src/harness/classifyCase.ts"
import { defineAgent, defineHarness } from '@purista/harness'
import { z } from 'zod'

const caseInput = z.object({ summary: z.string().min(1) })
const caseOutput = z.object({ priority: z.enum(['low', 'normal', 'high']) })

const classifyCase = defineAgent('classifyCase', {
  model: 'primary',
  input: caseInput,
  output: caseOutput,
  prompt: input => ({ role: 'user', content: input.summary }),
  instructions: 'Classify the support case as low, normal, or high priority.',
})

export const definition = defineHarness({ name: 'support-classification' })
  .addAgent(classifyCase)
```
Bind `primary` with the singular `model` field at `definition.getInstance(...)`.
An agent cannot use tools, skills, guardrails, or subagents unless those direct
definitions are supplied.

| Field | Runtime effect |
| --- | --- |
| `model` | Selects a bound provider-neutral alias for the default loop. |
| `input`, `output` | Validate the application boundary; model-facing output schemas also need JSON Schema. |
| `instructions` | Supplies the default-loop task; it is not authorization. |
| `tools`, `skills`, `subagents` | Allowlist direct definitions already referenced by the graph. Built-ins are selected from `builtInTools` through `tools`. |
| `guardrails` | Binds provider-neutral content controls to the default loop. |
| `permissions`, `governance` | Restrict selected tool occurrences and optionally require approval. |
| `loop` | Bounds steps, tool calls, subagent calls, parallel subagents, and depth. |
| `memory`, `sandbox`, `workspace`, `durable` | Declare graph requirements without embedding live adapters. |
| `responseMode` | Resolves an otherwise ambiguous text or structured output family. |

Use `defineAgent`, `defineTool`, `defineSkill`, and `defineMcpServer` as direct
portable factories. Compose roots with `defineHarness(...).addAgent(agent)` and
`.addWorkflow(workflow)`. IDs are stable graph keys; duplicate or unknown
references fail before a run starts.

Next: [control the model loop](/handbook/harness/build-agents/control-the-model-loop/) or [add a typed tool](/handbook/harness/add-capabilities/tools/).
