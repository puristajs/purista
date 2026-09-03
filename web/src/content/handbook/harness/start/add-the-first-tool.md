---
title: Add the first tool
description: Give an agent one explicit, typed application capability without treating model instructions as authorization.
order: 50
---

Tools are application handlers exposed to an agent. They are not a permission
system. Authenticate the caller before opening the session, then pass or obtain
the trusted scope inside the handler according to your application design.

This complete definition gives a support agent one public-plan lookup. The
model may choose to call it, but the handler still owns the data boundary and
would perform authorization before returning non-public information.

```ts title="src/harness.ts"
import { defineHarness, inMemorySandbox } from '@purista/harness'
import { openai } from '@purista/harness-openai'
import { z } from 'zod'

const planQuestion = z.object({ code: z.string().min(1) })
const planAnswer = z.object({ name: z.string(), responseHours: z.number().int() })
const apiKey = process.env.OPENAI_API_KEY
if (!apiKey) throw new Error('OPENAI_API_KEY is required to start the support Harness.')

export const harness = defineHarness({ name: 'support' })
	.sandbox(inMemorySandbox())
	.models({
		assistant: {
			provider: openai({ apiKey }),
			model: process.env.OPENAI_MODEL ?? 'gpt-5-mini',
			capabilities: ['object', 'tool_use'],
		},
	})
	.tool('lookup_plan', {
			description: 'Look up a public support plan by its code.',
			input: planQuestion,
			output: planAnswer,
			handler: async (_ctx, { code }) => {
				if (code !== 'standard') throw new Error('Unknown plan code')
				return { name: 'Standard', responseHours: 24 }
			},
	})
	.agent('summarize', {
		model: 'assistant',
		input: planQuestion,
		output: z.object({ answer: z.string() }),
		tools: ['lookup_plan'],
		instructions: 'Use lookup_plan only when the question asks about a plan.',
	})
	.build()
```

The input and output schemas make the tool contract inspectable and testable.
The handler must still enforce domain authorization and safe error behavior.
The selected provider must support `object` and `tool_use`; keep its API key in
application secrets and configure another provider through the same alias
contract when needed.

| Call or field | Runtime effect | Choose it when |
| --- | --- | --- |
| [`defineHarness({ name })`](/handbook/api/functions/_purista_harness.defineHarness/) | Creates the named composition that later owns sessions, tools, and agents. | The optional name defaults to `agent-harness` and identifies diagnostics; it is not a tenant, user, or authorization boundary. |
| [`.sandbox(...)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#sandbox) | Registers the sandbox whose declared capabilities type tool context. | `inMemorySandbox()` gives this tool no exec/process authority. Choose a stronger adapter only for a verified need. |
| [`.models(...)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#models) | Registers the alias selected by this default-loop agent. | `assistant` is the only alias this agent can select; `object` and `tool_use` declare the operations needed by its output contract and custom tool loop. Duplicate aliases fail definition registration. |
| [`.tool('lookup_plan', definition)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#tool) | Registers the inline, model-visible native tool. | It validates model-facing arguments and returned data before the next model step. `description` helps model selection; it is not authorization. |
| [`.tools(record)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#tools) | Registers a reusable, pre-typed native or MCP tool catalog. | Keep this inline TypeScript handler on `.tool(...)`; use a catalog only when it is the reusable composition boundary. |
| [`tools: ['lookup_plan']`](/handbook/api/types/_purista_harness.AgentDefinition/#signature) | Allows this agent to call one registered custom tool. | Omitting it denies all custom tools. The alias must declare `tool_use` for a live model call. |
| omitted [`builtinTools`](/handbook/api/types/_purista_harness.AgentDefinition/#signature) | Enables no built-in file or command tools. | Add only the names justified by a sandboxed use case; custom `tools` do not enable built-ins. |
| [`.agent(...)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#agent) | Registers the `summarize` session API after its model and tool IDs are known. | The inline definition restricts `model` and `tools` to those earlier registries. Unknown tool/skill references are rejected during configuration. |
| [`.build()`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#build) | Validates the complete composition and returns the Harness instance. | A default-loop agent requires its selected model alias. Build rejects invalid cross-registry references or namespace collisions before a session can run. |

For tool selection, timeouts, parallel calls, testing, skills, MCP, and plugins,
continue with [Add capabilities](/handbook/harness/add-capabilities/).
