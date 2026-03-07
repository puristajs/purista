---
title: Advanced
description: Advanced topics and internals of PURISTA
order: 299900
---

# Advanced

This section covers internals and production-grade operating patterns.

## Topics

- [Structure of a Message](./structure_of_a_message.md): command/subscription/stream message fields and semantics.
- [Queues – internals & delivery tuning](./queues.md): lifecycle configuration, leases, retries, DLQs.
- [Delivery semantics and reliability](./delivery-semantics-and-reliability.md): at-most-once vs at-least-once and idempotency patterns.
- [AI Protocol](./ai-protocol.md): envelope/frame contract for agent streaming, telemetry, and nested flows.
- [JavaScript Events](./javascript_events.md): integrating framework events with native JS events.

## When to read this section

- you debug cross-service routing and message metadata
- you define production delivery/retry expectations
- you need stronger observability and operational safety controls
