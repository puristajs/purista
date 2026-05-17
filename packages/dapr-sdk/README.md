# @purista/dapr-sdk

SDK and helpers for running PURISTA services with [Dapr](https://dapr.io/).

The package provides:

- `DaprEventBridge` for command invocation, subscriptions, and events through the Dapr sidecar
- `DaprClient` for sidecar HTTP calls
- `DaprConfigStore`, `DaprSecretStore`, and `DaprStateStore` adapters

```typescript
import { serve } from '@hono/node-server'
import { DaprConfigStore, DaprEventBridge, DaprSecretStore, DaprStateStore } from '@purista/dapr-sdk'
import { initLogger } from '@purista/core'

const logger = initLogger()

const eventBridge = new DaprEventBridge({
	logger,
	serve,
})

const secretStore = new DaprSecretStore({ logger, secretStoreName: 'local-secret-store' })
const stateStore = new DaprStateStore({ logger, stateStoreName: 'local-state-store' })
const configStore = new DaprConfigStore({ logger, configStoreName: 'local-config-store' })

await eventBridge.start()
```

The default Dapr sidecar endpoint is `http://127.0.0.1:3500`. Override it with `DAPR_HOST`, `DAPR_HTTP_PORT`, or the `clientConfig` option.

**Visit [purista.dev](https://purista.dev)**
