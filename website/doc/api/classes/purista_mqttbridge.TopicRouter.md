[PURISTA API](../README.md) / [Modules](../modules.md) / [@purista/mqttbridge](../modules/purista_mqttbridge.md) / TopicRouter

# Class: TopicRouter

[@purista/mqttbridge](../modules/purista_mqttbridge.md).TopicRouter

## Table of contents

### Constructors

- [constructor](purista_mqttbridge.TopicRouter.md#constructor)

### Properties

- [counter](purista_mqttbridge.TopicRouter.md#counter)
- [logger](purista_mqttbridge.TopicRouter.md#logger)
- [routes](purista_mqttbridge.TopicRouter.md#routes)

### Methods

- [add](purista_mqttbridge.TopicRouter.md#add)
- [match](purista_mqttbridge.TopicRouter.md#match)
- [remove](purista_mqttbridge.TopicRouter.md#remove)

## Constructors

### constructor

• **new TopicRouter**(`logger?`): [`TopicRouter`](purista_mqttbridge.TopicRouter.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `logger?` | [`Logger`](purista_core.Logger.md) |

#### Returns

[`TopicRouter`](purista_mqttbridge.TopicRouter.md)

#### Defined in

[mqttbridge/src/topic/TopicRouter.ts:13](https://github.com/sebastianwessel/purista/blob/master/packages/mqttbridge/src/topic/TopicRouter.ts#L13)

## Properties

### counter

• **counter**: `number` = `1`

#### Defined in

[mqttbridge/src/topic/TopicRouter.ts:11](https://github.com/sebastianwessel/purista/blob/master/packages/mqttbridge/src/topic/TopicRouter.ts#L11)

___

### logger

• **logger**: [`Logger`](purista_core.Logger.md)

#### Defined in

[mqttbridge/src/topic/TopicRouter.ts:9](https://github.com/sebastianwessel/purista/blob/master/packages/mqttbridge/src/topic/TopicRouter.ts#L9)

___

### routes

• **routes**: `Map`\<`number`, \{ `fn`: [`IncomingMessageFunction`](../modules/purista_mqttbridge.md#incomingmessagefunction) ; `topic`: `string`  }\>

#### Defined in

[mqttbridge/src/topic/TopicRouter.ts:8](https://github.com/sebastianwessel/purista/blob/master/packages/mqttbridge/src/topic/TopicRouter.ts#L8)

## Methods

### add

▸ **add**(`topic`, `fn`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `topic` | `string` |
| `fn` | [`IncomingMessageFunction`](../modules/purista_mqttbridge.md#incomingmessagefunction) |

#### Returns

`number`

#### Defined in

[mqttbridge/src/topic/TopicRouter.ts:18](https://github.com/sebastianwessel/purista/blob/master/packages/mqttbridge/src/topic/TopicRouter.ts#L18)

___

### match

▸ **match**(`topic`, `id?`): [`IncomingMessageFunction`](../modules/purista_mqttbridge.md#incomingmessagefunction)[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `topic` | `string` |
| `id?` | `number` |

#### Returns

[`IncomingMessageFunction`](../modules/purista_mqttbridge.md#incomingmessagefunction)[]

#### Defined in

[mqttbridge/src/topic/TopicRouter.ts:32](https://github.com/sebastianwessel/purista/blob/master/packages/mqttbridge/src/topic/TopicRouter.ts#L32)

___

### remove

▸ **remove**(`topic`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `topic` | `string` \| `number` |

#### Returns

`void`

#### Defined in

[mqttbridge/src/topic/TopicRouter.ts:26](https://github.com/sebastianwessel/purista/blob/master/packages/mqttbridge/src/topic/TopicRouter.ts#L26)
