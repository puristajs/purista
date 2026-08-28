---
title: Create typed tools
description: Expose narrow, application-authorized operations to an agent.
order: 410
---

A TypeScript tool is the default integration choice for a business action. Its
input and output schemas make the model-facing contract clear; its handler
performs the real authorization and side effect. This local support example
keeps the lookup deterministic so the composition can be tested without a
provider credential.

```ts title="src/harness/orderSupport.ts"
import { defineHarness, inMemorySandbox } from '@purista/harness'
import { z } from 'zod'

const orderLookupInput = z.object({ orderId: z.string().min(1) })
const orderLookupOutput = z.object({ status: z.enum(['pending', 'shipped', 'delivered']) })

export const orderSupportHarness = defineHarness({ name: 'order-support' })
  .sandbox(inMemorySandbox())
  .models({
    assistant: { provider: { id: 'local', genAiSystem: 'local' }, model: 'not-called', capabilities: ['object', 'tool_use'] },
  })
  .tools(({ tool }) => ({
    find_order: tool({
      description: 'Find one order visible to the authenticated customer.',
      input: orderLookupInput,
      output: orderLookupOutput,
      handler: async (_ctx, { orderId }) => ({
        status: orderId === 'order-42' ? 'delivered' : 'pending',
      }),
    }),
  }))
  .agents(({ agent }) => ({
    support: agent({
      model: 'assistant',
      input: orderLookupInput,
      output: z.object({ answer: z.string() }),
      tools: ['find_order'],
      builtinTools: false,
      instructions: 'Use find_order only for the order in the validated request.',
    }),
  }))
  .build()
```

`@purista/harness` and `zod` are sufficient; no optional package is needed.
The tool is unavailable until both its registration and agent allowlist exist.

| Call or field | What it does | Selection and failure guidance |
| --- | --- | --- |
| [`defineHarness({ name })`](/handbook/api/functions/_purista_harness.defineHarness/) | Starts a named Harness definition; the name becomes diagnostic and telemetry identity. | It defaults to `agent-harness` when omitted. Do not use it as a caller, tenant, or permission identifier. |
| [`.sandbox(...)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#sandbox) | Declares the sandbox capabilities exposed to a typed tool handler. | The in-memory adapter is files-only. Do not imply command/process isolation from this choice. |
| [`.models(...)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#models) | Registers the `assistant` alias before agent definitions refer to it. | Keep `object` for the structured result and add `tool_use` because the default agent loop may expose `find_order` to the model. Empty registries and duplicate aliases fail configuration. |
| [`.tools(...)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#tools) | Registers `find_order` in the Harness tool registry. | Use the callback helper for a TypeScript handler; use the object form only for a declared MCP tool. Duplicate IDs fail configuration. |
| [`tool({ ... })`](/handbook/api/interfaces/_purista_harness.ToolDefinitionHelpers/#tool) | Preserves exact input/output schemas and handler context. | `description` guides model selection; `input` and `output` validate shape; `handler` must still authorize and own side effects. |
| [`tools`](/handbook/api/interfaces/_purista_harness.AgentDefinition/#tools) | An agent-local allowlist of registered custom tools. | Omitting it denies custom tools. A live agent with any custom tool also needs a model alias declaring `tool_use`. |
| [`builtinTools`](/handbook/api/interfaces/_purista_harness.AgentDefinition/#builtintools) | Enables named built-in tools or disables all with `false`. | Keep `false` for a domain lookup. Built-ins have their own sandbox and authorization implications. |
| [`.agents(...)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#agents) | Adds the `support` agent to the session API. | Put it after models and tools: the callback helper then keeps model and tool IDs literal and checked. Missing referenced tools are rejected when the definition is built. |
| [`.build()`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#build) | Validates registries and returns the executable Harness. | It rejects a missing model registry, unknown agent references, and collisions between custom tool, skill, and built-in names; it does not make a tool authorized. |

The model and tool registries precede `.agents(...)` because their literal IDs
become the only values the agent helper accepts. This is why the configuration
stays inline rather than moving the agent into a broad, manually asserted
object.

## Make the boundary dependable

- Do validate identifiers, tenant scope, and result shape in the handler or
  the application service it calls.
- Do use a domain idempotency key for an externally visible write.
- Do return a compact, least-privilege result.
- Do not put credentials in a tool description or trust the model to authorize.
- Do not make one broad `admin` tool when a narrow domain operation will do.

Replace the deterministic handler with an application service call that first
checks the authenticated principal and tenant. Test the handler independently,
then test an agent call with an authorized and unauthorized principal. Also
verify that an agent without `tools: ['find_order']` cannot call it. For a
reusable file-based procedure, use [skills](/handbook/harness/add-capabilities/skills/).
