[PURISTA API](../README.md) / EventBridge

# Interface: EventBridge

Event bridge interface
The event bridge must implement this interface.

## Implemented by

- [`DefaultEventBridge`](../classes/DefaultEventBridge.md)

## Table of contents

### Properties

- [defaultTtl](EventBridge.md#defaultttl)

### Methods

- [emit](EventBridge.md#emit)
- [subscribe](EventBridge.md#subscribe)
- [unsubscribe](EventBridge.md#unsubscribe)
- [unsubscribeService](EventBridge.md#unsubscribeservice)

## Properties

### defaultTtl

• `Readonly` **defaultTtl**: `number`

#### Defined in

packages/core/src/core/types/EventBridge.ts:10

## Methods

### emit

▸ **emit**(`message`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | [`EBMessage`](../README.md#ebmessage) |

#### Returns

`Promise`<`void`\>

#### Defined in

packages/core/src/core/types/EventBridge.ts:11

___

### subscribe

▸ **subscribe**(`subscription`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `subscription` | [`Subscription`](../README.md#subscription) |

#### Returns

`Promise`<`string`\>

#### Defined in

packages/core/src/core/types/EventBridge.ts:12

___

### unsubscribe

▸ **unsubscribe**(`subscriptionId`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `subscriptionId` | `string` |

#### Returns

`Promise`<`void`\>

#### Defined in

packages/core/src/core/types/EventBridge.ts:13

___

### unsubscribeService

▸ **unsubscribeService**(`service`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `service` | [`EBMessageAddress`](../README.md#ebmessageaddress) |

#### Returns

`Promise`<`void`\>

#### Defined in

packages/core/src/core/types/EventBridge.ts:15
