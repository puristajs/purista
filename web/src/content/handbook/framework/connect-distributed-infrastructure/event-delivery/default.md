---
title: Use the default EventBridge
description: Use the included in-process bridge for local development and deterministic service tests.
order: 711
---

`DefaultEventBridge` is included in `@purista/core`. It requires no package, network, or broker and is the safe starting point for a single-process project.

```ts title="src/index.ts"
import { DefaultEventBridge } from '@purista/core'

const eventBridge = new DefaultEventBridge()
await eventBridge.start()
```

It does not distribute messages between processes or provide broker-backed recovery. Replace it before a deployment requires independent service instances, durable subscribers, or external interoperability.

Its useful local capability includes incremental streams, cancellation, and
aggregate finals. That does not make stream behavior production-ready on a
different bridge: select and test the deployed EventBridge before keeping a
stream in a distributed topology.

Next: [chapter overview](/handbook/framework/connect-distributed-infrastructure/event-delivery/).
