---
title: The Agent Builder
description: Describe agents with the fluent builder API—schemas, resources, tools, concurrency, and HTTP exposure.
order: 203701
---

# The Agent Builder

`AgentBuilder.create` mirrors `ServiceBuilder`: you compose fluent methods to describe metadata, schemas, resources, tool allowlists, HTTP exposure, and the handler that runs inside the PURISTA runtime. The result of `.build()` is an `AgentDefinition` you can start multiple times (local + worker pools) just like a service definition.

## Full builder example

```ts title="src/agents/supportAgent/v1/supportAgent.ts"
import { AgentBuilder, type AgentHandlerContext, type ModelProvider } from '@purista/ai'
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

type SupportAgentContext = AgentHandlerContext<z.infer<typeof supportInputSchema>, unknown, { model: ModelProvider }>

export const supportAgentDefinition = AgentBuilder.create({
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
  .setModelResource({ resourceName: 'openai:gpt-4o-mini' })
  .useResource('model', { resourceName: 'openai:gpt-4o-mini' })
  .allowTool({ serviceName: 'support', serviceVersion: '1', commandName: 'createTicket' })
  .setConcurrency({ poolId: 'support', maxWorkers: 3 })
  .exposeAsHttpEndpoint('POST', 'agents/supportAgent')
  .setStreamingMode('sse')
  .makeEndpointPublic()
  .setRetryPolicy({ maxAttempts: 2, initialIntervalMs: 1_000 })
  .setHandler(async function handler(context: SupportAgentContext, payload) {
    const sessionId = payload.sessionId ?? context.message.id

    const knowledge = await context.knowledge.query('supportFaq', payload.prompt, 3)
    const { output, tokens } = await context.resources.model.generate({
      prompt: payload.prompt,
      context: [payload.context, knowledge.map(doc => doc.body).join('\n')].filter(Boolean).join('\n\n'),
    })

    context.protocol.emitMessage({ content: 'Checking your account…', partial: true })
    context.protocol.emitMessage({ content: output, final: true })
    context.protocol.emitTelemetry({ provider: context.resources.model.name, usage: {
      promptTokens: tokens?.prompt,
      completionTokens: tokens?.completion,
      totalTokens: (tokens?.prompt ?? 0) + (tokens?.completion ?? 0),
    } })

    await context.session.save({ sessionId, data: { lastMessage: output }, updatedAt: Date.now() })

    return { message: output }
  })
  .build()
```

### Key builder calls

- `.addPayloadSchema` / `.addParameterSchema` / `.addOutputSchema` reuse the same schema primitives (`extendApi`, Zod, TypeBox, …) you already use in services.
- `.useResource(alias, { resourceName })` registers a manifest dependency and gives the handler typed access through `context.resources[alias]`. Pass the actual implementation later when creating an instance.
- `.allowTool` works exactly like `.canInvoke`: only allowlisted service commands may be invoked by `context.tools.invoke()`.
- `.persistHistory`, `.useSessionStore`, and `.useKnowledgeAdapter` describe how conversation history and shared knowledge should be stored. Defaults are in-memory, but you can plug in Redis/PGVector/etc. per agent.
- `.exposeAsHttpEndpoint` + `.setStreamingMode` wires up an HTTP route in the OpenAPI spec. Use `buffered` for single-payload responses or `sse`/`chunked` for token streams.
- `.setConcurrency` registers the agent in the `PoolManager` so that no more than `maxWorkers` run at once, protecting token quotas and rate limits.
- `.setRetryPolicy` mirrors queue/command retries. The runtime automatically replays transient failures and emits handled/unhandled error frames.

## Handler context breakdown

The handler receives a familiar context object with agent-specific helpers:

| Property | Description |
| --- | --- |
| `logger`, `message`, `serviceContext` | Same observability handles you use inside services. |
| `protocol` | Emits frames that follow the [agent protocol](./protocol-and-streaming.md). `emitMessage`, `emitArtifact`, `emitTelemetry`, and `emitError` are all optional—the runtime auto-fills defaults when you `return` a payload. |
| `session` | Wrapper around the chosen session store. Use `.load`, `.save`, `.delete` for conversation state. |
| `knowledge` | Fan-out to allowlisted knowledge adapters (vector stores, RAG indexes, etc.). |
| `tools` | Invoke allowlisted PURISTA commands. Events appear as tool frames for tracing/debugging. |
| `resources` | Typed access to the custom dependencies (model providers, caches, third-party SDK clients). |

Use these helpers instead of manually wiring protocol IDs, storing envelopes, or calling commands by hand. The builder/runtime ensure every handler runs with consistent tracing, retries, and validation.
