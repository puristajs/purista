[PURISTA API](../README.md) / [@purista/core](../modules/purista_core.md) / DefaultEventBridge

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
- [subscriptions](purista_core.DefaultEventBridge.md#subscriptions)

### Accessors

- [defaultTtl](purista_core.DefaultEventBridge.md#defaultttl)

### Methods

- [emit](purista_core.DefaultEventBridge.md#emit)
- [subscribe](purista_core.DefaultEventBridge.md#subscribe)
- [unsubscribe](purista_core.DefaultEventBridge.md#unsubscribe)
- [unsubscribeService](purista_core.DefaultEventBridge.md#unsubscribeservice)

## Constructors

### constructor

• **new DefaultEventBridge**(`baseLogger`, `conf?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `baseLogger` | [`Logger`](../modules/purista_core.md#logger) |
| `conf` | [`EventBridgeConfig`](../modules/purista_core.md#eventbridgeconfig) |

#### Defined in

[core/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts:26](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts#L26)

## Properties

### config

• `Private` **config**: [`EventBridgeConfig`](../modules/purista_core.md#eventbridgeconfig)

#### Defined in

[core/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts:23](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts#L23)

___

### log

• `Private` **log**: [`Logger`](../modules/purista_core.md#logger)

#### Defined in

[core/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts:22](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts#L22)

___

### subscriptions

• `Protected` **subscriptions**: `Map`<`string`, `SubscriptionStorageEntry`\>

#### Defined in

[core/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts:25](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts#L25)

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

[core/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts:35](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts#L35)

## Methods

### emit

▸ **emit**(`message`): `Promise`<`void`\>

Emit a new message to event bridge to be delivered to receiver

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | [`EBMessage`](../modules/purista_core.md#ebmessage) | EBMessage |

#### Returns

`Promise`<`void`\>

#### Implementation of

[EventBridge](../interfaces/purista_core.EventBridge.md).[emit](../interfaces/purista_core.EventBridge.md#emit)

#### Defined in

[core/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts:44](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts#L44)

___

### subscribe

▸ **subscribe**(`subscription`): `Promise`<`string`\>

Subscribe to specified event bridge message(s)
Means listen for messages

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `subscription` | [`Subscription`](../modules/purista_core.md#subscription) | Subscription |

#### Returns

`Promise`<`string`\>

Promise SubscriptionId

#### Implementation of

[EventBridge](../interfaces/purista_core.EventBridge.md).[subscribe](../interfaces/purista_core.EventBridge.md#subscribe)

#### Defined in

[core/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts:83](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts#L83)

___

### unsubscribe

▸ **unsubscribe**(`subscriptionId`): `Promise`<`void`\>

Unsubscribe a single subscription.

#### Parameters

| Name | Type |
| :------ | :------ |
| `subscriptionId` | `string` |

#### Returns

`Promise`<`void`\>

#### Implementation of

[EventBridge](../interfaces/purista_core.EventBridge.md).[unsubscribe](../interfaces/purista_core.EventBridge.md#unsubscribe)

#### Defined in

[core/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts:94](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts#L94)

___

### unsubscribeService

▸ **unsubscribeService**(`service`): `Promise`<`void`\>

Unsubscribes all subscriptions for given Service.

#### Parameters

| Name | Type |
| :------ | :------ |
| `service` | [`EBMessageAddress`](../modules/purista_core.md#ebmessageaddress) |

#### Returns

`Promise`<`void`\>

#### Implementation of

[EventBridge](../interfaces/purista_core.EventBridge.md).[unsubscribeService](../interfaces/purista_core.EventBridge.md#unsubscribeservice)

#### Defined in

[core/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts:103](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts#L103)
