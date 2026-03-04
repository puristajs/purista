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
import { HandledError } from '@purista/core'

new AgentBuilder({ agentName: 'supportAgent', agentVersion: '1' })
  .defineModel('openai:gpt-4o-mini')
  .persistHistory('user', { maxFrames: 40 })
  .setHandler(async (context, payload) => {
    await context.conversation.addUser(payload.prompt)
    const prompt = await context.conversation.buildPromptInput()

    try {
      const result = await context.models['openai:gpt-4o-mini'].generate({ prompt })
      await context.conversation.addAssistant(result.output)
      return { message: result.output }
    } catch (error) {
      // Roll back staged user input so retries do not duplicate turns.
      await context.conversation.revertLast({ role: 'user' })
      throw HandledError.fromError(error)
    }
  })
```

- **Default implementation:** `AgentInstance` falls back to an in-memory session store, perfect for local development. Provide a custom store via `await supportAgent.getInstance(eventBridge, { sessionStore: new RedisSessionStore(...) })` when you need persistence.
- **Conversation-first API:** prefer `context.conversation.*` in handlers. It uses a standard message shape (`role`, `content`, `createdAt`, metadata) and hides raw session plumbing.
- **Presets:** use `persistHistory('user')` for full conversation focus, or `persistHistory('agent')` for compact summary-oriented memory. You can still override `maxFrames`, `strategy`, or `storeName`.
- **Auto summary:** in `strategy: 'summary'`, older messages are compressed automatically and prepended by `context.conversation.buildPromptInput()`. Developers do not need to manually maintain summaries in normal use cases.
- **Retry-safe staging:** if model execution fails after adding the user prompt, call `context.conversation.revertLast({ role: 'user' })` before rethrowing to avoid duplicate user turns on retries.

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

`context.conversation` uses the same scoped identity automatically.

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

Session stores often grow quickly. The framework handles most of this through `context.conversation`, but you can still use lower-level helpers when needed:

```ts
import {
  appendMessage,
  summarizeHistory,
  type ConversationHistory,
} from '@purista/ai/memory/historyHelpers'

const state = await context.conversation.get()
const conversation = (state.messages ?? []) as ConversationHistory
const transcript = summarizeHistory(conversation)

const { output } = await context.models['openai:gpt-4o-mini'].generate({
  prompt: `${transcript}\n\nUser: ${payload.prompt}`,
})

const updatedHistory = appendMessage(conversation, {
  role: 'assistant',
  content: output,
  timestamp: Date.now(),
})

await context.conversation.setSummary(summarizeHistory(updatedHistory.slice(-10)))
```

The in-memory helpers under `@purista/ai/memory` remain available for custom strategies, but most applications should start with `persistHistory('user' | 'agent')` + `context.conversation`.
