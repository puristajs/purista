---
title: Event-to-queue
description: Hand off event reactions to durable queue work without long-running subscriptions.
order: 610020
---

# Event-to-queue

Subscriptions should stay bounded. If reacting to an event may take minutes, hours, retries, or operator replay, bind the event to a queue and let a worker own the long-running work.

```ts
service.bindEventToQueue('billing.monthlyCycleDue', 'billing.monthlyClosing', {
  idempotencyMode: 'advisory',
  idempotencyKey: event => `billing-cycle:${event.cycleId}`,
  mapPayload: event => ({
    cycleId: event.cycleId,
    periodStart: event.periodStart,
    periodEnd: event.periodEnd,
  }),
  mapParameter: event => ({ tenantId: event.tenantId }),
  onEnqueueFailure: { delayMs: 60_000, reason: 'billing_cycle_enqueue_failed' },
})
```

Runtime semantics:

1. the event bridge delivers the source event
2. the binding maps event data to queue payload and parameter
3. the queue bridge enqueues the job with trace, correlation, tenant, and idempotency metadata
4. when the event bridge supports durable subscriptions and manual acknowledgement, the generated subscription acknowledges after enqueue succeeds

If the active event bridge does not support durable/manual-ack subscriptions, PURISTA still registers the binding in an API-compatible mode using the bridge's best available semantics. For `DefaultEventBridge`, this means an in-memory, auto-ack subscription. That is useful for local development and tests, but it cannot guarantee source-event redelivery if the process exits between event delivery and queue enqueue.

`advisory` idempotency passes the key to the queue message and requires business-level dedupe. `strict` mode should only be used with a queue bridge that can enforce idempotency.

Capability checks:

| capability | needed for strongest handoff |
| --- | --- |
| event bridge durable subscriptions | source event survives consumer restart |
| event bridge manual acknowledgement | ack can happen only after enqueue succeeds |
| queue bridge durability | queued job survives process restart |
| queue bridge idempotency enforcement | required for `idempotencyMode: 'strict'` |

See [Subscriptions](../../2_building_business-logic/subscription/) for bounded reactions and [Queues](../../2_building_business-logic/queue/) for durable work.
