---
title: Web & SDK
description: Connecting your agent to a React/Next.js frontend.
order: 203706
---

# Web & SDK

PURISTA agents are designed to play well with modern frontend frameworks. While they use a robust internal protocol, they can effortlessly "speak" the Vercel AI SDK wire format.

## 1. Exposing the Agent

In your agent builder, expose the agent as an HTTP endpoint and set the SSE protocol to match the AI SDK's requirements.

```ts title="src/agents/supportAgent/v1/supportAgent.ts"
export const supportAgent = new AgentBuilder({ ... })
  .exposeAsHttpEndpoint('POST', 'agents/support')
  .setSseProtocol('ai-sdk-ui-message') // Crucial for seamless Vercel AI SDK integration
  .setHandler(...)
  .build()
```

By setting `.setSseProtocol('ai-sdk-ui-message')`, the PURISTA bridge will automatically transform its internal frames (reasoning, tool calls, messages) into the format expected by the `useChat` hook.

## 2. Frontend Integration (React)

Using the standard `useChat` hook from the Vercel AI SDK:

```tsx title="frontend/ChatComponent.tsx"
import { useChat } from 'ai/react'

export const ChatComponent = () => {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: '/api/v1/agents/support' // Path to your exposed PURISTA agent
  })

  return (
    <div>
      {messages.map(m => (
        <div key={m.id}>
          <b>{m.role === 'user' ? 'User: ' : 'AI: '}</b>
          {m.content}
        </div>
      ))}

      <form onSubmit={handleSubmit}>
        <input value={input} onChange={handleInputChange} />
        <button type="submit">Send</button>
      </form>
    </div>
  )
}
```

## 3. Supported SSE Protocols

PURISTA supports several wire protocols out-of-the-box. Choose the one that fits your client:

- **`purista`** (Default): The full-featured native protocol. Best for PURISTA-to-PURISTA communication.
- **`ai-sdk-ui-message`**: Standard for Vercel AI SDK `useChat`.
- **`ai-sdk-responses`**: For OpenAI-compatible stream clients.
- **`ai-sdk-data`**: Optimized for data-only streams.
- **`ai-sdk-json-render`**: Best for structured output rendering.

## 4. Durable Run State In The UI

Long-running agents should stream durable execution state through the standard `run-state` artifact. In `ai-sdk-ui-message` mode PURISTA maps that automatically to `data-run-state`.

This lets the frontend render:

- current phase
- task checklist
- completion or failure summary
- input locking while a run is active

```tsx title="frontend/ChatComponent.tsx"
const { messages, sendMessage } = useChat({
  api: '/api/v1/agents/support',
  onData: part => {
    if (part.type === 'data-run-state') {
      setRunState(part.data)
    }
  },
})

const inputLocked =
  runState?.status === 'planning' ||
  runState?.status === 'running' ||
  runState?.status === 'summarizing'
```

Use this for execution UX. Keep the final assistant summary in chat, and keep progress/tasks in a separate run-status panel.

## 5. Why use this instead of a custom controller?

1. **Automatic Transformation**: PURISTA handles the mapping between its rich protocol frames and the simpler client-side formats.
2. **OpenAPI Generation**: The exposed endpoint is automatically included in your generated OpenAPI spec, complete with protocol documentation.
3. **Tracing & Logs**: All HTTP calls are automatically linked to the agent's internal trace, giving you full visibility from the UI click to the LLM response.
4. **Security**: Leverages PURISTA's built-in HTTP guards for authentication and authorization.

---

### Pro Tip: Tool Call UI
When using `ai-sdk-ui-message`, tool calls are sent as `tool-call` and `tool-result` frames. You can use the AI SDK's `toolInvocation` feature in your React component to render specific UIs for things like "Order Lookup" or "Ticket Creation" results.
