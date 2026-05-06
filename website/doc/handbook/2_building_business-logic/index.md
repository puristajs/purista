---
title: Building Business Logic
description: How to implement business logic with the PURISTA typescript backend framework
order: 200000
---

# Building business logic

This section explains how to implement business logic with strong types and clear boundaries.

## Core flow

1. Scaffold service artifacts with the [PURISTA CLI](../cli.md) (`purista add ...`).
2. Define a [Service](./service/index.md) and shared [Builders](./builders.md).
3. Capture [Schemas & validation](./schemas.md) to power types/OpenAPI.
4. Add [Commands](./command/index.md) with request/response contracts.
5. Stream multi-frame responses through [Streams](./stream/index.md).
6. React to events via [Subscriptions](./subscription/index.md).
7. Configure [Queues](./queue/index.md) for pull-based workloads.
8. Emit [Custom event messages](./custom_events.md), wire [Logging](./logging.md), and [Error handling](./error-handling.md).
9. Connect [Stores](./stores/index.md) and expose APIs through [exposing commands](./exposing_endpoints/index.md) + [HTTP clients](./fetch_based_http_client.md).
10. Operate/observe services via [Connect to PURISTA](./connect_to_a_purista_application/index.md) and the [Advanced](./advanced/index.md) topics (message structure, delivery semantics, protocol internals).

## Suggested chapter order

1. [Builders](./builders.md)
2. [Schemas & Validation](./schemas.md)
3. [Service](./service/index.md)
4. [Command](./command/index.md)
5. [Stream](./stream/index.md) and [The Stream Builder](./stream/index.md#stream-builder)
6. [Subscription](./subscription/index.md)
7. [Queues](./queue/index.md)
8. [Custom Event Messages](./custom_events.md)
9. [Logging](./logging.md)
10. [Error Handling](./error-handling.md)
11. [Stores](./stores/index.md)
12. [Exposing Commands](./exposing_endpoints/index.md)
13. [HTTP Client](./fetch_based_http_client.md)
14. [Connect To PURISTA](./connect_to_a_purista_application/index.md)
15. [Advanced](./advanced/index.md) -> [Structure Of A Message](./advanced/structure_of_a_message.md), [Delivery Semantics And Reliability](./advanced/delivery-semantics-and-reliability.md)
