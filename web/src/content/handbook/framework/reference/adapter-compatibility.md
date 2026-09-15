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

Use the focused [event](/handbook/framework/connect-distributed-infrastructure/event-delivery/), [queue](/handbook/framework/connect-distributed-infrastructure/queue-delivery/), [store](/handbook/framework/configure-applications/state-stores/), and [HTTP](/handbook/framework/expose-and-consume-services/http-and-rest/) guides.

## EventBridge execution capabilities

| Bridge | Cross-process | Streams | Durable consumer controls | Subscription control results |
| --- | --- | --- | --- | --- |
| Default | No | Yes | No | Logged; no retry/DLQ/drop/pause action |
| AMQP | Yes | No | Yes, subject to broker/config capabilities | Handled by adapter |
| NATS | Yes | No | Yes with JetStream and strict configuration | Handled by adapter |
| MQTT | Yes | No | Limited | Logged; no retry/DLQ/drop/pause action |
| Dapr / HTTP | Yes | No | Platform-dependent, without the full PURISTA control contract | Logged; no retry/DLQ/drop/pause action |

Strict validation applies only to the definition capabilities that request it.
Do not read an interface method or package installation as a guarantee that a
broker implements the same settlement behavior.

## QueueBridge execution capabilities

| Bridge | Durable across restart | Idempotency-key enforcement | Delayed jobs and DLQ operations | Maximum declared prefetch |
| --- | --- | --- | --- | --- |
| Default | No | No | In-process only | 1 |
| Redis | Yes | Yes | Yes | 1 |
| NATS JetStream | Yes | Yes | Yes | 1 |

All shipped QueueBridges currently declare `maxBatchSize: 1`; a queue
definition with `prefetch` above `1` fails strict startup validation. Queue
deduplication covers enqueue identity, not exactly-once worker execution or
external side effects.
