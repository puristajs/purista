---
title: Web & SDK
description: Expose attached agents through HTTP/SSE and render protocol plus run-state cleanly in the UI.
order: 203710
---

# Web & SDK

The recommended frontend shape is:

1. attach the agent to a service
2. expose the attached agent directly over HTTP
3. render content streaming and operational streaming separately

## Service Side

```ts
export const supportAgentBuilder = supportV1ServiceBuilder
  .getAgentQueueBuilder(
    'supportAgent',
    'Support assistant attached to the support service',
    'support.agent.completed',
  )
  .addOutputSchema(supportAgentResponseSchema)
  .addModel('openai:gpt-4o-mini')
  .exposeAsHttpEndpoint('POST', 'agents/supportAgent')
  .setStreamProtocolAdapter('ai-sdk.ui-message')
```

## Frontend Side

```tsx
const { messages, onData } = useChat({
  api: '/api/v1/agents/supportAgent',
})
```

```tsx
onData(part => {
  if (part.type === 'data-run-state') {
    setRunState(part.data)
  }
})
```

The direct attached-agent endpoint is the primary UI entrypoint. Only add a command or stream wrapper when you need a product-specific facade, access-control boundary, or interoperability adapter.

## Streaming Model

PURISTA distinguishes two concurrent stream lanes:

- **Content streaming**
  - assistant text deltas
  - structured object sections
  - final validated `output`
- **Operational streaming**
  - run-state
  - reasoning
  - tool lifecycle
  - protocol artifacts

The UI should render these lanes separately. The chat transcript should react to text deltas, while workflow or diagnostics panels should react to `data-run-state`, tool parts, and custom `data-*` artifacts.

For plan/task UX, prefer the reserved `purista-ai:*` artifacts instead of inferring task state from ad hoc section ids:

- `data-purista-ai-plan`
- `data-purista-ai-task`
- `data-purista-ai-task-chunk`
- `data-purista-ai-plan-status`

`run-state` remains the durable recovery source of truth. The `purista-ai:*` parts are the stable live-consumption contract for browsers and SDK consumers.

## UI Rule

- chat transcript: user-visible conversation
- run-state panel: progress, tasks, checkpoints, recovery
- tool panel: optional tool lifecycle and external actions

Do not merge those concerns into one timeline unless the product intentionally wants a noisy operational transcript.

## Related Guides

- [Run State](./run-state.md)
- [Invocation](./invocation.md)
