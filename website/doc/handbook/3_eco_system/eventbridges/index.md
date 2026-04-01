---
title: Event Bridges
description: Choose the right PURISTA event bridge and understand delivery semantics
order: 301000
---

# Event Bridges

Event bridges are the transport backbone of PURISTA. They determine routing, scaling behavior, durability options, and delivery guarantees.

## Support matrix

| bridge | scale out | durable backlog | typical delivery mode | late response handling | stream support (`openStream`) |
|---|---:|---:|---|---:|
| [Default](./default_event_bridge.md) | no | no | at-most-once (in-memory) | ignored with warning after timeout | yes |
| [AMQP](./amqp.md) | yes | yes | at-least-once for durable queues with manual ack | ignored with warning after timeout | no (currently) |
| [MQTT](./mqtt.md) | yes | broker-dependent | QoS dependent (0/1/2) | ignored with warning after timeout | no (currently) |
| [NATS](./nats.md) | yes | yes with JetStream, no with core NATS | at-most-once on core NATS, at-least-once with JetStream durable consumers | not applicable | no (currently) |
| [Dapr](./dapr.md) | yes | component-dependent | component-dependent (often at-least-once) | not applicable | no (currently) |

### Queue bridge support

| queue bridge package | preferred workloads | compatible event bridges |
| --- | --- | --- |
| `@purista/core` default queue bridge | local dev, unit tests, single instance deployments | Any (in-memory inside the service) |
| `@purista/redis-queue-bridge` | production pull-based CQRS, delayed jobs, AI worker pools | Default, AMQP, MQTT, NATS, Dapr (redis acts as the queue backend while the event bridge handles command/subscription traffic) |

Future queue bridge packages will live next to the event bridge adapters (e.g. `@purista/nats-queue-bridge`) once those providers expose reliable pull + lease semantics. When evaluating infrastructure, pick an event bridge + queue bridge pair that matches your durability and scaling needs.

See the dedicated [Queue Bridges](../queue_bridges/index.md) page for wiring guidance and capability details.

## Delivery semantics in practice

PURISTA itself provides typed message contracts and processing flow. Delivery guarantees come from the selected bridge + broker/component configuration.

- `at-most-once`: low latency, but a message can be lost on failures.
- `at-least-once`: safer delivery, but duplicates are possible.
- `exactly-once`: generally not guaranteed end-to-end in distributed systems; design handlers to be idempotent.

Late command responses are normalized across invoke-capable bridges in this slice. Once the caller-side timeout fires, PURISTA keeps a short-lived tombstone for the correlation id and ignores any later response with a warning instead of raising a bridge error.

## Reliability checklist

- configure broker durability/retry features explicitly
- keep bridge settings identical across instances
- implement idempotency in command/subscription side effects
- define timeout/retry policies intentionally (do not rely on defaults only)
- verify shutdown, readiness, and reconnect semantics in integration tests
- test reconnect and broker outage scenarios in integration tests

## When to use which bridge

- `DefaultEventBridge`: local development, single-instance deployments, stream development.
- `AMQP`: production systems with durable queues/retries and strong operational control.
- `MQTT`: IoT/edge and broker setups where topic/QoS tuning is central.
- `NATS`: low-latency eventing where simple operations are preferred.
- `Dapr`: polyglot/service-mesh environments leveraging Dapr components.
