---
title: Monolithic
description: Run multiple PURISTA services in one process and one deployment artifact.
order: 501000
---

# Monolithic

A PURISTA monolith is one process that starts several service instances over
one in-process bridge. It retains service, command, subscription, queue, and
schema boundaries without requiring a broker for local development or a
single-instance deployment.

```ts [src/index.ts]
import { DefaultEventBridge, gracefulShutdown, initLogger } from '@purista/core'
import { ordersV1Service } from './service/orders/v1/index.js'
import { usersV1Service } from './service/users/v1/index.js'

const logger = initLogger()
const eventBridge = new DefaultEventBridge({ logger })
await eventBridge.start()

const users = await usersV1Service.getInstance(eventBridge)
const orders = await ordersV1Service.getInstance(eventBridge)
await Promise.all([users.start(), orders.start()])

gracefulShutdown(logger, [eventBridge, users, orders])
```

## Local and one-server operation

Use this topology for local development, tests, demos, and a single application
process on a server or container. It is also a sound initial production choice
when a single availability zone/process is an accepted operational decision.

Do not run this exact bootstrap in two replicas and expect cross-replica
commands, events, queues, or scheduler triggers. Each `DefaultEventBridge` is
private to its own process. To add replicas, move the shared communication and
durable state to production adapters first; at that point the deployment is a
replicated application, even if it still contains all services in one image.

## When to split

Split a service into a separate process when it needs independent deployment,
scaling, tenancy/security isolation, or a distinct failure boundary. Replace
only the composition root: both processes use the same external EventBridge and
the same required shared stores. Business handlers and contracts do not change.

See [Microservice style](./microservice_style/index.md) for that topology and
[Scheduling](../6_integrations/enterprise_interoperability/scheduling.md) for
the intentionally separate scheduler host.
