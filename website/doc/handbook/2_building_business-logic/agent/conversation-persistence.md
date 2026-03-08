---
title: Conversation Persistence
description: Configure conversation memory, summary behavior, and retry-safe history handling for agents.
order: 203704
---

# Conversation Persistence

`persistConversation` defines how an agent stores, trims, and reuses conversation context.

## How pieces fit together

- **Builder (`persistConversation`)** defines retention behavior (`user` vs `agent`) and limits (`maxFrames`).
- **Runtime (`getInstance(..., { conversationStore })`)** provides the persistence backend (in-memory by default; Redis/DB in production).
- **Handler (`context.conversation`)** is the main API used in business logic.

## Preset quick reference

| Preset | Strategy | Default maxFrames | Typical use case |
| --- | --- | --- | --- |
| `persistConversation('user')` | `full` | `40` | interactive chat where recent turns matter most |
| `persistConversation('agent')` | `summary` | `20` | long-running/background workflows where token efficiency matters |

You can override defaults: `persistConversation('user', { maxFrames: 80, strategy: 'summary' })`.

## Options reference

| Option | What it controls | Why/when to change |
| --- | --- | --- |
| preset (`'user' \| 'agent'`) | default strategy + frame budget | choose richer context (`user`) vs stronger compression (`agent`) |
| `maxFrames` | recent frames kept verbatim | increase for context-heavy flows; decrease for lower token usage |
| `strategy` (`full` \| `summary`) | overflow behavior | `full` drops oldest; `summary` compacts overflow |
| `storeName` | logical persistence namespace | advanced multi-store setups or migration control |

## Minimal handler pattern (retry-safe)

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
      // Prevent duplicate user turns when handler retries.
      await context.conversation.revertLast({ role: 'user' })
      throw HandledError.fromError(error)
    }
  })
```

## Auto-summary behavior

When `strategy: 'summary'` is active:

1. new messages are appended
2. if message count exceeds `maxFrames`, oldest overflow frames are removed
3. removed frames are compacted into summary text and merged into previous summary
4. `buildPromptInput()` prepends summary + recent frames

This is deterministic transcript compression, not semantic LLM summarization.

## Conversation API overview

| Method | Purpose |
| --- | --- |
| `addUser(content)` / `addAssistant(content)` | append standard turns |
| `addTool(...)` / `addToolResult(...)` | record tool lifecycle context |
| `getMessages()` / `getSummary()` | inspect current state |
| `buildPromptInput()` | build model-ready transcript (`summary + recent`) |
| `revertLast({ role })` | rollback staged frames on failure/retry |

## Session identity and tenancy

Scoped session identity includes agent/version plus tenant/principal metadata from Purista messages.  
`context.conversation` and `context.session` share the same scoped identity resolution automatically.

## Low-level escape hatch

For non-conversation custom state, use low-level `context.session.load/save/delete`.
