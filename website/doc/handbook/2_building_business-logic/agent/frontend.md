---
title: Web & SDK
description: Connect a PURISTA agent to a frontend by exposing the agent over HTTP/SSE and rendering run-state separately from chat content.
order: 203710
---

# Web & SDK

This page answers the frontend question:

> How do I expose a PURISTA agent to a chat UI without losing durable progress?

The default answer is:

1. expose the agent over HTTP
2. use `ai-sdk-ui-message` as the SSE protocol
3. render `data-run-state` in a side panel
4. keep the chat transcript for user-visible conversation only

## Step 1: Expose The Agent

```ts
export const supportAgent = new AgentBuilder({
  agentName: 'supportAgent',
  agentVersion: '1',
  description: 'Queued durable support assistant',
})
  .exposeAsHttpEndpoint('POST', 'agents/support')
  .setSseProtocol('ai-sdk-ui-message')
  .build()
```

This is the best default for chat UIs because `ai-sdk-ui-message` maps PURISTA frames into the format expected by `useChat`.

If the agent is queued durable, the same endpoint still works. The transport attaches to the live run instead of assuming the work finishes in one request.

## Step 2: Render The Stream In The Frontend

```tsx
import { useState } from 'react'
import { useChat } from '@ai-sdk/react'
import type { AgentRunState } from '@purista/ai'

const isRunBlocking = (status?: string) =>
  Boolean(status && ['queued', 'planning', 'running', 'recovering', 'retrying', 'summarizing'].includes(status))

export const ChatComponent = () => {
  const [runState, setRunState] = useState<AgentRunState | null>(null)

  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: '/api/v1/agents/support',
    onData: part => {
      if (part.type === 'data-run-state') {
        setRunState(part.data)
      }
    },
  })

  const inputLocked = isRunBlocking(runState?.status)

  return (
    <div>
      {runState ? (
        <section className="run-panel">
          <strong>{runState.title}</strong>
          <p>{runState.summary ?? runState.finalMessage ?? runState.phase}</p>
        </section>
      ) : null}

      {messages.map(message => (
        <div key={message.id}>
          <b>{message.role === 'user' ? 'User: ' : 'AI: '}</b>
          {message.content}
        </div>
      ))}

      <form onSubmit={handleSubmit}>
        <input value={input} onChange={handleInputChange} disabled={inputLocked} />
        <button type="submit" disabled={inputLocked}>Send</button>
      </form>
    </div>
  )
}
```

## The Important UI Rule

Keep these concerns separate:

- run panel:
  progress, tasks, checkpoints, durable state
- chat transcript:
  user messages and final assistant-facing content

This is the biggest practical UI lesson for queued durable agents.

## Which Protocol Should I Use?

### Default chat UI

Use:

- `ai-sdk-ui-message`

This should be the default recommendation for most frontend chat applications.

### When to look beyond that

Use another protocol only when you have a specific reason:

- `purista` if you want the native PURISTA frame stream
- `agent2agent` for reference-message integrations
- `mcp` for MCP reference tool flows

Most frontend developers do not need to choose among all protocols. They need the default first.

## Why PURISTA Transport Is Useful

Using the built-in transport instead of a custom controller gives you:

- mapped agent frames
- OpenAPI visibility
- run-state delivery
- queue-aware streaming
- tracing and logs that still align with the backend execution path

## If You Also Use An External SDK Loop

If the handler internally uses external runtime bindings plus the AI SDK adapter, the frontend does not change. The important point is:

- the frontend still receives the same stream protocol
- `data-run-state` still reflects durable progress
- tool events and final assistant output still flow through PURISTA transport

So the SDK adapter is a handler/runtime concern, not a frontend integration rewrite.

## Decision Rules

- Standard chat UI:
  use `ai-sdk-ui-message`
- Long-running queued agent:
  render `data-run-state` and lock the composer while active
- Inline short agent:
  same transport can still work, just with less run-state usage
- Only switch protocols if you have a concrete interoperability need

## Common Mistakes

- Mixing execution progress into the chat transcript.
- Building custom frontend state when `data-run-state` already expresses the workflow.
- Treating all SSE protocols as equal choices for a normal chat UI.
- Rewriting the frontend because the handler uses an external SDK loop internally.

## Related Guides

- [Quick Start](./getting-started.md)
- [Durable Run State](./run-state.md)
- [AI SDK Adapter](./ai-sdk-adapter.md)
