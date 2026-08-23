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
export { NatsBridge } from './NatsBridge.js'
export type { NatsBridgeConfig, NatsConsumerFailureHandlingDefaults } from './types/NatsBridgeConfig.js'
