[@purista/core](../README.md) / [Exports](../modules.md) / DefaultEventBridge

# Class: DefaultEventBridge

Simple implementation of some simple in-memory event bridge.
Does not support threads and does not need any external databases.

## Implements

- [`EventBridge`](../interfaces/EventBridge.md)

## Table of contents

### Constructors

- [constructor](DefaultEventBridge.md#constructor)

### Properties

- [config](DefaultEventBridge.md#config)
- [log](DefaultEventBridge.md#log)
- [subscriptions](DefaultEventBridge.md#subscriptions)

### Accessors

- [defaultTtl](DefaultEventBridge.md#defaultttl)

### Methods

- [emit](DefaultEventBridge.md#emit)
- [subscribe](DefaultEventBridge.md#subscribe)
- [unsubscribe](DefaultEventBridge.md#unsubscribe)
- [unsubscribeService](DefaultEventBridge.md#unsubscribeservice)

## Constructors

### constructor

• **new DefaultEventBridge**(`baseLogger`, `conf?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `baseLogger` | [`Logger`](../modules.md#logger) |
| `conf` | [`EventBridgeConfig`](../modules.md#eventbridgeconfig) |

#### Defined in

[src/core/DefaultEventBridge/DefaultEventBridge.impl.ts:26](https://github.com/sebastianwessel/purista/blob/9753133/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts#L26)

## Properties

### config

• `Private` **config**: [`EventBridgeConfig`](../modules.md#eventbridgeconfig)

#### Defined in

[src/core/DefaultEventBridge/DefaultEventBridge.impl.ts:23](https://github.com/sebastianwessel/purista/blob/9753133/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts#L23)

___

### log

• `Private` **log**: [`Logger`](../modules.md#logger)

#### Defined in

[src/core/DefaultEventBridge/DefaultEventBridge.impl.ts:22](https://github.com/sebastianwessel/purista/blob/9753133/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts#L22)

___

### subscriptions

• `Protected` **subscriptions**: `Map`<`string`, `SubscriptionStorageEntry`\>

#### Defined in

[src/core/DefaultEventBridge/DefaultEventBridge.impl.ts:25](https://github.com/sebastianwessel/purista/blob/9753133/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts#L25)

## Accessors

### defaultTtl

• `get` **defaultTtl**(): `number`

Get default time out.
It is the maximum time a command should be responded.

#### Returns

`number`

#### Implementation of

[EventBridge](../interfaces/EventBridge.md).[defaultTtl](../interfaces/EventBridge.md#defaultttl)

#### Defined in

[src/core/DefaultEventBridge/DefaultEventBridge.impl.ts:35](https://github.com/sebastianwessel/purista/blob/9753133/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts#L35)

## Methods

### emit

▸ **emit**(`message`): `Promise`<`void`\>

Emit a new message to event bridge to be delivered to receiver

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | [`EBMessage`](../modules.md#ebmessage) | EBMessage |

#### Returns

`Promise`<`void`\>

#### Implementation of

[EventBridge](../interfaces/EventBridge.md).[emit](../interfaces/EventBridge.md#emit)

#### Defined in

[src/core/DefaultEventBridge/DefaultEventBridge.impl.ts:44](https://github.com/sebastianwessel/purista/blob/9753133/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts#L44)

___

### subscribe

▸ **subscribe**(`subscription`): `Promise`<`string`\>

Subscribe to specified event bridge message(s)
Means listen for messages

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `subscription` | [`Subscription`](../modules.md#subscription) | Subscription |

#### Returns

`Promise`<`string`\>

Promise SubscriptionId

#### Implementation of

[EventBridge](../interfaces/EventBridge.md).[subscribe](../interfaces/EventBridge.md#subscribe)

#### Defined in

[src/core/DefaultEventBridge/DefaultEventBridge.impl.ts:83](https://github.com/sebastianwessel/purista/blob/9753133/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts#L83)

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

[EventBridge](../interfaces/EventBridge.md).[unsubscribe](../interfaces/EventBridge.md#unsubscribe)

#### Defined in

[src/core/DefaultEventBridge/DefaultEventBridge.impl.ts:94](https://github.com/sebastianwessel/purista/blob/9753133/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts#L94)

___

### unsubscribeService

▸ **unsubscribeService**(`service`): `Promise`<`void`\>

Unsubscribes all subscriptions for given Service.

#### Parameters

| Name | Type |
| :------ | :------ |
| `service` | [`EBMessageAddress`](../modules.md#ebmessageaddress) |

#### Returns

`Promise`<`void`\>

#### Implementation of

[EventBridge](../interfaces/EventBridge.md).[unsubscribeService](../interfaces/EventBridge.md#unsubscribeservice)

#### Defined in

[src/core/DefaultEventBridge/DefaultEventBridge.impl.ts:103](https://github.com/sebastianwessel/purista/blob/9753133/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts#L103)
