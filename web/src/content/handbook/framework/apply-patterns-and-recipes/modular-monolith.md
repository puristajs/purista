---
title: Build a modular monolith
description: Keep service boundaries and contracts inside one deployable before independent deployment becomes necessary.
order: 840
---

A modular monolith uses PURISTA services to separate business capabilities while
one application process owns composition and deployment. It is a good default
when the team needs clear boundaries but not distributed operational complexity.

## Compose one process, retain service boundaries

Start each capability—orders, billing, notifications—with its own service,
schemas, and resources. Compose those services in one bootstrap and use the
in-process `DefaultEventBridge` while one deployment owns their availability.

```ts title="src/index.ts"
import { DefaultEventBridge, gracefulShutdown } from '@purista/core'
import { billingV1Service } from './service/billing/v1/billingV1Service.js'
import { ordersV1Service } from './service/orders/v1/ordersV1Service.js'

const eventBridge = new DefaultEventBridge()
await eventBridge.start()

const ordersService = await ordersV1Service.getInstance(eventBridge)
const billingService = await billingV1Service.getInstance(eventBridge)
await ordersService.start()
await billingService.start()

gracefulShutdown(logger, [eventBridge, ordersService, billingService])
```

The services should interact through declared command/event contracts, even
though delivery is local. This keeps dependencies visible and makes a later
transport change a composition/deployment task rather than a rewrite of
business code.

## Keep the boundary honest

| Keep separate now | Do not simulate yet |
| --- | --- |
| Service schemas, resources, ownership, and authorization | A remote broker merely for internal calls |
| Database table/data access policy by capability | Network failure/retry logic that the process cannot experience |
| HTTP exposure per command | Service discovery or cross-process health machinery |
| Contract and handler tests | Independent deployment pipelines for every module |

Use the default EventBridge and direct/embedded clients locally. Do not
introduce a remote broker solely to make an application look like microservices.
When requirements change, extract a capability only after it has a clear
ownership, data, scaling, or security reason—see [distributed
microservices](/handbook/framework/apply-patterns-and-recipes/distributed-microservices/).

Before deployment, replace local-only stores and secret handling, expose only
approved HTTP commands, and define a graceful shutdown sequence. A single
deployment still needs authorization, backups, logs, traces, and recovery
controls.

Next: [chapter overview](/handbook/framework/apply-patterns-and-recipes/).
