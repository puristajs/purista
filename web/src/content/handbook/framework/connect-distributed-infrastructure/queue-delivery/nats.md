---
title: Deliver queue jobs through NATS JetStream
description: Enable JetStream-backed queues for durable pull workers, replay, and idempotent job publishing.
order: 723
---

```bash title="Install @purista/nats-queue-bridge"
npm install @purista/nats-queue-bridge
```

NATS with JetStream is required. Construct the bridge with connection options and a subject prefix, then start and inject it at service creation.

```ts title="src/index.ts"
import { NatsQueueBridge } from '@purista/nats-queue-bridge'

const queueBridge = new NatsQueueBridge({
  connectionOptions: { servers: process.env.NATS_URL },
  subjectPrefix: 'incident.queue',
})
await queueBridge.start()

const service = await incidentV1Service.getInstance(eventBridge, { queueBridge })
```

The default JetStream storage type is file. Set `storageType`,
`defaultLeaseTtlMs`, `defaultMaxAttempts`, `releaseBatchSize`, and
`idempotencyPendingTimeoutMs` only after agreeing their operational effect with
the NATS owner. The adapter creates its own stream/KV topology; it does not
offer a handbook-configurable JetStream retention policy. Meet regulated
retention requirements in the broker/platform design and verify durable stream
creation, redelivery after a failed lease, DLQ movement, replay, and duplicate
enqueue under the deployed credentials.

## Size the JetStream topology deliberately

| Option | Default | Effect |
| --- | --- | --- |
| `connectionOptions` | NATS client defaults | Passed to `nats.connect`; configure server URLs, TLS, credentials, and reconnect behavior. |
| `subjectPrefix` | `purista.queue` | Prefix for queue, schedule, dead-letter, and idempotency subjects. Change only with a coordinated data/topology migration. |
| `defaultLeaseTtlMs` | `30,000` ms | Fallback job lease. It must accommodate normal processing and heartbeat policy without delaying recovery excessively. |
| `defaultMaxAttempts` | `10` | Fallback attempts before dead-letter movement. The worker/job definition can supply a narrower policy. |
| `storageType` | `file` | JetStream storage for streams the bridge creates. `memory` trades restart recovery for speed and must not be used for durable jobs. |
| `releaseBatchSize` | `25` | Maximum due scheduled jobs released per pass; keep it bounded during catch-up. |
| `idempotencyPendingTimeoutMs` | `5,000` ms | Wait for an in-flight idempotent publish before treating it as stale; tune only from observed publish latency. |

Payloads, parameters, and headers use NATS JSON encoding. An idempotency key
deduplicates job publishing, not worker execution. When a lease expires or a
worker fails after an external side effect, JetStream can redeliver, so retain
the application-level business key and reconciliation path.

Next: [chapter overview](/handbook/framework/connect-distributed-infrastructure/queue-delivery/).
