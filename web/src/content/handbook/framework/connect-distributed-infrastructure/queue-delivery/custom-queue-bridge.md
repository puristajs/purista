---
title: Build a custom QueueBridge
description: Implement a queue adapter only when its leasing, retry, dead-letter, and idempotency guarantees can be represented honestly.
order: 724
---

Build a custom `QueueBridge` when neither the included bridge nor Redis/NATS
fits the provider or operational boundary. The adapter owns job persistence,
visibility, leases, acknowledgement, recovery, dead-letter operations, and
its declared capability contract. A queue definition and worker remain owned
by the service.

There is no base queue class. Implement the small public `QueueBridge`
interface directly and make lifecycle explicit.

```ts title="src/infrastructure/queue/acmeQueueCapabilities.ts"
import type { QueueBridgeCapabilities } from '@purista/core'

export const acmeQueueCapabilities = {
    delayedDelivery: true,
    fifoOrdering: true,
    partitions: false,
    priorities: false,
    deadLetterNative: true,
    exactlyOnce: false,
    maxBatchSize: 1,
    deadLetterInspectable: true,
    deadLetterInspectSupported: true,
    deadLetterReplaySupported: true,
    deadLetterPurgeSupported: true,
    leaseInspectionSupported: true,
    idempotencyEnforcement: true,
    partitionOrdering: false,
    providerManagedDelayedDelivery: true,
    strictStartupValidation: true,
} as const satisfies QueueBridgeCapabilities
```

The capabilities are a typed declaration for the concrete adapter. The class
must still implement the complete `QueueBridge` interface; there is no queue
base class. Use the exact interface links below for the signatures. Do not
publish an adapter that accepts jobs but cannot settle,
recover, or inspect the work it advertises as durable.

## Implement the lease lifecycle

| Phase | Methods | Required behavior |
| --- | --- | --- |
| Connect | `start`, `isReady`, `isHealthy`, `destroy` | Refuse normal operations until the provider is ready; stop pollers/background recovery and close connections on destroy. |
| Accept work | `enqueue(options)` | Store the validated payload/parameter, safe headers, delay, maximum attempts, lease TTL, and idempotency key. Return the accepted `jobId`, queue name, and scheduled time. |
| Lease work | `leaseNext(queueName, options?)`, `extendLease` | Return only available work; make lease expiry recoverable; respect the advertised batch/long-poll capability. |
| Settle work | `ack`, `nack` | Ack removes a successful lease. Nack schedules a retry or moves the job to dead letter when attempts are exhausted. A lost worker must not leave a job invisible forever. |
| Repair work | `moveToDeadLetter`, `peekDeadLetter`, `redriveDeadLetter`, `purgeDeadLetter`, `inspectLeases` | Implement an operation only if its capability says it is supported; return an explicit safe failure or empty inspection result where the interface contract requires it. |
| Operate | `metrics(queueName)` | Report pending, leased/in-flight, delayed/retry, and dead-letter state in a way operators can reconcile with provider state. |

Exact interface lookups:

- lifecycle: [`start`](/handbook/api/interfaces/_purista_core.QueueBridge/#start),
  [`isReady`](/handbook/api/interfaces/_purista_core.QueueBridge/#isready),
  [`isHealthy`](/handbook/api/interfaces/_purista_core.QueueBridge/#ishealthy), and
  [`destroy`](/handbook/api/interfaces/_purista_core.QueueBridge/#destroy);
- acceptance and leases: [`enqueue`](/handbook/api/interfaces/_purista_core.QueueBridge/#enqueue),
  [`leaseNext`](/handbook/api/interfaces/_purista_core.QueueBridge/#leasenext), and
  [`extendLease`](/handbook/api/interfaces/_purista_core.QueueBridge/#extendlease);
- settlement: [`ack`](/handbook/api/interfaces/_purista_core.QueueBridge/#ack),
  [`nack`](/handbook/api/interfaces/_purista_core.QueueBridge/#nack), and
  [`moveToDeadLetter`](/handbook/api/interfaces/_purista_core.QueueBridge/#movetodeadletter);
- operations: [`peekDeadLetter`](/handbook/api/interfaces/_purista_core.QueueBridge/#peekdeadletter),
  [`redriveDeadLetter`](/handbook/api/interfaces/_purista_core.QueueBridge/#redrivedeadletter),
  [`purgeDeadLetter`](/handbook/api/interfaces/_purista_core.QueueBridge/#purgedeadletter),
  [`inspectLeases`](/handbook/api/interfaces/_purista_core.QueueBridge/#inspectleases), and
  [`metrics`](/handbook/api/interfaces/_purista_core.QueueBridge/#metrics).

Use [`QueueBridge`](/handbook/api/interfaces/_purista_core.QueueBridge/),
[`QueueBridgeCapabilities`](/handbook/api/types/_purista_core.QueueBridgeCapabilities/),
[`QueueEnqueueOptions`](/handbook/api/types/_purista_core.QueueEnqueueOptions/),
and [`QueueRetryRequest`](/handbook/api/types/_purista_core.QueueRetryRequest/)
as the implementation contract.

The `QueueEnqueueOptions` fields are `queueName`, `payload`, optional
`parameter`, `delayMs`, `idempotencyKey`, safe string `headers`, `maxAttempts`,
`priority`, and `leaseTtlMs`. A `QueueRetryRequest` has only a safe `reason`
and optional `delayMs`. Never persist credentials, raw HTTP headers, prompts,
or customer content in headers or retry/dead-letter reasons.

## Report only enforceable guarantees

Capabilities are evaluated when a service starts. They are not marketing
metadata.

| Capability | Meaning when `true` | Common false positive |
| --- | --- | --- |
| `idempotencyEnforcement` | A duplicate `queueName` + idempotency key returns the original job result instead of accepting new work | Deduplicating only inside one worker process |
| `providerManagedDelayedDelivery` | The provider, rather than a local timer/poller alone, retains delayed jobs through the stated recovery boundary | A JavaScript timeout in the application process |
| DLQ inspection/replay/purge | The corresponding operator operation is safe and implemented | A provider DLQ that exists but has no supported application control path |
| `leaseInspectionSupported` | Active leases can be inspected consistently enough for operations | Listing jobs without knowing whether they are leased |
| `exactlyOnce` | The provider truly guarantees exactly-once queue delivery | An idempotency key or an at-least-once broker; official PURISTA bridges report this as `false` |

Even with strict enqueue idempotency, worker execution remains at least once
around a lease timeout or process failure. Make the worker's database write or
provider call idempotent with a business key, and record the outcome before
acknowledging the job.

## Wire and test the real boundary

After the concrete adapter implements `QueueBridge`, construct and start it at
the composition root before starting services that receive it. The capabilities
object above belongs to that concrete adapter; it is not a runnable queue
bridge by itself.

In a real provider environment, test enqueue, delayed visibility, lease expiry,
ack, retry, max-attempt dead-lettering, every advertised repair operation, and
duplicate strict enqueue. Kill a worker after it acquires a lease and prove the
job becomes recoverable. Then verify that a queue definition requiring an
unsupported capability fails during service startup instead of silently
degrading.

Next: return to [Queue delivery](/handbook/framework/connect-distributed-infrastructure/queue-delivery/) or [create a queue and worker](/handbook/framework/build-services/queues-and-workers/create-a-queue-and-worker/).
