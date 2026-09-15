---
title: Store configuration through Dapr
description: Use a Dapr configuration component from PURISTA without coupling service definitions to the backing vendor.
order: 515
---

`DaprConfigStore` is part of the optional `@purista/dapr-sdk`. Choose it when the platform team owns Dapr components and sidecar identity, not merely to avoid selecting a backing store.

```bash title="Install @purista/dapr-sdk"
npm install @purista/dapr-sdk
```

```ts title="src/index.ts"
import { DaprConfigStore } from '@purista/dapr-sdk'

const configStore = new DaprConfigStore({
  configStoreName: 'app-config',
})

const service = await incidentV1Service.getInstance(eventBridge, { configStore })
```

## Configure the adapter and its limits

| Constructor option | Default / effect | Set it when |
| --- | --- | --- |
| [`configStoreName`](/handbook/api/classes/_purista_dapr-sdk.DaprConfigStore/) | The Dapr configuration component name; `configStore` when omitted. | Your deployed Dapr component has a different name. This is the platform component identity, not a business key prefix. |
| `clientConfig.daprHost`, `clientConfig.daprPort` | `DAPR_HOST` or `127.0.0.1`; `DAPR_HTTP_PORT` or `3500`. | The sidecar runs at a non-default endpoint. Supply only the values that differ. |
| `clientConfig.daprApiToken` | No value is inferred by this adapter. | Sidecar API-token authentication is enabled. Obtain it from deployment secret delivery, never source code. |
| `clientConfig.daprApiVersion`, `clientConfig.isKeepAlive` | Configuration reads use `v1.0-alpha1` unless overridden; connection reuse defaults to `true`. | A compatible sidecar endpoint requires a different configuration API version or connection-reuse policy. |
| `enableGet` | Enabled by the configuration-store base class. | You need to deliberately prevent all handler reads in this process. |
| `enableSet`, `enableRemove` | Base flags may be set, but this adapter does not implement either mutation operation. | Never use these flags to imply Dapr configuration can be changed through this adapter. |
| `logger` or `logLevel` | A supplied logger takes precedence over a log level. | You need a scoped operational logger. Never emit configuration values unless their fields are reviewed as safe. |

`getConfig('one', 'two')` makes one Dapr configuration request per requested
key and returns an object keyed by those names; a key absent from the component
is returned as `undefined`. The adapter does not poll or subscribe to changes,
so an application that needs change propagation must own the refresh strategy.

The default sidecar endpoint is local (`http://127.0.0.1:3500`); this is only useful when a compatible sidecar and configuration component are actually running. Verify component health, namespace policy, and the sidecar's workload identity. Missing sidecar/component configuration fails the store operation; it does not create an in-memory replacement.

This adapter implements reads only. `setConfig(...)` and `removeConfig(...)`
throw `NotImplemented` even if their base-store toggles are enabled; change
Dapr configuration through the platform-owned component/configuration path.

Next: [chapter overview](/handbook/framework/configure-applications/configuration-stores/).
