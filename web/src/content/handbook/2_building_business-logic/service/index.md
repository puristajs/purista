---
title: Service
description: PURISTA typescript framework service creation
order: 201000
---

# Service

![Add service with cli](/graphic/add_service.png)

A service is a logical group of functions and subscriptions. This is where the domain-driven aspect comes in.

In practice, a service maps to a bounded context: all the commands, subscriptions, and streams that belong to `UserManagement` live in one service, while `Billing` lives in another. The event bridge is what lets them communicate without depending on each other's internals. When a `UserService` command emits a `userCreated` event, a `BillingService` subscription can react to it — but neither service imports the other's code or knows the other's address.

A service is a registration unit, not a runtime process. You can run multiple services in a single Node.js process (a monolith), or deploy each service as its own process (microservices) by pointing them all at the same event bridge. The same service code works in both topologies without modification, which means you can start with a single process for simplicity and split later when scale requires it.

A service provides:

- [Commands](../command/index.md) that are callable by the outside world (like an API).
- [Streams](../stream/index.md) for multi-frame request/response workloads.
- [Subscriptions](../subscription/index.md) that listen to events and react accordingly.
- A custom [service configuration](./add-a-service-config.md), which is available in commands, subscriptions, and streams.
- [Secret stores](../stores/secret-stores.md), which allow commands/subscriptions/streams to access secrets via a unified interface.
- [Config stores](../stores/config-stores.md), which allow commands/subscriptions/streams to access (dynamic) configurations via a unified interface.
- [State stores](../stores/state-stores.md), which allow commands/subscriptions/streams to access state data via a unified interface.
- [Resources](./define-resources.md), which are used by commands/subscriptions/streams (e.g., database connections or external APIs).

In general, a service itself should not contain any logic. It should only act as a logical container for commands and subscriptions.  
Additionally, services should not hold state data.

## Event bridge vs. queue bridge injection

Services always need an event bridge for command/subscription/stream traffic, but queues are supplied through a separate `queueBridge` option. This allows you to mix transports per use case (e.g., AMQP for synchronous messaging plus Redis for pull queues):

```ts
import { AmqpBridge } from '@purista/amqpbridge'
import { RedisQueueBridge } from '@purista/redis-queue-bridge'
import { myV1Service } from './my-service'

const eventBridge = new AmqpBridge({ /* ... */ })
const queueBridge = new RedisQueueBridge({ /* ... */ })

const myService = await myV1Service.getInstance(eventBridge, {
  logger,
  resources,
  queueBridge,
})
await myService.start()
```

If you skip `queueBridge`, PURISTA injects the in-memory default bridge automatically so your service still starts (handy for tests/local dev). Production deployments should always supply an explicit queue bridge.

## Typical implementation order

1. Define service info and create service builder.
2. Add config schema (if needed).
3. Define resources used by commands/subscriptions.
4. Add command, subscription, and stream definitions.
5. Create service instance, provide required resources (`getInstance(..., { resources })`), and call `start()`.

Continue with:

- [The service builder](./the-service-builder.md)
- [Add configuration](./add-a-service-config.md)
- [Define resources](./define-resources.md)
- [Unit test the service](./unit-test-a-service.md)

## When to use

Every command, subscription, and stream in PURISTA must belong to a service. The question is not whether to create a service, but where to draw the boundaries. A useful rule of thumb: if two functions would always be deployed together, owned by the same team, and share the same database connection, they probably belong in the same service. If they would evolve independently or be owned by different teams, split them.

- You want to group related commands/subscriptions by domain.
- You need shared resources/config for a set of functions.
- You want clear boundaries for ownership and deployment.

## Common pitfalls

- putting business logic into the service class itself
- mixing unrelated domains into one service
- storing mutable runtime state directly on the service instance

## Checklist

- service info is stable and meaningful (`serviceName`, `serviceVersion`)
- config schema is defined where needed
- resources are typed and passed at instance creation
- service setup test (`testServiceSetup`) is present

## Idea Behind the Design

When a new service is added, it is done via the service builder. The service builder is responsible for collecting all required information. It then provides clearly defined interfaces. By having these interfaces, the actual implementation of a resource, store, or any other dependency can be easily swapped out without affecting other parts of the system.

With the ability to simply swap out dependencies, vendor lock-in can be significantly reduced. For example, if you move your system from one cloud provider to another, you only need to update the adapter for the secret store or config store—without modifying any of your business logic.

The combination of well-defined interfaces and a message-based architecture makes integrating other systems seamless. It does not matter how these systems are built internally; all that matters is that they provide the correct interfaces. This allows for a combination of different programming languages, the integration of third-party services, and more.

__See__: [Export Service Definitions](../connect_to_a_purista_application/export_service_definitions.md)
