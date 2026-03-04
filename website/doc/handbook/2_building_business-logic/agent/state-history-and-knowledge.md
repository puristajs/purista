---
title: State, History & Knowledge
description: Persist conversations, plug in session/knowledge adapters, and share context between agents.
order: 203704
---

# State, History & Knowledge

Agents rarely operate statelessly. They need conversation history, scratchpads, and shared knowledge bases. `@purista/ai` ships pragmatic defaults plus adapter hooks so you can scale from in-memory experiments to production-grade stores.

## Session store

`persistHistory` (alias: `useSessionStore`) links an agent to a session store definition in the manifest:

```ts
new AgentBuilder({ agentName: 'supportAgent', agentVersion: '1' })
  .defineModel('openai:gpt-4o-mini')
  .persistHistory({
    storeName: 'aiConversation',
    maxFrames: 40,
    retentionMs: 86_400_000,
  })
  .setHandler(async (context, payload) => {
    const previous = await context.session.load()
    const scopedSessionId = context.session.resolveSessionId()

    const prompt = [previous?.data?.lastMessage, payload.prompt].filter(Boolean).join('\n')
    const result = await context.models['openai:gpt-4o-mini'].generate({ prompt })

    await context.session.save({
      data: { lastMessage: result.output },
      updatedAt: Date.now(),
    })

    context.logger.debug({ scopedSessionId }, 'Saved session snapshot')
    return { message: result.output }
  })
```

- **Default implementation:** `AgentInstance` falls back to an in-memory session store, perfect for local development. Provide a custom store via `await supportAgent.getInstance(eventBridge, { sessionStore: new RedisSessionStore(...) })` when you need persistence.
- **Session helpers:** `context.session.load/save/delete` abstracts the underlying store. Records are plain objects (`{ sessionId, data, updatedAt }`), so you can stash summarized history, embeddings, persona settings, etc.

### Tenant + principal aware session keys

For multi-tenant applications, include `tenantId` and `principalId` in your session key.  
These values already exist on Purista messages and are propagated into the agent context.

```ts
const buildSessionKey = (context: AgentHandlerContext, payload: { sessionId?: string }) => {
  const tenant = context.message.tenantId ?? 'global'
  const principal = context.message.principalId ?? 'anonymous'
  const base = payload.sessionId ?? context.message.id
  return `${tenant}:${principal}:${base}`
}
```

Then use that key consistently with `context.session.load/save/delete`.  
`context.session.resolveSessionId()` returns the exact scoped id used by implicit helpers.

## Knowledge adapters

Knowledge adapters let you query external corpora (RAG, FAQ tables, product catalogs) and share them across agents.

```ts
new AgentBuilder({ ... })
  .defineModel('openai:gpt-4o-mini')
  .useKnowledgeAdapter({ adapterName: 'supportFaq', options: { locale: 'en-US' } })
  .setHandler(async context => {
    const docs = await context.knowledge.query('supportFaq', context.payload.prompt, 5)
    const contextBlock = docs.map(doc => `• ${doc.title}: ${doc.body}`).join('\n')

    const { output } = await context.models['openai:gpt-4o-mini'].generate({
      prompt: `${context.payload.prompt}\n\nContext:\n${contextBlock}`,
    })

    return { message: output }
  })
```

- The default adapter is in-memory; plug in Redis, PGVector, or any other backend by passing `knowledgeAdapters` to `getInstance`.
- Adapter contracts are intentionally tiny (`query(name, query, limit)`), making it easy to wrap existing vector search clients.
- A fluent alias-first DX (`.useKnowledgeAdapter('supportFaq')` with `context.knowledge.supportFaq.query(...)`) is tracked as a potential improvement in the AI spec backlog.

## Shared knowledge between agents

Multiple agents can share the same adapter instance. For example, two domain-specific agents (`support`, `billing`) might both query a `faqVectorStore`. When you need agent-specific behavior, include options in the manifest (`options: { locale: 'de-DE' }`) and branch internally.

## Conversation helpers & summaries

Session stores often grow quickly. Combine `context.session.load` with helper utilities (e.g., summarize previous turns, persist only structured data) to keep prompts tiny:

```ts
import {
  appendMessage,
  summarizeHistory,
  type ConversationHistory,
} from '@purista/ai/memory/historyHelpers'

const history = await context.session.load()
const conversation = (history?.data.conversation ?? []) as ConversationHistory
const transcript = summarizeHistory(conversation)

const { output } = await context.models['openai:gpt-4o-mini'].generate({
  prompt: `${transcript}\n\nUser: ${payload.prompt}`,
})

const updatedHistory = appendMessage(conversation, {
  role: 'assistant',
  content: output,
  timestamp: Date.now(),
})

await context.session.save({
  data: {
    conversation: updatedHistory,
    lastSummary: summarizeHistory(updatedHistory.slice(-10)),
  },
  updatedAt: Date.now(),
})
```

The in-memory helpers under `@purista/ai/memory` include ready-made utilities for rolling summaries and token budgets. Swap them out gradually as your application grows.
