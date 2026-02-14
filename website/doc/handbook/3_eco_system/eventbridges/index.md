---
title: Event Bridges
description: Choose the right PURISTA event bridge and understand delivery semantics
order: 301000
---

# Event Bridges

Event bridges are the transport backbone of PURISTA. They determine routing, scaling behavior, durability options, and delivery guarantees.

## Support matrix

| bridge | scale out | durable backlog | typical delivery mode | stream support (`openStream`) |
|---|---:|---:|---|---:|
| [Default](./default_event_bridge.md) | no | no | at-most-once (in-memory) | yes |
| [AMQP](./amqp.md) | yes | yes | at-least-once (queue + ack based) | no (currently) |
| [MQTT](./mqtt.md) | yes | broker-dependent | QoS dependent (0/1/2) | no (currently) |
| [NATS](./nats.md) | yes | no (core NATS) | typically at-most-once | no (currently) |
| [Dapr](./dapr.md) | yes | component-dependent | component-dependent (often at-least-once) | no (currently) |

## Delivery semantics in practice

PURISTA itself provides typed message contracts and processing flow. Delivery guarantees come from the selected bridge + broker/component configuration.

- `at-most-once`: low latency, but a message can be lost on failures.
- `at-least-once`: safer delivery, but duplicates are possible.
- `exactly-once`: generally not guaranteed end-to-end in distributed systems; design handlers to be idempotent.

## Reliability checklist

- configure broker durability/retry features explicitly
- keep bridge settings identical across instances
- implement idempotency in command/subscription side effects
- define timeout/retry policies intentionally (do not rely on defaults only)
- test reconnect and broker outage scenarios in integration tests

## When to use which bridge

- `DefaultEventBridge`: local development, single-instance deployments, stream development.
- `AMQP`: production systems with durable queues/retries and strong operational control.
- `MQTT`: IoT/edge and broker setups where topic/QoS tuning is central.
- `NATS`: low-latency eventing where simple operations are preferred.
- `Dapr`: polyglot/service-mesh environments leveraging Dapr components.
