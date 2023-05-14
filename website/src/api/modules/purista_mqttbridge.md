[PURISTA API](../README.md) / [Modules](../modules.md) / @purista/mqttbridge

# Module: @purista/mqttbridge

Package for using a MQTT broker like rabbitMQ as event bridge.

Example usage:

**`Example`**

```typescript
import { MqttBridge } from '@purista/mqttbridge'

// create and init our eventbridge
const eventBridge = new MqttBridge()
await eventBridge.start()

```

## Table of contents

### Classes

- [AsyncClient](../classes/purista_mqttbridge.AsyncClient.md)
- [MqttBridge](../classes/purista_mqttbridge.MqttBridge.md)
- [TopicRouter](../classes/purista_mqttbridge.TopicRouter.md)

### Type Aliases

- [ISubscriptionResponse](purista_mqttbridge.md#isubscriptionresponse)
- [IncomingMessageFunction](purista_mqttbridge.md#incomingmessagefunction)
- [MqttBridgeConfig](purista_mqttbridge.md#mqttbridgeconfig)

### Functions

- [getCommandHandler](purista_mqttbridge.md#getcommandhandler)
- [getCommandResponseTopic](purista_mqttbridge.md#getcommandresponsetopic)
- [getCommandSubscriptionTopic](purista_mqttbridge.md#getcommandsubscriptiontopic)
- [getDefaultMqttBridgeConfig](purista_mqttbridge.md#getdefaultmqttbridgeconfig)
- [getSharedTopicName](purista_mqttbridge.md#getsharedtopicname)
- [getSubscriptionHandler](purista_mqttbridge.md#getsubscriptionhandler)
- [getSubscriptionTopic](purista_mqttbridge.md#getsubscriptiontopic)
- [getTopicName](purista_mqttbridge.md#gettopicname)
- [handleCommandResponse](purista_mqttbridge.md#handlecommandresponse)
- [isMatchingTopic](purista_mqttbridge.md#ismatchingtopic)
- [msToSec](purista_mqttbridge.md#mstosec)

## Type Aliases

### ISubscriptionResponse

Ƭ **ISubscriptionResponse**: `Prettify`<`ISubscriptionGrant` & { `properties?`: { `subscriptionIdentifier?`: `number`  }  }\>

#### Defined in

[packages/mqttbridge/src/AsyncClient/AsyncClient.ts:12](https://github.com/sebastianwessel/purista/blob/master/packages/mqttbridge/src/AsyncClient/AsyncClient.ts#L12)

___

### IncomingMessageFunction

Ƭ **IncomingMessageFunction**: (`this`: [`MqttBridge`](../classes/purista_mqttbridge.MqttBridge.md), `payload`: `EBMessage`, `packet`: `IPublishPacket`) => `Promise`<`void`\>

#### Type declaration

▸ (`this`, `payload`, `packet`): `Promise`<`void`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`MqttBridge`](../classes/purista_mqttbridge.MqttBridge.md) |
| `payload` | `EBMessage` |
| `packet` | `IPublishPacket` |

##### Returns

`Promise`<`void`\>

#### Defined in

[packages/mqttbridge/src/types/IncomingMessageFunction.ts:6](https://github.com/sebastianwessel/purista/blob/master/packages/mqttbridge/src/types/IncomingMessageFunction.ts#L6)

___

### MqttBridgeConfig

Ƭ **MqttBridgeConfig**: `Prettify`<{ `allowRetries?`: `boolean` ; `commandResponsePublishTwice`: ``"always"`` \| ``"eventOnly"`` \| ``"eventAndError"`` \| ``"never"`` ; `defaultMessageExpiryInterval`: `number` ; `defaultSessionExpiryInterval`: `number` ; `emptyTopicPartString`: `string` ; `qoSSubscription`: `QoS` ; `qosCommand`: `QoS` ; `shareTopicName`: `string` ; `shareTopicPrefix`: `string` ; `topicPrefix`: `string`  } & `IClientOptions`\>

the configuration for the MQTT event bridge

#### Defined in

[packages/mqttbridge/src/types/MqttBridgeConfig.ts:7](https://github.com/sebastianwessel/purista/blob/master/packages/mqttbridge/src/types/MqttBridgeConfig.ts#L7)

## Functions

### getCommandHandler

▸ **getCommandHandler**(`address`, `cb`, `_metadata`, `_eventBridgeConfig`): [`IncomingMessageFunction`](purista_mqttbridge.md#incomingmessagefunction)

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `EBMessageAddress` |
| `cb` | (`message`: { `contentEncoding`: `string` ; `contentType`: `string` ; `correlationId`: `string` ; `eventName?`: `string` ; `id`: `string` ; `instanceId`: `string` ; `messageType`: `Command` ; `otp?`: `string` ; `payload`: { `parameter`: `unknown` ; `payload`: `unknown`  } ; `principalId?`: `string` ; `receiver`: `EBMessageAddress` ; `sender`: `EBMessageAddress` ; `timestamp`: `number` ; `traceId?`: `string`  }) => `Promise`<{ `contentEncoding`: ``"utf-8"`` ; `contentType`: ``"application/json"`` ; `correlationId`: `string` ; `eventName?`: `string` ; `id`: `string` ; `instanceId`: `string` ; `isHandledError`: `boolean` ; `messageType`: `CommandErrorResponse` ; `otp?`: `string` ; `payload`: { `data?`: `unknown` ; `message`: `string` ; `status`: `StatusCode`  } ; `principalId?`: `string` ; `receiver`: `EBMessageAddress` ; `sender`: `EBMessageAddress` ; `timestamp`: `number` ; `traceId?`: `string`  } \| { `contentEncoding`: `string` ; `contentType`: `string` ; `correlationId`: `string` ; `eventName?`: `string` ; `id`: `string` ; `instanceId`: `string` ; `messageType`: `CommandSuccessResponse` ; `otp?`: `string` ; `payload`: `unknown` ; `principalId?`: `string` ; `receiver`: `EBMessageAddress` ; `sender`: `EBMessageAddress` ; `timestamp`: `number` ; `traceId?`: `string`  }\> |
| `_metadata` | `CommandDefinitionMetadataBase` |
| `_eventBridgeConfig` | `DefinitionEventBridgeConfig` |

#### Returns

[`IncomingMessageFunction`](purista_mqttbridge.md#incomingmessagefunction)

#### Defined in

[packages/mqttbridge/src/handler/getCommandHandler.impl.ts:27](https://github.com/sebastianwessel/purista/blob/master/packages/mqttbridge/src/handler/getCommandHandler.impl.ts#L27)

___

### getCommandResponseTopic

▸ **getCommandResponseTopic**(`this`, `instanceId?`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`MqttBridge`](../classes/purista_mqttbridge.MqttBridge.md) |
| `instanceId?` | `string` |

#### Returns

`string`

#### Defined in

[packages/mqttbridge/src/topic/getCommandResponseTopic.impl.ts:7](https://github.com/sebastianwessel/purista/blob/master/packages/mqttbridge/src/topic/getCommandResponseTopic.impl.ts#L7)

___

### getCommandSubscriptionTopic

▸ **getCommandSubscriptionTopic**(`this`, `address`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`MqttBridge`](../classes/purista_mqttbridge.MqttBridge.md) |
| `address` | `EBMessageAddress` |

#### Returns

`string`

#### Defined in

[packages/mqttbridge/src/topic/getCommandSubscriptionTopic.impl.ts:7](https://github.com/sebastianwessel/purista/blob/master/packages/mqttbridge/src/topic/getCommandSubscriptionTopic.impl.ts#L7)

___

### getDefaultMqttBridgeConfig

▸ **getDefaultMqttBridgeConfig**(): `Object`

#### Returns

`Object`

| Name | Type | Description |
| :------ | :------ | :------ |
| `allowRetries?` | `boolean` | allow retry of the initial connect |
| `commandResponsePublishTwice` | ``"always"`` \| ``"never"`` \| ``"eventOnly"`` \| ``"eventAndError"`` | Indicates if a command response should be published a second time. If the command response gets published, it will be published to the regular topic pattern. The QOS and expiry will be set to subscription configuration values. If set to `never`, subscription might not get messages they are expecting because of the timing. If set to `always`, every command response is published. Because there might not be a consumer for every message, the broker will store the messages until the `defaultMessageExpiryInterval` is reached. This might result in a high ressource consumption of the broker. If set to `eventOnly`, only success responses which have a event name set, are published twice. There, we expect, that an event has at least one consumer subscription and the broker does not unnecessarily stores messages for a long time. **`Default`** ```ts eventOnly ``` |
| `defaultMessageExpiryInterval` | `number` | the message expiry interval in seconds **`Default`** ```ts ``` |
| `defaultSessionExpiryInterval` | `number` | **`Default`** ```ts 0 ``` |
| `emptyTopicPartString` | `string` | The string which should be used in topics for parts, which are undefined **`Default`** ```ts __none__ ``` |
| `qoSSubscription` | `QoS` | QOS for all subscriptions **`Default`** ```ts 1 ``` |
| `qosCommand` | `QoS` | QOS for command, command responses and command response subscriptions messages **`Default`** ```ts 1 ``` |
| `shareTopicName` | `string` | the name of the shared topic (similar to pubsub name) **`Default`** ```ts purista ``` |
| `shareTopicPrefix` | `string` | the prefix to be used to dynamically create topic names for shared subscriptions **`Default`** ```ts $share ``` |
| `topicPrefix` | `string` | the prefix for topic to prevent name collisions **`Default`** ```ts purista ``` |

#### Defined in

[packages/mqttbridge/src/getDefaultMqttBridgeConfig.impl.ts:5](https://github.com/sebastianwessel/purista/blob/master/packages/mqttbridge/src/getDefaultMqttBridgeConfig.impl.ts#L5)

___

### getSharedTopicName

▸ **getSharedTopicName**(`this`, `topic`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`MqttBridge`](../classes/purista_mqttbridge.MqttBridge.md) |
| `topic` | `string` |

#### Returns

`string`

#### Defined in

[packages/mqttbridge/src/topic/getSharedTopicName.impl.ts:5](https://github.com/sebastianwessel/purista/blob/master/packages/mqttbridge/src/topic/getSharedTopicName.impl.ts#L5)

___

### getSubscriptionHandler

▸ **getSubscriptionHandler**(`_subscription`, `cb`): [`IncomingMessageFunction`](purista_mqttbridge.md#incomingmessagefunction)

#### Parameters

| Name | Type |
| :------ | :------ |
| `_subscription` | `Subscription` |
| `cb` | (`message`: `EBMessage`) => `Promise`<`undefined` \| `Omit`<{ `contentEncoding`: `string` ; `contentType`: `string` ; `correlationId?`: `string` ; `eventName`: `string` ; `id`: `string` ; `instanceId`: `string` ; `messageType`: `CustomMessage` ; `otp?`: `string` ; `payload?`: `unknown` ; `principalId?`: `string` ; `receiver?`: `EBMessageAddress` ; `sender`: `EBMessageAddress` ; `timestamp`: `number` ; `traceId?`: `string`  }, ``"id"`` \| ``"instanceId"`` \| ``"timestamp"``\>\> |

#### Returns

[`IncomingMessageFunction`](purista_mqttbridge.md#incomingmessagefunction)

#### Defined in

[packages/mqttbridge/src/handler/getSubscriptionHandler.impl.ts:20](https://github.com/sebastianwessel/purista/blob/master/packages/mqttbridge/src/handler/getSubscriptionHandler.impl.ts#L20)

___

### getSubscriptionTopic

▸ **getSubscriptionTopic**(`this`, `subscription`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`MqttBridge`](../classes/purista_mqttbridge.MqttBridge.md) |
| `subscription` | `Subscription` |

#### Returns

`string`

#### Defined in

[packages/mqttbridge/src/topic/getSubscriptionTopic.impl.ts:7](https://github.com/sebastianwessel/purista/blob/master/packages/mqttbridge/src/topic/getSubscriptionTopic.impl.ts#L7)

___

### getTopicName

▸ **getTopicName**(`this`, `message`): `string`

Calculates the MQTT topic name for a message which should be sent.
Something like:
purista/message_type/instance_id/sender_name/sender_version/sender_target/eventname/receiver_name/receiver_version/receiver_target

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `this` | [`MqttBridge`](../classes/purista_mqttbridge.MqttBridge.md) | - |
| `message` | `EBMessage` | the message to send |

#### Returns

`string`

the MQTT topic

#### Defined in

[packages/mqttbridge/src/topic/getTopicName.impl.ts:7](https://github.com/sebastianwessel/purista/blob/master/packages/mqttbridge/src/topic/getTopicName.impl.ts#L7)

___

### handleCommandResponse

▸ **handleCommandResponse**(`this`, `payload`, `packet`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`MqttBridge`](../classes/purista_mqttbridge.MqttBridge.md) |
| `payload` | `EBMessage` |
| `packet` | `IPublishPacket` |

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/mqttbridge/src/types/IncomingMessageFunction.ts:6](https://github.com/sebastianwessel/purista/blob/master/packages/mqttbridge/src/types/IncomingMessageFunction.ts#L6)

___

### isMatchingTopic

▸ **isMatchingTopic**(`input`, `pattern`): `boolean`

Checks if a given topic is matching against a subscription pattern

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `input` | `string` | the real full topic |
| `pattern` | `string` | the topic subscription pattern |

#### Returns

`boolean`

#### Defined in

[packages/mqttbridge/src/topic/isMatchingTopic.impl.ts:8](https://github.com/sebastianwessel/purista/blob/master/packages/mqttbridge/src/topic/isMatchingTopic.impl.ts#L8)

___

### msToSec

▸ **msToSec**(`ms`): `number`

Convert milliseconds into seconds and round decimal to integer if needed.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `ms` | `number` | Value in millisconads |

#### Returns

`number`

rounded value in seconds

#### Defined in

[packages/mqttbridge/src/msToSec.impl.ts:7](https://github.com/sebastianwessel/purista/blob/master/packages/mqttbridge/src/msToSec.impl.ts#L7)
