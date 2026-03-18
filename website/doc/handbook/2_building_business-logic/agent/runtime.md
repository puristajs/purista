---
title: Runtime
description: Starting agent instances, wiring providers, and managing concurrency.
order: 203704
---

# Runtime

An agent definition (`AgentBuilder`) is inert. To run it, you must create an **instance** and provide it with concrete runtime dependencies (Model Providers, Databases, etc.).

## 1. Bootstrapping the Instance

`getInstance(eventBridge, options)` is where you inject your production-ready tools.

```ts
import { DefaultQueueBridge } from '@purista/core'

const supportAgentInstance = await supportAgent.getInstance(eventBridge, {
  models: {
    'openai:gpt-4o-mini': new AiSdkProvider({ model: openai('gpt-4o-mini') })
  },
  conversationStore: new RedisConversationStore(),
  knowledgeAdapters: {
    supportFaq: new VectorStoreAdapter()
  },
  queueBridge: new DefaultQueueBridge(),
  poolConfig: {
    poolId: 'support',
    maxConcurrencyPerInstance: 5
  }
})

await supportAgentInstance.start()
```

## 2. Managing Concurrency (Pools)

LLM calls are expensive and can be slow. To protect your application and manage rate limits, PURISTA uses **Worker Pools**.

- **`poolId`**: Groups multiple agent instances into a shared concurrency limit.
- **`maxConcurrencyPerInstance`**: Limits how many agent runs can happen in parallel within a single process.

### Why use Pools?
- **Avoid Resource Exhaustion**: Prevents one agent from hogging all event-loop resources or memory.
- **Rate Limit Protection**: Keeps your outgoing LLM requests within your provider's quota.
- **Fairness**: Ensures that high-priority agents still have "slots" to run even during peak traffic.

Queued durable agents also need a `queueBridge`. The queue bridge decides which worker owns the job, and the pool decides how many jobs a process may execute at once. Inline agents do not need a queue bridge.

## 3. Deployment Patterns

### Pattern A: In-Process (Monolith/Service)
Run the agent in the same process as your API or Service. Good for low-to-medium volume or real-time streaming needs.

### Pattern B: Isolated Workers (Microservice)
Deploy a dedicated process that only runs agents. This allows you to scale AI workloads independently from your web traffic.

### Pattern C: Queued Durable Workers
Expose the agent over HTTP or SSE, but execute heavy work through queue workers. This is the preferred pattern for architecture synthesis, simulation, planning, and validation because it supports attach-and-stream frontends and recovery after restarts.

## 4. Health & Monitoring

Every agent instance provides a read-only status snapshot:

```ts
const status = supportAgentInstance.getStatus()
/*
{
  poolId: 'support',
  activeWorkers: 2,
  waitingWorkers: 1,
  maxConcurrencyPerInstance: 5
}
*/
```

This data is automatically included in PURISTA's health checks and telemetry frames, allowing you to alert on pool congestion.
