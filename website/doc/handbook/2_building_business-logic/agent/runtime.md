---
title: Runtime
description: Create running agent instances by binding models, skills, stores, queues, and sandbox runtime at getInstance(...).
order: 203704
---

# Runtime

`AgentBuilder` definitions are inert. They become real, running workloads only when you call `getInstance(eventBridge, options)`. This is the instance-creation phase of the PURISTA lifecycle, where the abstract definitions from the builder meet concrete, environment-specific dependencies.

## What Belongs In `getInstance(...)`

Provide all concrete runtime dependencies here:

- **Model Providers**: Bind model aliases to actual provider instances (e.g., `AiSdkProvider`).
- **Queue Bridge**: Required for agents in `'queued'` execution mode.
- **Stores**: Provide implementations for `conversationStore`, `stateStore`, etc.
- **Resources**: Provide implementations for any custom resources declared with `defineResource(...)`.
- **Skills**: Provide the actual skill content, either inline or as a `SkillResource`.
- **Runtime Config**: Pass environment-specific values for the schema defined by `setConfigSchema(...)`.
- **Pool Configuration**: Configure concurrency and resource pools.
- **Sandbox Execution**: Provide a sandbox runtime if the agent needs an isolated workspace.

## The Common Example

```ts
import { DefaultEventBridge, DefaultQueueBridge } from '@purista/core';
import { AiSdkProvider, createLayeredFileSkillResource } from '@purista/ai';
import { RedisStateStore } from '@purista/redis-state-store';

const eventBridge = new DefaultEventBridge();
const queueBridge = new DefaultQueueBridge();
const stateStore = new RedisStateStore(); // For durable runs

const supportSkills = createLayeredFileSkillResource({
  overlayRoots: [new URL('./skills', import.meta.url).pathname],
});

const supportAgentInstance = await supportAgent.getInstance(eventBridge, {
  queueBridge,
  stateStore,
  models: {
    'openai:primary': new AiSdkProvider({
      model: openai('gpt-4o-mini'),
    }),
  },
  resources: {
    supportPolicy: {
      developerInstruction: 'Answer concisely and always include next steps.',
    },
  },
  skills: supportSkills,
  config: {
    locale: 'en',
  },
  poolConfig: {
    poolId: 'support',
    maxConcurrencyPerInstance: 4,
  },
});

await supportAgentInstance.start();
```

## Runtime Dependencies in Detail

### Models

The builder declares aliases; `getInstance(...)` binds them to real providers. This separation keeps your handler code provider-agnostic.

```ts
.getInstance(eventBridge, {
  models: {
    'openai:primary': new AiSdkProvider({ model: openai('gpt-4o') }),
  },
})
```
`getInstance` validates that a provider is supplied for every alias declared in the builder and that it supports the required capabilities (e.g., `json`, `stream`).

### Skills

Provide skill implementations for the names declared with `.useSkills([...])`.

- **Inline Skills**: Good for tests or small, self-contained agents.
  ```ts
  skills: {
    'spec-elicitation': { content: '...' },
  }
  ```
- **File-Based Catalogs**: Use `createLayeredFileSkillResource` for reusable, application-wide skill catalogs.
  ```ts
  skills: createLayeredFileSkillResource({
    canonicalRoots: [sharedSkillsPath],
    overlayRoots: [appSkillsPath],
  })
  ```

### Stores and Queue Bridge

- **`queueBridge`**: A queue bridge instance is **required** if the agent's execution mode is `'queued'`.
- **`stateStore`**: A persistent state store (like `@purista/redis-state-store`) is highly recommended for durable agents to store run state.
- **`conversationStore`**: Manages chat history. If not provided, it **defaults to an in-memory store**, which is not suitable for production use with durable or multi-instance agents.

### Pools

Use `poolConfig` to constrain concurrency for expensive operations like model calls. This is useful for managing costs and ensuring fairness across workloads.

```ts
poolConfig: {
  poolId: 'support-agents',
  maxConcurrencyPerInstance: 4,
}
```

### Runtime Config

Provide environment-specific values for the schema you defined with `setConfigSchema(...)`.

```ts
.getInstance(eventBridge, {
  config: {
    locale: process.env.AGENT_LOCALE || 'en',
  },
})
```
The handler can access this resolved, validated config via `context.runtime.service.config`.

### The `AgentInstance` Object

The `getInstance(...)` method returns an `AgentInstance` object, which represents the running agent. You are responsible for managing its lifecycle:

- `await agentInstance.start()`: Starts the underlying PURISTA service and its subscriptions.
- `await agentInstance.stop()`: Stops the service and cleans up resources.
- `agentInstance.getStatus()`: Returns runtime status, including pool statistics.

## Propagation and Tracing

The PURISTA AI runtime automatically ensures that request metadata is preserved across all operations:
- `tenantId` and `principalId` flow through queued runs, tool calls, and child-agent invocations.
- `traceId` is maintained, keeping distributed traces connected.

The runtime also adds explicit orchestration spans to your traces, such as `ai.tool_call:<service>/<command>` and `ai.agent_invoke:<agent>/<version>`, providing deep visibility into the agent's execution.

## Instance Creation Checklist

When `getInstance(...)` feels unclear, run through this checklist:

1.  Which **model aliases** need to be bound to providers?
2.  Is the agent `inline` or `queued`? If queued, is a **`queueBridge`** provided?
3.  Does it need a persistent **`stateStore`** or **`conversationStore`**?
4.  Does it use declared **skills**, and where do they come from (inline or file)?
5.  Does it need **runtime config** values?
6.  Are there any custom **resources** to provide?
7.  Does it need a **sandbox** workspace for shell execution or file system access?

## Common Mistakes
- **Forgetting the `queueBridge`**: Queued agents will fail to start without it.
- **Using Default In-Memory Stores in Production**: Forgetting to provide a persistent `conversationStore` or `stateStore` can lead to state loss.
- **Provider/Capability Mismatch**: Not providing a model provider for a declared alias, or providing one that lacks a required capability.
- **Forgetting to Provide Resources**: If you use `defineResource(...)`, you must provide an implementation here.

## Related Guides
- [Quick Start](./getting-started.md)
- [Agent Builder](./agent-builder.md)
- [Handler Context](./handler-context.md)
- [Skills](./skills.md)
- [Sandbox Runtime](../../3_eco_system/sandbox.md)
