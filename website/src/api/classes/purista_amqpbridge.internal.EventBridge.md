[PURISTA API - v1.4.9](../README.md) / [@purista/amqpbridge](../modules/purista_amqpbridge.md) / [internal](../modules/purista_amqpbridge.internal.md) / EventBridge

# Class: EventBridge

[@purista/amqpbridge](../modules/purista_amqpbridge.md).[internal](../modules/purista_amqpbridge.internal.md).EventBridge

Event bridge interface
The event bridge must implement this interface.

## Hierarchy

- [`GenericEventEmitter`](purista_amqpbridge.internal.GenericEventEmitter.md)<[`EventBridgeEvents`](../modules/purista_amqpbridge.internal.md#eventbridgeevents)\>

  ↳ **`EventBridge`**

  ↳↳ [`AmqpBridge`](purista_amqpbridge.AmqpBridge.md)

## Table of contents

### Constructors

- [constructor](purista_amqpbridge.internal.EventBridge.md#constructor)

### Properties

- [defaultCommandTimeout](purista_amqpbridge.internal.EventBridge.md#defaultcommandtimeout)

### Methods

- [emit](purista_amqpbridge.internal.EventBridge.md#emit)
- [emitMessage](purista_amqpbridge.internal.EventBridge.md#emitmessage)
- [invoke](purista_amqpbridge.internal.EventBridge.md#invoke)
- [off](purista_amqpbridge.internal.EventBridge.md#off)
- [on](purista_amqpbridge.internal.EventBridge.md#on)
- [registerServiceFunction](purista_amqpbridge.internal.EventBridge.md#registerservicefunction)
- [registerSubscription](purista_amqpbridge.internal.EventBridge.md#registersubscription)
- [start](purista_amqpbridge.internal.EventBridge.md#start)
- [unregisterServiceFunction](purista_amqpbridge.internal.EventBridge.md#unregisterservicefunction)
- [unregisterSubscription](purista_amqpbridge.internal.EventBridge.md#unregistersubscription)

## Constructors

### constructor

• **new EventBridge**()

#### Inherited from

[GenericEventEmitter](purista_amqpbridge.internal.GenericEventEmitter.md).[constructor](purista_amqpbridge.internal.GenericEventEmitter.md#constructor)

## Properties

### defaultCommandTimeout

• `Readonly` `Abstract` **defaultCommandTimeout**: `number`

#### Defined in

core/lib/core/types/EventBridge.d.ts:12

## Methods

### emit

▸ **emit**<`K`\>(`eventName`, `parameter`): `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends [`EventKey`](../modules/purista_amqpbridge.internal.md#eventkey)<[`EventBridgeEvents`](../modules/purista_amqpbridge.internal.md#eventbridgeevents)\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `K` |
| `parameter` | [`EventBridgeEvents`](../modules/purista_amqpbridge.internal.md#eventbridgeevents)[`K`] |

#### Returns

`void`

#### Inherited from

[GenericEventEmitter](purista_amqpbridge.internal.GenericEventEmitter.md).[emit](purista_amqpbridge.internal.GenericEventEmitter.md#emit)

#### Defined in

core/lib/core/types/GenericEventEmitter.d.ts:13

___

### emitMessage

▸ `Abstract` **emitMessage**(`message`): `Promise`<`Readonly`<[`EBMessage`](../modules/purista_amqpbridge.internal.md#ebmessage)\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | `Omit`<[`EBMessage`](../modules/purista_amqpbridge.internal.md#ebmessage), ``"id"`` \| ``"timestamp"`` \| ``"instanceId"`` \| ``"correlationId"``\> |

#### Returns

`Promise`<`Readonly`<[`EBMessage`](../modules/purista_amqpbridge.internal.md#ebmessage)\>\>

#### Defined in

core/lib/core/types/EventBridge.d.ts:14

___

### invoke

▸ `Abstract` **invoke**<`T`\>(`input`, `contentType?`, `contentEncoding?`, `ttl?`): `Promise`<`T`\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | `Omit`<[`Command`](../modules/purista_amqpbridge.internal.md#command-1)<`unknown`, `unknown`\>, ``"id"`` \| ``"messageType"`` \| ``"timestamp"`` \| ``"instanceId"`` \| ``"correlationId"``\> |
| `contentType?` | `string` |
| `contentEncoding?` | `string` |
| `ttl?` | `number` |

#### Returns

`Promise`<`T`\>

#### Defined in

core/lib/core/types/EventBridge.d.ts:15

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

[GenericEventEmitter](purista_amqpbridge.internal.GenericEventEmitter.md).[off](purista_amqpbridge.internal.GenericEventEmitter.md#off)

#### Defined in

core/lib/core/types/GenericEventEmitter.d.ts:12

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

[GenericEventEmitter](purista_amqpbridge.internal.GenericEventEmitter.md).[on](purista_amqpbridge.internal.GenericEventEmitter.md#on)

#### Defined in

core/lib/core/types/GenericEventEmitter.d.ts:11

___

### registerServiceFunction

▸ `Abstract` **registerServiceFunction**(`address`, `cb`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | [`EBMessageAddress`](../modules/purista_amqpbridge.internal.md#ebmessageaddress) |
| `cb` | (`message`: [`Command`](../modules/purista_amqpbridge.internal.md#command-1)<`unknown`, `unknown`\>) => `Promise`<`Readonly`<`Omit`<[`CommandSuccessResponse`](../modules/purista_amqpbridge.internal.md#commandsuccessresponse-1)<`unknown`\>, ``"instanceId"``\>\> \| `Readonly`<`Omit`<[`CommandErrorResponse`](../modules/purista_amqpbridge.internal.md#commanderrorresponse-1), ``"instanceId"``\>\>\> |

#### Returns

`Promise`<`string`\>

#### Defined in

core/lib/core/types/EventBridge.d.ts:16

___

### registerSubscription

▸ `Abstract` **registerSubscription**(`subscription`, `cb`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `subscription` | [`Subscription`](../modules/purista_amqpbridge.internal.md#subscription) |
| `cb` | (`message`: [`EBMessage`](../modules/purista_amqpbridge.internal.md#ebmessage)) => `Promise`<`void`\> |

#### Returns

`Promise`<`string`\>

#### Defined in

core/lib/core/types/EventBridge.d.ts:18

___

### start

▸ `Abstract` **start**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

core/lib/core/types/EventBridge.d.ts:13

___

### unregisterServiceFunction

▸ `Abstract` **unregisterServiceFunction**(`address`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | [`EBMessageAddress`](../modules/purista_amqpbridge.internal.md#ebmessageaddress) |

#### Returns

`Promise`<`void`\>

#### Defined in

core/lib/core/types/EventBridge.d.ts:17

___

### unregisterSubscription

▸ `Abstract` **unregisterSubscription**(`address`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | [`EBMessageAddress`](../modules/purista_amqpbridge.internal.md#ebmessageaddress) |

#### Returns

`Promise`<`void`\>

#### Defined in

core/lib/core/types/EventBridge.d.ts:19
