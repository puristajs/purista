---
title: Temporal and PURISTA
description: Orchestrate PURISTA commands with Temporal workflows for durable, long-running business processes.
order: 601000
---

# Temporal and PURISTA

PURISTA excels at building isolated, message-driven business capabilities. Temporal excels at orchestrating long-running, failure-prone processes across those capabilities. Together, they handle the full spectrum from simple commands to complex sagas.

## What each layer does

| Layer | Responsibility | Example |
|---|---|---|
| **PURISTA** | Business logic, type safety, message routing | `createOrder`, `processPayment`, `reserveInventory` |
| **Temporal** | Workflow orchestration, retries, timeouts, compensation | "Reserve inventory, then charge payment, then ship — and undo if anything fails" |

```mermaid
sequenceDiagram
    participant T as Temporal Workflow
    participant P as PURISTA Event Bridge
    participant S1 as Inventory Service
    participant S2 as Payment Service
    participant S3 as Shipping Service

    T->>P: command: reserveInventory
    P->>S1: reserve items
    S1->>P: success: inventoryReserved
    P->>T: response

    T->>P: command: processPayment
    P->>S2: charge card
    S2->>P: success: paymentProcessed
    P->>T: response

    T->>P: command: createShipment
    P->>S3: schedule delivery
    S3->>P: success: shipmentCreated
    P->>T: response
```

## Why combine them

PURISTA handles immediate request/response and event-driven reactions well. But some business processes span minutes, hours, or days:

- **Order fulfillment** — reserve stock, charge payment, ship, confirm delivery
- **User onboarding** — send email, wait for verification, provision account, send welcome
- **Billing cycles** — generate invoices, retry failed charges, escalate after N attempts
- **Approval workflows** — submit request, wait for human approval, execute or reject

Temporal manages the orchestration layer:

- **Retries with backoff** — retry failed activities automatically
- **Timeouts** — fail or compensate when steps take too long
- **Sagas** — undo completed steps when later steps fail
- **Human-in-the-loop** — pause workflows until external signals arrive
- **Observability** — see the full workflow state, history, and pending actions

## Architecture

```mermaid
flowchart TB
    subgraph TEMPORAL["Temporal"]
        W["Workflow Engine"]
        A["Activities"]
    end
    subgraph PURISTA["PURISTA"]
        EB["Event Bridge"]
        S1["Order Service"]
        S2["Payment Service"]
        S3["Email Service"]
    end
    W -->|calls| A
    A -->|command messages| EB
    EB --> S1
    EB --> S2
    EB --> S3
    S1 -->|events| EB
    S2 -->|events| EB
    S3 -->|events| EB
    EB -->|signals| W
```

Temporal activities send PURISTA command messages. PURISTA subscriptions can signal Temporal workflows when events occur.

## When to use Temporal

| Use case | PURISTA alone | PURISTA + Temporal |
|---|---|---|
| Simple CRUD | ✅ | Overkill |
| Event-driven reactions | ✅ | Overkill |
| Multi-step process with retries | ⚠️ | ✅ |
| Human approval required | ❌ | ✅ |
| Saga/compensation pattern | ❌ | ✅ |
| Long-running (hours/days) | ❌ | ✅ |

## Next steps

- [Why use Temporal](./why_to_use_temporal_and_purista.md) — deeper motivation and trade-offs
- [Setup Temporal](./setup_temporal.md) — install and configure the Temporal server
- [Connect Temporal with PURISTA](./connect_temporal_with_purista.md) — wire activities to PURISTA commands
