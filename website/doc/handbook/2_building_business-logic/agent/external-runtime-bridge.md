---
title: External Runtime Bindings
description: Define provider-neutral external bindings for PURISTA commands and agents, then adapt them to SDK-specific tool formats.
order: 203703
---

# External Runtime Bindings

PURISTA does not replace Vercel AI SDK, OpenAI Agents, or LangChain. It owns the runtime contract around them:

- command and agent allowlists
- queue-backed durable execution
- protocol frames and SSE mapping
- tracing, logs, and tool event telemetry

Use external runtime bindings when you want an external tool loop, but the tools should still resolve through PURISTA commands or child agents.

## Public API

```ts
const bindings = context.expose.tools({
  commands: [
    { serviceName: 'support', serviceVersion: '1', commandName: 'lookupFaq' },
  ],
  agents: [
    { agentName: 'triageAgent', agentVersion: '1', name: 'triageEscalation', resultMode: 'text' },
  ],
})
```

Available helpers:

- `createCommandBinding(...)`
- `createAgentBinding(...)`
- `createExternalBindings(...)`
- `context.expose.tool(...)`
- `context.expose.agent(...)`
- `context.expose.tools(...)`
- `context.expose.metadata()`
- `definition.getExternalRuntimeMetadata()` or `getExternalRuntimeMetadata(definition)`

## Command Binding Example

```ts
const faqBinding = context.expose.tool({
  serviceName: 'support',
  serviceVersion: '1',
  commandName: 'lookupFaq',
  toolName: 'lookupFaq',
})
```

The input schema is taken from the PURISTA command metadata. No second schema definition is needed.

## Child-Agent Binding Example

```ts
const triageBinding = context.expose.agent(
  {
    agentName: 'triageAgent',
    agentVersion: '1',
    toolName: 'triageEscalation',
  },
  { resultMode: 'text' },
)
```

The binding emits normal PURISTA tool frames for the child agent invocation and returns the child result as text, object, or raw protocol envelopes.

## Adapter Boundary

Bindings are provider-neutral. Adapters such as the AI SDK adapter convert them to provider-specific tool objects right before the external loop runs.

See [AI SDK Adapter](./ai-sdk-adapter.md) for the Vercel AI SDK-specific conversion.

## Durable Contract

Supported queue-safe bindings must resolve to:

- a PURISTA command
- a PURISTA child agent

Inline-only closures are not part of the durable contract. If you need a local filesystem or sandbox helper, wrap it explicitly and keep it out of the queued path unless you can serialize the execution boundary safely.

## Queue Behaviour

Queued durable runs keep the same binding API. The important rule is that the actual work must still be serializable and replayable through PURISTA runtime calls.

That means:

- use `canInvoke(...)` and `canInvokeAgent(...)` as the allowlist
- use `context.runState` for progress and checkpoints
- use `ai-sdk-ui-message` when the frontend should receive `data-run-state`

## Protocol and Telemetry

Binding-driven tool calls still emit:

- PURISTA tool frames
- tracing spans and logs
- `run-state` artifacts
- mapped frontend SSE events such as `data-run-state`

This is the main difference from hand-written in-memory tool loops: the external runtime stays observable and durable, while the provider adapter stays a thin translation layer.
