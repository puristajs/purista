---
title: Builder
description: Fluent API to define agent workloads, execution mode, and exposure.
order: 203702
---

# Builder

`AgentBuilder` defines what an agent can do and how it runs. Keep the definition small and push runtime concerns into injected providers, stores, and queue bridges.

## 1. Minimal Setup

```ts
export const supportAgent = new AgentBuilder({
  agentName: 'supportAgent',
  agentVersion: '1',
  description: 'Answers support questions',
})
  .addPayloadSchema(z.object({ prompt: z.string() }))
  .defineModel('openai:gpt-4o-mini')
```

## 2. Execution Mode

Choose the execution model explicitly:

- `inline`: executes immediately in the current request/turn
- `queued`: converts the request into a queue-backed durable run

```ts
.setExecutionMode('queued')
.setExecutionPolicy({
  httpBehavior: 'attach-and-stream',
  recovery: 'resume-from-checkpoints',
  scopeFromPayload: ['sessionId'],
  maxAttempts: 3,
  leaseTtlMs: 60_000,
  maxLeaseExtensions: 20,
})
```

Queued durable agents should use:

- a `queueBridge` at runtime
- `context.runState` for plans, tasks, checkpoints, and locks
- attach-and-stream HTTP behavior so the caller can keep observing progress

If you omit `maxLeaseExtensions`, PURISTA derives it from `maxDurationMs / leaseTtlMs` with a small safety margin so long-running queued agents do not silently expire after the core queue default.

## 3. Model Capabilities

```ts
.defineModel('openai:gpt-4o-mini', { capabilities: ['text', 'stream', 'json', 'embedding', 'rerank'] })
```

Supported capabilities:

- `text` / `stream`: conversational text and deltas
- `json`: structured output
- `embedding`: vector generation
- `rerank`: scoring and sorting candidate results

## 4. Tool Access

Use `.canInvoke(...)` to allow an agent to call a PURISTA command as a tool.

```ts
.canInvoke('ticketing', '1', 'createTicket')
```

Use `.canInvokeAgent(...)` when an external tool loop should be able to delegate into another PURISTA agent through the external runtime bindings.

```ts
.canInvokeAgent('triageAgent', '1')
```

These declarations are the allowlist for both:

- native `context.tools` / `context.agents` usage
- external runtime helpers such as `context.expose.tools(...)`

You can inspect the exported external runtime metadata from the built definition:

```ts
const metadata = supportAgent.getExternalRuntimeMetadata()
```

## 5. Event-Driven Logic

```ts
.canEmit('ticket.classified', z.object({ urgency: z.enum(['high', 'low']) }))
```

## 6. Conversation Memory

Use `persistConversation` for LLM-visible chat history, not operational state.

```ts
.persistConversation('user')
.persistConversation('agent', { maxFrames: 20 })
```

## 7. HTTP Exposure

```ts
.exposeAsHttpEndpoint('POST', 'agents/support')
.setSseProtocol('ai-sdk-ui-message')
```

For queued durable agents, `ai-sdk-ui-message` maps `run-state` to `data-run-state`, so the frontend can render live progress and lock input while the run is active.

Unary mode is still available when you want a final JSON response:

```ts
.exposeAsHttpEndpoint('POST', 'agents/support')
.setStreamingMode('aggregate')
```

## 8. Builder Method Map

| Area | Methods |
| :--- | :--- |
| Schema | `addPayloadSchema`, `addParameterSchema`, `addOutputSchema`, `addContextSchema` |
| Execution | `setExecutionMode`, `setExecutionPolicy` |
| Capabilities | `defineModel`, `canInvoke`, `canEmit`, `canInvokeAgent` |
| Memory / Retrieval | `persistConversation` |
| Transport | `exposeAsHttpEndpoint`, `setSseProtocol`, `setStreamingMode` |
| Behavior | `setRetryPolicy`, `setSuccessEventName`, `setRuntime` |

## Why This Pattern?

The builder keeps definition separate from runtime wiring. That makes the same agent easy to run inline in tests and queued in production without changing business logic.

It also keeps external SDK integration honest: PURISTA remains the execution and observability layer, while the external runtime stays just a reasoning loop.
