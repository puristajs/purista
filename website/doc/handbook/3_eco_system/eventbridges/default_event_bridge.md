---
title: Default Event Bridge
description: Built-in in-memory bridge for local and single-instance setups
order: 301010
---

# Default Event Bridge

`DefaultEventBridge` is included in `@purista/core` and works without external broker infrastructure.

## Best use cases

- local development
- tests and prototypes
- single-instance deployments

## Delivery semantics

- durability: none (in-memory only)
- retries: none
- typical delivery mode: at-most-once
- cross-instance routing: not supported

## Stream support

`DefaultEventBridge` currently supports PURISTA stream sessions (`openStream`, stream frames, cancellation).

## Pros

- zero setup
- full command/subscription routing in-process
- supports stream runtime behavior

## Cons

- no broker persistence
- no horizontal scale sharing
- no durable recovery after process restart

## Example

```typescript
import { DefaultEventBridge } from '@purista/core'

const eventBridge = new DefaultEventBridge()
await eventBridge.start()
```

## Notes

For production systems with multi-instance delivery guarantees, use an external broker bridge (AMQP/MQTT/NATS/Dapr).
