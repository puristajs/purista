---
title: Persist state through Dapr
description: Use a Dapr state component while keeping the service definition independent of the backing provider.
order: 650
---

```bash title="Install @purista/dapr-sdk"
npm install @purista/dapr-sdk
```

```ts title="src/application/startIncidentService.ts"
import { DefaultEventBridge } from '@purista/core'
import { DaprStateStore } from '@purista/dapr-sdk'

import { incidentV1Service } from '../service/incident/v1/incidentV1Service.js'

const stateStore = new DaprStateStore({
  stateStoreName: 'incident-state',
})

const eventBridge = new DefaultEventBridge()
await eventBridge.start()

const service = await incidentV1Service.getInstance(eventBridge, { stateStore })
await service.start()
```

## Configure the Dapr boundary

| Constructor option | Default / effect | Set it when |
| --- | --- | --- |
| [`stateStoreName`](/handbook/api/classes/_purista_dapr-sdk.DaprStateStore/) | Component name; `stateStore` when omitted. | The deployed Dapr state component has another name. This is not a business key prefix. |
| `clientConfig.daprHost`, `clientConfig.daprPort` | `DAPR_HOST` or `127.0.0.1`; `DAPR_HTTP_PORT` or `3500`. | The sidecar runs at a non-default endpoint. |
| `clientConfig.daprApiToken` | No value is inferred by this adapter. | Sidecar API-token authentication is enabled. Obtain it from deployment secret delivery, never source code. |
| `clientConfig.daprApiVersion`, `clientConfig.isKeepAlive` | `v1.0`; `true`. | A compatible sidecar endpoint requires a different API version or connection-reuse policy. |
| `enableGet`, `enableSet`, `enableRemove` | All enabled by the state-store base class. | The process needs a deliberate read-only or append-only boundary. |

Reads, writes, and removals are enabled by default. Disable an operation only
when the process must be read-only. The Dapr sidecar and named state component are external prerequisites. Configure
their backing service, encryption, identity, concurrency/ETag policy, and
retention in the platform layer; PURISTA only calls the component. Verify
sidecar health, component availability, and recovery from a new pod/process
before relying on the store for durable state. The current state-store adapter
uses the basic Dapr get, set, and delete operations; it does not expose Dapr
transactions or ETag controls through `context.states`.

Next: [chapter overview](/handbook/framework/configure-applications/state-stores/).
