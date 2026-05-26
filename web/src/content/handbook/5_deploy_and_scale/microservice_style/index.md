---
title: Microservice style
description: Deploy your typescript application in a microservice styled way
order: 503000
---

# Microservice style

## When to choose microservice style

The microservice model is the right choice when you have **multiple teams** that need to develop, deploy, and scale services independently. The central benefit is not technical — it is organisational: teams own their service end-to-end without coordinating deployments with every other team.

If you are a single team or the project is early-stage, start with the [monolithic deployment](../monolithic.md). You can migrate to microservice style later without rewriting service code, because PURISTA service logic is independent of the deployment topology.

---

It's a common approach to have a microservice architecture.
We call it here _microservice style_, as classical microservices are typically (more or less) directly communicating via HTTP.
In PURISTA, the communication is not a direct connection between two instances — it is done via a message broker. Because of this, service mesh software like [Istio](https://istio.io) cannot be simply used. Here, you might want to consider [Dapr](https://dapr.io).

This solution fits if you have multiple developer teams, which should be able to work (and scale) independently.
This is the **biggest PRO** in comparison to the monolithic approach: It enables scaling the whole project and not only some software instances.

![example](/graphic/microservice_style.svg)

## Bootstrap pattern

Each service runs in its own process, connected to a shared message broker. Only the bootstrap file changes — service code (commands, subscriptions, schemas) is identical to the monolithic deployment:

```typescript
// src/index.ts — one process per service
import { NatsBridge } from '@purista/natsbridge'  // or AmqpBridge from '@purista/amqpbridge'
import { gracefulShutdown, initLogger } from '@purista/core'
import { orderV1ServiceBuilder } from './service/order/v1/orderV1ServiceBuilder.js'

const main = async () => {
  const logger = initLogger('info')

  const eventBridge = new NatsBridge({
    url: process.env.NATS_URL ?? 'nats://localhost:4222',
  })
  await eventBridge.start()

  const orderService = await orderV1ServiceBuilder.getInstance(eventBridge)
  await orderService.start()

  gracefulShutdown(logger, [eventBridge, orderService])
}

main()
```

Run a separate instance of this bootstrap for each service (Order, Payment, User, etc.), all pointing at the same broker URL. Services discover each other through the broker — no service mesh or sidecar required.

This solution will need the effort to set up, configure and maintain. You will also quickly hit the point, where you will need additional third-party solutions to handle the bigger complexity.
Here, a common way is, the usage of [kubernetes](https://kubernetes.io).
These third-party solutions will also bring a lot of additional benefits. The range will be from "some nicer UI" up to "autoscaling services" and automated, reproducible deployment.
The costs, for running a system this way, are (mostly) predictable - similar to the monolithic approach.

The overall workload is distributed across all running instances and the number of running instances per service can be set differently.
If you have for example some service, which does some time-consuming computation, it might make sense to have more instances running.

<Badge text="Be aware" type="warning"/>
When using the Hono HTTP server package, either:

- provide service instances to the server config, or
- enable and verify dynamic route registration.

This ensures the HTTP server instance has all endpoint mappings before traffic arrives.

::: tip Pros

- services can be deployed independently
- services can be scaled independently
- code can be handled in multiple repositories and multiple teams independently
- if one service instance crashes, the rest will not be impacted (in the meaning of "they are not automatically killed/crashing")
- different access levels, restrictions, and policies for single services possible
- by using tools like [kubernetes](https://kubernetes.io) more enhanced functions on infrastructure level like autoscaling
- enhanced monitoring and alerting become available because of the needed usage of third-party solutions (like [grafana](https://grafana.com))
- any bigger server/cloud provider has [kubernetes](https://kubernetes.io) focused solutions in his portfolio
:::

::: warning Cons

- much more complex orchestration to handle and will probably need some additional layer like [kubernetes.io](https://kubernetes.io) or [dapr.io](https://dapr.io)
- needs knowledge, time, and resources to be configured correctly
- instances of services are running 24/7
- will in most cases need third-party applications to handle logs (collecting and merging logs from all instances)
- monitoring and alerting become much more complex and might need third-party solutions
:::
