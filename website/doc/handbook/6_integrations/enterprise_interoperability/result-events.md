---
title: Result events
description: Emit queue worker completion as typed events for downstream subscriptions.
order: 610040
---

# Result events

Queue completion can be exposed through result events. A result event is a normal PURISTA custom event, so downstream services consume it with ordinary subscriptions.

```ts
const queue = service
  .getQueueBuilder('billing.monthlyClosing', 'Close a monthly billing cycle')
  .emitResultAsEvent('billing.monthlyClosing.completed', {
    failureEventName: 'billing.monthlyClosing.failed',
    delivery: 'required',
  })
```

Result payloads should include queue identity, status, attempt, trace/correlation metadata, tenant/principal metadata, and the worker output that subscribers need.

```ts
const subscription = service
  .getSubscriptionBuilder('recordBillingResult', 'Record completed billing cycles')
  .subscribeToEvent('billing.monthlyClosing.completed')
  .addPayloadSchema(billingClosingCompletedPayloadSchema)
  .setSubscriptionFunction(async function (context, payload) {
    await context.resources.ledger.record(payload)
  })
```

Use `delivery: 'required'` when result delivery must happen before the queue job is acknowledged. Use `best-effort` when completion should ack even if result delivery fails.

Result subscribers should remain idempotent because a worker may emit the result and then fail before the queue ack is persisted.
