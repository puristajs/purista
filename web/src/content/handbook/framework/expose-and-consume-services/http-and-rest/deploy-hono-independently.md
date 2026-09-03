---
title: Deploy Hono as an independent service
description: Discover HTTP endpoint announcements through a distributed EventBridge and operate Hono as its own gateway workload.
order: 413
---

An independent Hono process has no in-memory business-service instances. It
learns endpoint metadata from PURISTA service information messages delivered by
the selected distributed EventBridge.

## Enable dynamic routes

```ts title="src/runtime/http-gateway.ts"
import { serve } from '@hono/node-server'
import { gracefulShutdown, initLogger } from '@purista/core'
import { honoV1Service } from '@purista/hono-http-server'
import { createEventBridge } from '../eventbridge.js'

const logger = initLogger()
const eventBridge = await createEventBridge(logger)
await eventBridge.start()

const http = await honoV1Service.getInstance(eventBridge, {
  logger,
  serviceConfig: {
    enableDynamicRoutes: true,
    apiMountPath: '/api',
    enableHealth: true,
    services: [],
    autoRegisterServicesFromConfig: false,
    openApi: {
      enabled: true,
      info: { title: 'Example Bank API', version: '1.0.0' },
    },
  },
})

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
  { name: 'Hono service', destroy: () => http.destroy() },
  { name: 'Event bridge', destroy: () => eventBridge.destroy() },
])
```

Start the Hono subscription before business services publish their function
announcements. The built-in discovery path is event-driven and does not replay
missed non-durable announcements. Your deployment must coordinate startup or
provide a deliberate re-announcement/reconciliation mechanism.

## Treat the gateway as a real distributed workload

- Use a broker-backed EventBridge supported by every participating process.
- Give the gateway only invoke/stream and endpoint-announcement permissions.
- Configure authentication, request limits, TLS/ingress, health, and telemetry
  for this process independently.
- Do not pass remote service objects through `services`; objects cannot cross a
  process boundary.
- Make readiness depend on required route discovery when the public API must be
  complete before traffic starts.

Verify cold-start order in both directions: gateway first and business service
first. A route present after only one order is an incomplete deployment
contract.

Next: [authenticate and propagate principals and tenants](/handbook/framework/expose-and-consume-services/http-and-rest/authenticate-and-propagate-identity/).
