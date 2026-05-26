---
title: PURISTA Ecosystem
description: Choose the right transport, persistence, and tooling layers for your PURISTA application.
order: 300000
---

# PURISTA Ecosystem

PURISTA is modular. The core framework handles message contracts, routing, and type safety. The ecosystem provides adapters for message brokers, queue backends, state stores, and HTTP servers.

## Architecture overview

```mermaid
flowchart TB
    subgraph App["Your Application"]
        direction TB
        S1["User Service"]
        S2["Order Service"]
        S3["Email Service"]
        EB["Event Bridge"]
        QB["Queue Bridge"]
    end
    subgraph Transports["Transport Adapters"]
        AMQP["AMQP<br/>(RabbitMQ)"]
        NATS["NATS<br/>(JetStream)"]
        MQTT["MQTT<br/>(Mosquitto)"]
        DAPR["Dapr"]
        DEF["Default<br/>(in-memory)"]
    end
    subgraph Persistence["Persistence Adapters"]
        REDIS["Redis<br/>(Store + Queue)"]
        AWS["AWS<br/>(SSM + Secrets)"]
        AZURE["Azure<br/>(Key Vault)"]
    end
    subgraph HTTP["HTTP Surface"]
        HONO["Hono HTTP Server"]
    end
    S1 <-->|messages| EB
    S2 <-->|messages| EB
    S3 <-->|messages| EB
    EB <-->|transport| Transports
    QB <-->|pull-based| REDIS
    S1 <-->|stores| Persistence
    HONO <-->|exposes| EB
```

## Choosing your stack

### Event bridges (push-based messaging)

| Bridge | Scale out | Durable subscriptions | Manual ack | Stream support | Best for |
|---|---|---|---|---|---|
| [Default](./eventbridges/default_event_bridge.md) | No | No | No | Yes | Local dev, single instance |
| [AMQP](./eventbridges/amqp.md) | Yes | Yes | Yes | No | Production, operational control |
| [MQTT](./eventbridges/mqtt.md) | Yes | Broker-dependent | No | No | IoT, edge, topic-centric |
| [NATS](./eventbridges/nats.md) | Yes | JetStream only | JetStream only | No | Low-latency, simple ops |
| [Dapr](./eventbridges/dapr.md) | Yes | Component-dependent | Component-dependent | No | Polyglot, service mesh |

See the [Event Bridges](./eventbridges/index.md) page for the full capability matrix.

### Queue bridges (pull-based workloads)

| Package | Backend | Best for |
|---|---|---|
| `@purista/core` | In-memory | Local dev, tests, single instance |
| `@purista/redis-queue-bridge` | Redis | Production CQRS, delayed jobs, AI workers |
| `@purista/nats-queue-bridge` | NATS JetStream | NATS-first platforms, pull-based scaling |

### Stores

| Type | Packages | Purpose |
|---|---|---|
| Config | `@purista/core`, `@purista/aws-config-store`, `@purista/nats-config-store`, `@purista/redis-config-store` | Environment-specific values |
| Secret | `@purista/core`, `@purista/aws-secret-store`, `@purista/azure-secret-store`, `@purista/gcloud-secret-store`, `@purista/infisical-secret-store`, `@purista/vault-secret-store` | API keys, passwords, tokens |
| State | `@purista/core`, `@purista/redis-state-store`, `@purista/nats-state-store` | Business state, sessions, counters |

See [Stores](./stores.md) for the full list.

### HTTP servers

| Package | Features |
|---|---|
| `@purista/hono-http-server` | REST endpoints, SSE streaming, OpenAPI generation, problem details |

See [HTTP Server](./http_server.md) for configuration and middleware.

## Ecosystem decision tree

```mermaid
flowchart TD
    A["What do you need?"] --> B["Message routing<br/>between services"]
    A --> C["Pull-based async<br/>workloads"]
    A --> D["External state<br/>or secrets"]
    A --> E["HTTP API<br/>surface"]
    B --> F["Choose event bridge"]
    C --> G["Choose queue bridge"]
    D --> H["Choose store adapter"]
    E --> I["Use Hono HTTP Server"]
    F --> J["Local: Default<br/>Production: AMQP / NATS"]
    G --> K["Local: Default<br/>Production: Redis / NATS"]
    H --> L["Config: SSM / NATS / Redis<br/>Secrets: AWS / Azure / Vault / Infisical<br/>State: Redis / NATS"]
```

## Next steps

- [Event Bridges](./eventbridges/index.md) — deep dive into transport adapters
- [Queue Bridges](./queue_bridges/index.md) — pull-based workloads and worker pools
- [Stores](./stores.md) — config, secret, and state persistence
- [HTTP Server](./http_server.md) — REST, SSE, and OpenAPI
