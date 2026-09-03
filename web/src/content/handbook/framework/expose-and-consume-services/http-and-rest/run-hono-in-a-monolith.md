---
title: Run Hono in a monolith
description: Register in-process service definitions with Hono, start every runtime in dependency order, and bind the network listener last.
order: 412
---

In a modular monolith, Hono and the business services share one process and one
EventBridge. Register the actual service instances directly; dynamic endpoint
discovery is unnecessary.

## Install the server and listener

```bash title="Install Hono support for Node.js"
npm install @purista/hono-http-server @hono/node-server
```

`@purista/hono-http-server` owns routes, protection, errors, health, and
OpenAPI. `@hono/node-server` owns the TCP listener. Starting the PURISTA Hono
service does not open a port.

## Compose the process

```ts title="src/index.ts"
import { serve } from '@hono/node-server'
import { DefaultEventBridge, gracefulShutdown, initLogger } from '@purista/core'
import { honoV1Service } from '@purista/hono-http-server'
import { transactionV1Service } from './service/transaction/v1/transactionV1Service.js'

const logger = initLogger()
const eventBridge = new DefaultEventBridge({ logger })
await eventBridge.start()

const transactionService = await transactionV1Service.getInstance(eventBridge, { logger })
await transactionService.start()

const http = await honoV1Service.getInstance(eventBridge, {
  logger,
  serviceConfig: {
    apiMountPath: '/api',
    enableHealth: true,
    openApi: {
      enabled: true,
      info: { title: 'Example Bank API', version: '1.0.0' },
    },
  },
})

http.registerService(transactionService)
await http.start()

const listener = serve({ fetch: http.app.fetch, port: 3000 })

gracefulShutdown(logger, [
  http.prepareDestroy(),
  {
    name: 'HTTP listener',
    destroy: () => new Promise<void>((resolve, reject) => {
      listener.close(error => error ? reject(error) : resolve())
    }),
  },
  {
    name: 'Transaction service',
    destroy: () => transactionService.destroy(),
  },
  { name: 'Hono service', destroy: () => http.destroy() },
  { name: 'Event bridge', destroy: () => eventBridge.destroy() },
])
```

Call `registerService(...)` before `http.start()`. The alternative is
`serviceConfig.services` plus `autoRegisterServicesFromConfig: true`; do not
use both for the same service. Bind the listener only after the business and
HTTP services are ready.

## Prove the boundary

1. `GET /healthz` returns `200` after `http.start()`.
2. `GET /api/openapi.json` contains the exposed service operations.
3. One protected request reaches its command and carries principal/tenant data.
4. Shutdown first makes Hono unavailable, closes the listener, destroys
   services, and destroys EventBridge last.

A raw Node listener is application infrastructure, so it needs its own named
shutdown entry. It is not another PURISTA service.

Next: [map commands, streams, queues, and agents](/handbook/framework/expose-and-consume-services/http-and-rest/map-commands-streams-queues-and-agents/).
