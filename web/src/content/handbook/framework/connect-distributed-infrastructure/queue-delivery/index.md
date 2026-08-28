---
title: Queue delivery
description: Choose a QueueBridge for jobs that must outlive the request path and recover safely from failure.
order: 720
---

A QueueBridge stores jobs, leases work to workers, and can provide retries, delayed delivery, dead-letter handling, and idempotency. The queue definition remains service-owned; the bridge is application infrastructure.

| Bridge | Availability | What it can prove | Main limit |
| --- | --- | --- | --- |
| Default | Included in core | Local FIFO, delay, lease recovery, and dead-letter flow | Everything disappears with the process; no idempotency-key enforcement |
| Redis | `@purista/redis-queue-bridge` + Redis | Durable jobs, leases, delayed jobs, inspectable/replayable DLQ, duplicate enqueue returns the original job ID | Still at-least-once worker execution; external side effects must be idempotent |
| NATS | `@purista/nats-queue-bridge` + JetStream | Durable pull workers, delayed jobs, inspectable/replayable DLQ, duplicate enqueue returns the original job ID | Still at-least-once worker execution; JetStream is mandatory |
| Custom | Application-owned adapter | A provider with complete, verified leasing and recovery semantics | You own persistence, settlement, capability truthfulness, and repair support |

Pass the selected bridge when creating the service. Installing it without this runtime wiring leaves the service on its default QueueBridge.

`idempotencyEnforcement` means the **enqueue** boundary deduplicates the same
queue/idempotency key. It does not make a later provider call, database write,
or worker execution exactly once. Keep the worker's business effect
idempotent, then select [Redis](/handbook/framework/connect-distributed-infrastructure/queue-delivery/redis/)
or [NATS JetStream](/handbook/framework/connect-distributed-infrastructure/queue-delivery/nats/)
when that enqueue guarantee is required.

Next: [chapter overview](/handbook/framework/connect-distributed-infrastructure/), or return to [queues and workers](/handbook/framework/build-services/queues-and-workers/) to define the job and worker contract.

When the supported adapters do not fit, see [Build a custom QueueBridge](/handbook/framework/connect-distributed-infrastructure/queue-delivery/custom-queue-bridge/). Do not wrap an in-memory queue as a production bridge; restart recovery and idempotency must be implemented by the selected provider boundary.
