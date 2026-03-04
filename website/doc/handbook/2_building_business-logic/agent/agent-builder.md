---
title: The Agent Builder
description: Describe agents with the fluent builder API—schemas, resources, tools, concurrency, and HTTP exposure.
order: 203701
---

# The Agent Builder

`new AgentBuilder(...)` mirrors `ServiceBuilder`: you compose fluent methods to describe metadata, schemas, models, tool allowlists, HTTP exposure, and the handler that runs inside the PURISTA runtime. The result of `.build()` is an `AgentDefinition` you can start multiple times (local + worker pools) just like a service definition.

## Typical workflow

1. Scaffold a new agent with CLI:
   ```bash
   purista add agent supportAgent
   ```
2. Fill in schemas and handler logic in the generated agent file.
3. Wire runtime dependencies in `src/index.ts` via `getInstance(eventBridge, options)`.
4. Invoke the agent from command/subscription/stream contexts with `.canInvokeAgent(...)`.
5. Add or extend the generated test file.

## Full builder example

```ts title="src/agents/supportAgent/v1/supportAgent.ts"
import { AgentBuilder } from '@purista/ai'
import { extendApi } from '@purista/core'
import { z } from 'zod/v4'

const supportInputSchema = extendApi(
  z.object({
    sessionId: z.string().uuid().optional(),
    prompt: z.string().min(1),
    context: z.string().optional(),
  }),
  { title: 'Support Agent Input' },
)

export const supportAgentDefinition = new AgentBuilder({
  agentName: 'supportAgent',
  agentVersion: '1',
  description: 'Answers common help-desk questions',
})
  .addPayloadSchema(supportInputSchema)
  .addOutputSchema(
    extendApi(z.object({ message: z.string(), summary: z.string().optional() }), { title: 'Support Agent Output' }),
  )
  .persistHistory({ storeName: 'aiConversation', maxFrames: 40 })
  .useKnowledgeAdapter({ adapterName: 'supportFaq', options: { locale: 'en-US' } })
  .defineModel('openai:gpt-4o-mini')
  .allowTool({ serviceName: 'support', serviceVersion: '1', commandName: 'createTicket' })
  .setConcurrency({ poolId: 'support' })
  .exposeAsHttpEndpoint('POST', 'agents/supportAgent')
  .makeEndpointPublic()
  .setRetryPolicy({ maxAttempts: 2, initialIntervalMs: 1_000 })
  .setHandler(async function handler(context, payload) {
    const sessionId = payload.sessionId ?? context.message.id

    const knowledge = await context.knowledge.query('supportFaq', payload.prompt, 3)
    const model = context.models['openai:gpt-4o-mini']
    const { output, tokens } = await model.generate({
      prompt: payload.prompt,
      context: [payload.context, knowledge.map(doc => doc.body).join('\n')].filter(Boolean).join('\n\n'),
    })

    context.stream.sendChunk('Checking your account…')
    context.stream.sendFinal(output)

    await context.session.save({ sessionId, data: { lastMessage: output }, updatedAt: Date.now() })

    return { message: output }
  })
  .build()
```

### Key builder calls

- `.addPayloadSchema` / `.addParameterSchema` / `.addOutputSchema` reuse the same schema primitives (`extendApi`, Zod, TypeBox, …) you already use in services.
- `.defineModel(alias)` declares which model aliases the agent can use. Pass the actual provider implementation later through `getInstance(eventBridge, { models: { [alias]: provider } })`.
- `.allowTool` works exactly like `.canInvoke`: only allowlisted service commands may be invoked by `context.tools.invoke()`.
- `.persistHistory`, `.useSessionStore`, and `.useKnowledgeAdapter` describe how conversation history and shared knowledge should be stored. Defaults are in-memory, but you can plug in Redis/PGVector/etc. per agent.
- `.exposeAsHttpEndpoint` wires up an HTTP route in the OpenAPI spec. SSE is the default mode; use `.setStreamingMode(...)` only when you need `buffered` or `chunked`.
- `.setConcurrency` only declares a pool reference (`poolId`). Set actual worker counts via `getInstance(..., { poolConfig: { maxWorkers } })` so scaling stays environment-specific.
- `.setRetryPolicy` mirrors queue/command retries. The runtime automatically replays transient failures and emits handled/unhandled error frames.

## Handler context breakdown

The handler receives a familiar context object with agent-specific helpers:

| Property | Description |
| --- | --- |
| `logger`, `message`, `serviceContext` | Same observability handles you use inside services. |
| `stream` | Action-oriented streaming helpers that map to the [agent protocol](./protocol-and-streaming.md): `sendChunk`, `sendFinal`, `sendArtifact`, `sendError`. |
| `session` | Wrapper around the chosen session store. Use `.load`, `.save`, `.delete` for conversation state. |
| `knowledge` | Fan-out to allowlisted knowledge adapters (vector stores, RAG indexes, etc.). |
| `tools` | Invoke allowlisted PURISTA commands. Events appear as tool frames for tracing/debugging. |
| `models` | Typed access to declared model aliases (`context.models[alias]`). |
| `resources` | Optional custom dependencies for non-model integrations (caches, SDK clients, domain utilities). |

Use these helpers instead of manually wiring protocol IDs, storing envelopes, or calling commands by hand. The builder/runtime ensure every handler runs with consistent tracing, retries, and validation.
