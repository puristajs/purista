---
title: Memory & Knowledge
description: Managing conversation history and Retrieval-Augmented Generation (RAG).
order: 203707
---

# Memory & Knowledge

Agents need to "remember" previous turns and access "external data" to provide high-quality answers.

## 1. Conversation Memory

Use `persistConversation` to give your agent a history. It handles storing, trimming, and summarizing previous turns automatically.

```ts
export const supportAgent = new AgentBuilder({ ... })
  .persistConversation('user') // Use preset: 'user' or 'agent'
```

### Presets

| Preset | Strategy | Frame Budget | Best For |
| :--- | :--- | :--- | :--- |
| **`user`** | Full | 40 | Interactive chats where recent turns matter. |
| **`agent`** | Summary | 20 | Long-running tasks where tokens are expensive. |

### Accessing History
In your handler, `context.conversation` provides the API to manage history:

```ts
setHandler(async (context, payload) => {
  await context.conversation.addUser(payload.prompt)
  const messages = await context.conversation.getMessages()
  // ...
  await context.conversation.addAssistant(answer)
})
```

## 2. External Knowledge (RAG)

Knowledge adapters allow your agent to access external documents like FAQs, Wikis, or Vector databases.

### Defining Knowledge
```ts
export const supportAgent = new AgentBuilder({ ... })
  .useKnowledgeAdapter('supportFaq')
```

### Querying Knowledge
```ts
setHandler(async (context, payload) => {
  const docs = await context.knowledge.supportFaq.query(payload.prompt, 3)
})
```

PURISTA automatically scopes queries by `tenantId`, `principalId`, `agentName`, `agentVersion`, and `sessionId` to ensure data separation.

## 3. Configuration at Runtime

Both memory and knowledge are "in-memory" by default. For production, inject persistent stores during bootstrap.

```ts
const instance = await supportAgent.getInstance(eventBridge, {
  conversationStore: new RedisConversationStore(),
  knowledgeAdapters: {
    supportFaq: new PineconeAdapter()
  }
})
```

Conversation stores follow the same pattern: the runtime keeps the logical `conversationId` stable and passes tenant/user/agent metadata separately to the store implementation so custom backends can build their own compound keys without guessing how PURISTA scoped the id.

## 4. Durable Execution State

Conversation memory is not the right place for operational workflow state.

Use:

- `context.conversation` for LLM-visible history
- `context.runState` for durable execution progress, plans, task lists, and resumable status
- `context.states` directly only when you need lower-level custom persistence

`context.runState` is backed by the PURISTA state store, so it works across reconnects, retries, and multiple replicas.

```ts
const run = await context.runState.start({
  title: 'Simulation review',
  extraScope: { projectId: payload.projectId },
  lock: { key: 'simulation' },
})

await run.plan([
  { id: 'review', title: 'Review architecture inputs' },
  { id: 'simulate', title: 'Run simulation artifacts' },
  { id: 'verify', title: 'Verify simulation result' },
])

await run.task('simulate', async () => {
  // do the long-running work
})

await run.finishSuccess('Simulation completed successfully.')
```

Every update persists first and then emits a `run-state` artifact into the stream. In `ai-sdk-ui-message` mode that appears as `data-run-state` for the frontend.

---

### Need something custom?
If you need to build your own store or adapter, see the **[Custom AI Stores & Adapters](../advanced/ai-custom-stores.md)** section in the advanced handbook.
