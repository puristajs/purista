---
title: HTTP runtime architecture and startup
description: Choose direct definition registration for a monolith or event-driven endpoint discovery for a separately deployed Hono process.
order: 415
---

Hono is a PURISTA service that owns the HTTP listener-facing application. It
does not run command, queue, stream, or agent business logic itself. For every
request it builds a PURISTA command or stream request and sends it through the
EventBridge to the owning business service.

```mermaid title="Hono projects HTTP while business services execute the work"
flowchart LR
  Client[HTTP client] --> Hono[Hono service<br/>routes, middleware, OpenAPI]
  Hono -->|invoke command / open stream| Bridge[EventBridge]
  Bridge --> Service[Business service<br/>command, queue, stream, agent]
  Service -->|result, frames, or job acceptance| Bridge
  Bridge --> Hono
  Hono --> Client
```

The HTTP process and business-service process can be the same deployment or
separate deployments. That choice decides how Hono receives endpoint metadata.

| Deployment shape | Route source | Correct startup order | Best for |
| --- | --- | --- |
| Monolith | `registerService(...)` or `services` + `autoRegisterServicesFromConfig` reads in-memory definitions | EventBridge → instantiate services → register definitions with Hono → start Hono → start business services → bind listener | One Node deployment; a fixed, reviewable public surface. |
| Separate Hono process | Built-in Hono subscription receives `InfoServiceFunctionAdded` endpoint announcements through the EventBridge | Start EventBridge → start Hono with `enableDynamicRoutes: true` → make its listener ready → start each business service | Independently deployed HTTP edge and service workloads. |

## Distributed endpoint discovery

When `enableDynamicRoutes: true`, Hono keeps its built-in subscription. Each
business service emits an `InfoServiceFunctionAdded` message when it registers
a command or stream during `service.start()`. The Hono subscription accepts
only definitions with HTTP exposure metadata and calls `addEndpoint(...)` to
create a route and OpenAPI operation.

```mermaid title="Separate deployment: Hono must subscribe before services announce endpoints"
sequenceDiagram
  participant EB as EventBridge
  participant H as Hono process
  participant S as Business service
  H->>EB: start Hono subscription (enableDynamicRoutes: true)
  H->>H: bind listener after service startup
  S->>EB: start service and register command/stream
  EB-->>H: InfoServiceFunctionAdded + HTTP metadata
  H->>H: add route and OpenAPI operation
  Note over H,S: Later HTTP requests invoke/openStream through EventBridge
```

The built-in Hono subscription is non-durable. Therefore Hono must be started
and subscribed before services emit their registration announcements. If a
business service starts first, Hono may have no route for that endpoint until
the service registers it again (for example, after a restart); a request then
returns `404`, not a safe proxy retry. Treat the Hono listener as ready only
after `await honoService.start()` has completed. Each Hono replica receives the
announcement and maintains its own route table.

Do not call `registerService(...)` in this deployment. It requires the actual
in-memory `Service` instances and cannot discover remote instances.

The following separate-process composition uses NATS as the shared
EventBridge. Install and provision `@purista/natsbridge` and a reachable NATS
broker first; [deliver events through NATS](/handbook/framework/connect-distributed-infrastructure/event-delivery/nats/)
explains its transport and durability choices. The Hono package and its Node
listener dependency are enabled in [configure Hono](/handbook/framework/expose-and-consume-services/http-and-rest/hono/#install-the-optional-server).

```ts title="src/http/index.ts"
import { serve } from '@hono/node-server'
import { honoV1Service } from '@purista/hono-http-server'
import { NatsBridge } from '@purista/natsbridge'

const natsServer = process.env.NATS_URL
if (!natsServer) {
  throw new Error('NATS_URL is required to start the HTTP gateway.')
}

const eventBridge = new NatsBridge({
  servers: natsServer,
  topicPrefix: 'support',
})
await eventBridge.start()

const honoService = await honoV1Service.getInstance(eventBridge, {
  serviceConfig: { enableDynamicRoutes: true, apiMountPath: '/api' },
})
await honoService.start()

serve({ fetch: honoService.app.fetch, port: 3000 })
```

[`getInstance(eventBridge, options?)`](/handbook/api/classes/_purista_core.ServiceBuilder/#getinstance)
creates the Hono service with its configuration; [`start()`](/handbook/api/classes/_purista_core.Service/#start)
registers its subscription before the listener is made available. The NATS
bridge is an application dependency in this deployment, not a Hono setting.

Deploy this HTTP process before the business service deployments. After a
business service starts, verify its OpenAPI operation appears at
`/api/openapi.json` and make one authenticated request before shifting traffic.

## Monolith direct registration

In one composition root, Hono can read service definitions directly. Register
the routes before Hono starts; start command/stream receivers before exposing
the Node listener. This avoids relying on registration events for the initial
route table and keeps startup deterministic.

```ts title="src/index.ts"
import { serve } from '@hono/node-server'
import { DefaultEventBridge } from '@purista/core'
import { honoV1Service } from '@purista/hono-http-server'
import { pingV1Service } from './service/ping/v1/pingV1Service.js'

const eventBridge = new DefaultEventBridge()
await eventBridge.start()

const pingService = await pingV1Service.getInstance(eventBridge)
const honoService = await honoV1Service.getInstance(eventBridge, {
  serviceConfig: { enableDynamicRoutes: false, apiMountPath: '/api' },
})

honoService.registerService(pingService)
await honoService.start()
await pingService.start()

serve({ fetch: honoService.app.fetch, port: 3000 })
```

[`registerService(...services)`](/handbook/api/classes/_purista_hono-http-server.HonoServiceClass/#registerservice)
accepts one or more service instances. It scans
their declared command and stream definitions, ignores definitions without
HTTP metadata, and rejects a different service that claims the same method and
path. It throws if called after Hono has started, because the default router is
fixed. `enableDynamicRoutes` is unnecessary in this path and should remain
`false` unless the monolith deliberately also accepts later announcements.

Use `autoRegisterServicesFromConfig: true` plus `services: [pingService]`
only as a declarative alternative to `registerService`. The two options serve
the same monolith route-discovery purpose; using both adds no capability.

Next: [configure Hono](/handbook/framework/expose-and-consume-services/http-and-rest/hono/),
[expose a command](/handbook/framework/build-services/commands/expose-a-command/),
and [HTTP stream behavior](/handbook/framework/build-services/streams/termination-and-failures/).
