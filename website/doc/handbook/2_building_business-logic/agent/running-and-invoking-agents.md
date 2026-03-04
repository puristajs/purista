---
title: Run & Invoke Agents
description: Start agent instances, wire dependencies, and call them from commands, HTTP bridges, or queue workers.
order: 203702
---

# Run & Invoke Agents

An agent build result is inert until runtime dependencies are bound via `getInstance(...)`.

This page focuses on three runtime concerns:

1. bootstrap and start/stop
2. invocation patterns (context + standalone)
3. async queue execution and worker concurrency

## Bootstrap the instance

```ts title="src/index.ts"
import { DefaultEventBridge } from '@purista/core'
import { AiSdkProvider } from '@purista/ai'
import { createOpenAI } from '@ai-sdk/openai'
import { supportAgent } from './agents/supportAgent/v1/supportAgent.js'

const eventBridge = new DefaultEventBridge()
await eventBridge.start()

const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY! })
const provider = new AiSdkProvider({
  model: openai('gpt-5.2-mini'),
  systemPrompt: 'You are a friendly support engineer.',
  defaults: { temperature: 0.2 },
})

const supportAgentInstance = await supportAgent.getInstance(eventBridge, {
  models: {
    'openai:gpt-5.2-mini': provider,
  },
  poolConfig: {
    poolId: 'support',
    maxWorkers: 4,
  },
})

await supportAgentInstance.start()
```

- `eventBridge` is mandatory; every agent registers an internal service (`<agentName>.run`).
- `models` must satisfy aliases declared via `.defineModel(...)` in the agent builder.
- Session stores, knowledge adapters, and pool managers default to in-memory implementations.

## Runtime options reference

`getInstance(eventBridge, options)` supports:

| Option | Purpose | Typical choice | Notes |
| --- | --- | --- | --- |
| `models` | bind model aliases to provider instances | required in real workloads | fail-fast when a declared alias is missing |
| `poolConfig.poolId` | select execution pool namespace | explicit per workload class | defaults to `agent:<agentName>` |
| `poolConfig.maxWorkers` | cap parallel runs in-process | `1` locally, tuned in prod | runtime/deploy setting, not hardcoded |
| `sessionStore` | persistence backend for conversation/session state | in-memory locally, Redis/DB in prod | `context.conversation` uses this backend |
| `knowledgeAdapters` | RAG/document adapters by alias | in-memory or vector-store-backed | must match aliases used by builder |
| `logger`, `tracer`, `spanProcessor` | observability integration | inherit app defaults | keeps agent telemetry aligned with services |
| `config`, `resources` | custom app-specific dependencies | optional | use sparingly to keep handlers focused |

## Runtime pool config (important)

Builder config only assigns a pool id.  
Actual parallelism is runtime config:

```ts
const supportAgentInstance = await supportAgent.getInstance(eventBridge, {
  models: { 'openai:gpt-5.2-mini': provider },
  poolConfig: {
    poolId: 'support', // optional; defaults to agent:<agentName>
    maxWorkers: 4,     // default is 1
  },
})
```

`maxWorkers` controls how many agent runs can execute in parallel for that agent instance.

- default is `1` (safe baseline)
- keep this low in local/dev
- tune this in deployment config for production
- use separate pools when different agent workloads need isolation

Operational rule of thumb:

- queue controls how much work is waiting
- `maxWorkers` controls how much work runs now
- provider/API rate limits still apply downstream

## Invoke an agent programmatically

### 1. Integrated Service Pattern (Recommended)

When working inside Commands, Subscriptions, or Streams, use the `.canInvokeAgent` builder method. This integrates the agent into the functional context with full type safety.

```ts
export const notifyCommand = supportServiceBuilder
  .getCommandBuilder('notifySupportAgent', 'Runs the support agent from a command')
  .canInvokeAgent('supportAgent', '1', optionalParameterSchema) // Register dependency
  .addPayloadSchema(supportInputSchema)
  .setCommandFunction(async function (context, payload) {
    // 1. Get the final result
    const result = await context.invokeAgent.supportAgent['1']
      .call({ message: payload.prompt })
      .final()

    // 2. Or stream frames manually
    const invocation = context.invokeAgent.supportAgent['1']
      .call({ message: payload.prompt })

    for await (const frame of invocation) {
      context.logger.info({ frame }, 'Agent frame received')
    }

    return result
  })
```

The `.call()` method returns an `AgentInvocation` object which is an `AsyncIterable` yielding protocol frames and has a `.final()` helper returning a `Promise` for the full result.

### 2. Standalone Invocation

The helper `invokeAgent` (from `@purista/ai`) mirrors `invokeCommand` but automatically validates the agent protocol envelopes. This is ideal for scripts, manual triggers, or controllers where you don't have a Purista context.

```ts
import { invokeAgent } from '@purista/ai'

const result = await invokeAgent({
  eventBridge,
  agentName: 'supportAgent',
  agentVersion: '1',
  payload: { prompt: 'How do I reset my password?' },
  sessionId: 'chat-123',
  parameter: { locale: 'en' },
})

for (const envelope of result) {
  console.log(envelope.frame.kind, envelope.frame)
}
```

Use the optional `stream` argument to attach a responder that processes frames as the agent emits them (ideal for WebSockets or web streams).
If `sessionId` is provided and payload is an object, `invokeAgent` injects it automatically when missing so implicit `context.conversation` / `context.session` resolution works without manual payload wiring.

### invokeAgent options reference

| Option | Purpose | Use case |
| --- | --- | --- |
| `agentName`, `agentVersion` | target agent | required for every invocation |
| `payload` | main input | same shape as agent payload schema |
| `parameter` | optional side-channel input | locale, channel, feature flags |
| `sessionId` | stable conversation identity | continue existing conversation across invocations |
| `principalId`, `tenantId` | identity/multi-tenant isolation | per-user or per-tenant memory partitioning |
| `correlationId` | trace correlation | linking runs to upstream workflows |
| `timeoutMs` | invoke timeout | fail faster for synchronous APIs |
| `stream` | receive frames incrementally | websockets/custom transports |

## HTTP exposure

`.exposeAsHttpEndpoint('POST', 'agents/supportAgent')` automatically adds an endpoint to your generated OpenAPI spec. The endpoint behaves like any streaming command:

```ts
export const supportAgent = new AgentBuilder({ ... })
  .exposeAsHttpEndpoint('POST', 'agents/supportAgent')
  .setHandler(...)
  .build()
```

SSE is the default streaming mode for exposed agent endpoints. Call `.setStreamingMode(...)` only when you need a non-default mode.

If your API gateway already maps `POST /api/v1/agents/supportAgent` to the bridge, clients can `fetch` it directly. For custom controllers, pipe the envelopes to SSE/chunked responses using the [Protocol & Streaming](./protocol-and-streaming.md) helpers.

## Background & queues

For production workloads, queue-driven execution is usually the default pattern.

### Queue-driven pattern

1. expose a command/subscription/event path that enqueues work
2. queue worker invokes the agent
3. pool settings protect concurrency and upstream APIs

```ts
// inside a queue worker / background handler
const envelopes = await invokeAgent({
  eventBridge,
  agentName: 'supportAgent',
  agentVersion: '1',
  payload: { prompt: 'Summarize ticket #42' },
})
```

If you already use Purista queues, keep that setup.  
The AI package does not require a dedicated queue implementation.

### Queue + pool sizing (must configure both)

Example target profile:

- queue worker concurrency: `10`
- agent pool `maxWorkers`: `4`

Result: up to 10 jobs may be leased from queue, but only 4 agent runs execute at once in this process.  
This protects provider APIs from bursty parallelism while still keeping the queue busy.

### Why this is the default operational mode

- caller does not block on long LLM execution
- retries/delivery semantics are handled by queue infrastructure
- worker parallelism and `poolConfig.maxWorkers` together control throughput
- easier cost/rate-limit control than unbounded sync invocations

### What runs where

- **Queue bridge** decides delivery/lease/retry mechanics
- **Agent pool** decides in-process parallel execution cap (`maxWorkers`)
- **Provider/LLM** executes model calls

Both queue worker concurrency and agent pool size matter. Set both intentionally.

### Built-in runtime helpers

- `@purista/ai` ships reference services (`AIOrchestratorService`, `AIWorkerService`) that ingest manifests, enqueue runs, and execute them in isolated workers.
- Queue bridges (Redis, NATS, AMQP, …) treat agents like any other workload—define a queue worker that calls `invokeAgent` internally, then rely on the queue bridge for delayed or batched execution.
- Concurrency pools apply across sync and async invocations. Configure `poolConfig.maxWorkers` at runtime/deploy-time so each environment controls throughput independently.

### Failure behavior in queue mode

- transient failures are retried by your queue setup and/or agent retry policy
- handled errors emit protocol error frames and can still be inspected in worker logs
- telemetry frames include duration/token usage so operations can alert on degraded runs

Pick the approach that matches your deployment. Local development usually starts agents inside the same process; production often combines HTTP exposure for real-time calls plus queue workers for heavy background chains.
