---
title: Persist state in NATS JetStream KV
description: Enable JetStream key-value storage for state in a NATS-operated deployment.
order: 640
---

```bash title="Install @purista/nats-state-store"
npm install @purista/nats-state-store
```

JetStream is required. Configure `NatsStateStore` with NATS connection options and a separate key-value bucket where isolation requires it.

```ts title="src/application/startIncidentService.ts"
import { DefaultEventBridge } from '@purista/core'
import { NatsStateStore } from '@purista/nats-state-store'

import { incidentV1Service } from '../service/incident/v1/incidentV1Service.js'

const stateStore = new NatsStateStore({
  servers: process.env.NATS_URL,
  keyValueStoreName: 'incident-state',
})

const eventBridge = new DefaultEventBridge()
await eventBridge.start()

const service = await incidentV1Service.getInstance(eventBridge, { stateStore })
await service.start()
```

Reads, writes, and removals are enabled by default. Disable an operation only
when the process must be read-only. Values must be JSON-compatible. Provision TLS, credentials, JetStream storage,
and subject/bucket permissions. Verify restart recovery and denied access with
the runtime identity. Keep payloads small and avoid placing secrets in state
values unless the broker storage and backup path meet the required protection
level. PURISTA reads and writes individual keys; use JetStream's own facilities
only after verifying their semantics when a workflow needs TTL, revisions, or
watchers.

The NATS connection and KV handle are created lazily on the first state
operation. During shutdown, stop services first and then call
`await stateStore.destroy()` once at the composition root; that drains and
closes the shared NATS connection. See [composition-root lifecycle](/handbook/framework/configure-applications/wire-stores-at-the-composition-root/#keep-lifecycle-ownership-explicit).

Next: [chapter overview](/handbook/framework/configure-applications/state-stores/).
