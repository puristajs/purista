---
title: Monolithic
description: Deploy your typescript application as monolithic application
order: 501000
---

# Monolithic

Starting monolithic is a deliberate architectural choice, not a shortcut you will regret later. When your team is small, your domain boundaries are still being discovered, and you do not yet know which services will be under the most load, a single-process deployment gives you the fastest feedback loop. You can iterate on domain boundaries, refactor command and subscription ownership, and change your data models without negotiating API contracts between separate deployments. The bounded-context discipline that PURISTA enforces through services and the event bridge means the codebase stays structured even as it grows — you are building a monolith with clean internal seams, not a big ball of mud.

## What changes in the bootstrap

Only the bootstrap file (`src/index.ts`) changes between deployment patterns. Service code — commands, subscriptions, schemas — is identical in every deployment model. For the monolithic pattern you use `DefaultEventBridge` from `@purista/core`:

```typescript
// src/index.ts
import { DefaultEventBridge, gracefulShutdown, initLogger } from '@purista/core'
import { userV1ServiceBuilder } from './service/user/v1/userV1ServiceBuilder.js'
import { orderV1ServiceBuilder } from './service/order/v1/orderV1ServiceBuilder.js'

const main = async () => {
  const logger = initLogger('info')

  const eventBridge = new DefaultEventBridge()
  await eventBridge.start()

  const userService = await userV1ServiceBuilder.getInstance(eventBridge)
  await userService.start()

  const orderService = await orderV1ServiceBuilder.getInstance(eventBridge)
  await orderService.start()

  gracefulShutdown(logger, [eventBridge, userService, orderService])
}

main()
```

`DefaultEventBridge` is an in-process, in-memory event bridge. No broker process is required. When you later want to split a service out, you replace `DefaultEventBridge` with `AmqpBridge` or `NatsBridge` and start the affected service in its own process — nothing else changes.

It is the most mature and straightforward way, to simply deploy multiple instances to have horizontal scaling and to provide some kind of failover solution.

In the picture below, a simplified setup with two instances is shown.
You can scale it up by adding more instances or scale down, to one instance, if you think of [IoT and small edge devices](edge.md).

![example](/graphic/monolithic.svg)

This solution works for a single developer team or local, development and test environments.
It perfectly fits for early stages if the final decision about infrastructure/cloud provider is not made.
If not enough DevOps resources are available, this might be the preferred way.
Also, costs for running the application are predictable - price per instance. The costs do not directly correlate to the usage amount of executing single functions.
This approach does not need a real cloud provider and you can choose cheap (dedicated) servers.

To have a scalable solution, there is a need to ensure that the message broker and the HTTP proxy/load balancer do not become a single point of failure.
They need to be fault tolerant and should be able to scale or at least handle the number of requests.

The overall workload is distributed across all running instances.
In the picture above you can see, that every user request is sent to the HTTP server service of one of the instances.
The HTTP server itself invokes the correlating command of the matching service.
The invoked service might be executed on the same instance or a different instance. This depends on the message broker and the timing.
The command execution result will be sent to the instance, which was receiving the user's request and will respond to the user's request.

Subscriptions are triggered by messages from the message broker. This means they are executed at "any of" the instances.

The migration path to microservices is intentionally low-friction. When a specific service — say, an image-processing service that has become a CPU bottleneck — needs to run on dedicated hardware or be scaled independently, you extract it: stand up a new process, point it at the same `AmqpBridge` or `NatsBridge`, and remove it from the monolith's bootstrap list. Nothing else changes. The other services still send commands and publish events exactly as before; they do not know or care that the image-processing service is now in a separate process. This is why investing in proper service boundaries from day one pays off: extraction is a configuration change, not a rewrite.

<Badge text="Be aware" type="warning"/>
If you need some kind of **state or session handling**:
Because the execution of commands and subscription is generally done on "any of the instances" (random!), state handling will need some shared state store, even if a single user session is pinned to a specific instance!

The simple and common solution, to advise the load balancer/proxy, to pin the user's session to always the same instance, and to store the session data simply in the memory of that instance, will **not work** properly! Only the same HTTP server service will be invoked, but the command, corresponding to called HTTP endpoint, might be executed on any of the available instances.

You will need some additional external, shared-state storage!

::: tip Pros

- simple in the basic setup
- can run on bare metal with no additional overhead (IoT/edge devices)
- low configuration
- scales workload
- provides low-level backup
- different geo locations possible
- ensures all services (schemas, db migrations...) are in sync
- can be done at nearly any provider
:::

::: warning Cons

- the need to deploy always all services
- different access levels, restrictions, and policies for services & functions is not possible
- instances (incl. all services & functions) are running 24/7
- most likely a lot of manual steps
- the (manual) effort for managing instances grows, with the number of instances in most cases
- every addition, like state handling, secret, and config stores, must also be provided & managed
- code must be in mono repo or additional effort to merge all repos to a single deployment bundle
:::
