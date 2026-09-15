---
title: Test AI-powered services deterministically
description: Test portable graphs, mounted service integration, and HTTP protocol adapters without provider credentials.
order: 3992
---

Keep each test at the boundary it owns.

## Test portable graphs

Instantiate a portable agent or workflow with `FakeModelProvider` and scripted
responses. Test schemas, tool selection, guardrails, workflow transitions,
interruptions, and final outcomes without network credentials. Use this
standalone style only when the graph contains portable tools and dependencies.

## Test service-owned tools and mounted targets

A tool created with `ServiceBuilder.defineTool(...)` needs PURISTA context.
Test it through a mounted service with deterministic EventBridge and service
resources. This verifies capability declarations, trusted identity, target
guards, resource access, and result publication.

A command, stream, or worker that calls a target can use the matching context
mock. Stub the declared address-first client with the complete result envelope:

```ts title="Stub an address-first agent call"
const { context, stubs } = createCommandContextMock(triageTicketCommandBuilder, {
  payload,
  parameter: {},
})

stubs.agent.Support['1'].triageTicket.run.resolves({
  sessionId: 'session-1',
  outcome: {
    status: 'completed',
    runId: 'run-1',
    output: { priority: 'high', reason: 'Time-sensitive account failure' },
  },
})
```

Also test interrupted outcomes and cancellation. These tests must not call a
live model.

## Test HTTP projections

Test an aggregate command with completed and interrupted envelopes. For an AI
SDK UI Message Stream v1 projection, pass deterministic Harness events through
the adapter and assert request conversion, resume forwarding, SSE records, the
protocol header, completion, and cancellation. Add a Hono integration test for
protected and public routing. No provider credential is needed.
