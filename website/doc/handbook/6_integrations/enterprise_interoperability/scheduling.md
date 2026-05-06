---
title: Scheduling
description: Declare schedule intent without making PURISTA the production scheduler.
order: 610010
---

# Scheduling

Schedules are trigger contracts. They describe when a scheduler should emit an event, enqueue a queue job, or invoke a short command.

Prefer event targets for business facts:

```ts
const schedule = service
  .getScheduleBuilder('monthlyBillingCycle', 'Monthly billing cycle trigger')
  .emitEvent('billing.monthlyCycleDue', {
    expression: { kind: 'cron', value: '0 2 1 * *' },
    timezone: 'Europe/Berlin',
    concurrencyPolicy: 'forbid',
    missedRunPolicy: 'runOnce',
    idempotencyKey: 'payload.cycleId',
    payloadSchema: billingCycleDuePayloadSchema,
  })

service.addScheduleDefinition(schedule)
```

Use queue targets when the scheduled trigger is exactly one durable background task. Use command targets only for short idempotent logic.

Production schedule state, missed-run recovery, and provider-specific deployment remain outside PURISTA. Exporters can turn this metadata into provider-neutral manifests or provider hints later.

The billing-cycle example uses a local runner to emit the scheduled event through `DefaultEventBridge`.
