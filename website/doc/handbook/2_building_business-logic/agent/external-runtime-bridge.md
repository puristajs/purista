---
title: External Runtime Bindings
description: Use provider-neutral bindings only when an external SDK owns the reasoning loop but PURISTA must still own execution.
order: 203708
---

# External Runtime Bindings

This page answers one question:

> How do I keep PURISTA in charge of execution when an external SDK owns the reasoning loop?

If you do not have that problem, you probably do not need this page yet.

The default PURISTA path is still:

- direct `context.invoke.tools`
- direct `context.invoke.agents`

External runtime bindings are the advanced path for external tool loops.

## When To Use Bindings

Use bindings when:

- Vercel AI SDK or another external loop drives the model/tool cycle
- tool execution must still go through PURISTA commands or child agents
- you want tracing, telemetry, queue safety, and allowlists to remain intact

Do not use bindings when the handler itself already owns the loop. In that case, just call `context.invoke.tools` or `context.invoke.agents` directly.

## The Normal Binding Flow

### 1. Declare allowlists in the builder

```ts
.canInvoke('support', '1', 'lookupFaq')
.canInvokeAgent('triageAgent', '1')
```

### 2. Build bindings in the handler

```ts
const bindings = context.invoke.expose.tools({
  commands: [{ serviceName: 'support', serviceVersion: '1', commandName: 'lookupFaq' }],
  agents: [{ agentName: 'triageAgent', serviceVersion: '1', name: 'triageEscalation', resultMode: 'text' }],
})
```

### 3. Hand them to an adapter

That adapter usually lives on the model provider bound at `getInstance(...)`.

That concrete provider-adapter step is covered in [AI SDK Adapter](./ai-sdk-adapter.md).

This is the important mental model:

- builder declares what is allowed
- `context.invoke.expose.*` binds that allowlist to the live runtime
- the adapter translates those bindings for the external SDK

## Command Binding Example

If you want one command binding explicitly:

```ts
const faqBinding = context.invoke.expose.tool({
  serviceName: 'support',
  serviceVersion: '1',
  commandName: 'lookupFaq',
  toolName: 'lookupFaq',
})
```

Use this shape when:

- one specific tool is enough
- you want explicit naming at the adapter boundary

## Child-Agent Binding Example

If the external loop should be able to call a child agent:

```ts
const triageBinding = context.invoke.expose.agent(
  {
    agentName: 'triageAgent',
    serviceVersion: '1',
    toolName: 'triageEscalation',
  },
  { resultMode: 'text' },
)
```

Use this when:

- the external loop should delegate to another agent
- you want the child agent to remain a real PURISTA invocation

## Why This Exists

Without bindings, external SDK tools often become:

- ad hoc closures
- hand-written schema duplication
- missing telemetry
- non-durable execution paths

Bindings avoid that by keeping the authoritative runtime in PURISTA.

## Durable Contract

Bindings are safe for queued durable agents only when they resolve to:

- a PURISTA command
- a PURISTA child agent

That is the durable contract.

Do not treat:

- host filesystem closures
- random in-memory lambdas
- environment-specific helpers

as queue-safe tool bindings.

If you need those capabilities, wrap them behind real PURISTA commands or sandbox-backed resources first.

## Protocol and Telemetry

The main benefit of bindings is not convenience. It is preservation of runtime behavior:

- tool frames still exist
- tracing still exists
- queue-backed execution still exists
- `run-state` artifacts still exist

That is why bindings are better than hand-written tool objects in durable systems.

## Decision Rules

- If the handler owns the loop:
  use `context.invoke.tools` / `context.invoke.agents`
- If an external SDK owns the loop:
  use `context.invoke.expose.*` and then an adapter
- If the tool target is not a PURISTA command or child agent:
  do not treat it as a queue-safe binding yet

## Common Mistakes

- Using bindings when direct handler calls would be simpler.
- Treating bindings as a replacement for builder allowlists.
- Exposing non-durable local helpers in queued durable flows.
- Explaining bindings before the reader understands the normal invocation path.

## Related Guides

- [Invocation](./invocation.md)
- [AI SDK Adapter](./ai-sdk-adapter.md)
- [Context](./handler-context.md)
