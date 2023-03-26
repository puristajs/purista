# @purista/amqpbridge

Package for using a AMQP broker like rabbitMQ as event bridge.

Example usage:

```typescript
import { AmqpBridge } from '@purista/amqpbridge'

// create and init our eventbridge
  const eventBridge = new AmqpBridge(undefined)
  await eventBridge.start()

```

**Visit [purista.dev](https://purista.dev)**
