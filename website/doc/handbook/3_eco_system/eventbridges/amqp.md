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
- subscription consumer failure handling: supported with bridge-managed bounded retries and dead-letter queue routing
- typical delivery mode: at-least-once when durable queues use manual ack (duplicates must be handled)

Durable command consumers now default to:

- `autoacknowledge: false`
- `autoDelete: false`
- configurable `prefetch`
- optional dead-letter exchange / routing-key arguments

This makes the safe path the default for durable command workloads instead of requiring every service to override queue settings manually.

For command invocation, PURISTA keeps a pending invocation timeout registry and additionally sets AMQP message `expiration` from the invocation timeout. This combines caller-side timeout determinism with broker-side stale-message expiry.

Durable subscriptions can now also declare `consumerFailureHandling`:

- `maxAttempts` is honored by the bridge through bounded republish
- `deadLetterTarget` is honored as the terminal queue name
- `retryDelayMs` is honored for durable subscriptions through bridge-managed broker retry queues (TTL + dead-letter back to source queue)
- `mode: 'strict'` keeps startup honest by rejecting unsupported semantics instead of degrading silently
- explicit handler outcomes:
  - `drop`: ack and discard the current delivery with warning metadata
  - `stop-consumer`: cancel and pause the affected consumer tag until explicit resume

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
- use confirm-channel backed retry/DLQ handoff so the original delivery is not acknowledged before the retry/DLQ write is accepted
- monitor paused subscription consumers and resume them deliberately after remediation
- use queue bridges instead of subscriptions when you need long backoff windows or operator-driven replay
- keep manual ack enabled for durable command consumers
- make command/subscription handlers idempotent
- align exchange/queue naming and routing settings across all instances
