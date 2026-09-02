---
title: Test AI-powered services deterministically
description: Test portable Harness behavior with a fake model, PURISTA consumers with context stubs, and protocol adapters at their own boundary.
order: 3992
---

Keep tests at the same boundaries as the architecture.

## Test the Harness definition

Instantiate the portable definition with `FakeModelProvider` and scripted
responses. Verify schemas, tool selection, guardrails, workflow transitions,
interruptions, and the final `RunOutcome` without network credentials.

## Test the PURISTA consumer

Use `createCommandContextMock`, `createStreamContextMock`, or the matching
worker helper. Stub the declared address-first client:

```ts title="Stub an address-first agent call"
const { context, stubs } = createCommandContextMock(triageTicketCommandBuilder, {
  payload,
  parameter: {},
})

stubs.agent.Support['1'].triage_ticket.run.resolves({
  status: 'completed',
  runId: 'run-1',
  output: { priority: 'high', reason: 'Time-sensitive account failure' },
})

await expect(
  triageTicketCommandBuilder.getCommandFunction().call({} as never, context, payload, {}),
).resolves.toMatchObject({ priority: 'high' })
```

Also test interrupted outcomes, business guards, identity propagation, resource
failures, and success-event policy. These tests should not call a live model.

## Test the HTTP protocol adapter

Feed deterministic `ExecutionEvent` fixtures into the AI SDK UI Message Stream
v1 adapter. Assert the response header, SSE frames, tool and approval states,
terminal message, cancellation, and error mapping. Add one Hono integration test
for protected and public routing.
