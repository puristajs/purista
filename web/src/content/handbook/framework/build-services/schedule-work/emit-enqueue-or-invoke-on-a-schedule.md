---
title: Emit, enqueue, or invoke on a schedule
description: Turn a scheduled trigger into an observable event, a durable job, or short command logic without making the scheduler own business recovery.
order: 362
---

For important long-running business work, prefer schedule → event → queue. The
event makes the trigger observable; the queue isolates execution and retry from
the scheduler platform.

```ts title="src/service/billing/v1/billingV1Service.ts"
export const billingV1Service = billingV1ServiceBuilder
  .addScheduleDefinition(monthlyBillingSchedule)
  .bindEventToQueue('billing.monthlyCycleDue', 'billing.monthlyClosing', {
    idempotencyMode: 'strict',
    idempotencyKey: 'correlationId',
    mapPayload: event => event,
  })
```

[`addScheduleDefinition(...schedules)`](/handbook/api/classes/_purista_core.ServiceBuilder/#addscheduledefinition)
accepts one or more already-created schedule definitions and adds their
provider-neutral contracts to this service. It only assembles definition
metadata: it neither creates an EventBridge event nor starts an external
scheduler. Add it before `resolveDefinitions()`, `getInstance(...)`, or a test
helper resolves the service; a later call throws because the assembled
definitions are immutable.

[`bindEventToQueue(...)`](/handbook/api/classes/_purista_core.ServiceBuilder/#bindeventtoqueue) creates an event-to-queue handoff. Its default
`idempotencyMode` is `advisory`; `strict` requires a QueueBridge that declares
idempotency enforcement and can fail startup when capability validation is
strict. `idempotencyKey` accepts `messageId`, `correlationId`, `eventField`,
`none`, or a function. `mapPayload`, `mapParameter`, and `onEnqueueFailure`
make the queued contract and recovery explicit.

The schedule definition records payload and parameter schemas for export, but
does not construct or validate scheduled input at runtime. The external trigger
must emit a `billing.monthlyCycleDue` event that matches the application’s
published contract. Use a custom key function only after the event shape is
known and validated at the receiving boundary; `bindEventToQueue` currently
receives the event as an untyped transport value.

Keep the scheduled event payload and idempotency key safe: do not derive a key
from raw headers, secrets, or sensitive payload fields. A bridge accepting one
key once does not make the worker's business effect exactly-once.

For a direct target, register the schedule returned by `enqueueQueue(...)` or
`invokeCommand(...)`. The target service/queue must exist in the deployed
runtime; the schedule metadata itself does not verify it. See [Queues and
workers](/handbook/framework/build-services/queues-and-workers/) for the
durable job lifecycle.
