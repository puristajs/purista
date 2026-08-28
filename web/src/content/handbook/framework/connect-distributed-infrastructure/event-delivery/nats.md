---
title: Deliver events through NATS
description: Enable the NATS EventBridge and make JetStream durability an explicit production decision.
order: 713
---

```bash title="Install @purista/natsbridge"
npm install @purista/natsbridge
```

Choose NATS when its subject-based topology and operations are the approved service transport. Configure a topic prefix and NATS connection options, then start the bridge before the services.

```ts title="src/index.ts"
import { NatsBridge } from '@purista/natsbridge'

const eventBridge = new NatsBridge({
  servers: process.env.NATS_URL,
  topicPrefix: 'incident',
  durableSubscriptionMode: 'strict',
})
await eventBridge.start()
```

JetStream is required for durable/manual-ack subscription behavior. `strict` fails registrations when JetStream is unavailable; `best-effort` continues without durability, retry, or DLQ guarantees and should not be presented as an equivalent production fallback. Provision TLS, credentials, streams, storage limits, and subject permissions, then verify redelivery and dead-letter handling.

## Configure the transport deliberately

`NatsBridge` merges the following defaults with normal NATS connection options
such as `servers`, TLS, authentication, reconnect settings, and client name.

| Option | Default | Why change it |
| --- | --- | --- |
| `topicPrefix` | `purista` | Isolate this application’s subjects. Use a stable environment/application prefix. |
| `emptyTopicPartString` | `__empty__` | Keep a stable representation for missing address parts; change only with a coordinated topic migration. |
| `commandResponsePublishTwice` | `eventOnly` | `always` retains more response traffic; `never` can miss subscription-visible response timing; `eventAndError` also republishes command error responses. |
| `defaultMessageExpiryInterval` | `2,592,000` seconds (30 days) | Bound JetStream retention to your recovery window and storage budget. |
| `maxMessages` | `10` | Per-subscription parallel delivery limit; lower it to protect a scarce downstream dependency. |
| `jetStreamAckWaitMs` | `30,000` ms | Broker processing/ack timeout before redelivery; coordinate it with handler duration and idempotency. |
| `durableSubscriptionMode` | `strict` | Keep `strict` for required durability; `best-effort` starts without JetStream guarantees. |
| `defaultConsumerFailureHandling` | 5 attempts, 1,000 ms delay, `.dead-letter` suffix | Adapter defaults for JetStream-backed consumers; per-subscription failure handling can override them. |

NATS does not currently support PURISTA streams. A service that registers a
stream fails its capability check with this bridge; use a queue and stored
result for distributed progressive work instead.

Next: [chapter overview](/handbook/framework/connect-distributed-infrastructure/event-delivery/).
