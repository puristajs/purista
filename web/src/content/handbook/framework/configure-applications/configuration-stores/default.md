---
title: Use the default configuration store
description: Seed the included in-memory store for local development and deterministic tests, then pass it explicitly to the service.
order: 511
---

`DefaultConfigStore` is included in `@purista/core`; no extra package is
needed. It stores values only in this process, loses them at shutdown, and
emits a warning that it is not secure for production. Use it to make a local
email subscription or a unit test deterministic—not to share configuration
between services or deployments.

```ts title="src/index.ts"
import { DefaultConfigStore } from '@purista/core'
import { emailV1Service } from './service/email/v1/emailV1Service.js'

const configStore = new DefaultConfigStore({
  config: {
    emailProviderUrl: 'http://localhost:4025/send',
  },
})

const emailService = await emailV1Service.getInstance(eventBridge, {
  configStore,
})
```

| Call | Parameters, defaults, and intent | Runtime boundary |
| --- | --- | --- |
| [`new DefaultConfigStore(options?)`](/handbook/api/classes/_purista_core.DefaultConfigStore/) | `config` seeds the process-local map. `enableGet` defaults to `true`; `enableSet`, `enableRemove`, and `enableCache` default to `false`. | Creates an explicit local store; it does not become available to a service until `getInstance` receives it. |
| [`serviceBuilder.getInstance(eventBridge, { configStore })`](/handbook/api/classes/_purista_core.ServiceBuilder/#getinstance) | Pass the store instance as the `configStore` runtime binding. Omit it only when the included default is intentionally sufficient. | The resulting service exposes the binding as `context.configs` in handlers. A supplied store is owned and destroyed by the composition root. |

`getConfig(...)` is enabled by default. `setConfig(...)` and
`removeConfig(...)` are disabled by default; only enable them in an explicit
test or local development scenario.

```ts title="test/support/createConfigStore.ts"
import { DefaultConfigStore } from '@purista/core'

export const createConfigStore = () => new DefaultConfigStore({
  enableSet: true,
  enableRemove: true,
  config: { emailProviderUrl: 'http://test.invalid/send' },
})
```

The second example enables mutations only for a controlled fixture. It is not a
recommended application setting: a process that serves normal requests should
not be able to rewrite its own operational configuration without an explicit
authorization path.

Before production, select a configuration-store adapter, provision the
external namespace and least-privilege identity, and verify that a newly
started instance resolves a non-sensitive test key. A missing or unavailable
external store must fail visibly; it must not silently fall back to this map.

Next: choose a production [configuration store](/handbook/framework/configure-applications/configuration-stores/).
