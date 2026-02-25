---
title: MQTT Event Bridge
description: Use MQTT v5 brokers with PURISTA
order: 301030
---

![MQTT event bridge](/graphic/mqtt_event_bridge_header.png)

# MQTT Event Bridge

The `@purista/mqttbridge` package integrates MQTT v5 brokers with PURISTA routing semantics.

## Delivery semantics

Delivery behavior depends on your MQTT QoS and retention/session settings:

- QoS 0: at-most-once
- QoS 1: at-least-once
- QoS 2: exactly-once on broker/client protocol level (application side effects still must be idempotent)

Durability and replay are broker- and topic-config dependent.

## Stream support

PURISTA stream runtime (`openStream`) is currently not implemented for MQTT bridge.

## Topic strategy

PURISTA composes topics from message metadata (type, sender, receiver, tenant/principal, event). Keep prefixes/QoS consistent across all instances.

## Reliability recommendations

- choose QoS per traffic class (`command` vs event/subscription)
- align expiry and timeout values intentionally
- use shared subscriptions carefully for scale-out consumers
- test reconnect and retained-session behavior in integration tests
