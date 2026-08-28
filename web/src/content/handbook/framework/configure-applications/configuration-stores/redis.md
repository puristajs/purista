---
title: Store configuration in Redis
description: Enable the Redis configuration-store adapter for shared low-latency configuration.
order: 512
---

Choose Redis configuration when the application already operates a protected Redis service and configuration must be shared across processes. Avoid it when configuration needs cloud-provider hierarchy, change approval, or secret-specific controls.

```bash title="Install @purista/redis-config-store"
npm install @purista/redis-config-store
```

Provision Redis with authenticated, encrypted connectivity in non-local environments. Construct `RedisConfigStore` with Node Redis options nested under `config`, then pass the instance through application service wiring.

```ts title="src/index.ts"
import { RedisConfigStore } from '@purista/redis-config-store'

const configStore = new RedisConfigStore({
  config: { url: process.env.REDIS_URL },
})

const service = await incidentV1Service.getInstance(eventBridge, { configStore })
```

| Call | Parameters, defaults, and intent | Runtime boundary |
| --- | --- | --- |
| [`new RedisConfigStore(options?)`](/handbook/api/classes/_purista_redis-config-store.RedisConfigStore/) | `config` contains the node-redis `createClient` options. Set `config.url` for the endpoint; use node-redis TLS/authentication options for shared environments. The inherited operation defaults are read on, write/remove off. | The client is constructed immediately and connects lazily on the first store operation. Call `destroy()` from composition shutdown to close an open connection. |
| [`serviceBuilder.getInstance(eventBridge, { configStore })`](/handbook/api/classes/_purista_core.ServiceBuilder/#getinstance) | Supplies the Redis adapter to one service instance. | Handlers receive it as `context.configs`; PURISTA does not add a key namespace, tenant prefix, or cache. |

`REDIS_URL` is a secret-sensitive connection value; resolve it from the runtime secret mechanism rather than committing it. Verify startup with a non-sensitive test key and observe Redis authentication/connection metrics. A missing Redis service or invalid credentials must fail the configured store path; it does not fall back to the in-memory store.

Redis configuration values are JSON-serialized. Reads are enabled by default;
`setConfig(...)` and `removeConfig(...)` require explicit base-store toggles.
Keep operational configuration management separate from application startup so
a compromised service identity cannot rewrite its own limits or endpoints.

Next: [chapter overview](/handbook/framework/configure-applications/configuration-stores/).
