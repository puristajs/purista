---
title: Create a schedule and choose a target
description: Define an external schedule contract and select the event, queue, or command target that matches the scheduled outcome.
order: 361
---

[`getScheduleBuilder(name, description)`](/handbook/api/classes/_purista_core.ServiceBuilder/#getschedulebuilder) creates provider-neutral metadata.
Choose exactly one target method; every method requires a non-empty target name
and returns a `ScheduleDefinition` to register with `addScheduleDefinition(...)`.

```ts title="src/service/billing/v1/monthlyBillingSchedule.ts"
export const monthlyBillingSchedule = billingV1ServiceBuilder
  .getScheduleBuilder('monthlyBillingCycle', 'Start one monthly billing cycle')
  .emitEvent('billing.monthlyCycleDue', {
    expression: { kind: 'cron', value: '0 2 1 * *', timezone: 'Europe/Berlin' },
    concurrencyPolicy: 'forbid',
    missedRunPolicy: 'runOnce',
    enabledByDefault: false,
  })

export const billingV1Service = billingV1ServiceBuilder
  .addScheduleDefinition(monthlyBillingSchedule)
```

`addScheduleDefinition(definition)` is the final service-assembly step: it
accepts the already-created schedule definition and must run before the
service resolves definitions through `getInstance(...)`, `resolveDefinitions()`,
or a definition lookup. It records export/deployment metadata; it does not
start a scheduler. See [`addScheduleDefinition(...)`](/handbook/api/classes/_purista_core.ServiceBuilder/#addscheduledefinition)
for the exact signature and [Add definitions to a service](/handbook/framework/build-services/services/add-definitions-to-a-service/)
for the immutable assembly boundary.

| Target method | Use it when | Avoid it when |
| --- | --- | --- |
| [`emitEvent(eventName, options)`](/handbook/api/classes/_purista_core.ScheduleDefinitionBuilder/#emitevent) | The trigger is a business fact or multiple consumers may react | You need only one internal durable job and no observable event. |
| [`enqueueQueue(queueName, options)`](/handbook/api/classes/_purista_core.ScheduleDefinitionBuilder/#enqueuequeue) | One job needs queue lifecycle/retry handling | An independent consumer needs the time trigger as an event. |
| [`invokeCommand(commandName, options)`](/handbook/api/classes/_purista_core.ScheduleDefinitionBuilder/#invokecommand) | The trigger can finish quickly and idempotently | Work may outlive a scheduler timeout or needs durable retries. |

## Set provider-neutral scheduling intent

| Option | Required/default | Meaning |
| --- | --- | --- |
| `expression` | Required | `{ kind: 'cron', value, timezone? }`, `{ kind: 'interval', everyMs }`, or `{ kind: 'oneShot', runAt }`. |
| `timezone` | Optional | Additional provider metadata; check the chosen provider's timezone behavior. |
| `concurrencyPolicy` | `allow` | `allow`, `forbid`, or `replace` overlap intent. |
| `missedRunPolicy` | `skip` | `skip`, `runOnce`, or `backfill` recovery intent. |
| `maxCatchUpCount`, `jitterWindowMs` | Optional | Bound recovery and request trigger jitter. |
| `idempotencyKey` | Optional string | Scheduler metadata, not business exactly-once execution. |
| `enabledByDefault` | `true` | Generated/platform deployment default; it does not start a local scheduler. |
| schemas and `providerHints` | Optional | Contract/export metadata, not runtime scheduling configuration. |

The builder does not validate a provider's cron dialect, timezone database,
permissions, or overlap support. Treat those as adapter/platform verification.

## Let a command or queue own its schedule when it is the only target

Use the standalone schedule builder for an event that may fan out. When a
single command or queue owns both the work and its time trigger, attach the
same schedule options to that definition with `markSchedulable(...)`; its
definition export includes the schedule automatically.

```ts title="src/service/billing/v1/queue/monthlyClosingQueueBuilder.ts"
export const monthlyClosingQueueBuilder = billingV1ServiceBuilder
  .getQueueBuilder('billing.monthlyClosing', 'Close the monthly billing cycle')
  .markSchedulable({
    name: 'monthlyBillingClosing',
    description: 'Queue monthly billing closing',
    expression: { kind: 'cron', value: '0 2 1 * *', timezone: 'Europe/Berlin' },
    enabledByDefault: false,
  })
```

[`getQueueBuilder(queueName, description)`](/handbook/api/classes/_purista_core.ServiceBuilder/#getqueuebuilder)
requires a non-empty queue name and takes a human-readable queue description.
It creates the queue contract, not a scheduler and not a worker. The schedule
metadata only reaches service definition resolution when the queue’s
`getDefinition()` promise is registered:

```ts title="src/service/billing/v1/billingV1Service.ts"
export const billingV1ServiceWithScheduledQueue = billingV1ServiceBuilder
  .addQueueDefinition(monthlyClosingQueueBuilder.getDefinition())
```

[`addQueueDefinition(...)`](/handbook/api/classes/_purista_core.ServiceBuilder/#addqueuedefinition)
must run before `getInstance(...)` or `resolveDefinitions()`; adding it later
throws. Register a matching worker in the service that owns execution, as
shown in [Create a queue and worker](/handbook/framework/build-services/queues-and-workers/create-a-queue-and-worker/).

[`CommandDefinitionBuilder.markSchedulable(...)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#markschedulable)
and [`QueueDefinitionBuilder.markSchedulable(...)`](/handbook/api/classes/_purista_core.QueueDefinitionBuilder/#markschedulable)
accept the same `ScheduleOptions` plus the required schedule `name` and optional
description. Prefer the queue form when the work needs durable retries; prefer
the command form only for short, idempotent work. Neither form starts a local
scheduler or constructs a payload—the deployed trigger owns both.

Next: [emit, enqueue, or invoke on a schedule](/handbook/framework/build-services/schedule-event-queue-result/emit-enqueue-or-invoke-on-a-schedule/).
