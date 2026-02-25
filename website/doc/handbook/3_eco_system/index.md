---
title: PURISTA Ecosystem
description: Explore the ecosystem of PURISTA
order: 300000
---

# PURISTA Ecosystem

PURISTA is highly modular and functionality is separated into multiple packages. Use this section to pick the right transport, persistence, or tooling layer for your deployment.

| area | what it covers | docs |
| --- | --- | --- |
| Event bridges | Push-based transports (Default, AMQP, MQTT, NATS, Dapr) for commands/subscriptions/streams. | [Event bridges](./eventbridges/index.md) |
| Queue bridges | Pull-based queue providers (Default in-memory, Redis, future adapters) for worker pools and async HTTP workflows. | [Queue bridges](./queue_bridges/index.md) |
| Stores | Config, secret, and state stores (AWS, Azure, Redis, Dapr, etc.) with unified abstractions. | [Stores](./stores.md) |
| Servers | HTTP server adapters (Hono, native HTTP) and exposure helpers. | [Servers](./http_server.md) |
| Tools | CLI, generators, deployment helpers, and supporting SDKs. | [Tools](./tools.md) |
