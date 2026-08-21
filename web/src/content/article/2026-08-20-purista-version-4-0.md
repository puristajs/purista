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

The existing session-policy API keeps its `payloadPath`, so a valid PURISTA 3.2
declaration does not need to change. The path is type-checked. Use the payload
field that identifies the business conversation—not a message, trace, or
correlation id.

```ts
// Valid PURISTA 3.2 configuration — keep this code unchanged.
agent.setSessionPolicy({
  mode: 'conversation',
  payloadPath: ['conversationId'],
})
```

Nested fields keep the same array form:

```ts
agent.setSessionPolicy({
  mode: 'conversation',
  payloadPath: ['conversation', 'id'],
})
```

That is the complete configuration. The conversation id is the application's
stable, non-empty business identifier. PURISTA automatically takes trusted
`message.tenantId` and `message.principalId` into account when they are
present. Conceptually, the persistent session is partitioned by
`tenantId:principalId:conversationId` inside the owning service and agent.

Tenant and principal are optional dimensions. When both are absent, the
conversation id is the whole business boundary. When either trusted value is
present, it automatically creates stricter separation for the same conversation
id. No session scope or single-tenant configuration is required.

Only trusted PURISTA message metadata participates in that partition. Do not
take tenant or principal identity from agent payload fields, prompts,
conversation ids, or unverified headers.

`setSessionPolicy(...)` creates or resumes the Harness session identity for the
logical conversation. It scopes persisted history and the associated agent run
records. It does **not** make a sandbox persistent, restore files, or grant
tools. Those are separate application decisions:

| Need | PURISTA declaration and runtime binding |
| --- | --- |
| Continue chat history across requests | `setSessionPolicy({ mode: 'conversation', payloadPath })` |
| Use filesystem, code execution, or MCP tools in one run | `setSandboxPolicy(...)` and `ai.sandbox` |
| Resume workflow files/checkpoints after restart | `setWorkspacePolicy(...)`, `ai.runtime`, and `ai.workspaceStore` |
| Permit model-requested tools | agent tool declarations and the application’s approved runtime bindings |

### Existing persisted history

No application code migration is needed. There is one deliberate behavior
change for persistent conversations: if a message now carries a tenant or
principal, its history begins in that more specific namespace instead of
joining the older conversation-id-only history. PURISTA never reads the old
shared record into a newly partitioned conversation because it cannot prove
that record belongs to the current tenant or principal.

Let existing records expire under their retention policy, or archive them using
your normal data-governance process. Do not copy old shared transcripts into a
tenant or principal namespace automatically. Conversations whose messages have
neither optional value continue to use their conversation-id-only identity.

## A long-running support conversation

Conversation history is permanent unless you choose a limit. Add retention
only when the product needs it—for example, a support chat that should retain
recent context for 30 days and avoid indefinite storage growth.

```ts
agent.setSessionPolicy({
  mode: 'conversation',
  payloadPath: ['conversationId'],
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
- [ ] Keep valid `setSessionPolicy({ mode: 'conversation', payloadPath })`
      declarations; no session-scope option is needed.
- [ ] Ensure the application's `conversationId` is stable and unique for the
      logical business conversation it represents.
- [ ] Propagate trusted `message.tenantId` and `message.principalId` when the
      transport/authentication layer provides them; Core applies them
      automatically.
- [ ] Add workflow delegation only to workflows that call local Harness agents.
- [ ] Replace raw Harness lifecycle emission; use `emitRunEvents: true` for
      active-stream progress and `setSuccessEventName(...)` for a business
      event on the EventBridge.
- [ ] Verify any explicit sandbox, workspace, or agent StateStore is a real
      adapter.

For API detail and examples, see the [AI handbook](/handbook/2_building-business-logic/ai/)
and [agent builder guide](/handbook/2_building-business-logic/ai/the-agent-builder/).
