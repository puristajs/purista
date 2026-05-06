---
title: Invocation
description: Call agents from PURISTA services first; use orchestration and forwarding only when the use case really needs it.
order: 22
---

# Invocation

Invocation is how PURISTA workloads call each other. This guide covers the different ways to invoke an agent, from simple service calls to complex in-handler orchestration.

The default rule is simple:
- From a service, command, or subscription, use `context.invokeAgent`.
- Inside an agent handler, use `context.invoke.agents`.

## 1. Standard Invocation from a Service

This is the most common and recommended path for integrating agents into your application.

First, declare the dependency on the calling service's builder:
```ts
.canInvokeAgent('supportAgent', '1')
```

Then, call it from the service's handler using the typed `context.invokeAgent` helper:
```ts title="src/services/support/v1/command/ask.ts"
export const askCommand = supportServiceBuilder
  .getCommandBuilder('ask', 'Ask the support agent')
  .canInvokeAgent('supportAgent', '1', {
    payloadSchema: z.object({ prompt: z.string() }),
  })
  .setHandler(async (context, payload) => {
    const result = await context.invokeAgent.supportAgent['1']
      .call({ prompt: payload.prompt })
      .final(); // .final() awaits the complete, aggregated result

    // The result is the array of protocol envelopes.
    // You'll typically find the final message in the last 'message' frame.
    const finalMessage = result.find(e => e.frame.kind === 'message' && e.frame.final)?.frame.content;

    return { message: finalMessage };
  });
```

This is the default path because it provides type safety, automatic identity and trace forwarding, and connected observability, regardless of whether the agent is inline or queued.

### Streaming from a Service

If the calling service needs to handle the live stream of frames from the agent, you can iterate over the invocation directly:

```ts
const invocation = context.invokeAgent.supportAgent['1'].call({
  prompt: payload.prompt,
});

for await (const frame of invocation) {
  if (frame.kind === 'message') {
    console.log(frame.content);
  }
}

const result = await invocation.final();
```

## 2. In-Handler Orchestration (Agent-to-Agent)

When one agent needs to call another, use the `context.invoke.agents` helpers.

### Simple Result Helpers

For most internal orchestration, you only need the final result of the child agent.

- **`runText(...)`**: Use when you only need the final assistant text output.
  ```ts
  const triageSummary = await context.invoke.agents.runText({
    agentName: 'triageAgent',
    serviceVersion: '1',
    payload: { prompt: payload.prompt },
  });
  ```
- **`runObject<T>(...)`**: Use when the child agent declares structured output. PURISTA reads the final `output` artifact as the canonical machine result instead of parsing assistant text.
  ```ts
  const triageData = await context.invoke.agents.runObject<{
    urgency: 'low' | 'medium' | 'high';
  }>({
    agentName: 'triageAgent',
    serviceVersion: '1',
    payload: { prompt: payload.prompt },
  });
  ```

### Stream Pipelines for UI-Visible Children

Use `stream(...)` when the parent needs live control over a child agent's canonical envelopes. This is the preferred composition API because it avoids hand-written `for await` loops and keeps forwarding, tapping, and collection in one place.

```ts
const childEnvelopes = await context.invoke.agents
  .stream({
    agentName: 'projectArchitectureAgent',
    serviceVersion: '1',
    payload: { prompt: 'Design a new microservice' },
    emitInvocationToolEvents: false,
  })
  .forwardToCurrentStream({
    assistant: true,
    reasoning: true,
    artifacts: true,
    errors: true,
  })
  .collect()
```

Use `forward(...)` when you want the same forwarding behavior with the default orchestration settings and do not need extra composition steps.

```ts
await context.invoke.agents.forward({
  agentName: 'projectArchitectureAgent',
  serviceVersion: '1',
  payload: { prompt: 'Design a new microservice' },
});
```
Forwarding streams the child agent's assistant text, reasoning, artifacts, run state, tool frames, and errors directly into the parent's output stream when enabled. Forwarded envelopes keep the original child identity and lineage; the parent only adds separate orchestration frames of its own. For internal-only child agents, prefer `runText` or `runObject`.

### Full Control with `invoke(...)`

For advanced use cases where you need raw access to the child agent's protocol envelopes or custom forwarding behavior, use `invoke(...)`.

```ts
const envelopes = await context.invoke.agents.invoke({
  agentName: 'triageAgent',
  serviceVersion: '1',
  payload: { prompt: payload.prompt },
  forwardToCurrentStream: {
    assistant: true, // Forward assistant messages
    errors: true,      // Forward error frames
    artifacts: false,  // Do not forward artifacts
  },
  emitInvocationToolEvents: false, // Don't show this as a "tool" in the parent's trace
});
```

## 3. Invocation Outside Handler Context

For invoking an agent from runtime callers outside handler-local context (for example bootstrap scripts, operational jobs, or tests), use `invokeAgent`.

```ts
import { invokeAgent } from '@purista/ai';

const result = await invokeAgent({
  eventBridge,
  agentName: 'supportAgent',
  serviceVersion: '1',
  payload: { prompt: 'A customer was charged twice.' },
  sessionId: 'manual-session-123',
  deliveryMode: 'prefer-stream', // default
});

// result is the array of AgentProtocolEnvelope
```

This function always opens stream transport first. In `deliveryMode: 'prefer-stream'` it may fall back to command invoke. In `deliveryMode: 'require-stream'` it fails fast when streams are unavailable.

## Invocation Options

When calling child agents via `context.invoke.agents`, you can pass several options:

| Option                   | Description                                                                                                   |
| ------------------------ | ------------------------------------------------------------------------------------------------------------- |
| `timeoutMs`              | Sets a timeout for the invocation.                                                                            |
| `correlationId`          | Overrides the correlation ID for trace chaining.                                                              |
| `sessionId`              | Overrides the session ID for the child agent call.                                                            |
| `failOnErrorFrame`       | If `true` (default), the invocation promise will reject if the child agent returns an `error` frame.            |
| `deliveryMode`           | `'prefer-stream'` (default) allows fallback; `'require-stream'` fails fast when stream transport is unavailable. |
| `forwardToCurrentStream` | Forwards frames from the child to the parent's stream. Can be `true` or an object for fine-grained control. |
| `emitInvocationToolEvents` | If `true` (default), the child agent call will appear as a `tool` event in the parent's protocol stream.      |

For `runObject(...)`, you can also pass `outputSchema` to validate the canonical final `output` artifact at call time. If omitted, PURISTA uses any `outputSchema` declared via `.canInvokeAgent(...)`.

## Error Handling

PURISTA's standard error handling applies to agent invocations:
- If a child agent throws a `HandledError`, the invocation promise will reject with that error. The calling agent can catch it and handle it as a predictable business failure.
- If a child agent throws an `UnhandledError` (or any other unexpected error), the promise will reject, and the parent agent can decide whether to retry or fail.
- By default, if a child agent emits an `error` frame in its protocol stream, the invocation will fail. You can disable this with `failOnErrorFrame: false` to handle the error frames manually.

## Decision Rules

- **Service-to-Agent**: Use `context.invokeAgent`.
- **Internal Agent-to-Agent**: Use `context.invoke.agents.runText(...)` or `runObject<T>(...)`.
- **UI-Visible Child Agent**: Use `context.invoke.agents.stream(...).forwardToCurrentStream(...).collect()`.
- **Simple UI Relay**: Use `context.invoke.agents.forward(...)`.
- **Full Control Needed**: Use `context.invoke.agents.invoke(...)` with custom options.
- **External Runtime Caller**: Use `invokeAgent(...)` with explicit `deliveryMode` when needed.

## Related Guides
- [Agent Builder](./agent-builder.md)
- [Handler Context](./handler-context.md)
- [Production-Ready Agents](./production-ready-agents.md)
- [External Runtime Bindings](./external-runtime-bridge.md)
