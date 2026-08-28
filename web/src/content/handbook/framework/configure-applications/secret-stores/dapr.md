---
title: Store secrets through Dapr
description: Resolve secrets through a Dapr secret-store component and platform-managed identity.
order: 527
---

```bash title="Install @purista/dapr-sdk"
npm install @purista/dapr-sdk
```

```ts title="src/application/startIncidentService.ts"
import { DefaultEventBridge } from '@purista/core'
import { DaprSecretStore } from '@purista/dapr-sdk'

import { incidentV1Service } from '../service/incident/v1/incidentV1Service.js'

const secretStore = new DaprSecretStore({
  secretStoreName: 'app-secrets',
  metadata: { namespace: 'production' },
})

const eventBridge = new DefaultEventBridge()
await eventBridge.start()

const service = await incidentV1Service.getInstance(eventBridge, { secretStore })
await service.start()
```

## Configure the Dapr boundary

| Constructor option | Default / effect | Set it when |
| --- | --- | --- |
| [`secretStoreName`](/handbook/api/classes/_purista_dapr-sdk.DaprSecretStore/) | Component name; `secretStore` when omitted. | The deployed Dapr secret component has another name. This is not a key prefix. |
| `metadata.namespace` | Omitted; no namespace request metadata is sent. | The Dapr component uses a Kubernetes namespace outside the default. It does not replace backing-provider authorization. |
| `clientConfig.daprHost`, `clientConfig.daprPort` | `DAPR_HOST` or `127.0.0.1`; `DAPR_HTTP_PORT` or `3500`. | The sidecar runs at a non-default endpoint. |
| `clientConfig.daprApiToken` | No value is inferred by this adapter. | Sidecar API-token authentication is enabled. Obtain it from deployment secret delivery, never source code. |
| `clientConfig.daprApiVersion`, `clientConfig.isKeepAlive` | `v1.0`; `true`. | A compatible sidecar endpoint requires a different API version or connection-reuse policy. |
| `enableGet` | Enabled by the secret-store base class. | You must disable all runtime secret reads in this process. |
| `enableSet`, `enableRemove` | Disabled by default; enabling them still cannot add write support. | Never: this adapter implements reads only. |

The sidecar and the named secret-store component must exist. Configure the component's backing-provider identity and namespace policy in the platform, then verify sidecar health and a non-sensitive access path. `metadata.namespace` scopes Dapr requests; it does not replace the backing store's authorization model.

`getSecret('one', 'two')` issues one sidecar request for each name and returns
an object keyed by those names; a missing key is `undefined`. This adapter has
no polling or rotation notification mechanism. `setSecret(...)` and
`removeSecret(...)` throw `NotImplemented` when their base-store toggle is
enabled; create, rotate, and revoke Dapr secrets through the platform-owned
secret workflow instead.

Next: [chapter overview](/handbook/framework/configure-applications/secret-stores/).
