---
title: Upgrading to PURISTA 4.0
description: "Attached-agent migrations and first-class StateStore retention in PURISTA 4.0."
date: 2026-08-20
order: 20260820
---

PURISTA 4.0 adds first-class StateStore retention and changes attached-agent
persistence, workflow delegation, and custom agent streaming.

## Migrate persisted conversations

Attached-agent history, run summaries, and lifecycle events now use the owning
service's StateStore by default. Review its durability, encryption, access
controls, and expiry behaviour before upgrading a persistent conversation.
Configure `ai.stateStore` only when agent data needs a separate storage
boundary.

When a message includes a trusted `tenantId` or `principalId`, PURISTA adds it
to the conversation namespace automatically. If an existing persisted
conversation starts receiving either value, future turns use a separate history.
Archive or let the older conversation-id-only history expire through the
application's normal data-retention process; do not copy a shared transcript
into the new namespace.

## Migrate Harness workflow delegation

Harness workflows that register local agents and call `ctx.agents.<name>` must
declare the agents and models they may use:

```ts
const workflow = {
  input,
  output,
  delegation: {
    agents: ['summarize'],
    modelAliases: ['primary'],
  },
  handler: ctx => ctx.agents.summarize(ctx.input),
}

agent.setHarnessWorkflow(workflow, { agents: { summarize } })
```

## Migrate custom-agent client progress

Configure model progress on the agent instead of each model call:

```ts
agent
  .setStreamingMode('stream', { modelChunkVisibility: 'safe' })
  .setRunFunction(async context => {
    const result = await context.harness.models.primary.object(request, context.signal)
    return { ticketId: context.payload.ticketId, result }
  })
```

`safe` forwards user-facing model output and tool status without prompts,
reasoning, tool arguments/results, sandbox output, policy details, or raw
errors. Use `full` only for a trusted diagnostic client; use `off` for the final
result only.

`context.harness.events.emit(...)` has been removed. The agent response stream
now accepts runtime-owned model and tool lifecycle chunks only.
`modelChunkVisibility` does not carry arbitrary application-specific UI frames.
Move those frames to a separate application stream or channel.

Do not replace them with `context.emit(...)`: PURISTA `emit` publishes a message
through the EventBridge for subscriptions and other services; it does not write
to the active agent HTTP response stream.

## New: bounded StateStore data

Retention now works for ordinary service state as well as attached-agent
records. Apply it to one write, make it the default for a service, or give a
dedicated StateStore instance a default lifetime. The [StateStore retention
guide](/handbook/2_building-business-logic/stores/state-stores/#retention)
shows the three choices, exact precedence, use cases, and adapter compatibility.

For a conversation, `history.maxTurns` and `history.maxBytes` keep a rolling
window of complete turns. `idleTtlMs` expires inactive agent state through the
same StateStore expiry capability. The [AI runtime durability model](/handbook/2_building-business-logic/ai/#runtime-durability-model)
explains when a conversation, sandbox, or durable workflow is the right
boundary.
