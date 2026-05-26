---
title: Integrations
description: Integrate PURISTA with Temporal, enterprise systems, and third-party services.
order: 600000
---

# Integrations

PURISTA focuses on business logic and message-driven architecture. For orchestration, scheduling, and enterprise interoperability, integrate with specialized tools rather than building everything in-house.

## Integration philosophy

```mermaid
flowchart TB
    subgraph PURISTA["PURISTA Services"]
        C1["Commands"]
        S1["Subscriptions"]
        Q1["Queues + Workers"]
    end
    subgraph External["External Systems"]
        T["Temporal"]
        E["Enterprise Bus"]
        SCH["Scheduler"]
    end
    PURISTA <-->|messages| External
```

The integration pattern is always the same:

1. **Keep business logic in PURISTA** — commands, subscriptions, and queues
2. **Use adapters for orchestration** — Temporal workflows, enterprise gateways, schedulers
3. **Pass only typed data** — schemas define what crosses the boundary

## Available integrations

| Integration | Purpose | Pattern |
|---|---|---|
| [Temporal](./temporal_and_purista/index.md) | Durable workflows, saga orchestration, long-running processes | Temporal calls PURISTA commands; PURISTA emits events Temporal subscribes to |
| [Enterprise Interoperability](./enterprise_interoperability/index.md) | Async agent queues, scheduling, result events, exports | Bridge between PURISTA and enterprise messaging systems |

## Temporal + PURISTA

Temporal handles complex orchestration — retries, timeouts, compensations, and human-in-the-loop steps. PURISTA handles the business operations.

```mermaid
sequenceDiagram
    participant T as Temporal Workflow
    participant P as PURISTA
    participant EB as Event Bridge

    T->>P: command: reserveInventory
    P->>EB: event: inventoryReserved
    T->>P: command: processPayment
    P->>EB: event: paymentProcessed
    T->>P: command: createOrder
    P->>EB: event: orderCreated
    T->>P: command: confirmShipment
```

If `processPayment` fails, Temporal's saga pattern triggers compensations — like releasing the reserved inventory — without any retry logic in your business code.

See [Temporal and PURISTA](./temporal_and_purista/index.md) for setup and examples.

## Enterprise interoperability

For organizations with existing messaging infrastructure:

| Pattern | Use case |
|---|---|
| [Async agent queues](./enterprise_interoperability/async-agent-queues.md) | Bridge PURISTA queues to enterprise MQ systems |
| [Scheduling](./enterprise_interoperability/scheduling.md) | Time-based job triggering from external schedulers |
| [Result events](./enterprise_interoperability/result-events.md) | Publish PURISTA command results to enterprise topics |
| [Exports](./enterprise_interoperability/exports.md) | Export service definitions and schemas for enterprise governance |
| [Long-running queues](./enterprise_interoperability/long-running-queues.md) | Durable queue workers that survive restarts and retries |

## Next steps

- [Temporal and PURISTA](./temporal_and_purista/index.md) — durable workflow orchestration
- [Enterprise Interoperability](./enterprise_interoperability/index.md) — integrate with existing infrastructure
