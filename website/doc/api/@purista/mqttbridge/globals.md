[**@purista/mqttbridge v2.0.0**](README.md)

***

[PURISTA API](../../packages.md) / @purista/mqttbridge

# @purista/mqttbridge

Package for using a MQTT broker like rabbitMQ as event bridge.

Example usage:

## Example

```typescript
import { MqttBridge } from '@purista/mqttbridge'

// create and init our eventbridge
const eventBridge = new MqttBridge()
await eventBridge.start()

```

## Classes

- [MqttBridge](classes/MqttBridge.md)
- [TopicRouter](classes/TopicRouter.md)

## Type Aliases

- [IncomingMessageFunction](type-aliases/IncomingMessageFunction.md)
- [MqttBridgeConfig](type-aliases/MqttBridgeConfig.md)

## Variables

- [puristaVersion](variables/puristaVersion.md)

## Functions

- [getCommandHandler](functions/getCommandHandler.md)
- [getCommandResponseSubscriptionTopic](functions/getCommandResponseSubscriptionTopic.md)
- [getCommandSubscriptionTopic](functions/getCommandSubscriptionTopic.md)
- [getDefaultMqttBridgeConfig](functions/getDefaultMqttBridgeConfig.md)
- [getSharedTopicName](functions/getSharedTopicName.md)
- [getSubscriptionHandler](functions/getSubscriptionHandler.md)
- [getSubscriptionTopic](functions/getSubscriptionTopic.md)
- [getTopicName](functions/getTopicName.md)
- [handleCommandResponse](functions/handleCommandResponse.md)
- [isMatchingTopic](functions/isMatchingTopic.md)
- [msToSec](functions/msToSec.md)
