---
title: Web & SDK
description: Connecting your agent to a React/Next.js frontend.
order: 203706
---

# Web & SDK

PURISTA agents can speak the Vercel AI SDK wire format while still using PURISTA's transport, queue, and run-state model under the hood.

## 1. Expose The Agent

```ts title="src/agents/supportAgent/v1/supportAgent.ts"
export const supportAgent = new AgentBuilder({ ... })
  .exposeAsHttpEndpoint('POST', 'agents/support')
  .setSseProtocol('ai-sdk-ui-message')
  .build()
```

`ai-sdk-ui-message` is the best default for frontend chat UIs because it maps PURISTA frames into the `useChat` stream protocol.

Queued durable agents still use the same endpoint, but the transport attaches to the live run instead of assuming the work finishes in the request itself.

## 2. Frontend Integration

```tsx title="frontend/ChatComponent.tsx"
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

      {messages.map(m => (
        <div key={m.id}>
          <b>{m.role === 'user' ? 'User: ' : 'AI: '}</b>
          {m.content}
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

The execution panel should stay separate from the chat transcript. Keep:

- progress tasks and checkpoints in a run panel
- final human-facing answers in chat
- the composer locked while a durable run is active

## 3. Supported SSE Protocols

- `purista`: native PURISTA protocol
- `ai-sdk-ui-message`: Vercel AI SDK chat protocol
- `ai-sdk-responses`: OpenAI Responses-style protocol
- `ai-sdk-data`: data-only stream alias
- `ai-sdk-json-render`: JSON render helper
- `agent2agent`: Agent-to-Agent reference protocol
- `mcp`: MCP reference tool protocol

## 4. Why Use This Instead Of A Custom Controller?

1. PURISTA maps rich agent frames into the client protocol for you.
2. The exposed endpoint is included in OpenAPI generation.
3. Tracing, logs, queue ownership, and run state stay connected end to end.
4. The composer can be locked using durable run state instead of local UI-only flags.

## 5. Practical Rule

If the agent is short and interactive, keep it inline. If the agent should survive restarts, expose progress, or resume from checkpoints, make it queued and render `data-run-state` in the UI.
