---
title: Service
description: PURISTA typescript framework service creation
order: 201000
---

# Service

![Add service with cli](/graphic/add_service.png)

A service is a logical group of functions and subscriptions. This is where the domain-driven aspect comes in.

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
