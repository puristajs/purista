---
title: Test scheduled behavior
description: Prove schedule metadata, event-to-queue mapping, worker idempotency, and the selected scheduler platform at the boundaries that actually own them.
order: 365
---

There is no generic scheduler runtime or schedule test harness in core. Test
the contract as data, test the target with its own primitive helper, then use a
real platform integration test for the trigger that deploys it.

| Boundary | Proves | Does not prove |
| --- | --- | --- |
| Schedule definition unit test | Target kind/name, expression object, default policies, enabled intent, provider hints | Cron execution, timezone behavior, platform permission, or target delivery |
| Event-to-queue/runtime test | Payload mapping, idempotency strategy, enqueue-failure behavior, QueueBridge capability validation | A deployed scheduler's trigger timing |
| Command/worker deterministic test | Business key, result, retry/DLQ behavior, duplicate-safe effect | Platform cron, provider availability, or exactly-once delivery |
| Selected scheduler integration | One real deployed trigger reaches its target with the expected identity/permissions | Another platform's behavior or business-effect correctness |

```ts title="src/service/billing/v1/monthlyBillingSchedule.test.ts"
import { expect, test } from 'vitest'
import { monthlyBillingSchedule } from './monthlyBillingSchedule.js'

test('exports the disabled monthly billing event contract', () => {
  expect(monthlyBillingSchedule).toMatchObject({
    targetKind: 'event',
    targetName: 'billing.monthlyCycleDue',
    concurrencyPolicy: 'forbid',
    missedRunPolicy: 'runOnce',
    enabledByDefault: false,
  })
})
```

Use the [queue test guide](/handbook/framework/build-services/queues-and-workers/test-queued-work/)
for the job/worker boundary and test the selected external platform in its
deployment environment. A passing metadata assertion is not proof that any
schedule is enabled or will fire.

For exact types, see [ScheduleDefinitionBuilder](/handbook/api/classes/_purista_core.ScheduleDefinitionBuilder/).
