[PURISTA API - v1.4.9](../README.md) / [@purista/amqpbridge](../modules/purista_amqpbridge.md) / [internal](../modules/purista_amqpbridge.internal.md) / IEmitter

# Interface: IEmitter<T\>

[@purista/amqpbridge](../modules/purista_amqpbridge.md).[internal](../modules/purista_amqpbridge.internal.md).IEmitter

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`EventMap`](../modules/purista_amqpbridge.internal.md#eventmap) |

## Implemented by

- [`GenericEventEmitter`](../classes/purista_amqpbridge.internal.GenericEventEmitter.md)

## Table of contents

### Methods

- [emit](purista_amqpbridge.internal.IEmitter.md#emit)
- [off](purista_amqpbridge.internal.IEmitter.md#off)
- [on](purista_amqpbridge.internal.IEmitter.md#on)

## Methods

### emit

▸ **emit**<`K`\>(`eventName`, `parameter`): `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends `string` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `K` |
| `parameter` | `T`[`K`] |

#### Returns

`void`

#### Defined in

core/lib/core/types/GenericEventEmitter.d.ts:7

___

### off

▸ **off**<`K`\>(`eventName`, `fn`): `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends `string` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `K` |
| `fn` | [`EventReceiver`](../modules/purista_amqpbridge.internal.md#eventreceiver)<`T`[`K`]\> |

#### Returns

`void`

#### Defined in

core/lib/core/types/GenericEventEmitter.d.ts:6

___

### on

▸ **on**<`K`\>(`eventName`, `fn`): `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends `string` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `K` |
| `fn` | [`EventReceiver`](../modules/purista_amqpbridge.internal.md#eventreceiver)<`T`[`K`]\> |

#### Returns

`void`

#### Defined in

core/lib/core/types/GenericEventEmitter.d.ts:5
