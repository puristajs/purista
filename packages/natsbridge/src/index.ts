/**
Package for using a [NATS](https://nats.io/) broker as event bridge.  
The event bridge supports brokers with and without JetStream enabled.

If JetStream is enabled, subscriptions which are marked as durable are persisted by using JetStream.  
If JetStream is not available, subscription fall back to live-subscriptions without any persistence.  

@example
```typescript
import { NatsBridge } from '@purista/natsbridge'

// create and init our eventbridge
  const eventBridge = new NatsBridge()
  await eventBridge.start()

```
 @module
 */
export * from './getDefaultNatsBridgeConfig.js'
export * from './getQueueGroupName.impl.js'
export * from './NatsBridge.js'
export * from './topic/getTopicName.impl.js'
export * from './topic/getCommandSubscriptionTopic.impl.js'
export * from './topic/getSubscriptionTopic.impl.js'
export * from './types/IncomingMessageFunction.js'
export * from './types/NatsBridgeConfig.js'
export * from './types/INatsBridge.js'
export * from './version.js'
