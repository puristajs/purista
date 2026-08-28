---
title: Adapter compatibility
description: Choose an adapter from the business guarantee and operational ownership, not from the package name alone.
order: 1240
---

Adapters share PURISTA contracts, but external systems do not share the same delivery, retention, authorization, or operating model. A compatible interface is not a promise of identical semantics.

| Family | Choices | Decision boundary |
| --- | --- | --- |
| Event delivery | Default, AMQP, NATS, MQTT, Dapr | Durable subscriptions, broker operations, routing model, and redelivery |
| Queue delivery | Default, Redis, NATS | Background-work durability, retry/DLQ process, worker scaling, and retention |
| Stores | Default, Redis, cloud services, Vault/Infisical, NATS, Dapr | Data sensitivity, consistency, identity, availability, and audit needs |
| HTTP | Hono or application-owned implementation | Public API policy, authentication, deployment, and server ownership |

Before selecting an adapter, validate the runtime's supported capability, the vendor's currently supported version, network and identity model, and failure/recovery procedure. The Framework package inventory does not certify external vendor versions or managed-service configuration.

Use the focused [event](/handbook/framework/connect-distributed-infrastructure/event-delivery/), [queue](/handbook/framework/connect-distributed-infrastructure/queue-delivery/), [store](/handbook/framework/persist-application-state/), and [HTTP](/handbook/framework/expose-and-consume-services/http-and-rest/) guides.
