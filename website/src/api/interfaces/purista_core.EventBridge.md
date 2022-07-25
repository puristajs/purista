[PURISTA API - v1.3.1](../README.md) / [@purista/core](../modules/purista_core.md) / EventBridge

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
- [invoke](purista_core.EventBridge.md#invoke)
- [registerServiceFunction](purista_core.EventBridge.md#registerservicefunction)
- [registerSubscription](purista_core.EventBridge.md#registersubscription)
- [unregisterServiceFunction](purista_core.EventBridge.md#unregisterservicefunction)
- [unregisterSubscription](purista_core.EventBridge.md#unregistersubscription)

## Properties

### defaultTtl

• `Readonly` **defaultTtl**: `number`

#### Defined in

[core/src/core/types/EventBridge.ts:11](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/core/types/EventBridge.ts#L11)

## Methods

### emit

▸ **emit**(`message`): `Promise`<`Readonly`<[`EBMessage`](../modules/purista_core.md#ebmessage)\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | `Omit`<[`EBMessage`](../modules/purista_core.md#ebmessage), ``"id"`` \| ``"timestamp"`` \| ``"instanceId"`` \| ``"correlationId"``\> |

#### Returns

`Promise`<`Readonly`<[`EBMessage`](../modules/purista_core.md#ebmessage)\>\>

#### Defined in

[core/src/core/types/EventBridge.ts:12](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/core/types/EventBridge.ts#L12)

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
| `ttl?` | `number` |

#### Returns

`Promise`<`T`\>

#### Defined in

[core/src/core/types/EventBridge.ts:14](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/core/types/EventBridge.ts#L14)

___

### registerServiceFunction

▸ **registerServiceFunction**(`address`, `cb`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | [`EBMessageAddress`](../modules/purista_core.md#ebmessageaddress) |
| `cb` | (`message`: [`Command`](../modules/purista_core.md#command)<`unknown`, `unknown`\>) => `void` |

#### Returns

`Promise`<`string`\>

#### Defined in

[core/src/core/types/EventBridge.ts:19](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/core/types/EventBridge.ts#L19)

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

#### Defined in

[core/src/core/types/EventBridge.ts:22](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/core/types/EventBridge.ts#L22)

___

### unregisterServiceFunction

▸ **unregisterServiceFunction**(`address`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | [`EBMessageAddress`](../modules/purista_core.md#ebmessageaddress) |

#### Returns

`Promise`<`void`\>

#### Defined in

[core/src/core/types/EventBridge.ts:20](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/core/types/EventBridge.ts#L20)

___

### unregisterSubscription

▸ **unregisterSubscription**(`address`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | [`EBMessageAddress`](../modules/purista_core.md#ebmessageaddress) |

#### Returns

`Promise`<`void`\>

#### Defined in

[core/src/core/types/EventBridge.ts:23](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/core/types/EventBridge.ts#L23)
