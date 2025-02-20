[**@purista/natsbridge v2.0.5**](README.md)

***

[PURISTA API](../../packages.md) / @purista/natsbridge

# @purista/natsbridge

Package for using a [NATS](https://nats.io/) broker as event bridge.  
The event bridge supports brokers with and without JetStream enabled.

If JetStream is enabled, subscriptions which are marked as durable are persisted by using JetStream.  
If JetStream is not available, subscription fall back to live-subscriptions without any persistence.

## Example

```typescript
import { NatsBridge } from '@purista/natsbridge'

// create and init our eventbridge
  const eventBridge = new NatsBridge()
  await eventBridge.start()

```

## Classes

- [NatsBridge](classes/NatsBridge.md)

## Type Aliases

- [IncomingMessageFunction](type-aliases/IncomingMessageFunction.md)
- [NatsBridgeConfig](type-aliases/NatsBridgeConfig.md)

## Variables

- [puristaVersion](variables/puristaVersion.md)

## Functions

- [getCommandSubscriptionTopic](functions/getCommandSubscriptionTopic.md)
- [getDefaultNatsBridgeConfig](functions/getDefaultNatsBridgeConfig.md)
- [getQueueGroupName](functions/getQueueGroupName.md)
- [getSubscriptionTopic](functions/getSubscriptionTopic.md)
- [getTopicName](functions/getTopicName.md)
