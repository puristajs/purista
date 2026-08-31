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
		assistant: {
			provider: { id: 'local', genAiSystem: 'local' },
			model: 'not-called',
			capabilities: ['object', 'tool_use'],
		},
	})
	.tool('find_order', {
			description: 'Find one order visible to the authenticated customer.',
			input: orderLookupInput,
			output: orderLookupOutput,
			handler: async (_ctx, { orderId }) => ({
				status: orderId === 'order-42' ? 'delivered' : 'pending',
			}),
	})
	.agent('support', {
		model: 'assistant',
		input: orderLookupInput,
		output: z.object({ answer: z.string() }),
		tools: ['find_order'],
		instructions: 'Use find_order only for the order in the validated request.',
	})
	.build()
```

With Zod, `@purista/harness` and `zod` are sufficient; no Harness-specific
schema addon is needed. You can instead use any Standard Schema validator. The
tool is unavailable until both its registration and agent allowlist exist.

## Keep validation separate from model projection

Harness accepts any [Standard Schema](https://standardschema.dev/) validator;
Zod remains the default shown here. A TypeScript tool is the one schema boundary
where the distinction changes setup: `input` must be a `ModelSchema`, because a
model creates the tool arguments. `output` needs only `Schema`, because the
handler creates it after the tool is selected.

At `.build()`, Harness requests the input JSON Schema from each tool input once
with the Draft 2020-12 target, copies and freezes it, and passes that exact JSON
value to the configured provider. Do not call a vendor converter in the tool
handler, wrap a schema for Harness, or expect provider adapters to repair an
unsupported keyword.

ArkType implements both contracts directly:

```ts title="src/harness/orderSupportSchemas.ts"
import { type } from 'arktype'

export const orderLookupInput = type({ orderId: 'string' })
export const orderLookupOutput = type({ status: 'string' })
```

Valibot is a direct validation schema. For the input only, add its official
Standard JSON Schema wrapper:

```ts title="src/harness/orderSupportSchemas.ts"
import { toStandardJsonSchema } from '@valibot/to-json-schema'
import * as v from 'valibot'

export const orderLookupInput = toStandardJsonSchema(v.object({ orderId: v.string() }))
export const orderLookupOutput = v.object({ status: v.string() })
```

Install that wrapper alongside Valibot with `npm install @valibot/to-json-schema`.
The `tool(...)` helper infers both library variants without a cast.
The [schema-library compatibility matrix](/handbook/harness/start/requirements-and-installation/#choose-the-schema-library-your-application-owns)
also covers application-only tool output and every other schema boundary.

| Call or field | What it does | Selection and failure guidance |
| --- | --- | --- |
| [`defineHarness({ name })`](/handbook/api/functions/_purista_harness.defineHarness/) | Starts a named Harness definition; the name becomes diagnostic and telemetry identity. | It defaults to `agent-harness` when omitted. Do not use it as a caller, tenant, or permission identifier. |
| [`.sandbox(...)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#sandbox) | Declares the sandbox capabilities exposed to a typed tool handler. | The in-memory adapter provides files and bounded search, but no command/process isolation. |
| [`.models(...)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#models) | Registers the `assistant` alias before agent definitions refer to it. | Keep `object` for the structured result and add `tool_use` because the default agent loop may expose `find_order` to the model. Empty registries and duplicate aliases fail configuration. |
| [`.tool('find_order', definition)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#tool) | Registers the inline native tool in the Harness registry. | `description` guides model selection; input is a model-facing `ModelSchema`, output is a validation `Schema`; `handler` must still authorize and own side effects. Duplicate IDs fail configuration. |
| [`.tools(record)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#tools) | Registers a reusable, pre-typed native or MCP catalog. | Do not use it for an inline TypeScript handler; use it when the catalog itself is the reusable composition boundary. |
| [`tools`](/handbook/api/types/_purista_harness.AgentDefinition/#signature) | An agent-local allowlist of registered custom tools. | Omitting it denies custom tools. A live agent with any custom tool also needs a model alias declaring `tool_use`. |
| [`builtinTools`](/handbook/api/types/_purista_harness.AgentDefinition/#signature) | Enables only the named built-in tools; omission enables none. | Omit it for this domain lookup. Add a minimal explicit allowlist only after selecting the matching sandbox and authorization boundary. |
| [`.agent(...)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#agent) | Adds the `support` agent to the session API. | Put it after models and tools so their IDs remain literal and checked in the inline definition. Missing referenced tools are rejected when the definition is built. |
| [`.build()`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#build) | Validates registries and returns the executable Harness. | It rejects a missing model registry, unknown agent references, and collisions between custom tool, skill, and built-in names; it does not make a tool authorized. |

The model and tool registries precede `.agent(...)` because their literal IDs
become the only values its definition accepts. This is why the configuration
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

When an agent needs the built-in `write`, `edit`, or `bash` tool, continue with
[set built-in tool permissions](/handbook/harness/secure-and-govern/tool-permissions/).
That guide owns path/command allowlists, denylists, approval mode, and the
deterministic checks that prove a denied operation never reaches the sandbox.
Custom TypeScript tool authorization remains in the handler shown on this page.

## Use built-in `grep` for sandbox files

Add `grep` only to agents that need it:

```ts title="Define the bounded-search agent fields"
const supportAgent = {
	model: 'assistant',
	builtinTools: ['read', 'grep'],
	instructions: 'Search first, then open only the relevant files.',
} as const
```

Pass `supportAgent` to `.agent('support', supportAgent)` in the inline Harness
composition after registering the `assistant` model alias.

This works with the default sandbox. `grep` uses `sandbox.text_search`, not a
shell, and returns stable line matches plus `complete`, `limitReasons`,
`scannedFiles`, and `scannedBytes`. Treat `complete: false` as a reason to
narrow the path or pattern. Custom sandbox authors must implement and
contract-test that capability; Harness never reads a remote workspace into
core as a fallback.
