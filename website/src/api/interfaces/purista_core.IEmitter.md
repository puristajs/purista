[PURISTA API - v1.4.9](../README.md) / [@purista/core](../modules/purista_core.md) / IEmitter

# Interface: IEmitter<T\>

[@purista/core](../modules/purista_core.md).IEmitter

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`EventMap`](../modules/purista_core.md#eventmap) |

## Implemented by

- [`GenericEventEmitter`](../classes/purista_core.GenericEventEmitter.md)

## Table of contents

### Methods

- [emit](purista_core.IEmitter.md#emit)
- [off](purista_core.IEmitter.md#off)
- [on](purista_core.IEmitter.md#on)

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

[core/src/core/types/GenericEventEmitter.ts:11](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/core/src/core/types/GenericEventEmitter.ts#L11)

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
| `fn` | [`EventReceiver`](../modules/purista_core.internal.md#eventreceiver)<`T`[`K`]\> |

#### Returns

`void`

#### Defined in

[core/src/core/types/GenericEventEmitter.ts:10](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/core/src/core/types/GenericEventEmitter.ts#L10)

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
| `fn` | [`EventReceiver`](../modules/purista_core.internal.md#eventreceiver)<`T`[`K`]\> |

#### Returns

`void`

#### Defined in

[core/src/core/types/GenericEventEmitter.ts:9](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/core/src/core/types/GenericEventEmitter.ts#L9)
