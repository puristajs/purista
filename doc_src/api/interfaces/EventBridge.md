[@purista/core](../README.md) / [Exports](../modules.md) / EventBridge

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

[src/core/types/EventBridge.ts:10](https://github.com/sebastianwessel/purista/blob/40390cf/src/core/types/EventBridge.ts#L10)

## Methods

### emit

▸ **emit**(`message`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | [`EBMessage`](../modules.md#ebmessage) |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/core/types/EventBridge.ts:11](https://github.com/sebastianwessel/purista/blob/40390cf/src/core/types/EventBridge.ts#L11)

___

### subscribe

▸ **subscribe**(`subscription`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `subscription` | [`Subscription`](../modules.md#subscription) |

#### Returns

`Promise`<`string`\>

#### Defined in

[src/core/types/EventBridge.ts:12](https://github.com/sebastianwessel/purista/blob/40390cf/src/core/types/EventBridge.ts#L12)

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

[src/core/types/EventBridge.ts:13](https://github.com/sebastianwessel/purista/blob/40390cf/src/core/types/EventBridge.ts#L13)

___

### unsubscribeService

▸ **unsubscribeService**(`service`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `service` | [`EBMessageAddress`](../modules.md#ebmessageaddress) |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/core/types/EventBridge.ts:15](https://github.com/sebastianwessel/purista/blob/40390cf/src/core/types/EventBridge.ts#L15)
