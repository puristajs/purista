---
title: Version 4.0 — Harness v2 migration
description: "PURISTA 4.0 aligns attached agents with AI Harness v2: typed runtime bindings, tenant-safe conversations, bounded retention, and explicit workflow delegation."
date: 2026-08-20
order: 20260820
---

PURISTA 4.0 upgrades attached agents to `@purista/harness` v2 and makes their
runtime boundaries explicit. The release adds static Harness modules, approved
Agent Plugin tool bindings, typed sandbox/state/workspace adapters, bounded
conversation retention, and safer lifecycle events.

This is a major release because a few formerly implicit or loosely typed
behaviors are now rejected. Package versions are assigned by the release
pipeline; do not edit workspace versions by hand.

## What changes

- Attached-agent runtime bindings are typed and validated at startup.
- Conversation sessions declare either tenant or service isolation explicitly.
- A service StateStore is reused for agent history, runs, and events unless an
  explicit Harness-native `ai.stateStore` is supplied.
- History can retain complete recent turns with explicit byte/turn bounds.
- Harness-local workflow agents require an explicit delegation allowlist.
- Custom handlers can opt into trusted model lifecycle events, but cannot forge
  Harness lifecycle events directly.

## Migration checklist

### 1. Upgrade the framework packages together

Use your package manager to upgrade the PURISTA packages you use. Keep
`@purista/core`, bridges, stores, and HTTP packages on the same generated
release line. Provider packages remain application dependencies.

```sh
npm install @purista/core@latest @purista/hono-http-server@latest
```

Run the normal checks afterwards:

```sh
npm run lint
npm test
npm run build
```

### 2. Configure conversations safely by default

`setConversation(...)` is tenant-isolated by default. There is no tenant
fallback or synthesized tenant identity.

For a multi-tenant service, use the default. PURISTA then uses the authenticated
`message.tenantId` already carried into the service handler and rejects a
missing tenant. Ensure the inbound adapter or guard establishes that trusted
message field; never derive it from the payload, prompt, or conversation id.

```ts
agent.setConversation('conversationId')
```

For a genuinely single-tenant service, choose `{ scope: 'service' }`. No `tenantId` is
required or fabricated; the session still remains namespaced by service,
version, agent, and conversation id.

```ts
agent.setConversation('conversationId', { scope: 'service' })
```

### 3. Declare workflow delegation

Passing `{ agents }` to `setHarnessWorkflow(...)` registers local definitions;
it no longer grants them authority automatically. Add the workflow's explicit
allowlist and only the model aliases it needs.

```ts
.setHarnessWorkflow({
  input,
  output,
  delegation: {
    agents: ['summarize'],
    modelAliases: ['primary'],
  },
  handler: ctx => ctx.agents.summarize(ctx.input),
}, {
  agents: { summarize },
})
```

### 4. Replace custom lifecycle-event emission

`context.harness.events.emit(...)` is removed. Harness owns lifecycle event
identity, ordering, redaction, and final status. Opt into model events at the
model call instead; emit business events through the normal PURISTA handler
context.

```ts
const result = await context.harness.models.primary.object(
  request,
  context.signal,
  { emitRunEvents: true },
)

await context.emit('support.triage.completed', { ticketId: context.payload.ticketId })
```

### 5. Bind real adapters instead of structural placeholders

`ai.sandbox`, `ai.workspaceStore`, and `ai.stateStore` now use their respective
Harness adapter contracts. Replace ad-hoc objects with adapters that implement
the documented port. Durable workspaces remain workflow-only and fail fast for
`setHarnessAgent(...)` or `setRunFunction(...)`.

If you use an explicit Harness-native state store with history retention, it
must implement atomic `replaceMessages`. Otherwise, allow the attached agent
to use the service StateStore and retain the normal application ownership of
conversation admission and ordering.

### 6. Bound retained state deliberately

Retention is optional. Add it only where the product needs it; it is storage
accounting, not a model-token budget.

```ts
agent.setConversation('conversationId', {
  retention: {
    idleTtlMs: 30 * 24 * 60 * 60 * 1_000,
    history: { maxTurns: 50, maxBytes: 256_000 },
    runs: { maxPerSession: 20 },
    events: { maxPerRun: 500 },
  },
})
```

## Conversation concurrency remains your product policy

PURISTA and Harness persist session state and provide local busy/idempotency
signals. They do not impose a distributed ordering policy for user messages.
Choose whether a conversation queues turns, returns a busy response, or uses
independent sessions for parallel work. Persisting timestamps after two model
calls have started cannot make either answer aware of the other call.

See the [AI handbook](/handbook/2_building_business-logic/ai/) and the
[Harness memory guide](/harness/memory/) for the resulting runtime and storage
model.
