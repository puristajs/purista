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
import { z } from 'zod'

const planQuestion = z.object({ code: z.string().min(1) })
const planAnswer = z.object({ name: z.string(), responseHours: z.number().int() })

export const harness = defineHarness({ name: 'support' })
  .sandbox(inMemorySandbox())
  .models({
    assistant: { provider: { id: 'local', genAiSystem: 'local' }, model: 'not-called', capabilities: ['object', 'tool_use'] },
  })
  .tools(({ tool }) => ({
    lookup_plan: tool({
      description: 'Look up a public support plan by its code.',
      input: planQuestion,
      output: planAnswer,
      handler: async (_ctx, { code }) => {
        if (code !== 'standard') throw new Error('Unknown plan code')
        return { name: 'Standard', responseHours: 24 }
      },
    }),
  }))
  .agents(({ agent }) => ({
    summarize: agent({
      model: 'assistant',
      input: planQuestion,
      output: z.object({ answer: z.string() }),
      tools: ['lookup_plan'],
      builtinTools: false,
      instructions: 'Use lookup_plan only when the question asks about a plan.',
    }),
  }))
  .build()
```

The input and output schemas make the tool contract inspectable and testable.
The handler must still enforce domain authorization and safe error behavior. A
live agent needs a model provider that supports `object` and `tool_use`; replace
the local verification provider with a configured provider alias from [configure
the runtime](/handbook/harness/configure-the-runtime/).

| Call or field | Runtime effect | Choose it when |
| --- | --- | --- |
| [`defineHarness({ name })`](/handbook/api/functions/_purista_harness.defineHarness/) | Creates the named composition that later owns sessions, tools, and agents. | The optional name defaults to `agent-harness` and identifies diagnostics; it is not a tenant, user, or authorization boundary. |
| [`.sandbox(...)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#sandbox) | Registers the sandbox whose declared capabilities type tool context. | `inMemorySandbox()` gives this tool no exec/process authority. Choose a stronger adapter only for a verified need. |
| [`.models(...)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#models) | Registers the non-empty alias registry required when the Harness is built. | `assistant` is the only alias this agent can select; `object` and `tool_use` declare the operations needed by its output contract and custom tool loop. Duplicate aliases fail definition registration. |
| [`.tools(...)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#tools) | Registers model-visible tool IDs. | Use the callback form for TypeScript handlers: its `tool(...)` helper preserves schema and sandbox-context types. |
| [`tool({ input, output, handler })`](/handbook/api/interfaces/_purista_harness.ToolDefinitionHelpers/#tool) | Validates model-facing arguments and returned data before the next model step. | `description` helps model selection; it is not authorization. Keep the handler narrow and authorize its domain read or write. |
| [`tools: ['lookup_plan']`](/handbook/api/interfaces/_purista_harness.AgentDefinition/#tools) | Allows this agent to call one registered custom tool. | Omitting it denies all custom tools. The alias must declare `tool_use` for a live model call. |
| [`builtinTools: false`](/handbook/api/interfaces/_purista_harness.AgentDefinition/#builtintools) | Denies the built-in file and command tools. | Keep it until a sandbox and use case justify an explicit built-in allowlist. |
| [`.agents(...)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#agents) | Registers the `summarize` session API after its model and tool IDs are known. | Use `agent(...)` in the callback so TypeScript restricts `model` and `tools` to those earlier registries. Unknown tool/skill references are rejected during configuration. |
| [`.build()`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#build) | Validates the complete composition and returns the Harness instance. | It requires at least one model alias and rejects invalid cross-registry references or namespace collisions before a session can run. |

For tool selection, timeouts, parallel calls, testing, skills, MCP, and plugins,
continue with [Add capabilities](/handbook/harness/add-capabilities/).
