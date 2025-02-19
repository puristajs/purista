[**@purista/mqttbridge v2.0.0**](../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/mqttbridge](../README.md) / TopicRouter

# Class: TopicRouter

Defined in: [mqttbridge/src/topic/TopicRouter.ts:7](https://github.com/puristajs/purista/blob/master/packages/mqttbridge/src/topic/TopicRouter.ts#L7)

## Constructors

### new TopicRouter()

> **new TopicRouter**(`logger`?): [`TopicRouter`](TopicRouter.md)

Defined in: [mqttbridge/src/topic/TopicRouter.ts:13](https://github.com/puristajs/purista/blob/master/packages/mqttbridge/src/topic/TopicRouter.ts#L13)

#### Parameters

##### logger?

[`Logger`](../../core/classes/Logger.md)

#### Returns

[`TopicRouter`](TopicRouter.md)

## Properties

### counter

> **counter**: `number` = `1`

Defined in: [mqttbridge/src/topic/TopicRouter.ts:11](https://github.com/puristajs/purista/blob/master/packages/mqttbridge/src/topic/TopicRouter.ts#L11)

***

### logger

> **logger**: [`Logger`](../../core/classes/Logger.md)

Defined in: [mqttbridge/src/topic/TopicRouter.ts:9](https://github.com/puristajs/purista/blob/master/packages/mqttbridge/src/topic/TopicRouter.ts#L9)

***

### routes

> **routes**: `Map`\<`number`, \{ `fn`: [`IncomingMessageFunction`](../type-aliases/IncomingMessageFunction.md); `topic`: `string`; \}\>

Defined in: [mqttbridge/src/topic/TopicRouter.ts:8](https://github.com/puristajs/purista/blob/master/packages/mqttbridge/src/topic/TopicRouter.ts#L8)

## Methods

### add()

> **add**(`topic`, `fn`): `number`

Defined in: [mqttbridge/src/topic/TopicRouter.ts:18](https://github.com/puristajs/purista/blob/master/packages/mqttbridge/src/topic/TopicRouter.ts#L18)

#### Parameters

##### topic

`string`

##### fn

[`IncomingMessageFunction`](../type-aliases/IncomingMessageFunction.md)

#### Returns

`number`

***

### match()

> **match**(`topic`, `id`?): [`IncomingMessageFunction`](../type-aliases/IncomingMessageFunction.md)[]

Defined in: [mqttbridge/src/topic/TopicRouter.ts:32](https://github.com/puristajs/purista/blob/master/packages/mqttbridge/src/topic/TopicRouter.ts#L32)

#### Parameters

##### topic

`string`

##### id?

`number`

#### Returns

[`IncomingMessageFunction`](../type-aliases/IncomingMessageFunction.md)[]

***

### remove()

> **remove**(`topic`): `void`

Defined in: [mqttbridge/src/topic/TopicRouter.ts:26](https://github.com/puristajs/purista/blob/master/packages/mqttbridge/src/topic/TopicRouter.ts#L26)

#### Parameters

##### topic

`string` | `number`

#### Returns

`void`
