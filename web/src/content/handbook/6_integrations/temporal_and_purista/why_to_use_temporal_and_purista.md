---
title: Why Use Temporal
description: When and why to add Temporal orchestration to your PURISTA application.
order: 601001
---

# Why Use Temporal with PURISTA

PURISTA builds reactive, message-driven systems. Commands execute. Subscriptions react. Events flow. This works beautifully for immediate actions and simple causal chains.

But not all business processes fit the immediate-reaction model. Some need to wait. Some need to retry with carefully tuned backoff. Some need human approval. Some need to undo prior steps when later steps fail.

## The gap

Consider an order fulfillment process:

1. Reserve inventory
2. Charge payment
3. Create shipment
4. Send confirmation email

In PURISTA alone, you could chain these with subscriptions:

```mermaid
flowchart LR
    A["orderCreated"] --> B["reserveInventory"]
    B --> C["inventoryReserved"]
    C --> D["processPayment"]
    D --> E["paymentProcessed"]
    E --> F["createShipment"]
```

This works until something fails. What if payment fails after inventory is reserved? You need to release the reservation. What if the user cancels mid-process? You need to stop and compensate. What if step 3 needs a human to review unusual orders?

PURISTA handles the individual steps. Temporal handles the orchestration.

## What Temporal adds

| Feature | What it means |
|---|---|
| **Durable workflows** | Process state survives server restarts, crashes, and deployments |
| **Retries with backoff** | Failed activities retry automatically with configurable policy |
| **Timeouts** | Steps have deadlines; missed deadlines trigger compensation or alerts |
| **Sagas** | When step N fails, undo steps 1 through N-1 in reverse order |
| **Signals** | External systems (humans, webhooks, subscriptions) can pause or resume workflows |
| **Queries** | Inspect running workflow state without mutating it |
| **Observability** | See the full history, pending actions, and failure reasons |

## The saga pattern

A saga executes a sequence of steps, each with a compensating action:

```mermaid
flowchart TD
    A["Start Order"] --> B["Reserve Inventory"]
    B --> C{"Payment OK?"}
    C -->|Yes| D["Create Shipment"]
    C -->|No| E["Release Inventory"]
    E --> F["Order Failed"]
    D --> G["Send Confirmation"]
    G --> H["Order Complete"]
```

If payment fails, Temporal automatically invokes the compensation (release inventory) without any compensation logic in your PURISTA services.

## Architecture comparison

### Without Temporal

```mermaid
flowchart LR
    C["Client"] -->|HTTP| H["HTTP Server"]
    H -->|command| EB["Event Bridge"]
    EB --> S1["Service A"]
    EB --> S2["Service B"]
    S1 -->|event| EB
    EB --> S2
```

Best for: simple request/response, event-driven reactions, independent capabilities.

### With Temporal

```mermaid
flowchart TB
    C["Client"] -->|start| W["Temporal Workflow"]
    W -->|activity| A1["Activity: call PURISTA command"]
    W -->|activity| A2["Activity: call PURISTA command"]
    A1 -->|message| EB["Event Bridge"]
    A2 -->|message| EB
    EB --> S1["PURISTA Service"]
    EB --> S2["PURISTA Service"]
    S1 -->|event| EB
    EB -->|subscription| SIG["Signal Temporal"]
```

Best for: multi-step processes, retries, human approval, sagas, long-running work.

## When to introduce Temporal

| Indicator | Action |
|---|---|
| Process has 3+ sequential steps | Consider Temporal |
| Steps can fail and need retry | Use Temporal |
| Failure requires undoing prior steps | Use Temporal sagas |
| Human approval is required | Use Temporal signals |
| Process spans minutes, hours, or days | Use Temporal |
| Process needs audit history | Use Temporal |

## When to stay with PURISTA alone

| Indicator | Action |
|---|---|
| Simple CRUD operations | PURISTA commands + REST |
| Independent event reactions | PURISTA subscriptions |
| Real-time streaming | PURISTA streams |
| Background jobs with simple retry | PURISTA queues + workers |

## Summary

- **PURISTA** = business capabilities, type safety, message-driven architecture
- **Temporal** = orchestration, durability, retries, sagas, human workflows
- **Together** = the full spectrum from simple commands to complex long-running processes

Next: [set up Temporal](./setup_temporal.md) and [connect it to PURISTA](./connect_temporal_with_purista.md).
