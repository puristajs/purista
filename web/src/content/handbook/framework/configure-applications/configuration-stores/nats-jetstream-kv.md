---
title: Store configuration in NATS JetStream KV
description: Enable the NATS configuration-store adapter when JetStream is part of the operating platform.
order: 514
---

Choose this adapter when NATS with JetStream is already an approved dependency and you want configuration in a managed key-value bucket. JetStream must be enabled; a plain core NATS connection is insufficient.

```bash title="Install @purista/nats-config-store"
npm install @purista/nats-config-store
```

`NatsConfigStore` accepts NATS connection options and uses the `purista-config-store` bucket by default. Set a distinct `keyValueStoreName` per isolation boundary when required.

```ts title="src/index.ts"
import { NatsConfigStore } from '@purista/nats-config-store'

const configStore = new NatsConfigStore({
  servers: process.env.NATS_URL,
  keyValueStoreName: 'incident-config',
})

const service = await incidentV1Service.getInstance(eventBridge, { configStore })
```

| Call | Parameters, defaults, and intent | Runtime boundary |
| --- | --- | --- |
| [`new NatsConfigStore(options?)`](/handbook/api/classes/_purista_nats-config-store.NatsConfigStore/) | NATS `ConnectionOptions` such as `servers` identify the broker. `keyValueStoreName` defaults to `purista-config-store`; set it to a distinct JetStream KV bucket when the platform has already created that isolation boundary. Partial KV options are also accepted. | The connection and KV handle are created lazily. Startup fails on the first operation if JetStream is disabled or the identity cannot open the bucket. `destroy()` drains and closes the connection. |
| [`serviceBuilder.getInstance(eventBridge, { configStore })`](/handbook/api/classes/_purista_core.ServiceBuilder/#getinstance) | Wires the selected bucket to this service instance. | No automatic per-service or per-tenant namespace is added; keys and broker ACLs must enforce that boundary. |

Provision broker authentication, TLS, JetStream storage, and ACLs before
startup. Values use NATS `JSONCodec`, so keep them JSON-compatible. Reads are
enabled by default; enable writes/removals only for an audited configuration
management path. Verify that the application identity can read its bucket and
cannot read another tenant/environment bucket. A missing JetStream capability
is a deployment error, not a safe local fallback.

Next: [chapter overview](/handbook/framework/configure-applications/configuration-stores/).
