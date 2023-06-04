[PURISTA API](../README.md) / [Modules](../modules.md) / @purista/natsbridge

# Module: @purista/natsbridge

Package for using a [NATS](https://nats.io/) broker as event bridge.  
The event bridge supports brokers with and without JetStream enabled.

If JetStream is enabled, subscriptions which are marked as durable are persisted by using JetStream.  
If JetStream is not available, subscription fall back to live-subscriptions without any persistence.

**`Example`**

```typescript
import { NatsBridge } from '@purista/natsbridge'

// create and init our eventbridge
  const eventBridge = new NatsBridge()
  await eventBridge.start()

```
 *

## Table of contents

### Classes

- [NatsBridge](../classes/purista_natsbridge.NatsBridge.md)

### Type Aliases

- [IncomingMessageFunction](purista_natsbridge.md#incomingmessagefunction)
- [NatsBridgeConfig](purista_natsbridge.md#natsbridgeconfig)

### Variables

- [puristaVersion](purista_natsbridge.md#puristaversion)

### Functions

- [getCommandSubscriptionTopic](purista_natsbridge.md#getcommandsubscriptiontopic)
- [getDefaultNatsBridgeConfig](purista_natsbridge.md#getdefaultnatsbridgeconfig)
- [getQueueGroupName](purista_natsbridge.md#getqueuegroupname)
- [getSubscriptionTopic](purista_natsbridge.md#getsubscriptiontopic)
- [getTopicName](purista_natsbridge.md#gettopicname)

## Type Aliases

### IncomingMessageFunction

Ƭ **IncomingMessageFunction**: (`this`: [`NatsBridge`](../classes/purista_natsbridge.NatsBridge.md), `error`: `NatsError` \| ``null``, `msg`: `Msg`) => `Promise`<`void`\>

#### Type declaration

▸ (`this`, `error`, `msg`): `Promise`<`void`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`NatsBridge`](../classes/purista_natsbridge.NatsBridge.md) |
| `error` | `NatsError` \| ``null`` |
| `msg` | `Msg` |

##### Returns

`Promise`<`void`\>

#### Defined in

[natsbridge/src/types/IncomingMessageFunction.ts:5](https://github.com/sebastianwessel/purista/blob/master/packages/natsbridge/src/types/IncomingMessageFunction.ts#L5)

___

### NatsBridgeConfig

Ƭ **NatsBridgeConfig**: `Prettify`<{ `commandResponsePublishTwice`: ``"always"`` \| ``"eventOnly"`` \| ``"eventAndError"`` \| ``"never"`` ; `defaultMessageExpiryInterval`: `number` ; `emptyTopicPartString`: `string` ; `maxMessages`: `number` ; `topicPrefix`: `string`  } & `ConnectionOptions`\>

the configuration for the NATS event bridge

#### Defined in

[natsbridge/src/types/NatsBridgeConfig.ts:6](https://github.com/sebastianwessel/purista/blob/master/packages/natsbridge/src/types/NatsBridgeConfig.ts#L6)

## Variables

### puristaVersion

• `Const` **puristaVersion**: ``"1.7.0"``

#### Defined in

[natsbridge/src/version.ts:1](https://github.com/sebastianwessel/purista/blob/master/packages/natsbridge/src/version.ts#L1)

## Functions

### getCommandSubscriptionTopic

▸ **getCommandSubscriptionTopic**(`this`, `address`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`NatsBridge`](../classes/purista_natsbridge.NatsBridge.md) |
| `address` | `EBMessageAddress` |

#### Returns

`string`

#### Defined in

[natsbridge/src/topic/getCommandSubscriptionTopic.impl.ts:5](https://github.com/sebastianwessel/purista/blob/master/packages/natsbridge/src/topic/getCommandSubscriptionTopic.impl.ts#L5)

___

### getDefaultNatsBridgeConfig

▸ **getDefaultNatsBridgeConfig**(): `Object`

#### Returns

`Object`

| Name | Type | Description |
| :------ | :------ | :------ |
| `commandResponsePublishTwice` | ``"always"`` \| ``"never"`` \| ``"eventOnly"`` \| ``"eventAndError"`` | Indicates if a command response should be published a second time. If the command response gets published, it will be published to the regular topic pattern. If set to `never`, subscription might not get messages they are expecting because of the timing. If set to `always`, every command response is published. Because there might not be a consumer for every message, the broker will store the messages until the `defaultMessageExpiryInterval` is reached. This might result in a high ressource consumption of the broker. If set to `eventOnly`, only success responses which have a event name set, are published twice. There, we expect, that an event has at least one consumer subscription and the broker does not unnecessarily stores messages for a long time. **`Default`** ```ts eventOnly ``` |
| `defaultMessageExpiryInterval` | `number` | the message expiry interval in seconds **`Default`** ```ts 30 days in seconds ``` |
| `emptyTopicPartString` | `string` | The string which should be used in topics for parts, which are undefined **`Default`** ```ts __none__ ``` |
| `maxMessages` | `number` | maximum messages to run in parallel per subscription 10 means, each subscription can handle 10 calls at the same time **`Default`** ```ts 10 ``` |
| `topicPrefix` | `string` | the prefix for topic to prevent name collisions **`Default`** ```ts purista ``` |

#### Defined in

[natsbridge/src/getDefaultNatsBridgeConfig.ts:4](https://github.com/sebastianwessel/purista/blob/master/packages/natsbridge/src/getDefaultNatsBridgeConfig.ts#L4)

___

### getQueueGroupName

▸ **getQueueGroupName**(`prefix`, `address`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `prefix` | `string` |
| `address` | `EBMessageAddress` |

#### Returns

`string`

#### Defined in

[natsbridge/src/getQueueGroupName.impl.ts:3](https://github.com/sebastianwessel/purista/blob/master/packages/natsbridge/src/getQueueGroupName.impl.ts#L3)

___

### getSubscriptionTopic

▸ **getSubscriptionTopic**(`this`, `subscription`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`NatsBridge`](../classes/purista_natsbridge.NatsBridge.md) |
| `subscription` | `Subscription` |

#### Returns

`string`

#### Defined in

[natsbridge/src/topic/getSubscriptionTopic.impl.ts:5](https://github.com/sebastianwessel/purista/blob/master/packages/natsbridge/src/topic/getSubscriptionTopic.impl.ts#L5)

___

### getTopicName

▸ **getTopicName**(`this`, `message`): `string`

Calculates the NATS topic name for a message which should be sent.
Something like:
purista/message_type/instance_id/sender_name/sender_version/sender_target/eventname/receiver_name/receiver_version/receiver_target

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `this` | [`NatsBridge`](../classes/purista_natsbridge.NatsBridge.md) | - |
| `message` | `EBMessage` | the message to send |

#### Returns

`string`

the NATS topic

#### Defined in

[natsbridge/src/topic/getTopicName.impl.ts:5](https://github.com/sebastianwessel/purista/blob/master/packages/natsbridge/src/topic/getTopicName.impl.ts#L5)
