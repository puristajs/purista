[PURISTA API - v1.4.9](../README.md) / [@purista/core](../modules/purista_core.md) / EventBridge

# Class: EventBridge

[@purista/core](../modules/purista_core.md).EventBridge

Event bridge interface
The event bridge must implement this interface.

## Hierarchy

- [`GenericEventEmitter`](purista_core.GenericEventEmitter.md)<[`EventBridgeEvents`](../modules/purista_core.md#eventbridgeevents)\>

  ↳ **`EventBridge`**

  ↳↳ [`DefaultEventBridge`](purista_core.DefaultEventBridge.md)

## Table of contents

### Constructors

- [constructor](purista_core.EventBridge.md#constructor)

### Properties

- [defaultCommandTimeout](purista_core.EventBridge.md#defaultcommandtimeout)

### Methods

- [emit](purista_core.EventBridge.md#emit)
- [emitMessage](purista_core.EventBridge.md#emitmessage)
- [invoke](purista_core.EventBridge.md#invoke)
- [off](purista_core.EventBridge.md#off)
- [on](purista_core.EventBridge.md#on)
- [registerServiceFunction](purista_core.EventBridge.md#registerservicefunction)
- [registerSubscription](purista_core.EventBridge.md#registersubscription)
- [start](purista_core.EventBridge.md#start)
- [unregisterServiceFunction](purista_core.EventBridge.md#unregisterservicefunction)
- [unregisterSubscription](purista_core.EventBridge.md#unregistersubscription)

## Constructors

### constructor

• **new EventBridge**()

#### Inherited from

[GenericEventEmitter](purista_core.GenericEventEmitter.md).[constructor](purista_core.GenericEventEmitter.md#constructor)

## Properties

### defaultCommandTimeout

• `Readonly` `Abstract` **defaultCommandTimeout**: `number`

#### Defined in

[core/src/core/types/EventBridge.ts:13](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/core/src/core/types/EventBridge.ts#L13)

## Methods

### emit

▸ **emit**<`K`\>(`eventName`, `parameter`): `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends [`EventKey`](../modules/purista_core.md#eventkey)<[`EventBridgeEvents`](../modules/purista_core.md#eventbridgeevents)\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `K` |
| `parameter` | [`EventBridgeEvents`](../modules/purista_core.md#eventbridgeevents)[`K`] |

#### Returns

`void`

#### Inherited from

[GenericEventEmitter](purista_core.GenericEventEmitter.md).[emit](purista_core.GenericEventEmitter.md#emit)

#### Defined in

[core/src/core/types/GenericEventEmitter.ts:24](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/core/src/core/types/GenericEventEmitter.ts#L24)

___

### emitMessage

▸ `Abstract` **emitMessage**(`message`): `Promise`<`Readonly`<[`EBMessage`](../modules/purista_core.md#ebmessage)\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | `Omit`<[`EBMessage`](../modules/purista_core.md#ebmessage), ``"id"`` \| ``"timestamp"`` \| ``"instanceId"`` \| ``"correlationId"``\> |

#### Returns

`Promise`<`Readonly`<[`EBMessage`](../modules/purista_core.md#ebmessage)\>\>

#### Defined in

[core/src/core/types/EventBridge.ts:16](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/core/src/core/types/EventBridge.ts#L16)

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
| `input` | `Omit`<[`Command`](../modules/purista_core.md#command)<`unknown`, `unknown`\>, ``"id"`` \| ``"messageType"`` \| ``"timestamp"`` \| ``"instanceId"`` \| ``"correlationId"``\> |
| `contentType?` | `string` |
| `contentEncoding?` | `string` |
| `ttl?` | `number` |

#### Returns

`Promise`<`T`\>

#### Defined in

[core/src/core/types/EventBridge.ts:20](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/core/src/core/types/EventBridge.ts#L20)

___

### off

▸ **off**<`K`\>(`eventName`, `fn`): `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends [`EventKey`](../modules/purista_core.md#eventkey)<[`EventBridgeEvents`](../modules/purista_core.md#eventbridgeevents)\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `K` |
| `fn` | [`EventReceiver`](../modules/purista_core.internal.md#eventreceiver)<[`EventBridgeEvents`](../modules/purista_core.md#eventbridgeevents)[`K`]\> |

#### Returns

`void`

#### Inherited from

[GenericEventEmitter](purista_core.GenericEventEmitter.md).[off](purista_core.GenericEventEmitter.md#off)

#### Defined in

[core/src/core/types/GenericEventEmitter.ts:20](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/core/src/core/types/GenericEventEmitter.ts#L20)

___

### on

▸ **on**<`K`\>(`eventName`, `fn`): `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends [`EventKey`](../modules/purista_core.md#eventkey)<[`EventBridgeEvents`](../modules/purista_core.md#eventbridgeevents)\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `K` |
| `fn` | [`EventReceiver`](../modules/purista_core.internal.md#eventreceiver)<[`EventBridgeEvents`](../modules/purista_core.md#eventbridgeevents)[`K`]\> |

#### Returns

`void`

#### Inherited from

[GenericEventEmitter](purista_core.GenericEventEmitter.md).[on](purista_core.GenericEventEmitter.md#on)

#### Defined in

[core/src/core/types/GenericEventEmitter.ts:16](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/core/src/core/types/GenericEventEmitter.ts#L16)

___

### registerServiceFunction

▸ `Abstract` **registerServiceFunction**(`address`, `cb`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | [`EBMessageAddress`](../modules/purista_core.md#ebmessageaddress) |
| `cb` | (`message`: [`Command`](../modules/purista_core.md#command)<`unknown`, `unknown`\>) => `Promise`<`Readonly`<`Omit`<[`CommandSuccessResponse`](../modules/purista_core.md#commandsuccessresponse)<`unknown`\>, ``"instanceId"``\>\> \| `Readonly`<`Omit`<[`CommandErrorResponse`](../modules/purista_core.md#commanderrorresponse), ``"instanceId"``\>\>\> |

#### Returns

`Promise`<`string`\>

#### Defined in

[core/src/core/types/EventBridge.ts:27](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/core/src/core/types/EventBridge.ts#L27)

___

### registerSubscription

▸ `Abstract` **registerSubscription**(`subscription`, `cb`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `subscription` | [`Subscription`](../modules/purista_core.md#subscription) |
| `cb` | (`message`: [`EBMessage`](../modules/purista_core.md#ebmessage)) => `Promise`<`void`\> |

#### Returns

`Promise`<`string`\>

#### Defined in

[core/src/core/types/EventBridge.ts:38](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/core/src/core/types/EventBridge.ts#L38)

___

### start

▸ `Abstract` **start**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[core/src/core/types/EventBridge.ts:15](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/core/src/core/types/EventBridge.ts#L15)

___

### unregisterServiceFunction

▸ `Abstract` **unregisterServiceFunction**(`address`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | [`EBMessageAddress`](../modules/purista_core.md#ebmessageaddress) |

#### Returns

`Promise`<`void`\>

#### Defined in

[core/src/core/types/EventBridge.ts:36](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/core/src/core/types/EventBridge.ts#L36)

___

### unregisterSubscription

▸ `Abstract` **unregisterSubscription**(`address`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | [`EBMessageAddress`](../modules/purista_core.md#ebmessageaddress) |

#### Returns

`Promise`<`void`\>

#### Defined in

[core/src/core/types/EventBridge.ts:39](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/core/src/core/types/EventBridge.ts#L39)
