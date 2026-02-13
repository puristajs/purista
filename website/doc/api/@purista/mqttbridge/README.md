[**PURISTA API**](../../README.md)

***

[PURISTA API](../../packages.md) / @purista/mqttbridge

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

**Follow on Twitter [@purista_js](https://twitter.com/purista_js)**  
**Join the [Discord Chat](https://discord.gg/9feaUm3H2v)**

<a href="https://www.producthunt.com/posts/purista?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-purista" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=386519&theme=light" alt="PURISTA - Typescript&#0032;framework&#0032;for&#0032;IoT&#0044;&#0032;microservices&#0044;&#0032;and&#0032;serverless | Product Hunt" style="width: 250px; height: 54px;" width="250" height="54" /></a>

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

- [IMqttBridge](type-aliases/IMqttBridge.md)
- [IncomingMessageFunction](type-aliases/IncomingMessageFunction.md)
- [MqttBridgeConfig](type-aliases/MqttBridgeConfig.md)

## Variables

- [getCommandResponseSubscriptionTopic](variables/getCommandResponseSubscriptionTopic.md)
- [getCommandSubscriptionTopic](variables/getCommandSubscriptionTopic.md)
- [getSharedTopicName](variables/getSharedTopicName.md)
- [getSubscriptionTopic](variables/getSubscriptionTopic.md)
- [getTopicName](variables/getTopicName.md)
- [handleCommandResponse](variables/handleCommandResponse.md)
- [puristaVersion](variables/puristaVersion.md)

## Functions

- [getCommandHandler](functions/getCommandHandler.md)
- [getDefaultMqttBridgeConfig](functions/getDefaultMqttBridgeConfig.md)
- [getSubscriptionHandler](functions/getSubscriptionHandler.md)
- [isMatchingTopic](functions/isMatchingTopic.md)
- [msToSec](functions/msToSec.md)
