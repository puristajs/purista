---
title: AMQP Event Bridge
description: Use AMQP brokers (for example RabbitMQ) with PURISTA
order: 301020
---

![AMQP event bridge](/graphic/amqp_event_bridge_header.png)

# AMQP Event Bridge

The `@purista/amqpbridge` package connects PURISTA to AMQP brokers such as RabbitMQ.

## Delivery semantics

- durability: supported (durable queues/exchanges)
- retries: supported (broker + consumer policies)
- dead-lettering: supported by broker configuration
- typical delivery mode: at-least-once (duplicates must be handled)

## Stream support

PURISTA stream runtime (`openStream`) is currently not implemented for AMQP bridge.

## Example

```typescript
import { AmqpBridge } from '@purista/amqpbridge'

const eventBridge = new AmqpBridge({
  url: 'amqp://my-amqp-host.example.com',
})

await eventBridge.start()
```

## Reliability recommendations

- configure durable queues for long-lived subscriptions
- configure dead-letter queues for poison messages
- make command/subscription handlers idempotent
- align exchange/queue naming and routing settings across all instances
