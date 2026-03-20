---
title: Memory & Retrieval
description: Managing conversation history, durable run state, and resource-backed retrieval.
order: 203707
---

# Memory & Retrieval

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

## 2. External Retrieval (RAG)

PURISTA does not ship a framework-owned knowledge base abstraction.

Use normal resources for retrieval infrastructure such as vector stores, search indexes, document registries, or skill registries.

```ts
setHandler(async (context, payload) => {
  const docs = await context.resources.supportFaq.search({
    query: payload.prompt,
    limit: 3,
    tenantId: context.service.tenantId,
    principalId: context.service.principalId,
  })

  const prompt = [
    payload.prompt,
    '',
    'Relevant documents:',
    ...docs.map(doc => `- ${doc.title}: ${doc.content}`),
  ].join('\n')

  return await context.models.primary.generate({ prompt })
})
```

If retrieval must be model-invocable, expose it through an allowlisted command and hand that command to the external tool loop.

## 3. Configuration at Runtime

Conversation memory is in-memory by default. For production, inject a persistent conversation store during bootstrap. Retrieval resources follow the same runtime resource pattern as any other dependency.

```ts
const instance = await supportAgent.getInstance(eventBridge, {
  conversationStore: new RedisConversationStore(),
  resources: {
    supportFaq: new PineconeFaqResource(),
  },
})
```

Conversation stores follow the same pattern: the runtime keeps the logical `conversationId` stable and passes tenant/user/agent metadata separately to the store implementation so custom backends can build their own compound keys without guessing how PURISTA scoped the id.

## 4. Durable Execution State

Conversation memory is not the right place for operational workflow state.

Use:

- `context.conversation` for LLM-visible history
- `context.runState` for durable execution progress, plans, task lists, checkpoints, and resumable status
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

await run.checkpoint('input-snapshot', { projectId: payload.projectId }, { completed: true })
await run.update({ phase: 'running', status: 'running' })

await run.step('simulate', async () => {
  // do the long-running work
  return 'Simulation completed'
}, { checkpoint: 'simulation-result' })

await run.finishSuccess('Simulation completed successfully.')
```

Every update persists first and then emits a `run-state` artifact into the stream. In `ai-sdk-ui-message` mode that appears as `data-run-state` for the frontend. That is the right place for progress, checkpoints, and recovery metadata; conversation memory should stay focused on the chat transcript.

---

### Need something custom?
If you need custom persistence or retrieval infrastructure, see the **[Custom AI Stores & Retrieval Resources](../advanced/ai-custom-stores.md)** section in the advanced handbook.
