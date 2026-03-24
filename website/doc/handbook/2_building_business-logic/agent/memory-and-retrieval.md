---
title: Memory & Retrieval
description: Keep conversation history, durable run state, and external retrieval as separate concerns with clear runtime boundaries.
order: 203711
---

# Memory & Retrieval

This page answers a boundary question:

> Where should agent state actually live?

In PURISTA, there are three separate concerns:

1. conversation history
2. durable execution state
3. external retrieval

If those stay separated, the rest of the AI runtime becomes much easier to reason about.

## 1. Conversation Memory

Use conversation memory for LLM-visible history.

Declare it in the builder:

```ts
export const supportAgent = new AgentBuilder({ ... })
  .persistConversation('user')
```

Use it in the handler:

```ts
await context.memory.conversation.addUser(payload.prompt)
const messages = await context.memory.conversation.getMessages()
await context.memory.conversation.addAssistant(answer)
```

Use this for:

- chat history
- prior user turns
- prior assistant answers

Do not use it for:

- task progress
- checkpoints
- retry state

## 2. Durable Run State

Use `context.memory.run` for operational workflow state.

```ts
const run = await context.memory.run.start({
  title: 'Simulation review',
  extraScope: { projectId: payload.projectId },
  lock: { key: 'simulation' },
})

await run.plan([
  { id: 'review', title: 'Review architecture inputs' },
  { id: 'simulate', title: 'Run simulation artifacts' },
  { id: 'verify', title: 'Verify simulation result' },
])

await run.checkpoint('input-snapshot', { projectId: payload.projectId }, { completed: true })
await run.update({ phase: 'running', status: 'running' })

await run.step(
  'simulate',
  async () => {
    return 'Simulation completed'
  },
  { checkpoint: 'simulation-result' },
)

await run.finishSuccess('Simulation completed successfully.')
```

Use this for:

- plans and tasks
- progress state
- checkpoints
- resumable workflow state
- UI-facing execution metadata

Do not use it for:

- chat memory
- generic retrieval documents

## 3. External Retrieval

PURISTA does not ship a framework-owned knowledgebase abstraction.

Use normal resources for retrieval systems:

```ts
const docs = await context.app.resources.supportFaq.search({
  query: payload.prompt,
  limit: 3,
  tenantId: context.input.message.tenantId,
  principalId: context.input.message.principalId,
})
```

That resource can wrap:

- a vector store
- a search engine
- a document registry
- a domain-specific index
- a skill registry

Use retrieval when the agent needs external facts, not just prior chat or workflow state.

## The Practical Rule

When you are unsure where something belongs, ask:

- “Should the model see this as part of the conversation?”
  Use `context.memory.conversation`.
- “Should the workflow resume from this after reconnect or retry?”
  Use `context.memory.run`.
- “Is this external data or search infrastructure?”
  Use `context.app.resources`.

That rule is more useful than memorizing APIs.

## Runtime Wiring

Conversation stores and retrieval systems are injected at instance creation like normal runtime dependencies.

```ts
const instance = await supportAgent.getInstance(eventBridge, {
  conversationStore: new RedisConversationStore(),
  resources: {
    supportFaq: new PineconeFaqResource(),
  },
})
```

That keeps memory and retrieval aligned with the normal PURISTA instance-creation model.

## If Retrieval Must Be Tool-Invocable

If the model should call retrieval dynamically, do not invent a special AI-only path.

Instead:

1. expose retrieval through a normal PURISTA command
2. allowlist that command
3. call it through `context.invoke.tools` or external bindings

That keeps retrieval inside the same command and telemetry model as the rest of the application.

## Common Mistakes

- Storing workflow progress in conversation memory.
- Treating retrieval as a hidden framework subsystem.
- Using `context.runtime.stores.states` directly when `context.memory.run` already expresses the workflow.
- Mixing skill catalogs and retrieval systems into one vague “knowledge” bucket.

## Related Guides

- [Context](./handler-context.md)
- [Durable Run State](./run-state.md)
- [Runtime](./runtime.md)
- [Advanced Retrieval & RAG](../advanced/ai-retrieval.md)
