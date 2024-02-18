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

- [MqttBridge](../classes/purista_mqttbridge.MqttBridge.md)
- [TopicRouter](../classes/purista_mqttbridge.TopicRouter.md)

### Type Aliases

- [IncomingMessageFunction](purista_mqttbridge.md#incomingmessagefunction)
- [MqttBridgeConfig](purista_mqttbridge.md#mqttbridgeconfig)

### Variables

- [puristaVersion](purista_mqttbridge.md#puristaversion)

### Functions

- [getCommandHandler](purista_mqttbridge.md#getcommandhandler)
- [getCommandResponseSubscriptionTopic](purista_mqttbridge.md#getcommandresponsesubscriptiontopic)
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

### IncomingMessageFunction

Ƭ **IncomingMessageFunction**: (`this`: [`MqttBridge`](../classes/purista_mqttbridge.MqttBridge.md), `payload`: [`EBMessage`](purista_core.md#ebmessage), `packet`: `IPublishPacket`) => `Promise`\<`void`\>

#### Type declaration

▸ (`this`, `payload`, `packet`): `Promise`\<`void`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`MqttBridge`](../classes/purista_mqttbridge.MqttBridge.md) |
| `payload` | [`EBMessage`](purista_core.md#ebmessage) |
| `packet` | `IPublishPacket` |

##### Returns

`Promise`\<`void`\>

#### Defined in

[mqttbridge/src/types/IncomingMessageFunction.ts:6](https://github.com/sebastianwessel/purista/blob/master/packages/mqttbridge/src/types/IncomingMessageFunction.ts#L6)

___

### MqttBridgeConfig

Ƭ **MqttBridgeConfig**: [`Prettify`](purista_core.md#prettify)\<\{ `allowRetries?`: `boolean` ; `defaultMessageExpiryInterval`: `number` ; `defaultSessionExpiryInterval`: `number` ; `emptyTopicPartString`: `string` ; `qoSSubscription`: `QoS` ; `qosCommand`: `QoS` ; `shareTopicName`: `string` ; `shareTopicPrefix`: `string` ; `topicPrefix`: `string`  } & `IClientOptions`\>

the configuration for the MQTT event bridge

#### Defined in

[mqttbridge/src/types/MqttBridgeConfig.ts:8](https://github.com/sebastianwessel/purista/blob/master/packages/mqttbridge/src/types/MqttBridgeConfig.ts#L8)

## Variables

### puristaVersion

• `Const` **puristaVersion**: ``"1.10.6"``

#### Defined in

[mqttbridge/src/version.ts:1](https://github.com/sebastianwessel/purista/blob/master/packages/mqttbridge/src/version.ts#L1)

## Functions

### getCommandHandler

▸ **getCommandHandler**(`address`, `cb`, `_metadata`, `_eventBridgeConfig`): [`IncomingMessageFunction`](purista_mqttbridge.md#incomingmessagefunction)

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | [`EBMessageAddress`](purista_core.md#ebmessageaddress) |
| `cb` | (`message`: \{ `contentEncoding`: `string` ; `contentType`: `string` ; `correlationId`: `string` ; `eventName?`: `string` ; `id`: `string` ; `messageType`: [`Command`](../enums/purista_core.EBMessageType.md#command) ; `otp?`: `string` ; `payload`: \{ `parameter`: `unknown` ; `payload`: `unknown`  } ; `principalId?`: `string` ; `receiver`: [`EBMessageAddress`](purista_core.md#ebmessageaddress) ; `sender`: \{ `instanceId`: `string` ; `serviceName`: `string` ; `serviceTarget`: `string` ; `serviceVersion`: `string`  } ; `tenantId?`: `string` ; `timestamp`: `number` ; `traceId?`: `string`  }) => `Promise`\<\{ `contentEncoding`: ``"utf-8"`` ; `contentType`: ``"application/json"`` ; `correlationId`: `string` ; `eventName?`: `string` ; `id`: `string` ; `isHandledError`: `boolean` ; `messageType`: [`CommandErrorResponse`](../enums/purista_core.EBMessageType.md#commanderrorresponse) ; `otp?`: `string` ; `payload`: \{ `data?`: `unknown` ; `message`: `string` ; `status`: [`StatusCode`](../enums/purista_core.StatusCode.md)  } ; `principalId?`: `string` ; `receiver`: \{ `instanceId`: `string` ; `serviceName`: `string` ; `serviceTarget`: `string` ; `serviceVersion`: `string`  } ; `sender`: \{ `instanceId`: `string` ; `serviceName`: `string` ; `serviceTarget`: `string` ; `serviceVersion`: `string`  } ; `tenantId?`: `string` ; `timestamp`: `number` ; `traceId?`: `string`  } \| \{ `contentEncoding`: `string` ; `contentType`: `string` ; `correlationId`: `string` ; `eventName?`: `string` ; `id`: `string` ; `messageType`: [`CommandSuccessResponse`](../enums/purista_core.EBMessageType.md#commandsuccessresponse) ; `otp?`: `string` ; `payload`: `unknown` ; `principalId?`: `string` ; `receiver`: \{ `instanceId`: `string` ; `serviceName`: `string` ; `serviceTarget`: `string` ; `serviceVersion`: `string`  } ; `sender`: \{ `instanceId`: `string` ; `serviceName`: `string` ; `serviceTarget`: `string` ; `serviceVersion`: `string`  } ; `tenantId?`: `string` ; `timestamp`: `number` ; `traceId?`: `string`  }\> |
| `_metadata` | [`CommandDefinitionMetadataBase`](purista_core.md#commanddefinitionmetadatabase) |
| `_eventBridgeConfig` | [`DefinitionEventBridgeConfig`](purista_core.md#definitioneventbridgeconfig) |

#### Returns

[`IncomingMessageFunction`](purista_mqttbridge.md#incomingmessagefunction)

#### Defined in

[mqttbridge/src/handler/getCommandHandler.impl.ts:29](https://github.com/sebastianwessel/purista/blob/master/packages/mqttbridge/src/handler/getCommandHandler.impl.ts#L29)

___

### getCommandResponseSubscriptionTopic

▸ **getCommandResponseSubscriptionTopic**(`this`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`MqttBridge`](../classes/purista_mqttbridge.MqttBridge.md) |

#### Returns

`string`

#### Defined in

[mqttbridge/src/topic/getCommandResponseSubscriptionTopic.impl.ts:8](https://github.com/sebastianwessel/purista/blob/master/packages/mqttbridge/src/topic/getCommandResponseSubscriptionTopic.impl.ts#L8)

___

### getCommandSubscriptionTopic

▸ **getCommandSubscriptionTopic**(`this`, `address`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`MqttBridge`](../classes/purista_mqttbridge.MqttBridge.md) |
| `address` | [`EBMessageAddress`](purista_core.md#ebmessageaddress) |

#### Returns

`string`

#### Defined in

[mqttbridge/src/topic/getCommandSubscriptionTopic.impl.ts:10](https://github.com/sebastianwessel/purista/blob/master/packages/mqttbridge/src/topic/getCommandSubscriptionTopic.impl.ts#L10)

___

### getDefaultMqttBridgeConfig

▸ **getDefaultMqttBridgeConfig**(): `Object`

#### Returns

`Object`

| Name | Type | Description |
| :------ | :------ | :------ |
| `allowRetries?` | `boolean` | allow retry of the initial connect |
| `defaultMessageExpiryInterval` | `number` | the message expiry interval in seconds **`Default`** ```ts ``` |
| `defaultSessionExpiryInterval` | `number` | **`Default`** ```ts 0 ``` |
| `emptyTopicPartString` | `string` | The string which should be used in topics for parts, which are undefined **`Default`** ```ts __none__ ``` |
| `qoSSubscription` | `QoS` | QOS for all subscriptions **`Default`** ```ts 1 ``` |
| `qosCommand` | `QoS` | QOS for command, command responses and command response subscriptions messages **`Default`** ```ts 1 ``` |
| `shareTopicName` | `string` | the name of the shared topic (similar to pubsub name) **`Default`** ```ts sharedpurista ``` |
| `shareTopicPrefix` | `string` | the prefix to be used to dynamically create topic names for shared subscriptions **`Default`** ```ts $share ``` |
| `topicPrefix` | `string` | the prefix for topic to prevent name collisions **`Default`** ```ts purista ``` |

#### Defined in

[mqttbridge/src/getDefaultMqttBridgeConfig.impl.ts:5](https://github.com/sebastianwessel/purista/blob/master/packages/mqttbridge/src/getDefaultMqttBridgeConfig.impl.ts#L5)

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

[mqttbridge/src/topic/getSharedTopicName.impl.ts:7](https://github.com/sebastianwessel/purista/blob/master/packages/mqttbridge/src/topic/getSharedTopicName.impl.ts#L7)

___

### getSubscriptionHandler

▸ **getSubscriptionHandler**(`_subscription`, `cb`): [`IncomingMessageFunction`](purista_mqttbridge.md#incomingmessagefunction)

#### Parameters

| Name | Type |
| :------ | :------ |
| `_subscription` | [`Subscription`](purista_core.md#subscription) |
| `cb` | (`message`: [`EBMessage`](purista_core.md#ebmessage)) => `Promise`\<`undefined` \| `Omit`\<\{ `contentEncoding`: `string` ; `contentType`: `string` ; `correlationId?`: `string` ; `eventName`: `string` ; `id`: `string` ; `messageType`: [`CustomMessage`](../enums/purista_core.EBMessageType.md#custommessage) ; `otp?`: `string` ; `payload?`: `unknown` ; `principalId?`: `string` ; `receiver?`: [`EBMessageAddress`](purista_core.md#ebmessageaddress) ; `sender`: \{ `instanceId`: `string` ; `serviceName`: `string` ; `serviceTarget`: `string` ; `serviceVersion`: `string`  } ; `tenantId?`: `string` ; `timestamp`: `number` ; `traceId?`: `string`  }, ``"id"`` \| ``"timestamp"``\>\> |

#### Returns

[`IncomingMessageFunction`](purista_mqttbridge.md#incomingmessagefunction)

#### Defined in

[mqttbridge/src/handler/getSubscriptionHandler.impl.ts:18](https://github.com/sebastianwessel/purista/blob/master/packages/mqttbridge/src/handler/getSubscriptionHandler.impl.ts#L18)

___

### getSubscriptionTopic

▸ **getSubscriptionTopic**(`this`, `subscription`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`MqttBridge`](../classes/purista_mqttbridge.MqttBridge.md) |
| `subscription` | [`Subscription`](purista_core.md#subscription) |

#### Returns

`string`

#### Defined in

[mqttbridge/src/topic/getSubscriptionTopic.impl.ts:10](https://github.com/sebastianwessel/purista/blob/master/packages/mqttbridge/src/topic/getSubscriptionTopic.impl.ts#L10)

___

### getTopicName

▸ **getTopicName**(`this`, `message`): `string`

Calculates the MQTT topic name for a message which should be sent.
Something like:
purista/
message_type/
principal_id/
sender_instance_id/
sender_name/
sender_version/
sender_target/
eventname/
sender_instance_id/
receiver_name/
receiver_version/
receiver_target

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `this` | [`MqttBridge`](../classes/purista_mqttbridge.MqttBridge.md) | - |
| `message` | [`EBMessage`](purista_core.md#ebmessage) | the message to send |

#### Returns

`string`

the MQTT topic

#### Defined in

[mqttbridge/src/topic/getTopicName.impl.ts:31](https://github.com/sebastianwessel/purista/blob/master/packages/mqttbridge/src/topic/getTopicName.impl.ts#L31)

___

### handleCommandResponse

▸ **handleCommandResponse**(`this`, `payload`, `packet`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`MqttBridge`](../classes/purista_mqttbridge.MqttBridge.md) |
| `payload` | [`EBMessage`](purista_core.md#ebmessage) |
| `packet` | `IPublishPacket` |

#### Returns

`Promise`\<`void`\>

#### Defined in

[mqttbridge/src/handler/handleCommandResponse.impl.ts:16](https://github.com/sebastianwessel/purista/blob/master/packages/mqttbridge/src/handler/handleCommandResponse.impl.ts#L16)

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

[mqttbridge/src/topic/isMatchingTopic.impl.ts:8](https://github.com/sebastianwessel/purista/blob/master/packages/mqttbridge/src/topic/isMatchingTopic.impl.ts#L8)

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

[mqttbridge/src/msToSec.impl.ts:7](https://github.com/sebastianwessel/purista/blob/master/packages/mqttbridge/src/msToSec.impl.ts#L7)
