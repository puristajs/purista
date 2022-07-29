[PURISTA API - v1.3.1](../README.md) / [@purista/core](../modules/purista_core.md) / DefaultEventBridge

# Class: DefaultEventBridge

[@purista/core](../modules/purista_core.md).DefaultEventBridge

Simple implementation of some simple in-memory event bridge.
Does not support threads and does not need any external databases.

## Hierarchy

- [`EventBridge`](purista_core.EventBridge.md)

  ↳ **`DefaultEventBridge`**

## Table of contents

### Constructors

- [constructor](purista_core.DefaultEventBridge.md#constructor)

### Properties

- [config](purista_core.DefaultEventBridge.md#config)
- [log](purista_core.DefaultEventBridge.md#log)
- [pendingInvocations](purista_core.DefaultEventBridge.md#pendinginvocations)
- [readStream](purista_core.DefaultEventBridge.md#readstream)
- [serviceFunctions](purista_core.DefaultEventBridge.md#servicefunctions)
- [subscriptions](purista_core.DefaultEventBridge.md#subscriptions)
- [writeStream](purista_core.DefaultEventBridge.md#writestream)

### Accessors

- [defaultCommandTimeout](purista_core.DefaultEventBridge.md#defaultcommandtimeout)
- [instanceId](purista_core.DefaultEventBridge.md#instanceid)

### Methods

- [emit](purista_core.DefaultEventBridge.md#emit)
- [emitMessage](purista_core.DefaultEventBridge.md#emitmessage)
- [invoke](purista_core.DefaultEventBridge.md#invoke)
- [off](purista_core.DefaultEventBridge.md#off)
- [on](purista_core.DefaultEventBridge.md#on)
- [registerServiceFunction](purista_core.DefaultEventBridge.md#registerservicefunction)
- [registerSubscription](purista_core.DefaultEventBridge.md#registersubscription)
- [start](purista_core.DefaultEventBridge.md#start)
- [unregisterServiceFunction](purista_core.DefaultEventBridge.md#unregisterservicefunction)
- [unregisterSubscription](purista_core.DefaultEventBridge.md#unregistersubscription)

## Constructors

### constructor

• **new DefaultEventBridge**(`baseLogger`, `conf?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `baseLogger` | [`Logger`](purista_core.Logger.md) |
| `conf` | [`EventBridgeConfig`](../modules/purista_core.md#eventbridgeconfig) |

#### Overrides

[EventBridge](purista_core.EventBridge.md).[constructor](purista_core.EventBridge.md#constructor)

#### Defined in

[core/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts:64](https://github.com/sebastianwessel/purista/blob/81fe9e5/packages/core/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts#L64)

## Properties

### config

• `Protected` **config**: [`EventBridgeEnsuredDefaults`](../modules/purista_core.md#eventbridgeensureddefaults)

#### Defined in

[core/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts:47](https://github.com/sebastianwessel/purista/blob/81fe9e5/packages/core/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts#L47)

___

### log

• `Protected` **log**: [`Logger`](purista_core.Logger.md)

#### Defined in

[core/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts:46](https://github.com/sebastianwessel/purista/blob/81fe9e5/packages/core/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts#L46)

___

### pendingInvocations

• `Protected` **pendingInvocations**: `Map`<`string`, [`PendigInvocation`](../modules/purista_core.md#pendiginvocation)\>

#### Defined in

[core/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts:61](https://github.com/sebastianwessel/purista/blob/81fe9e5/packages/core/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts#L61)

___

### readStream

• `Protected` **readStream**: `Readable`

#### Defined in

[core/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts:49](https://github.com/sebastianwessel/purista/blob/81fe9e5/packages/core/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts#L49)

___

### serviceFunctions

• `Protected` **serviceFunctions**: `Map`<`string`, (`message`: [`Command`](../modules/purista_core.md#command)<`unknown`, `unknown`\>) => `Promise`<[`CommandErrorResponse`](../modules/purista_core.md#commanderrorresponse) \| [`CommandSuccessResponse`](../modules/purista_core.md#commandsuccessresponse)<`unknown`\>\>\>

#### Defined in

[core/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts:56](https://github.com/sebastianwessel/purista/blob/81fe9e5/packages/core/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts#L56)

___

### subscriptions

• `Protected` **subscriptions**: `Map`<`string`, [`SubscriptionStorageEntry`](../modules/purista_core.md#subscriptionstorageentry)\>

#### Defined in

[core/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts:63](https://github.com/sebastianwessel/purista/blob/81fe9e5/packages/core/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts#L63)

___

### writeStream

• `Protected` **writeStream**: `Writable`

#### Defined in

[core/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts:48](https://github.com/sebastianwessel/purista/blob/81fe9e5/packages/core/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts#L48)

## Accessors

### defaultCommandTimeout

• `get` **defaultCommandTimeout**(): `number`

Get default command time out.
It is the maximum time a command should be responded.

#### Returns

`number`

#### Overrides

EventBridge.defaultCommandTimeout

#### Defined in

[core/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts:153](https://github.com/sebastianwessel/purista/blob/81fe9e5/packages/core/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts#L153)

___

### instanceId

• `get` **instanceId**(): `string`

Get instance id.
The id of current event bridge instance.

#### Returns

`string`

#### Defined in

[core/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts:161](https://github.com/sebastianwessel/purista/blob/81fe9e5/packages/core/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts#L161)

## Methods

### emit

▸ **emit**<`K`\>(`eventName`, `params`): `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends [`EventKey`](../modules/purista_core.md#eventkey)<[`EventBridgeEvents`](../modules/purista_core.md#eventbridgeevents)\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `K` |
| `params` | [`EventBridgeEvents`](../modules/purista_core.md#eventbridgeevents)[`K`] |

#### Returns

`void`

#### Inherited from

[EventBridge](purista_core.EventBridge.md).[emit](purista_core.EventBridge.md#emit)

#### Defined in

[core/src/core/types/GenericEventEmitter.ts:24](https://github.com/sebastianwessel/purista/blob/81fe9e5/packages/core/src/core/types/GenericEventEmitter.ts#L24)

___

### emitMessage

▸ **emitMessage**(`message`): `Promise`<`Readonly`<[`EBMessage`](../modules/purista_core.md#ebmessage)\>\>

Emit a new message to event bridge to be delivered to receiver

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | `Omit`<[`EBMessage`](../modules/purista_core.md#ebmessage), ``"id"`` \| ``"timestamp"`` \| ``"instanceId"`` \| ``"correlationId"``\> | EBMessage |

#### Returns

`Promise`<`Readonly`<[`EBMessage`](../modules/purista_core.md#ebmessage)\>\>

#### Overrides

[EventBridge](purista_core.EventBridge.md).[emitMessage](purista_core.EventBridge.md#emitmessage)

#### Defined in

[core/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts:202](https://github.com/sebastianwessel/purista/blob/81fe9e5/packages/core/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts#L202)

___

### invoke

▸ **invoke**<`T`\>(`input`, `_contentType?`, `_contentEncoding?`, `commandTimeout?`): `Promise`<`T`\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `input` | `Omit`<[`Command`](../modules/purista_core.md#command)<`unknown`, `unknown`\>, ``"id"`` \| ``"messageType"`` \| ``"timestamp"`` \| ``"instanceId"`` \| ``"correlationId"``\> | `undefined` |
| `_contentType` | `string` | `'application/json'` |
| `_contentEncoding` | `string` | `'utf-8'` |
| `commandTimeout` | `number` | `undefined` |

#### Returns

`Promise`<`T`\>

#### Overrides

[EventBridge](purista_core.EventBridge.md).[invoke](purista_core.EventBridge.md#invoke)

#### Defined in

[core/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts:223](https://github.com/sebastianwessel/purista/blob/81fe9e5/packages/core/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts#L223)

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

[EventBridge](purista_core.EventBridge.md).[off](purista_core.EventBridge.md#off)

#### Defined in

[core/src/core/types/GenericEventEmitter.ts:20](https://github.com/sebastianwessel/purista/blob/81fe9e5/packages/core/src/core/types/GenericEventEmitter.ts#L20)

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

[EventBridge](purista_core.EventBridge.md).[on](purista_core.EventBridge.md#on)

#### Defined in

[core/src/core/types/GenericEventEmitter.ts:16](https://github.com/sebastianwessel/purista/blob/81fe9e5/packages/core/src/core/types/GenericEventEmitter.ts#L16)

___

### registerServiceFunction

▸ **registerServiceFunction**(`address`, `cb`): `Promise`<`string`\>

Register a service function and ensure that there is a queue for all incoming command requests.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | [`EBMessageAddress`](../modules/purista_core.md#ebmessageaddress) | The service function address |
| `cb` | (`message`: [`Command`](../modules/purista_core.md#command)<`unknown`, `unknown`\>) => `Promise`<[`CommandErrorResponse`](../modules/purista_core.md#commanderrorresponse) \| [`CommandSuccessResponse`](../modules/purista_core.md#commandsuccessresponse)<`unknown`\>\> | the function to call if a matching command message arrives |

#### Returns

`Promise`<`string`\>

the id of command function queue

#### Overrides

[EventBridge](purista_core.EventBridge.md).[registerServiceFunction](purista_core.EventBridge.md#registerservicefunction)

#### Defined in

[core/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts:171](https://github.com/sebastianwessel/purista/blob/81fe9e5/packages/core/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts#L171)

___

### registerSubscription

▸ **registerSubscription**(`subscription`, `cb`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `subscription` | [`Subscription`](../modules/purista_core.md#subscription) |
| `cb` | (`message`: [`EBMessage`](../modules/purista_core.md#ebmessage)) => `Promise`<`void`\> |

#### Returns

`Promise`<`string`\>

#### Overrides

[EventBridge](purista_core.EventBridge.md).[registerSubscription](purista_core.EventBridge.md#registersubscription)

#### Defined in

[core/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts:185](https://github.com/sebastianwessel/purista/blob/81fe9e5/packages/core/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts#L185)

___

### start

▸ **start**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Overrides

[EventBridge](purista_core.EventBridge.md).[start](purista_core.EventBridge.md#start)

#### Defined in

[core/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts:73](https://github.com/sebastianwessel/purista/blob/81fe9e5/packages/core/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts#L73)

___

### unregisterServiceFunction

▸ **unregisterServiceFunction**(`address`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | [`EBMessageAddress`](../modules/purista_core.md#ebmessageaddress) |

#### Returns

`Promise`<`void`\>

#### Overrides

[EventBridge](purista_core.EventBridge.md).[unregisterServiceFunction](purista_core.EventBridge.md#unregisterservicefunction)

#### Defined in

[core/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts:180](https://github.com/sebastianwessel/purista/blob/81fe9e5/packages/core/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts#L180)

___

### unregisterSubscription

▸ **unregisterSubscription**(`address`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | [`EBMessageAddress`](../modules/purista_core.md#ebmessageaddress) |

#### Returns

`Promise`<`void`\>

#### Overrides

[EventBridge](purista_core.EventBridge.md).[unregisterSubscription](purista_core.EventBridge.md#unregistersubscription)

#### Defined in

[core/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts:192](https://github.com/sebastianwessel/purista/blob/81fe9e5/packages/core/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts#L192)
