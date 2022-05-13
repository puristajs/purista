[PURISTA API](../README.md) / [@purista/core](../modules/purista_core.md) / EventBridge

# Interface: EventBridge

[@purista/core](../modules/purista_core.md).EventBridge

Event bridge interface
The event bridge must implement this interface.

## Implemented by

- [`DefaultEventBridge`](../classes/purista_core.DefaultEventBridge.md)

## Table of contents

### Properties

- [defaultTtl](purista_core.EventBridge.md#defaultttl)

### Methods

- [emit](purista_core.EventBridge.md#emit)
- [subscribe](purista_core.EventBridge.md#subscribe)
- [unsubscribe](purista_core.EventBridge.md#unsubscribe)
- [unsubscribeService](purista_core.EventBridge.md#unsubscribeservice)

## Properties

### defaultTtl

• `Readonly` **defaultTtl**: `number`

#### Defined in

[core/src/core/types/EventBridge.ts:10](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/core/types/EventBridge.ts#L10)

## Methods

### emit

▸ **emit**(`message`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | [`EBMessage`](../modules/purista_core.md#ebmessage) |

#### Returns

`Promise`<`void`\>

#### Defined in

[core/src/core/types/EventBridge.ts:11](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/core/types/EventBridge.ts#L11)

___

### subscribe

▸ **subscribe**(`subscription`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `subscription` | [`Subscription`](../modules/purista_core.md#subscription) |

#### Returns

`Promise`<`string`\>

#### Defined in

[core/src/core/types/EventBridge.ts:12](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/core/types/EventBridge.ts#L12)

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

[core/src/core/types/EventBridge.ts:13](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/core/types/EventBridge.ts#L13)

___

### unsubscribeService

▸ **unsubscribeService**(`service`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `service` | [`EBMessageAddress`](../modules/purista_core.md#ebmessageaddress) |

#### Returns

`Promise`<`void`\>

#### Defined in

[core/src/core/types/EventBridge.ts:15](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/core/types/EventBridge.ts#L15)
