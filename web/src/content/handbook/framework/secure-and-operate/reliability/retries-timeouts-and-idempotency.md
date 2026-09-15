---
title: Retries, timeouts, and idempotency
description: Retry only transient, repeat-safe work and make the idempotency boundary visible in the contract.
order: 1032
---

Retries change correctness. A network timeout can occur after a payment,
notification, or record write already happened, so a retry is safe only when
the downstream business effect has an explicit idempotency or reconciliation
boundary. Move slow work to a queue when the caller can accept a job reference
instead of a completed result.

## Enqueue one business operation with a stable key

For a report-generation request, derive the queue key from the operation's
business identity—not an attempt ID or the current timestamp. The key is part
of the public operation contract and must remain stable when the caller retries
the same request. The surrounding command declares its payload, output, and
`generateReport` queue contract as shown in [Queues and workers](/handbook/framework/build-services/queues-and-workers/).

```ts title="src/service/report/v1/command/requestReport/requestReportCommandBuilder.ts"
export const requestReportCommandBuilder = reportV1ServiceBuilder
  .getCommandBuilder('requestReport', 'Accept report generation')
  .canEnqueue('generateReport', generateReportPayloadSchema)
  .setCommandFunction(async function (context, payload) {
    const job = await context.queue.enqueue.generateReport(
      { reportId: payload.reportId },
      undefined,
      { idempotencyKey: `report-generation:${payload.reportId}` },
    )

    return { jobId: job.jobId }
  })
```

[`getCommandBuilder(name, description, eventName?)`](/handbook/api/classes/_purista_core.ServiceBuilder/#getcommandbuilder)
starts the stable service-local acceptance operation. Its optional `eventName`
is for a canonical success event, not the queue name. [`canEnqueue(name,
payloadSchema?, parameterSchema?)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#canenqueue)
adds the typed queue client used by this handler; the queue name must be
non-empty, and its optional schemas type the enqueue payload and parameters.
It does not create the queue, worker, persistence, or retry policy. [`setCommandFunction(handler)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#setcommandfunction)
installs the required service-bound, non-arrow `async function`; Core rejects
arrow handlers and cannot assemble a definition without it. The surrounding
command must also declare payload and output schemas when this acceptance
operation crosses a public contract, as shown in [Queues and workers](/handbook/framework/build-services/queues-and-workers/).

Redis and NATS QueueBridge adapters return the original job ID instead of
creating another job when the same queue and idempotency key are enqueued again.
Without a key, normal enqueue behavior applies. This protects queue publication;
the worker must still make its database/API side effect idempotent because a
lease can expire after the side effect and before `complete()`.

## Decide every failure path before enabling retries

| Situation | Safe decision |
| --- | --- |
| Caller-facing request exceeds its budget | Return a bounded timeout or accepted job reference; do not leave the client guessing whether work continues. |
| Temporary broker or provider failure | Retry with a bounded policy only after the handler/side effect is repeat-safe. |
| Validation, authorization, or permanent business error | Do not retry blindly; reject or route to the defined repair/DLQ path. |
| Worker crashes after side effect, before acknowledgement | Reconcile via the same business key before performing the side effect again. |
| Poisoned payload/version | Quarantine it, repair data/code/configuration, then replay a scoped set with audit approval. |

## Test the actual promise

Use the queue-worker test harness to prove handler success, retryable failure,
and no duplicate side effect for an already-recorded business key. Then run the
selected Redis/NATS adapter integration test against protected non-production
infrastructure to prove lease expiry, redelivery, delayed delivery, DLQ, and
idempotent enqueue behavior. A core/default-bridge test cannot prove those
broker guarantees.

Next: [delivery semantics](/handbook/framework/secure-and-operate/reliability/delivery-semantics/)
and [recovery and replay](/handbook/framework/secure-and-operate/reliability/recovery-and-replay/).
