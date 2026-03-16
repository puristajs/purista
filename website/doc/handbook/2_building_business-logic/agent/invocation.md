---
title: Invocation
description: How to call agents from Commands, Subscriptions, and Scripts.
order: 203705
---

# Invocation

PURISTA follows a strict dependency pattern. Agents should be invoked using the **Context API** inside your services for full observability and type safety.

## 1. Context API (Recommended)

When working inside a command, subscription, or stream, register your agent dependency using `.canInvokeAgent(...)`.

```ts title="src/services/support/v1/command/ask.ts"
export const askCommand = supportServiceBuilder
  .getCommandBuilder('ask', 'Asks the agent a question')
  .canInvokeAgent('supportAgent', '1', {
    payloadSchema: z.object({ prompt: z.string() })
  })
  .setCommandFunction(async (context, payload) => {
    // 1. Start invocation
    const invocation = context.invokeAgent.supportAgent['1'].call({
      prompt: payload.prompt
    })

    // 2. Iterate through streaming frames (optional)
    for await (const frame of invocation) {
      if (frame.kind === 'message') {
        console.log(frame.content)
      }
    }

    // 3. Get the final result
    const result = await invocation.final()
    return result.message
  })
```

### Benefits
- **Type Safety**: Payload and parameters are validated.
- **Traceability**: Traces flow from caller to agent automatically.
- **Identity**: `tenantId` and `principalId` are automatically forwarded.
- **Session Management**: `sessionId` flows seamlessly into the agent's memory.

## 2. In-Handler Orchestration

Agents can call other agents directly using `context.agents`. This is useful for building multi-agent chains.

```ts
setHandler(async (context, payload) => {
  const triageInvocation = context.agents.invoke.triageAgent['1'].call({
    prompt: payload.prompt,
  })

  const triageEnvelopes = await triageInvocation.final()

  const triage = await context.agents.runText({
    agentName: 'triageAgent',
    agentVersion: '1',
    payload: { prompt: payload.prompt },
  })

  if (triage === 'urgent') {
    return context.agents.runText({
      agentName: 'expertAgent',
      agentVersion: '1',
      payload,
    })
  }

  return 'Standard response.'
})
```

Use the chained `context.agents.invoke.<agent>['version'].call(...)` form when you want the full protocol envelopes. Use `runText(...)` or `runObject<T>(...)` when you only want the final assistant result.

If the parent agent should expose the child agent's live output directly to the current client stream, use `forwardToCurrentStream`. This avoids hand-written frame bridging in orchestration agents.

```ts
await context.agents.invoke({
  agentName: 'triageAgent',
  agentVersion: '1',
  payload: { prompt: payload.prompt },
  forwardToCurrentStream: {
    assistant: true,
    reasoning: true,
    artifacts: true,
    errors: true,
    toolEvents: false,
  },
  emitInvocationToolEvents: false,
})
```

`emitInvocationToolEvents: false` is useful when the sub-agent is an internal orchestration step and you do not want the outer stream to show synthetic `childAgent.run` tool telemetry.

For JSON-first orchestration:

```ts
const triage = await context.agents.runObject<{ urgency: string; nextSteps: string[] }>({
  agentName: 'triageAgent',
  agentVersion: '1',
  payload: { prompt: payload.prompt },
})
```

## 3. Standalone API

For manual scripts or testing where no service context exists, use the `invokeAgent` helper.

```ts
import { invokeAgent } from '@purista/ai'

const result = await invokeAgent({
  eventBridge,
  agentName: 'supportAgent',
  agentVersion: '1',
  payload: { prompt: '...' },
  sessionId: 'manual-session'
})
```

## 4. HTTP Exposure Modes (`stream` vs `aggregate`)

Agent HTTP endpoints can be exposed in two transport modes:

- `stream` (default): SSE (`text/event-stream`), incremental frames.
- `aggregate`: unary JSON response (`application/json`) containing the final envelope.

```ts
.exposeAsHttpEndpoint('POST', 'agents/support')
.setStreamingMode('aggregate')
```

---

## Payload vs. Parameter

- **Payload**: Primary business input (e.g., prompt, question).
- **Parameter**: Side-channel metadata (e.g., `locale`, `featureFlags`).

```ts
await context.invokeAgent.supportAgent['1'].call(
  { prompt: '...' }, // Payload
  { locale: 'en-US' } // Parameter
)
```
