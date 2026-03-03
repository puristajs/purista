---
title: Building Business Logic
description: How to implement business logic with the PURISTA typescript backend framework
order: 200000
---

# Building business logic

This section explains how to implement domain logic with strong types and clear boundaries.

## Core flow

1. Scaffold service artifacts with the [PURISTA CLI](../cli.md) (`purista add ...`).
2. Define a [Service](./service/index.md) and shared [Builders](./builders.md).
3. Capture [Schemas & validation](./schemas.md) to power types/OpenAPI.
4. Add [Commands](./command/index.md) with request/response contracts.
5. Stream multi-frame responses through [Streams](./stream/index.md).
6. React to events via [Subscriptions](./subscription/index.md).
7. Configure [Queues](./queue/index.md) for pull-based workloads.
8. Add [AI Agents](./agent/index.md) with managed manifests, orchestration queues, and evaluation helpers.
9. Emit [Custom event messages](./custom_events.md), wire [Logging](./logging.md), and [Error handling](./error-handling.md).
10. Connect [Stores](./stores/index.md) and expose APIs through [exposing commands](./exposing_endpoints/index.md) + [HTTP clients](./fetch_based_http_client.md).
11. Operate/observe services via [Connect to PURISTA](./connect_to_a_purista_application/index.md) and the [Advanced](./advanced/index.md) topics (JavaScript events, message structure, delivery semantics).

## Suggested chapter order

1. [Builders](./builders.md)
2. [Schemas & Validation](./schemas.md)
3. [Service](./service/index.md)
4. [Command](./command/index.md)
5. [Stream](./stream/index.md) and [The Stream Builder](./stream/index.md#stream-builder)
6. [Subscription](./subscription/index.md)
7. [Queues](./queue/index.md)
8. [AI Agents](./agent/index.md)
9. [Custom Event Messages](./custom_events.md)
10. [Logging](./logging.md)
11. [Error Handling](./error-handling.md)
12. [Stores](./stores/index.md)
13. [Exposing Commands](./exposing_endpoints/index.md)
14. [HTTP Client](./fetch_based_http_client.md)
15. [Connect To PURISTA](./connect_to_a_purista_application/index.md)
16. [Advanced](./advanced/index.md) → [JavaScript Events](./advanced/javascript_events.md), [Structure Of A Message](./advanced/structure_of_a_message.md), [Delivery Semantics And Reliability](./advanced/delivery-semantics-and-reliability.md)
