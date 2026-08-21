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

## Optional: retention for long-lived conversations

This is a new optional capability, not a breaking change or migration
requirement. Add retention only when the product needs it—for example, a
support chat that should retain recent context for 30 days and avoid indefinite
storage growth.

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

## Only if your Harness workflow delegates to local agents

This is a migration only for a workflow that both uses
`setHarnessWorkflow(..., { agents })` and calls a local `ctx.agents.<name>`.
Declare the workflow's agent and model authority explicitly:

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
keeps a workflow’s capabilities reviewable. Workflows without local Harness
agents and PURISTA child agents using `canInvokeAgent(...)` need no change.

## Client progress from a custom agent

Harness lifecycle events are owned by the runtime so their ordering, run
identity, redaction, and completion status remain trustworthy. Configure which
model progress reaches the generated agent stream once on the agent:

```ts
agent
  .setStreamingMode('stream', { modelChunkVisibility: 'safe' })
  .setSuccessEventName('support.triage.completed')
  .setRunFunction(async context => {
    const result = await context.harness.models.primary.object(
      request,
      context.signal,
    )

    return { ticketId: context.payload.ticketId, result }
  })
```

`safe` forwards user-facing model output and tool status without tool
arguments/results, reasoning, prompts, policy details, sandbox output, or raw
errors. `full` is for a trusted diagnostic client; `off` sends only the final
result. These frames belong only to the active generated stream. They are not
PURISTA EventBridge publications and cannot trigger subscriptions.

## Only if you supplied explicit Harness adapters

Ordinary agents require no adapter migration: they use the owning service's
standard PURISTA StateStore by default. This section applies only if your
application explicitly passes `ai.sandbox`, `ai.workspaceStore`, or
`ai.stateStore`. Each must now be the corresponding published Harness adapter,
not an ad-hoc placeholder object. Durable workspace replay additionally applies
only to Harness workflows; a plain Harness agent or custom run function cannot
claim durable workflow replay.

Static Harness modules and imported Agent Plugin tools remain optional,
application-owned runtime bindings. PURISTA does not discover plugins, decide
trust, or inject credentials. See the [Agent Plugins guide](/harness/agent-plugins/)
when your application intentionally uses them.

## Upgrade checklist

- [ ] Upgrade the PURISTA packages used by the application together.
- [ ] If a Harness workflow calls a registered local agent, declare that
      authority in `workflow.delegation`.
- [ ] Configure `modelChunkVisibility` on custom agents that stream model
      progress to clients.
- [ ] In agent tests, replace `createScriptedHarnessModel()` with
      `new FakeModelProvider()` from `@purista/core/testing`.
- [ ] If the application supplies an explicit `ai.sandbox`, `ai.workspaceStore`,
      or `ai.stateStore`, verify it is the matching Harness adapter.

For API detail and examples, see the [AI handbook](/handbook/2_building-business-logic/ai/)
and [agent builder guide](/handbook/2_building-business-logic/ai/the-agent-builder/).
