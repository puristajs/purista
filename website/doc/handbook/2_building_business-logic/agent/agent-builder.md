---
title: Builder
description: Define the attached-agent contract with AgentQueueBuilder and keep runtime wiring out of the builder.
order: 203702
---

# Builder

`AgentQueueBuilder` is the definition phase for attached agents in PURISTA.

Use it to declare:

- payload and parameter schemas
- model aliases
- allowed tools and child agents
- execution policy
- HTTP exposure metadata
- the handler implementation

Do not use it to provide concrete providers, stores, queue bridges, or sandbox drivers. Those belong in `getInstance(..., { ai })`.

## Canonical Shape

```ts
import { supportV1ServiceBuilder } from '../../supportV1ServiceBuilder.js'
import { z } from 'zod'

export const supportAgentBuilder = supportV1ServiceBuilder
  .getAgentQueueBuilder(
    'supportAgent',
    'Support assistant attached to the support service',
    'support.agent.completed',
  )
  .addPayloadSchema(
    z.object({
      prompt: z.string().min(1),
      sessionId: z.string().optional(),
    }),
  )
  .addModel('openai:gpt-4o-mini')
  .canInvoke('support', '1', 'lookupFaq')
  .canInvokeAgent('triageAgent', '1')
  .setExecutionPolicy({
    maxModelSteps: 8,
    maxToolCalls: 4,
  })
  .setAgentFunction(async (context, payload) => {
    return { message: payload.prompt }
  })
```

## Builder Rules

- The agent builder is anchored to the owning service builder.
- `serviceVersion` comes from the service namespace.
- `getDefinition()` returns an inert `{ queue, worker, manifest }` artifact.
- The service file aggregates that definition through `addAgentDefinition(...)`.

## Runtime Boundary

Runtime AI configuration belongs here:

```ts
const supportService = await supportV1Service.getInstance(eventBridge, {
  queueBridge,
  ai: {
    model: {
      'openai:gpt-4o-mini': provider,
    },
  },
})
```

That keeps the builder honest: declarations in the builder, deployment config at startup.

## Related Guides

- [Quick Start](./getting-started.md)
- [Context](./handler-context.md)
- [Invocation](./invocation.md)
