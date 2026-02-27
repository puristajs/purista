---
title: Run & Invoke Agents
description: Start agent instances, wire dependencies, and call them from commands, HTTP bridges, or queue workers.
order: 203702
---

# Run & Invoke Agents

An `AgentDefinition` is inert until you bind runtime dependencies (event bridge, stores, resources). This page shows how to create an instance, start/stop it alongside your services, and invoke it from anywhere in the application.

## Bootstrap the instance

```ts title="src/index.ts"
import { DefaultEventBridge } from '@purista/core'
import { AiSdkProvider } from '@purista/ai'
import { createOpenAI } from '@ai-sdk/openai'
import { supportAgentDefinition } from './agents/supportAgent/v1/supportAgent.js'

type Resources = { model: AiSdkProvider }

const eventBridge = new DefaultEventBridge()
await eventBridge.start()

const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY! })
const provider = new AiSdkProvider({
  model: openai('gpt-4o-mini'),
  systemPrompt: 'You are a friendly support engineer.',
  defaults: { temperature: 0.2 },
})

const supportAgent = await supportAgentDefinition.getInstance({
  eventBridge,
  resources: {
    model: provider,
  } satisfies Resources,
})

await supportAgent.start()
```

- `eventBridge` is mandatory; every agent registers an internal service (`agent.<name>.run`).
- `resources` matches whatever aliases you declared with `.useResource`. Inject SDK clients, providers, caches, etc.
- Session stores, knowledge adapters, and pool managers default to in-memory implementations. Override them per environment if you need Redis/PGVector or a shared pool.

## Invoke an agent programmatically

The helper `invokeAgent` mirrors `invokeCommand` but automatically validates the agent protocol envelopes:

```ts
import { invokeAgent } from '@purista/ai'

const result = await invokeAgent({
  eventBridge,
  agentName: supportAgentDefinition.info.agentName,
  agentVersion: supportAgentDefinition.info.agentVersion,
  payload: { prompt: 'How do I reset my password?' },
  parameter: { locale: 'en' },
})

for (const envelope of result) {
  console.log(envelope.frame.kind, envelope.frame)
}
```

Use the optional `stream` argument to attach a responder that processes frames as the agent emits them (ideal for WebSockets or web streams).

### Inside commands, streams, or subscriptions

Because agents register as internal services, you can reuse the existing invoke helpers:

```ts
import { invokeAgent } from '@purista/ai'

export const notifyCommand = supportServiceBuilder
  .getCommandBuilder('notifySupportAgent', 'Runs the support agent from a command')
  .addPayloadSchema(supportInputSchema)
  .setCommandFunction(async function (context, payload) {
    const envelopes = await invokeAgent({
      eventBridge: context.eventBridge,
      agentName: 'supportAgent',
      agentVersion: '1',
      payload,
      parameter: { channel: 'command' },
    })

    return envelopes
  })
```

The helper keeps your command lean—no need to reimplement the protocol or envelope plumbing.

## HTTP exposure

`.exposeAsHttpEndpoint('POST', 'agents/supportAgent')` automatically adds an endpoint to your generated OpenAPI spec. The endpoint behaves like any streaming command:

```ts
export const supportAgentDefinition = AgentBuilder.create({ ... })
  .exposeAsHttpEndpoint('POST', 'agents/supportAgent')
  .setStreamingMode('sse')
  .setHandler(...)
  .build()
```

If your API gateway already maps `POST /api/v1/agents/supportAgent` to the bridge, clients can `fetch` it directly. For custom controllers, pipe the envelopes to SSE/chunked responses using the [Protocol & Streaming](./protocol-and-streaming.md) helpers.

## Background & queues

Agents can also run fully asynchronously:

- `@purista/ai` ships reference services (`AIOrchestratorService`, `AIWorkerService`) that ingest manifests, enqueue runs, and execute them in isolated workers.
- Queue bridges (Redis, NATS, AMQP, …) treat agents like any other workload—define a queue worker that calls `invokeAgent` internally, then rely on the queue bridge for delayed or batched execution.
- Concurrency pools apply across sync and async invocations, so even background workers respect the same `maxWorkers` guardrails.

Pick the approach that matches your deployment. Local development usually starts agents inside the same process; production often combines HTTP exposure for real-time calls plus queue workers for heavy background chains.
