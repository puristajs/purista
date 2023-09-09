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

• **new TopicRouter**(`logger?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `logger?` | `Logger` |

#### Defined in

[mqttbridge/src/topic/TopicRouter.ts:12](https://github.com/sebastianwessel/purista/blob/master/packages/mqttbridge/src/topic/TopicRouter.ts#L12)

## Properties

### counter

• **counter**: `number` = `1`

#### Defined in

[mqttbridge/src/topic/TopicRouter.ts:10](https://github.com/sebastianwessel/purista/blob/master/packages/mqttbridge/src/topic/TopicRouter.ts#L10)

___

### logger

• **logger**: `Logger`

#### Defined in

[mqttbridge/src/topic/TopicRouter.ts:8](https://github.com/sebastianwessel/purista/blob/master/packages/mqttbridge/src/topic/TopicRouter.ts#L8)

___

### routes

• **routes**: `Map`<`number`, { `fn`: [`IncomingMessageFunction`](../modules/purista_mqttbridge.md#incomingmessagefunction) ; `topic`: `string`  }\>

#### Defined in

[mqttbridge/src/topic/TopicRouter.ts:7](https://github.com/sebastianwessel/purista/blob/master/packages/mqttbridge/src/topic/TopicRouter.ts#L7)

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

[mqttbridge/src/topic/TopicRouter.ts:17](https://github.com/sebastianwessel/purista/blob/master/packages/mqttbridge/src/topic/TopicRouter.ts#L17)

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

[mqttbridge/src/topic/TopicRouter.ts:31](https://github.com/sebastianwessel/purista/blob/master/packages/mqttbridge/src/topic/TopicRouter.ts#L31)

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

[mqttbridge/src/topic/TopicRouter.ts:25](https://github.com/sebastianwessel/purista/blob/master/packages/mqttbridge/src/topic/TopicRouter.ts#L25)
