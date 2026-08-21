---
title: Upgrading AI agents from PURISTA 3.2
description: "A practical guide to upgrading attached PURISTA agents: persistent conversations, workflows, state, and model events."
date: 2026-08-20
order: 20260820
---

This guide is for applications that use `getAgentQueueBuilder(...)`. It explains
what to change in application code and what stays the same.

Most agents need no code change. A normal agent still belongs to a service,
runs through its generated queue and worker, calls only declared commands or
child agents, and receives its model provider at `service.getInstance(...)`.

## Start here

Upgrade the PURISTA packages your application uses together, then run your
usual checks:

```sh
npm install @purista/core@latest @purista/hono-http-server@latest
npm run lint
npm test
npm run build
```

If an application has no attached agents, uses only ephemeral agents, or does
not use the advanced features below, there is nothing else to migrate.

## A support-chat conversation

The old session-policy API used one low-level term for several related runtime
concepts. Its persistent-conversation use case is now a PURISTA conversation
declaration. Use the payload field that identifies the business conversation—
not a message, trace, or correlation id.

```ts
// PURISTA 3.2
agent.setSessionPolicy({
  mode: 'conversation',
  payloadPath: ['conversationId'],
})

// Current PURISTA
agent.setConversation('conversationId')
```

For an ordinary multi-tenant service, that is the complete configuration.
PURISTA uses the trusted `message.tenantId` that your transport adapter or
guard already places on the service message. A missing tenant is rejected, so
two tenants cannot accidentally share a conversation with the same id.

Only a service that genuinely has no tenant boundary should opt out:

```ts
agent.setConversation('conversationId', { scope: 'service' })
```

Do not use service scope as a fallback for missing tenant data. Fix the inbound
authentication or guard instead.

`setConversation(...)` creates or resumes the Harness session identity for the
logical conversation. It scopes persisted history and the associated agent run
records. It does **not** make a sandbox persistent, restore files, or grant
tools. Those are separate application decisions:

| Need | PURISTA declaration and runtime binding |
| --- | --- |
| Continue chat history across requests | `setConversation(...)` |
| Use filesystem, code execution, or MCP tools in one run | `setSandboxPolicy(...)` and `ai.sandbox` |
| Resume workflow files/checkpoints after restart | `setWorkspacePolicy(...)`, `ai.runtime`, and `ai.workspaceStore` |
| Permit model-requested tools | agent tool declarations and the application’s approved runtime bindings |

The 3.2 policy could not express the scope required by its runtime, so normal
typed applications did not establish a persistent conversation through that
API. There is therefore no automatic history conversion to perform. If an
application bypassed the public API and wrote its own agent records, decide
whether those records meet the new isolation policy and handle any archival or
import in application code.

## A long-running support conversation

Conversation history is permanent unless you choose a limit. Add retention
only when the product needs it—for example, a support chat that should retain
recent context for 30 days and avoid indefinite storage growth.

```ts
agent.setConversation('conversationId', {
  retention: {
    idleTtlMs: 30 * 24 * 60 * 60_000,
    history: { maxTurns: 50, maxBytes: 256_000 },
  },
})
```

`maxTurns` keeps complete user/assistant/tool turns. `maxBytes` bounds stored
data, not model tokens; the provider still chooses a request context according
to its own token window.

The existing service StateStore is used for agent history, run summaries, and
events by default. You do not need a second store for an ordinary agent. Use
`ai.stateStore` only when agent data deliberately needs a separate persistence
boundary. Expiring state requires a StateStore with atomic expiry, such as the
Redis state store or a correctly configured TTL-capable Dapr component.

## A workflow that calls local Harness agents

If an attached agent wraps a Harness workflow and registers local agents with
`setHarnessWorkflow(..., { agents })`, name the agents and models that the
workflow may call:

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

Registering a definition and granting it authority are separate actions. This
keeps a workflow’s capabilities reviewable. PURISTA child agents that use
`canInvokeAgent(...)` are unchanged.

## A custom agent handler that exposes model progress

Use the agent's normal PURISTA success event for a business fact. It is emitted
only after the run has completed successfully. Include the data consumers need
in the validated agent output.

If a custom handler also needs provider model progress on the generated stream,
opt in at the model call:

```ts
agent
  .setSuccessEventName('support.triage.completed')
  .setRunFunction(async context => {
    const result = await context.harness.models.primary.object(
      request,
      context.signal,
      { emitRunEvents: true },
    )

    return { ticketId: context.payload.ticketId, result }
  })
```

`context.harness.events.emit(...)` is no longer available. Model lifecycle
events are owned by the runtime so their ordering, run identity, redaction, and
completion status remain trustworthy. `{ emitRunEvents: true }` adds
provider-progress frames to the active generated stream only; it is not a
PURISTA EventBridge publication and cannot trigger subscriptions. By contrast,
the configured success event publishes the completed agent output through the
PURISTA EventBridge, so subscriptions and other services can consume it.

## Only if you supply advanced runtime adapters

Applications that already pass `ai.sandbox`, `ai.workspaceStore`, or
`ai.stateStore` must use the corresponding published Harness adapter. Replace
ad-hoc placeholder objects with a real adapter. Durable workspaces are for
Harness workflows; a plain Harness agent or a custom PURISTA run function must
not claim durable workflow replay.

Static Harness modules and imported Agent Plugin tools remain optional,
application-owned runtime bindings. PURISTA does not discover plugins, decide
trust, or inject credentials. See the [Agent Plugins guide](/harness/agent-plugins/)
when your application intentionally uses them.

## Upgrade checklist

- [ ] Upgrade the PURISTA packages used by the application together.
- [ ] Replace `setSessionPolicy({ mode: 'conversation', ... })` with
      `setConversation(...)` where persistent conversations are intended.
- [ ] Ensure multi-tenant request handling supplies trusted `message.tenantId`.
- [ ] Use `{ scope: 'service' }` only for a genuinely non-tenant service.
- [ ] Add workflow delegation only to workflows that call local Harness agents.
- [ ] Replace raw Harness lifecycle emission; use `emitRunEvents: true` for
      active-stream progress and `setSuccessEventName(...)` for a business
      event on the EventBridge.
- [ ] Verify any explicit sandbox, workspace, or agent StateStore is a real
      adapter.

For API detail and examples, see the [AI handbook](/handbook/2_building-business-logic/ai/)
and [agent builder guide](/handbook/2_building-business-logic/ai/the-agent-builder/).
