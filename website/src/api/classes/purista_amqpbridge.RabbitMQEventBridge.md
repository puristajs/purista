[PURISTA API - v1.3.1](../README.md) / [@purista/amqpbridge](../modules/purista_amqpbridge.md) / RabbitMQEventBridge

# Class: RabbitMQEventBridge

[@purista/amqpbridge](../modules/purista_amqpbridge.md).RabbitMQEventBridge

A adapter to use rabbitMQ as event bridge.

## Hierarchy

- [`EventBridge`](purista_amqpbridge.internal.EventBridge.md)

  ↳ **`RabbitMQEventBridge`**

## Table of contents

### Constructors

- [constructor](purista_amqpbridge.RabbitMQEventBridge.md#constructor)

### Properties

- [channel](purista_amqpbridge.RabbitMQEventBridge.md#channel)
- [config](purista_amqpbridge.RabbitMQEventBridge.md#config)
- [connection](purista_amqpbridge.RabbitMQEventBridge.md#connection)
- [encoder](purista_amqpbridge.RabbitMQEventBridge.md#encoder)
- [encrypter](purista_amqpbridge.RabbitMQEventBridge.md#encrypter)
- [log](purista_amqpbridge.RabbitMQEventBridge.md#log)
- [pendingInvocations](purista_amqpbridge.RabbitMQEventBridge.md#pendinginvocations)
- [replyQueueName](purista_amqpbridge.RabbitMQEventBridge.md#replyqueuename)
- [serviceFunctions](purista_amqpbridge.RabbitMQEventBridge.md#servicefunctions)
- [subscriptions](purista_amqpbridge.RabbitMQEventBridge.md#subscriptions)

### Accessors

- [defaultCommandTimeout](purista_amqpbridge.RabbitMQEventBridge.md#defaultcommandtimeout)
- [instanceId](purista_amqpbridge.RabbitMQEventBridge.md#instanceid)

### Methods

- [decodeContent](purista_amqpbridge.RabbitMQEventBridge.md#decodecontent)
- [emit](purista_amqpbridge.RabbitMQEventBridge.md#emit)
- [emitMessage](purista_amqpbridge.RabbitMQEventBridge.md#emitmessage)
- [encodeContent](purista_amqpbridge.RabbitMQEventBridge.md#encodecontent)
- [invoke](purista_amqpbridge.RabbitMQEventBridge.md#invoke)
- [off](purista_amqpbridge.RabbitMQEventBridge.md#off)
- [on](purista_amqpbridge.RabbitMQEventBridge.md#on)
- [registerServiceFunction](purista_amqpbridge.RabbitMQEventBridge.md#registerservicefunction)
- [registerSubscription](purista_amqpbridge.RabbitMQEventBridge.md#registersubscription)
- [start](purista_amqpbridge.RabbitMQEventBridge.md#start)
- [unregisterServiceFunction](purista_amqpbridge.RabbitMQEventBridge.md#unregisterservicefunction)
- [unregisterSubscription](purista_amqpbridge.RabbitMQEventBridge.md#unregistersubscription)

## Constructors

### constructor

• **new RabbitMQEventBridge**(`baseLogger`, `conf?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `baseLogger` | [`Logger`](purista_amqpbridge.internal.Logger.md) |
| `conf` | [`RabbitMQEventBridgeConfig`](../modules/purista_amqpbridge.md#rabbitmqeventbridgeconfig) |

#### Overrides

[EventBridge](purista_amqpbridge.internal.EventBridge.md).[constructor](purista_amqpbridge.internal.EventBridge.md#constructor)

#### Defined in

[amqpbridge/src/RabbitMQEventBridge.impl.ts:73](https://github.com/sebastianwessel/purista/blob/81fe9e5/packages/amqpbridge/src/RabbitMQEventBridge.impl.ts#L73)

## Properties

### channel

• `Protected` `Optional` **channel**: `Channel`

#### Defined in

[amqpbridge/src/RabbitMQEventBridge.impl.ts:44](https://github.com/sebastianwessel/purista/blob/81fe9e5/packages/amqpbridge/src/RabbitMQEventBridge.impl.ts#L44)

___

### config

• `Protected` **config**: [`RabbitMQEventBridgeConfig`](../modules/purista_amqpbridge.md#rabbitmqeventbridgeconfig)

#### Defined in

[amqpbridge/src/RabbitMQEventBridge.impl.ts:42](https://github.com/sebastianwessel/purista/blob/81fe9e5/packages/amqpbridge/src/RabbitMQEventBridge.impl.ts#L42)

___

### connection

• `Protected` `Optional` **connection**: `Connection`

#### Defined in

[amqpbridge/src/RabbitMQEventBridge.impl.ts:43](https://github.com/sebastianwessel/purista/blob/81fe9e5/packages/amqpbridge/src/RabbitMQEventBridge.impl.ts#L43)

___

### encoder

• `Protected` **encoder**: [`Encoder`](../modules/purista_amqpbridge.md#encoder)

#### Defined in

[amqpbridge/src/RabbitMQEventBridge.impl.ts:65](https://github.com/sebastianwessel/purista/blob/81fe9e5/packages/amqpbridge/src/RabbitMQEventBridge.impl.ts#L65)

___

### encrypter

• `Protected` **encrypter**: [`Encrypter`](../modules/purista_amqpbridge.md#encrypter)

#### Defined in

[amqpbridge/src/RabbitMQEventBridge.impl.ts:69](https://github.com/sebastianwessel/purista/blob/81fe9e5/packages/amqpbridge/src/RabbitMQEventBridge.impl.ts#L69)

___

### log

• `Protected` **log**: [`Logger`](purista_amqpbridge.internal.Logger.md)

#### Defined in

[amqpbridge/src/RabbitMQEventBridge.impl.ts:41](https://github.com/sebastianwessel/purista/blob/81fe9e5/packages/amqpbridge/src/RabbitMQEventBridge.impl.ts#L41)

___

### pendingInvocations

• `Protected` **pendingInvocations**: `Map`<`string`, [`PendigInvocation`](../modules/purista_amqpbridge.internal.md#pendiginvocation)\>

#### Defined in

[amqpbridge/src/RabbitMQEventBridge.impl.ts:55](https://github.com/sebastianwessel/purista/blob/81fe9e5/packages/amqpbridge/src/RabbitMQEventBridge.impl.ts#L55)

___

### replyQueueName

• `Protected` `Optional` **replyQueueName**: `string`

#### Defined in

[amqpbridge/src/RabbitMQEventBridge.impl.ts:46](https://github.com/sebastianwessel/purista/blob/81fe9e5/packages/amqpbridge/src/RabbitMQEventBridge.impl.ts#L46)

___

### serviceFunctions

• `Protected` **serviceFunctions**: `Map`<`string`, { `cb`: (`message`: [`Command`](../modules/purista_amqpbridge.internal.md#command-1)<`unknown`, `unknown`\>) => `Promise`<[`CommandErrorResponse`](../modules/purista_amqpbridge.internal.md#commanderrorresponse-1) \| [`CommandSuccessResponse`](../modules/purista_amqpbridge.internal.md#commandsuccessresponse-1)<`unknown`\>\> ; `channel`: `Channel`  }\>

#### Defined in

[amqpbridge/src/RabbitMQEventBridge.impl.ts:47](https://github.com/sebastianwessel/purista/blob/81fe9e5/packages/amqpbridge/src/RabbitMQEventBridge.impl.ts#L47)

___

### subscriptions

• `Protected` **subscriptions**: `Map`<`string`, { `cb`: (`message`: [`Command`](../modules/purista_amqpbridge.internal.md#command-1)<`unknown`, `unknown`\>) => `Promise`<`void`\> ; `channel`: `Channel`  }\>

#### Defined in

[amqpbridge/src/RabbitMQEventBridge.impl.ts:57](https://github.com/sebastianwessel/purista/blob/81fe9e5/packages/amqpbridge/src/RabbitMQEventBridge.impl.ts#L57)

## Accessors

### defaultCommandTimeout

• `get` **defaultCommandTimeout**(): `number`

Get default time out.
It is the maximum time a command should be responded.

#### Returns

`number`

#### Overrides

EventBridge.defaultCommandTimeout

#### Defined in

[amqpbridge/src/RabbitMQEventBridge.impl.ts:96](https://github.com/sebastianwessel/purista/blob/81fe9e5/packages/amqpbridge/src/RabbitMQEventBridge.impl.ts#L96)

___

### instanceId

• `get` **instanceId**(): `string`

Get instance id.
The id of current event bridge instance.

#### Returns

`string`

#### Defined in

[amqpbridge/src/RabbitMQEventBridge.impl.ts:104](https://github.com/sebastianwessel/purista/blob/81fe9e5/packages/amqpbridge/src/RabbitMQEventBridge.impl.ts#L104)

## Methods

### decodeContent

▸ `Protected` **decodeContent**<`T`\>(`input`, `contentType`, `contentEncoding`): `Promise`<`T`\>

Decode buffer into given type

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | `Buffer` |
| `contentType` | `string` |
| `contentEncoding` | `string` |

#### Returns

`Promise`<`T`\>

#### Defined in

[amqpbridge/src/RabbitMQEventBridge.impl.ts:549](https://github.com/sebastianwessel/purista/blob/81fe9e5/packages/amqpbridge/src/RabbitMQEventBridge.impl.ts#L549)

___

### emit

▸ **emit**<`K`\>(`eventName`, `params`): `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends [`EventKey`](../modules/purista_amqpbridge.internal.md#eventkey)<[`EventBridgeEvents`](../modules/purista_amqpbridge.internal.md#eventbridgeevents)\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `K` |
| `params` | [`EventBridgeEvents`](../modules/purista_amqpbridge.internal.md#eventbridgeevents)[`K`] |

#### Returns

`void`

#### Inherited from

[EventBridge](purista_amqpbridge.internal.EventBridge.md).[emit](purista_amqpbridge.internal.EventBridge.md#emit)

#### Defined in

core/lib/types/core/types/GenericEventEmitter.d.ts:13

___

### emitMessage

▸ **emitMessage**<`T`\>(`message`, `contentType?`, `contentEncoding?`): `Promise`<`Readonly`<[`EBMessage`](../modules/purista_amqpbridge.internal.md#ebmessage)\>\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`EBMessage`](../modules/purista_amqpbridge.internal.md#ebmessage) |

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `message` | `Omit`<[`EBMessage`](../modules/purista_amqpbridge.internal.md#ebmessage), ``"id"`` \| ``"timestamp"`` \| ``"instanceId"`` \| ``"correlationId"``\> | `undefined` |
| `contentType` | `string` | `'application/json'` |
| `contentEncoding` | `string` | `'utf-8'` |

#### Returns

`Promise`<`Readonly`<[`EBMessage`](../modules/purista_amqpbridge.internal.md#ebmessage)\>\>

#### Overrides

[EventBridge](purista_amqpbridge.internal.EventBridge.md).[emitMessage](purista_amqpbridge.internal.EventBridge.md#emitmessage)

#### Defined in

[amqpbridge/src/RabbitMQEventBridge.impl.ts:196](https://github.com/sebastianwessel/purista/blob/81fe9e5/packages/amqpbridge/src/RabbitMQEventBridge.impl.ts#L196)

___

### encodeContent

▸ `Protected` **encodeContent**<`T`\>(`input`, `contentType`, `contentEncoding`): `Promise`<`Buffer`\>

Encode given payload to buffer

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | `T` |
| `contentType` | `string` |
| `contentEncoding` | `string` |

#### Returns

`Promise`<`Buffer`\>

#### Defined in

[amqpbridge/src/RabbitMQEventBridge.impl.ts:528](https://github.com/sebastianwessel/purista/blob/81fe9e5/packages/amqpbridge/src/RabbitMQEventBridge.impl.ts#L528)

___

### invoke

▸ **invoke**<`T`\>(`input`, `contentType?`, `contentEncoding?`, `commandTimeout?`): `Promise`<`T`\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `input` | `Omit`<[`Command`](../modules/purista_amqpbridge.internal.md#command-1)<`unknown`, `unknown`\>, ``"id"`` \| ``"messageType"`` \| ``"timestamp"`` \| ``"instanceId"`` \| ``"correlationId"``\> | `undefined` |
| `contentType` | `string` | `'application/json'` |
| `contentEncoding` | `string` | `'utf-8'` |
| `commandTimeout` | `number` | `undefined` |

#### Returns

`Promise`<`T`\>

#### Overrides

[EventBridge](purista_amqpbridge.internal.EventBridge.md).[invoke](purista_amqpbridge.internal.EventBridge.md#invoke)

#### Defined in

[amqpbridge/src/RabbitMQEventBridge.impl.ts:237](https://github.com/sebastianwessel/purista/blob/81fe9e5/packages/amqpbridge/src/RabbitMQEventBridge.impl.ts#L237)

___

### off

▸ **off**<`K`\>(`eventName`, `fn`): `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends [`EventKey`](../modules/purista_amqpbridge.internal.md#eventkey)<[`EventBridgeEvents`](../modules/purista_amqpbridge.internal.md#eventbridgeevents)\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `K` |
| `fn` | [`EventReceiver`](../modules/purista_amqpbridge.internal.md#eventreceiver)<[`EventBridgeEvents`](../modules/purista_amqpbridge.internal.md#eventbridgeevents)[`K`]\> |

#### Returns

`void`

#### Inherited from

[EventBridge](purista_amqpbridge.internal.EventBridge.md).[off](purista_amqpbridge.internal.EventBridge.md#off)

#### Defined in

core/lib/types/core/types/GenericEventEmitter.d.ts:12

___

### on

▸ **on**<`K`\>(`eventName`, `fn`): `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends [`EventKey`](../modules/purista_amqpbridge.internal.md#eventkey)<[`EventBridgeEvents`](../modules/purista_amqpbridge.internal.md#eventbridgeevents)\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `K` |
| `fn` | [`EventReceiver`](../modules/purista_amqpbridge.internal.md#eventreceiver)<[`EventBridgeEvents`](../modules/purista_amqpbridge.internal.md#eventbridgeevents)[`K`]\> |

#### Returns

`void`

#### Inherited from

[EventBridge](purista_amqpbridge.internal.EventBridge.md).[on](purista_amqpbridge.internal.EventBridge.md#on)

#### Defined in

core/lib/types/core/types/GenericEventEmitter.d.ts:11

___

### registerServiceFunction

▸ **registerServiceFunction**(`address`, `cb`): `Promise`<`string`\>

Register a service function and ensure that there is a queue for all incoming command requests.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | [`EBMessageAddress`](../modules/purista_amqpbridge.internal.md#ebmessageaddress) | The service function address |
| `cb` | (`message`: [`Command`](../modules/purista_amqpbridge.internal.md#command-1)<`unknown`, `unknown`\>) => `Promise`<[`CommandErrorResponse`](../modules/purista_amqpbridge.internal.md#commanderrorresponse-1) \| [`CommandSuccessResponse`](../modules/purista_amqpbridge.internal.md#commandsuccessresponse-1)<`unknown`\>\> | the function to call if a matching command message arrives |

#### Returns

`Promise`<`string`\>

the id of command function queue

#### Overrides

[EventBridge](purista_amqpbridge.internal.EventBridge.md).[registerServiceFunction](purista_amqpbridge.internal.EventBridge.md#registerservicefunction)

#### Defined in

[amqpbridge/src/RabbitMQEventBridge.impl.ts:346](https://github.com/sebastianwessel/purista/blob/81fe9e5/packages/amqpbridge/src/RabbitMQEventBridge.impl.ts#L346)

___

### registerSubscription

▸ **registerSubscription**(`subscription`, `cb`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `subscription` | [`Subscription`](../modules/purista_amqpbridge.internal.md#subscription) |
| `cb` | (`message`: [`EBMessage`](../modules/purista_amqpbridge.internal.md#ebmessage)) => `Promise`<`void`\> |

#### Returns

`Promise`<`string`\>

#### Overrides

[EventBridge](purista_amqpbridge.internal.EventBridge.md).[registerSubscription](purista_amqpbridge.internal.EventBridge.md#registersubscription)

#### Defined in

[amqpbridge/src/RabbitMQEventBridge.impl.ts:448](https://github.com/sebastianwessel/purista/blob/81fe9e5/packages/amqpbridge/src/RabbitMQEventBridge.impl.ts#L448)

___

### start

▸ **start**(): `Promise`<`void`\>

Connect to RabbitMQ broker, ensure exchange, call back queue

#### Returns

`Promise`<`void`\>

#### Overrides

[EventBridge](purista_amqpbridge.internal.EventBridge.md).[start](purista_amqpbridge.internal.EventBridge.md#start)

#### Defined in

[amqpbridge/src/RabbitMQEventBridge.impl.ts:111](https://github.com/sebastianwessel/purista/blob/81fe9e5/packages/amqpbridge/src/RabbitMQEventBridge.impl.ts#L111)

___

### unregisterServiceFunction

▸ **unregisterServiceFunction**(`address`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | [`EBMessageAddress`](../modules/purista_amqpbridge.internal.md#ebmessageaddress) |

#### Returns

`Promise`<`void`\>

#### Overrides

[EventBridge](purista_amqpbridge.internal.EventBridge.md).[unregisterServiceFunction](purista_amqpbridge.internal.EventBridge.md#unregisterservicefunction)

#### Defined in

[amqpbridge/src/RabbitMQEventBridge.impl.ts:429](https://github.com/sebastianwessel/purista/blob/81fe9e5/packages/amqpbridge/src/RabbitMQEventBridge.impl.ts#L429)

___

### unregisterSubscription

▸ **unregisterSubscription**(`address`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | [`EBMessageAddress`](../modules/purista_amqpbridge.internal.md#ebmessageaddress) |

#### Returns

`Promise`<`void`\>

#### Overrides

[EventBridge](purista_amqpbridge.internal.EventBridge.md).[unregisterSubscription](purista_amqpbridge.internal.EventBridge.md#unregistersubscription)

#### Defined in

[amqpbridge/src/RabbitMQEventBridge.impl.ts:502](https://github.com/sebastianwessel/purista/blob/81fe9e5/packages/amqpbridge/src/RabbitMQEventBridge.impl.ts#L502)
