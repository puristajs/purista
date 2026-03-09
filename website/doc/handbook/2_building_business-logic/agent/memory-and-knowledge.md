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

PURISTA automatically scopes queries by `tenantId`, `principalId`, and `sessionId` to ensure data isolation.

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

---

### Need something custom?
If you need to build your own store or adapter, see the **[Custom AI Stores & Adapters](../advanced/ai-custom-stores.md)** section in the advanced handbook.
