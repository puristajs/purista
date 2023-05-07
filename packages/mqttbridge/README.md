# @purista/mqttbridge

Package for using a MQTT broker like rabbitMQ as event bridge.

Example usage:

```typescript
import { MqttBridge } from '@purista/mqttbridge'

// create and init our eventbridge
  const eventBridge = new MqttBridge()
  await eventBridge.start()

```

**Visit [purista.dev](https://purista.dev)**
