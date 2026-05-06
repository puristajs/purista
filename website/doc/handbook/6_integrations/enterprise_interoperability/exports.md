---
title: Exports
description: Export provider-neutral contracts for async enterprise systems.
order: 610060
---

# Exports

Enterprise exports should be generated from declarations, not from running handlers.

Exportable declarations include:

- custom events and subscriptions
- queues, queue workers, and result events
- event-to-queue bindings
- schedules
- stream channels
- async agent queue response contracts
- runtime bridge capability reports

AsyncAPI is the primary export shape for asynchronous surfaces. OpenAPI remains the primary export shape for HTTP commands, streams, and async accepted/status endpoints.

CloudEvents mapping is an interoperability adapter for external event systems. It does not replace PURISTA's internal message envelope.

Provider bindings are optional. The neutral document should be the default so teams can review ownership, schemas, idempotency strategy, and delivery limitations before choosing NATS, AMQP, MQTT, gateway, scheduler, or queue-provider details.

The billing-cycle example declares the schedule, event-to-queue binding, queue, worker, result event, and subscription in one service so these contracts can be exported without a live broker.

Use runtime capability exports next to AsyncAPI exports when reviewing operational guarantees:

```sh
purista export runtime-capabilities --out purista-runtime.json
```

The capability report is intentionally truthful. For example, `DefaultEventBridge` reports no durable subscriptions and no manual ack support, while `DefaultQueueBridge` reports in-memory queue behavior and no idempotency enforcement.
