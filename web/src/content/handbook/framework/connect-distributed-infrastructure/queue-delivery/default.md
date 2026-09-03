---
title: Use the default QueueBridge
description: Use the included in-memory QueueBridge to develop and test a queue/worker flow.
order: 721
---

`DefaultQueueBridge` is included in `@purista/core` and does not require external setup. Use it to verify queue definitions and worker behavior locally.

```ts title="src/index.ts"
import { DefaultQueueBridge } from '@purista/core'

const queueBridge = new DefaultQueueBridge()
await queueBridge.start()

const service = await incidentV1Service.getInstance(eventBridge, { queueBridge })
```

It can delay a local job and retain a local dead-letter list while this process
is alive. Those are useful deterministic-flow features, not durable broker
guarantees: all jobs, leases, schedules, and dead-letter entries disappear on
process exit, and it does not enforce idempotency keys. Do not use it for a
production job that must survive restart or coordinate across instances.

`DefaultQueueBridge` uses a 30-second lease and five maximum attempts unless a
job definition or enqueue request supplies its own values. Its optional
constructor fields are `instanceId`, `defaultLeaseTtlMs`, `maxAttempts`, and
`metricsRecorder`. It can inspect, replay, and purge its process-local dead
letters, but does not inspect leases or provide provider-managed delayed
delivery. Those limits make it useful for deterministic tests, not production
recovery validation.

Next: [chapter overview](/handbook/framework/connect-distributed-infrastructure/queue-delivery/).
