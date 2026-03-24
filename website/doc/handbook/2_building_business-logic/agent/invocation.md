---
title: Invocation
description: Call agents from PURISTA services first; use orchestration and forwarding only when the use case really needs it.
order: 203707
---

# Invocation

Invocation is the point where one PURISTA workload calls another.

The default rule is simple:

- from services, commands, subscriptions, or streams, use `context.invokeAgent`
- inside an agent handler, use `context.invoke.agents`
- use forwarding only when the child agent should be visible to the end user
- use standalone invocation only for scripts and tooling

## Start With The Normal PURISTA Path

Most applications should start here.

Register the dependency on the caller:

```ts
.canInvokeAgent('supportAgent', '1')
```

Then call it from the service context:

```ts title="src/services/support/v1/command/ask.ts"
export const askCommand = supportServiceBuilder
  .getCommandBuilder('ask', 'Ask the support agent')
  .canInvokeAgent('supportAgent', '1', {
    payloadSchema: z.object({ prompt: z.string() }),
  })
  .setCommandFunction(async (context, payload) => {
    const result = await context.invokeAgent.supportAgent['1']
      .call({ prompt: payload.prompt })
      .final()

    return result.message
  })
```

Use this path when:

- a command wants an agent result
- a subscription wants to delegate work to an agent
- a stream handler wants to trigger an agent

Why this is the default:

- typed payloads
- automatic identity forwarding
- tracing and observability stay connected
- queued durable agents still look like normal invocations

## When You Need More Than The Final Message

Sometimes the caller needs the streamed envelopes, not just the final result.

```ts
const invocation = context.invokeAgent.supportAgent['1'].call({
  prompt: payload.prompt,
})

for await (const frame of invocation) {
  if (frame.kind === 'message') {
    console.log(frame.content)
  }
}

const result = await invocation.final()
```

Use this when the caller needs:

- live frames
- custom stream handling
- access to protocol details

If you only need the final result, do not use this shape yet.

## In-Handler Orchestration

When an agent calls another agent, use `context.invoke.agents`.

The common case is internal reasoning:

```ts
const triage = await context.invoke.agents.runText({
  agentName: 'triageAgent',
  agentVersion: '1',
  payload: { prompt: payload.prompt },
})
```

Use:

- `runText(...)` when you only need the final assistant text
- `runObject<T>(...)` when the child returns structured JSON in its final message

Example:

```ts
const triage = await context.invoke.agents.runObject<{
  urgency: 'low' | 'medium' | 'high'
  nextSteps: string[]
}>({
  agentName: 'triageAgent',
  agentVersion: '1',
  payload: { prompt: payload.prompt },
})
```

This is the normal multi-agent orchestration path.

## When The Child Agent Should Be Visible To The User

Use forwarding only when the child agent is part of the visible user experience.

```ts
await context.invoke.agents.forward({
  agentName: 'architectureAgent',
  agentVersion: '1',
  payload: { prompt: payload.prompt, projectId: payload.projectId },
})
```

What forwarding does:

- forwards assistant text
- forwards reasoning
- forwards artifacts
- forwards `run-state`

That is why forwarding is useful for:

- orchestrator agents
- supervisor agents
- queued durable child runs that should surface progress directly

If the child is only an internal classifier or planner, prefer `runText(...)` or `runObject<T>(...)`.

## Full Control

Use `context.invoke.agents.invoke(...)` only when you genuinely need raw envelopes or custom forwarding behavior.

```ts
const envelopes = await context.invoke.agents.invoke({
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

This is an advanced path. The usual choices should still be:

- `runText(...)`
- `runObject<T>(...)`
- `forward(...)`

## Standalone Invocation

For scripts or tooling where no normal service context exists, use `invokeAgent(...)`.

```ts
import { invokeAgent } from '@purista/ai'

const result = await invokeAgent({
  eventBridge,
  agentName: 'supportAgent',
  agentVersion: '1',
  payload: { prompt: 'A customer was charged twice.' },
  sessionId: 'manual-session',
})
```

Use this for:

- CLI tools
- scripts
- admin maintenance flows

Do not treat it as the default application integration path.

## HTTP Exposure Modes

Once an agent is exposed over HTTP, invocation transport can be:

- `stream` for SSE
- `aggregate` for one final JSON response

Queued durable agents still use the same exposure. The difference is that the transport attaches to the durable run instead of assuming everything finishes inside one request.

## Decision Rules

- Service or command calling an agent:
  use `context.invokeAgent`
- Agent calling another agent for internal reasoning:
  use `context.invoke.agents.runText(...)` or `runObject<T>(...)`
- Parent agent wants the child visible to the user:
  use `context.invoke.agents.forward(...)`
- Need full envelope control:
  use `context.invoke.agents.invoke(...)`
- Script or tooling:
  use `invokeAgent(...)`

## Common Mistakes

- Using forwarding for internal-only orchestration.
- Jumping to raw envelope APIs when a final result helper is enough.
- Treating standalone invocation as the normal app integration path.
- Mixing external SDK adapter concerns into the normal invocation story.

## Related Guides

- [Quick Start](./getting-started.md)
- [Context](./handler-context.md)
- [AI SDK Adapter](./ai-sdk-adapter.md)
- [External Runtime Bindings](./external-runtime-bridge.md)
