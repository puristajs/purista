---
title: Migrate from v3 to v4
description: Replace the generated attached-agent API with native Harness definitions, explicit service mounts, address-first calls, and deliberate HTTP adapters.
order: 1110
---

PURISTA v4 makes a clean break in AI integration. Remove v3 agent builders and
their generated command, stream, queue, and worker projections. Define AI
behavior with native `@purista/harness`, mount selected targets in a service,
and add normal Framework primitives only where the application needs them.

There is no runtime compatibility layer. Migrate the whole service boundary in
one release and verify every caller before deployment.

## 1. Align packages and generated code

Upgrade `@purista/core`, CLI, transport packages, and `@purista/harness` as
one version set. Regenerate or manually update CLI-owned AI scaffolds. Install
the provider packages used by the composition root and the optional
`@purista/harness-ai-sdk-ui` adapter only when a browser endpoint needs it.

## 2. Replace AgentQueueBuilder with a Harness definition

Move model requirements, schemas, agents, workflows, tools, skills, MCP
servers, guardrails, and portable runtime policy into one native definition:

```ts title="Define a native Harness agent"
export const supportHarness = defineHarness({ name: 'support' })
  .requireModel('primary', { capabilities: ['object'] })
  .agent('triage_ticket', {
    input: triageInput,
    output: triageOutput,
    model: 'primary',
    instructions: 'Classify one support ticket.',
    updates: 'none',
  })
  .define()
```

Delete v3 `getAgentQueueBuilder`, `addAgentDefinition`,
`setHarnessAgent`, `setHarnessWorkflow`, `setRunFunction`, response-mode,
and generated-projection configuration.

## 3. Mount selected targets

```ts title="Mount selected targets"
export const supportV1Service = supportV1ServiceBuilder
  .addCommandDefinition(triageTicketCommandBuilder.getDefinition())
  .mountHarness(supportHarness, {
    publish: { agents: ['triage_ticket'] },
  })
```

Bind host tools with `commandAsHarnessTool(...)` or
`getHarnessHostToolBuilder(...)`. Put target-specific business authorization
in mount before/after guards. Use `successEvent` only for the fact that a
target completed successfully.

## 4. Replace generated callers

Declare the service name, version, target, and exported Harness contract:

```ts title="Declare the target address"
const triageCommandBuilder = supportV1ServiceBuilder
  .getCommandBuilder('triageTicket', 'Classifies a support ticket')
  .canInvokeAgent(
  'Support',
  '1',
  'triage_ticket',
  supportHarness.contracts.agents.triage_ticket,
  )
```

Then call `context.agent.Support['1'].triage_ticket.run(input)` or
`.stream(input)`. All calls cross EventBridge. Remove same-process shortcuts
and definition-object invocation.

The aggregate result is a `RunOutcome`. Handle `completed`, `interrupted`,
and other terminal states explicitly. Approval and external waits are
interrupted outcomes, not thrown errors.

## 5. Recreate only needed application contracts

Create a normal command for bounded request/response, a normal stream for live
updates, or a queue and worker for durable admission/retry. Mounting no longer
creates all four.

For browser chat, map the portable execution stream with
`@purista/harness-ai-sdk-ui/v1`, declare
`ai-sdk-ui-message-stream-v1`, and send the
`x-vercel-ai-ui-message-stream: v1` header. The client can use AI SDK
`useChat` and AI Elements without a PURISTA client package.

## 6. Move runtime bindings

Supply concrete adapters under `getInstance(eventBridge, { ai: ... })`:
models, admission, artifacts, telemetry, Harness storage, sandbox,
sandboxBinding, memory, and workspace. PURISTA StateStore does not replace
Harness persistence, and domain records belong behind database resources.

## 7. Replace tests

- Test the portable definition with `FakeModelProvider`.
- Test commands, streams, and workers with PURISTA context mocks and
  address-first target stubs.
- Test the UI Message Stream v1 adapter with deterministic execution events.
- Test authentication, public/protected metadata, business guards, host-tool
  identity propagation, interruptions, and cancellation.

## Release verification

Before deployment, search application and documentation sources for the removed
v3 API names. Build and test all packages, export contracts, start the real
composition root with production-like adapters, and exercise aggregate,
streaming, queued, approval, and shutdown paths. Roll back the whole release if
any consumer still expects a generated agent projection.
