---
title: NATS Event Bridge
description: Use NATS with PURISTA
order: 301050
---

![NATS event bridge](/graphic/nats_event_bridge_header.png)

# NATS Event Bridge

The `@purista/natsbridge` package integrates NATS subject-based routing.

## Delivery semantics

For core NATS (without JetStream persistence), behavior is typically:

- durability: no persistent backlog
- retries: application-level retry patterns required
- typical delivery mode: at-most-once

If you need stronger durability/replay, plan explicit broker/runtime patterns around it.

## Stream support

PURISTA stream runtime (`openStream`) is currently not implemented for NATS bridge.

## Reliability recommendations

- design handlers idempotent even when retries are app-driven
- keep subject prefix configuration identical across instances
- validate timeout/error behavior under broker disconnect scenarios
