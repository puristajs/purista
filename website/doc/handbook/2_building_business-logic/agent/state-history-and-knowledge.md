---
title: State, History & Knowledge
description: Persist conversations, plug in session/knowledge adapters, and share context between agents.
order: 203704
---

# State, History & Knowledge

Agents rarely operate statelessly. They need conversation history, scratchpads, and shared knowledge bases. `@purista/ai` ships pragmatic defaults plus adapter hooks so you can scale from in-memory experiments to production-grade stores.

## Conversation persistence

`persistConversation` configures how an agent stores and reuses conversation context.

### How pieces fit together

- **Builder (`persistConversation`)** defines conversation retention strategy (`user` vs `agent`) and limits (`maxFrames`).
- **Runtime (`getInstance(..., { sessionStore })`)** provides the actual storage adapter (in-memory by default, Redis/DB in production).
- **Handler (`context.conversation`)** is what you use in business logic; it reads/writes using the configured strategy and store.

### Preset quick reference

| Preset | Strategy | Default maxFrames | Typical use case |
| --- | --- | --- | --- |
| `persistConversation('user')` | `full` | `40` | interactive chat where recent turns matter most |
| `persistConversation('agent')` | `summary` | `20` | long-running/background agents where token efficiency matters |

You can always override via `persistConversation('user', { maxFrames: 80, strategy: 'summary' })`.

### persistConversation options reference

| Option | What it controls | Why/when to change |
| --- | --- | --- |
| preset (`'user' \| `'agent'`) | default strategy + frame budget | choose chat richness (`user`) vs token efficiency (`agent`) |
| `maxFrames` | number of recent frames kept verbatim | increase for context-heavy conversations, decrease for lower token usage |
| `strategy` (`full` \| `summary`) | overflow handling mode | `full` drops oldest frames; `summary` compacts overflow into summary |
| `storeName` | logical store namespace in manifest | advanced multi-store setups or migration control |

### Minimal handler pattern (retry-safe)

```ts
import { HandledError } from '@purista/core'

new AgentBuilder({ agentName: 'supportAgent', agentVersion: '1' })
  .defineModel('openai:gpt-4o-mini')
  .persistConversation('user', { maxFrames: 40 })
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

### Behavior summary

- **Default implementation:** `AgentInstance` falls back to an in-memory session store, perfect for local development. Provide a custom store via `await supportAgent.getInstance(eventBridge, { sessionStore: new RedisSessionStore(...) })` when you need persistence.
- **Conversation-first API:** prefer `context.conversation.*` in handlers. It uses a standard message shape (`role`, `content`, `createdAt`, metadata) and hides raw session plumbing.
- **Compatibility:** `persistHistory(...)` remains available as a legacy alias.
- **Auto summary:** in `strategy: 'summary'`, older messages are compressed automatically and prepended by `context.conversation.buildPromptInput()`. Developers do not need to manually maintain summaries in normal use cases.
- **Retry-safe staging:** if model execution fails after adding the user prompt, call `context.conversation.revertLast({ role: 'user' })` before rethrowing to avoid duplicate user turns on retries.

## How auto-summary works

When `strategy: 'summary'` is active:

1. new messages are appended to conversation
2. if total frames exceed `maxFrames`, oldest overflow frames are removed
3. removed frames are compacted into summary text and merged into existing summary
4. `buildPromptInput()` prepends summary + recent frames

This gives deterministic, framework-managed compression without requiring manual summary code in handlers.

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

### Knowledge adapter options reference

| Option | Purpose | Typical example |
| --- | --- | --- |
| `adapterName` | alias used in handler lookup | `supportFaq`, `productCatalog`, `roadmap` |
| `options` | adapter-specific tuning/config | `{ locale: 'en-US', topK: 5 }` |

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

The in-memory helpers under `@purista/ai/memory` remain available for custom strategies, but most applications should start with `persistConversation('user' | 'agent')` + `context.conversation`.

## Low-level escape hatch

If your workload needs custom persistence beyond conversation frames, use `context.session` directly (`load/save/delete`) and keep additional app-specific fields in `data`.
