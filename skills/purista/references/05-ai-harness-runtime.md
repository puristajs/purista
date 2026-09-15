# AI Harness Runtime

Use this reference for PURISTA v4 AI integration. `@purista/harness` owns
portable agent, workflow, tool, Skill, MCP, Guardrail, and governance
definitions. `@purista/core` mounts one completed Harness definition on its
owning service and supplies trusted Framework context and runtime bindings.
Harness never imports Core.

## Contents

- Definitions and mount ownership
- Address-first invocation
- Runtime bindings and lifecycle
- Tools, browser streaming, and tests

## Definitions and mount ownership

Define a root agent or workflow beside its owning service, then compose it:

```ts
import { defineAgent, defineHarness } from '@purista/harness'
import { z } from 'zod'

export const triageTicketAgent = defineAgent('triageTicket', {
	model: 'classification',
  input: z.object({ ticketId: z.string(), text: z.string() }),
  output: z.object({ priority: z.enum(['low', 'normal', 'high']) }),
  prompt: input => ({ role: 'user', content: input.text }),
  instructions: 'Classify the ticket from the supplied text.',
})

export const supportHarness = defineHarness({ name: 'support' })
  .addAgent(triageTicketAgent)
```

Mount once on the final service builder. A root is addressable; an agent or
workflow only referenced by another definition remains private.

```ts
export const supportV1Service = supportV1ServiceBuilder.mountHarness(supportHarness, {
  targets: { agents: { [triageTicketAgent.contract.id]: { beforeGuards: { authorize } } } },
})
```

Mount guards authorize the mounted address. HTTP wrapper guards authorize only
the wrapper. Guardrails and governance belong to `defineAgent`; they do not
replace Framework authorization.

Output rails run only on final answer candidates.
Intermediate tool-call responses skip output rails.
Use tool-output rails for schema-validated tool results.

## Address-first invocation

Declare the authentic target contract before use. Calls cross EventBridge even
in one process.

```ts
const command = supportV1ServiceBuilder
  .getCommandBuilder('triageTicket', 'Classify a support ticket')
  .canInvokeAgent('Support', '1', triageTicketAgent.contract)
  .setCommandFunction(async function ({ agent }, input) {
    const result = await agent.Support['1'][triageTicketAgent.contract.id].run(input)
    if (result.outcome.status !== 'completed') return result
    return result.outcome.output
  })
```

Remote `.run(...)` returns `{ sessionId, outcome }`; remote `.stream(...)`
returns a cancellable execution stream. An interruption is normal application
data. Queue delivery requires `defineHarnessQueueBinding(...)` and its queued
reference; direct contracts never expose `.enqueue(...)`.

## Runtime binding and lifecycle

Bind concrete infrastructure only at service instance creation. Every agent
declares a user-chosen purpose alias, and every binding uses the exact matching
key under `ai.models`. Harness reserves no alias. Runtime bindings do not
declare model capabilities.

```ts
const support = await supportV1Service.getInstance(eventBridge, {
  resources,
  ai: {
    models: { classification: { provider, model: 'provider-model-id' } },
    storage: harnessStorage,
    memory,
    sandbox: {
      adapter: sandbox,
    },
    workspace,
  },
})
```

The service owns Harness lifecycle and closes its instance during destruction.
Use application-owned logical session ids; trusted tenant/principal identity is
provided by the Framework, never by a payload.

The adapter is execution infrastructure. Its policy is optional: private
partitions are the default. A graph that declares `sandbox: { group: 'name' }`
needs `policy: { sharing: 'declared' }`; no runtime group list is repeated.
Use `authorizeBorrowedOwner` only when an application intentionally permits an
existing owner to be attached after its own authorization decision.

## Tools, streaming, and tests

Use a portable `defineTool(...)` only for portable dependencies. Use
`ServiceBuilder.defineTool(...)` when a model-selected tool needs a PURISTA
command, stream, queue, event, or resource. Declare capability clients before
its `setHandler(...)` implementation.

Mounting creates no HTTP route. Expose a command for aggregate output or a
PURISTA stream for browser delivery. Use `@purista/harness-ai-sdk-ui/v1` to map
portable events to AI SDK UI Message Stream v1. Declare
`AI_SDK_UI_MESSAGE_STREAM_V1_PROTOCOL` on the stream so Hono supplies the
standard response headers and direct-stream settings. Use
`pipeHarnessUIMessageStream(events, writer, request)` so projection,
completion, closing, and upstream cancellation stay in the adapter instead of
being reimplemented in the handler.

Test portable definitions with `FakeModelProvider`. Test host tools and mounted
targets through deterministic EventBridge/service integration. Test commands,
streams, and HTTP projections with their own context or protocol fixtures.
