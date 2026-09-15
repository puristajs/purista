---
title: Enqueue and schedule jobs
description: Declare a queue client, submit a validated job with safe delivery options, and distinguish delayed work from scheduler metadata.
order: 352
---

Producers use a declared [`canEnqueue(...)` capability](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#canenqueue). The declaration makes the target
visible in the handler context and provides the payload/parameter schemas used
at the Framework enqueue boundary.

```ts title="src/service/report/v1/command/requestReport.ts"
export const requestReportCommandBuilder = reportV1ServiceBuilder
  .getCommandBuilder('requestReport', 'Accept report generation')
  .canEnqueue('generateReport', reportJobPayloadSchema, reportJobParameterSchema)
  .setCommandFunction(async function (context, payload, parameter) {
    const job = await context.queue.enqueue.generateReport(payload, parameter, {
      idempotencyKey: `report:${payload.reportId}`,
    })
    return { jobId: job.jobId, queueName: job.queueName }
  })
```

| Builder call | Parameters, default, and effect |
| --- | --- |
| [`getCommandBuilder(name, description, successEventName?)`](/handbook/api/classes/_purista_core.ServiceBuilder/#getcommandbuilder) | `name` must be non-empty and becomes the command target; `description` is the contract description. The optional third argument declares the command’s success event, not a queue result event. Omit it when accepting a job is not itself an event other services should consume. The returned builder must later be registered with [`addCommandDefinition(...)`](/handbook/api/classes/_purista_core.ServiceBuilder/#addcommanddefinition) before service definition resolution. |
| [`canEnqueue(queueName, payloadSchema?, parameterSchema?)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#canenqueue) | `queueName` must be non-empty. The optional schemas validate Framework-mediated submissions and give `context.queue.enqueue.<queueName>` its payload and parameter type. The declaration does not create or register the target queue. |
| [`setCommandFunction(handler)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#setcommandfunction) | Required service-bound `async function (context, payload, parameter)`. It receives the declared queue client and returns the command result; an arrow function is rejected because it cannot receive the service as `this`. A missing handler makes `getDefinition()` fail. |

Workers declare and use the same capability with `QueueWorkerBuilder.canEnqueue(...)`.
The generic form is also available: `context.queue.enqueue(queueName, payload,
parameter?, options?)`. An undeclared queue is rejected by the runtime; a
declared queue that the service has not registered is not found.

The target queue must belong to that same service instance. Use an event plus
`bindEventToQueue(...)` when another service owns the queue.

## Pick delivery options from the business need

| Option | Meaning | Caveat |
| --- | --- | --- |
| `delayMs` | Delay before the job is available | The selected bridge must support meaningful delayed delivery. |
| `idempotencyKey` | Stable duplicate-acceptance key | `DefaultQueueBridge` stores the key but does not deduplicate. Redis and NATS queue bridges enforce it. It never makes the business effect exactly-once. |
| `headers` | Safe low-cardinality transport metadata | Never place secrets, raw HTTP headers, or sensitive data here. |
| `maxAttempts` | Override lifecycle attempt limit for this job | Recovery still follows the queue lifecycle policy. |
| `priority` | Carried provider hint | No currently shipped QueueBridge implements priority ordering (`priorities: false` on Default, Redis, and NATS). The value is metadata only. |
| `leaseTtlMs` | Initial lease duration | Prefer lifecycle configuration for normal policy. |

Use a business identifier for the idempotency key—such as one report per
report ID—not an auto-generated queue message ID. Test duplicate acceptance
against the selected QueueBridge and make the downstream side effect idempotent
as well.

Local tests using `DefaultQueueBridge` cannot prove duplicate rejection: each
enqueue receives a new job ID even when the key repeats. Run that assertion
against Redis or NATS when the application depends on acceptance deduplication.

## Send work later or on a schedule

For one delayed job, call `context.queue.scheduleAt(queueName, runAt, payload,
parameter?, options?)`; the runtime derives its delay from the `Date` or epoch
time. This still needs a bridge with delayed-delivery support.

For recurring work, put schedule metadata on the queue:

```ts title="src/service/report/v1/queue/generateReport.ts"
export const nightlyReportQueueBuilder = generateReportQueueBuilder.markSchedulable({
  name: 'nightly-report',
  expression: { kind: 'cron', value: '0 2 * * *', timezone: 'Europe/Berlin' },
  concurrencyPolicy: 'forbid',
  missedRunPolicy: 'skip',
})
```

[`markSchedulable(...)`](/handbook/api/classes/_purista_core.QueueDefinitionBuilder/#markschedulable) creates a definition only. It does not start an
in-process scheduler. Provider export, deployment, overlap, and missed-run
behaviour belong to [Schedule work](/handbook/framework/build-services/schedule-work/).

`expression` is a discriminated schedule value: use `{ kind: 'cron', value,
timezone? }` for a calendar rule, `{ kind: 'interval', everyMs }` for a fixed
cadence, or `{ kind: 'oneShot', runAt }` for one future run. The optional
top-level `timezone` is scheduler metadata; keep the timezone with the cron
expression when the rule itself needs an explicit local calendar.

The queue's [`setBeforeEnqueueTransform(...)`](/handbook/api/classes/_purista_core.QueueDefinitionBuilder/#setbeforeenqueuetransform) runs after Framework schema
validation and before bridge submission. It can normalize trusted values, but
its output is not revalidated; preserve the contract or validate shape changes
yourself.

For signatures, see [QueueWorkerBuilder](/handbook/api/classes/_purista_core.QueueWorkerBuilder/) and [QueueDefinitionBuilder](/handbook/api/classes/_purista_core.QueueDefinitionBuilder/).
