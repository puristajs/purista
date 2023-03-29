[PURISTA API - v1.4.9](../README.md) / [Modules](../modules.md) / [@purista/httpserver](../modules/purista_httpserver.md) / [internal](../modules/purista_httpserver.internal.md) / IEmitter

# Interface: IEmitter<T\>

[@purista/httpserver](../modules/purista_httpserver.md).[internal](../modules/purista_httpserver.internal.md).IEmitter

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`EventMap`](../modules/purista_httpserver.internal.md#eventmap) |

## Implemented by

- [`GenericEventEmitter`](../classes/purista_httpserver.internal.GenericEventEmitter.md)

## Table of contents

### Methods

- [emit](purista_httpserver.internal.IEmitter.md#emit)
- [off](purista_httpserver.internal.IEmitter.md#off)
- [on](purista_httpserver.internal.IEmitter.md#on)

## Methods

### emit

▸ **emit**<`K`\>(`eventName`, `parameter?`): `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends `string` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `K` |
| `parameter?` | `T`[`K`] |

#### Returns

`void`

#### Defined in

packages/core/lib/core/types/GenericEventEmitter.d.ts:7

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
| `fn` | [`EventReceiver`](../modules/purista_httpserver.internal.md#eventreceiver)<`T`[`K`]\> |

#### Returns

`void`

#### Defined in

packages/core/lib/core/types/GenericEventEmitter.d.ts:6

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
| `fn` | [`EventReceiver`](../modules/purista_httpserver.internal.md#eventreceiver)<`T`[`K`]\> |

#### Returns

`void`

#### Defined in

packages/core/lib/core/types/GenericEventEmitter.d.ts:5
