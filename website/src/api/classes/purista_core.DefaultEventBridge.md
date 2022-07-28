[PURISTA API - v1.3.1](../README.md) / [@purista/core](../modules/purista_core.md) / DefaultEventBridge

# Class: DefaultEventBridge

[@purista/core](../modules/purista_core.md).DefaultEventBridge

Simple implementation of some simple in-memory event bridge.
Does not support threads and does not need any external databases.

## Implements

- [`EventBridge`](../interfaces/purista_core.EventBridge.md)

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

- [defaultTtl](purista_core.DefaultEventBridge.md#defaultttl)
- [instanceId](purista_core.DefaultEventBridge.md#instanceid)

### Methods

- [emit](purista_core.DefaultEventBridge.md#emit)
- [invoke](purista_core.DefaultEventBridge.md#invoke)
- [registerServiceFunction](purista_core.DefaultEventBridge.md#registerservicefunction)
- [registerSubscription](purista_core.DefaultEventBridge.md#registersubscription)
- [unregisterServiceFunction](purista_core.DefaultEventBridge.md#unregisterservicefunction)
- [unregisterSubscription](purista_core.DefaultEventBridge.md#unregistersubscription)

## Constructors

### constructor

• **new DefaultEventBridge**(`baseLogger`, `conf?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `baseLogger` | [`Logger`](../modules/purista_core.md#logger) |
| `conf` | [`EventBridgeConfig`](../modules/purista_core.md#eventbridgeconfig) |

#### Defined in

[core/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts:62](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts#L62)

## Properties

### config

• `Protected` **config**: [`EventBridgeEnsuredDefaults`](../modules/purista_core.md#eventbridgeensureddefaults)

#### Defined in

[core/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts:49](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts#L49)

___

### log

• `Protected` **log**: [`Logger`](../modules/purista_core.md#logger)

#### Defined in

[core/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts:48](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts#L48)

___

### pendingInvocations

• `Protected` **pendingInvocations**: `Map`<`string`, [`PendigInvocation`](../modules/purista_core.internal.md#pendiginvocation)\>

#### Defined in

[core/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts:59](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts#L59)

___

### readStream

• `Protected` **readStream**: `Readable`

#### Defined in

[core/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts:51](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts#L51)

___

### serviceFunctions

• `Protected` **serviceFunctions**: `Map`<`string`, (`message`: [`Command`](../modules/purista_core.md#command)<`unknown`, `unknown`\>) => `void`\>

#### Defined in

[core/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts:58](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts#L58)

___

### subscriptions

• `Protected` **subscriptions**: `Map`<`string`, [`SubscriptionStorageEntry`](../modules/purista_core.internal.md#subscriptionstorageentry)\>

#### Defined in

[core/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts:61](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts#L61)

___

### writeStream

• `Protected` **writeStream**: `Writable`

#### Defined in

[core/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts:50](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts#L50)

## Accessors

### defaultTtl

• `get` **defaultTtl**(): `number`

Get default time out.
It is the maximum time a command should be responded.

#### Returns

`number`

#### Implementation of

[EventBridge](../interfaces/purista_core.EventBridge.md).[defaultTtl](../interfaces/purista_core.EventBridge.md#defaultttl)

#### Defined in

[core/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts:127](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts#L127)

___

### instanceId

• `get` **instanceId**(): `string`

Get instance id.
The id of current event bridge instance.

#### Returns

`string`

#### Defined in

[core/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts:135](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts#L135)

## Methods

### emit

▸ **emit**(`message`): `Promise`<`Readonly`<[`EBMessage`](../modules/purista_core.md#ebmessage)\>\>

Emit a new message to event bridge to be delivered to receiver

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | `Omit`<[`EBMessage`](../modules/purista_core.md#ebmessage), ``"id"`` \| ``"timestamp"`` \| ``"instanceId"`` \| ``"correlationId"``\> | EBMessage |

#### Returns

`Promise`<`Readonly`<[`EBMessage`](../modules/purista_core.md#ebmessage)\>\>

#### Implementation of

[EventBridge](../interfaces/purista_core.EventBridge.md).[emit](../interfaces/purista_core.EventBridge.md#emit)

#### Defined in

[core/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts:173](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts#L173)

___

### invoke

▸ **invoke**<`T`\>(`input`, `ttl?`): `Promise`<`T`\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | `Omit`<[`Command`](../modules/purista_core.md#command)<`unknown`, `unknown`\>, ``"id"`` \| ``"messageType"`` \| ``"timestamp"`` \| ``"instanceId"`` \| ``"correlationId"``\> |
| `ttl` | `number` |

#### Returns

`Promise`<`T`\>

#### Implementation of

[EventBridge](../interfaces/purista_core.EventBridge.md).[invoke](../interfaces/purista_core.EventBridge.md#invoke)

#### Defined in

[core/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts:194](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts#L194)

___

### registerServiceFunction

▸ **registerServiceFunction**(`address`, `cb`): `Promise`<`string`\>

Register a service function and ensure that there is a queue for all incoming command requests.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | [`EBMessageAddress`](../modules/purista_core.md#ebmessageaddress) | The service function address |
| `cb` | (`message`: [`Command`](../modules/purista_core.md#command)<`unknown`, `unknown`\>) => `void` | the function to call if a matching command message arrives |

#### Returns

`Promise`<`string`\>

the id of command function queue

#### Implementation of

[EventBridge](../interfaces/purista_core.EventBridge.md).[registerServiceFunction](../interfaces/purista_core.EventBridge.md#registerservicefunction)

#### Defined in

[core/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts:145](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts#L145)

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

#### Implementation of

[EventBridge](../interfaces/purista_core.EventBridge.md).[registerSubscription](../interfaces/purista_core.EventBridge.md#registersubscription)

#### Defined in

[core/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts:156](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts#L156)

___

### unregisterServiceFunction

▸ **unregisterServiceFunction**(`address`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | [`EBMessageAddress`](../modules/purista_core.md#ebmessageaddress) |

#### Returns

`Promise`<`void`\>

#### Implementation of

[EventBridge](../interfaces/purista_core.EventBridge.md).[unregisterServiceFunction](../interfaces/purista_core.EventBridge.md#unregisterservicefunction)

#### Defined in

[core/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts:151](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts#L151)

___

### unregisterSubscription

▸ **unregisterSubscription**(`address`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | [`EBMessageAddress`](../modules/purista_core.md#ebmessageaddress) |

#### Returns

`Promise`<`void`\>

#### Implementation of

[EventBridge](../interfaces/purista_core.EventBridge.md).[unregisterSubscription](../interfaces/purista_core.EventBridge.md#unregistersubscription)

#### Defined in

[core/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts:163](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts#L163)
