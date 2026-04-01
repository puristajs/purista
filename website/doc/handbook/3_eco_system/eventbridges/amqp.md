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
- typical delivery mode: at-least-once when durable queues use manual ack (duplicates must be handled)

Durable command consumers now default to:

- `autoacknowledge: false`
- `autoDelete: false`
- configurable `prefetch`
- optional dead-letter exchange / routing-key arguments

This makes the safe path the default for durable command workloads instead of requiring every service to override queue settings manually.

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
- keep manual ack enabled for durable command consumers
- make command/subscription handlers idempotent
- align exchange/queue naming and routing settings across all instances
