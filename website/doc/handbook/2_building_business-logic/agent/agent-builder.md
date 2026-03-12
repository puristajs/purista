---
title: Builder
description: Fluent API to define agent workloads, tools, and behavior.
order: 203702
---

# Builder

The `AgentBuilder` is a fluent API similar to the `ServiceBuilder`. It defines **how** an agent works, **what** it can access, and **how** it is exposed.

## 1. Minimal Setup

Start by defining the agent's identity and input/output schema.

```ts
export const supportAgent = new AgentBuilder({
  agentName: 'supportAgent',
  agentVersion: '1',
  description: 'Answers help-desk questions',
})
  .addPayloadSchema(z.object({ prompt: z.string() }))
  .defineModel('openai:gpt-4o-mini')
```

## 2. Model Capabilities

When you define a model, you can specify its capabilities. This allows for type-safe access in the handler and validation at runtime.

```ts
.defineModel('openai:gpt-4o-mini', { capabilities: ['text', 'stream', 'json', 'embedding', 'rerank'] })
```

Supported capabilities:
- `text` / `stream`: Normal conversational text and incremental deltas.
- `json`: Structured output generation.
- `embedding`: Vector generation for RAG/search.
- `rerank`: Scoring and re-ordering search results.

## 3. Tool Access (canInvoke)

An agent is more powerful when it can "act." Use `.canInvoke(...)` to allow an agent to call any PURISTA command as a tool.

```ts
.canInvoke('ticketing', '1', 'createTicket')
```

This ensures the agent is granted the correct permissions and provides typed access via `context.tools.invoke`.

## 4. Event-Driven Logic (canEmit)

Agents can trigger downstream workflows by emitting domain events.

```ts
.canEmit('ticket.classified', z.object({ urgency: z.enum(['high', 'low']) }))
```

In the handler, you call `context.emit('ticket.classified', { urgency: 'high' })`.

## 5. Conversation Persistence

Agents can maintain history automatically using `persistConversation`. This is the easiest way to give your agent memory.

```ts
// Using presets:
.persistConversation('user')  // Detailed transcript memory (40 frames)
.persistConversation('agent') // Compressed summary memory (20 frames)

// Custom config:
.persistConversation({
  maxFrames: 50,
  strategy: 'full',
  storeName: 'support_history'
})
```

## 6. HTTP Exposure

You can expose your agent as either SSE (`stream`) or unary JSON (`aggregate`) with a single endpoint path.

```ts
.exposeAsHttpEndpoint('POST', 'agents/support')
.setStreamingMode('stream') // default: SSE
.setSseProtocol('ai-sdk-ui-message') // Optimize for Vercel AI SDK
```

Unary aggregate mode:

```ts
.exposeAsHttpEndpoint('POST', 'agents/support')
.setStreamingMode('aggregate') // returns final envelope json
```

## 7. Dynamic Call Options (Advanced)

If you need to change model settings per step (e.g., increase temperature as the conversation progresses), use hooks.

```ts
.setCallOptionsSchema(z.object({ aiSdk: z.record(z.any()) }))
.prepareStep(({ step }) => ({
  aiSdk: {
    generate: { temperature: step > 3 ? 0.7 : 0.2 }
  }
}))
```

## 8. Builder Method Map

| Area | Methods |
| :--- | :--- |
| **Schema** | `addPayloadSchema`, `addParameterSchema`, `addOutputSchema` |
| **Capabilities** | `defineModel`, `canInvoke`, `canEmit` |
| **Memory/RAG** | `persistConversation`, `useKnowledgeAdapter` |
| **Behavior** | `setRetryPolicy`, `setSuccessEventName` |
| **Transport** | `exposeAsHttpEndpoint`, `setSseProtocol`, `setStreamingMode` |

---

### Why this pattern?
The builder keeps your agent's **definition** separate from its **runtime instance**. This allows you to test the logic with mock models and deploy it in different environments (dev/prod) with different provider configurations without changing the business logic.
