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
- [Subscriptions](../subscription/index.md) that listen to events and react accordingly.
- A custom [service configuration](./add-a-service-config.md), which is available in commands and subscriptions.
- [Secret stores](../stores/secret-stores.md), which allow commands and subscriptions to access secrets via a unified interface.
- [Config stores](../stores/config-stores.md), which allow commands and subscriptions to access (dynamic) configurations via a unified interface.
- [State stores](../stores/state-stores.md), which allow commands and subscriptions to access state data via a unified interface.
- [Resources](./define-resources.md), which are used by commands and subscriptions (e.g., database connections or external APIs).

In general, a service itself should not contain any logic. It should only act as a logical container for commands and subscriptions.  
Additionally, services should not hold state data.

## Idea Behind the Design

When a new service is added, it is done via the service builder. The service builder is responsible for collecting all required information. It then provides clearly defined interfaces. By having these interfaces, the actual implementation of a resource, store, or any other dependency can be easily swapped out without affecting other parts of the system.

With the ability to simply swap out dependencies, vendor lock-in can be significantly reduced. For example, if you move your system from one cloud provider to another, you only need to update the adapter for the secret store or config store—without modifying any of your business logic.

The combination of well-defined interfaces and a message-based architecture makes integrating other systems seamless. It does not matter how these systems are built internally; all that matters is that they provide the correct interfaces. This allows for a combination of different programming languages, the integration of third-party services, and more.

__See__: [Export Service Definitions](../connect_to_a_purista_application/export_service_definitions.md)
