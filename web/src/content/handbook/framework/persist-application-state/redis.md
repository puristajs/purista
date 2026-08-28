---
title: Persist state in Redis
description: Enable Redis-backed state for a protected, shared application runtime.
order: 630
---

```bash title="Install @purista/redis-state-store"
npm install @purista/redis-state-store
```

Choose Redis for low-latency application state when Redis persistence, backup, TLS, and access controls meet the workload's recovery requirement. Configure `RedisStateStore` with Node Redis options nested under `config`:

```ts title="src/application/startIncidentService.ts"
import { DefaultEventBridge } from '@purista/core'
import { RedisStateStore } from '@purista/redis-state-store'

import { incidentV1Service } from '../service/incident/v1/incidentV1Service.js'

const stateStore = new RedisStateStore({
  config: { url: process.env.REDIS_URL },
})

const eventBridge = new DefaultEventBridge()
await eventBridge.start()

const service = await incidentV1Service.getInstance(eventBridge, { stateStore })
await service.start()
```

Reads, writes, and removals are enabled by default. Disable an operation only
to enforce a deliberate process-level read-only boundary. Wire the store at
application startup and use a stable,
tenant-aware key namespace. Values are JSON-serialized; validate them on read.
Verify a write/read across a new service instance. A successful in-process test
does not prove Redis persistence, replication, failover, or backup behavior;
test those controls in the target environment. The adapter does not set a TTL,
perform atomic read-modify-write, or subscribe to Redis changes for you. Use a
repository/database or explicit Redis client capability when the business
operation requires those guarantees.

Redis connects lazily on the first store operation. At shutdown, the
composition root—not `service.destroy()`—must call `await stateStore.destroy()`
once after the services that share it have stopped, so the client socket closes.
The [composition-root lifecycle](/handbook/framework/configure-applications/wire-stores-at-the-composition-root/#keep-lifecycle-ownership-explicit)
shows that ownership shape.

Next: [chapter overview](/handbook/framework/persist-application-state/).
