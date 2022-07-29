[PURISTA API - v1.3.1](../README.md) / [@purista/core](../modules/purista_core.md) / GenericEventEmitter

# Class: GenericEventEmitter<T\>

[@purista/core](../modules/purista_core.md).GenericEventEmitter

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`EventMap`](../modules/purista_core.md#eventmap) |

## Hierarchy

- **`GenericEventEmitter`**

  ↳ [`EventBridge`](purista_core.EventBridge.md)

  ↳ [`ServiceClass`](purista_core.ServiceClass.md)

## Implements

- [`IEmitter`](../interfaces/purista_core.IEmitter.md)<`T`\>

## Table of contents

### Constructors

- [constructor](purista_core.GenericEventEmitter.md#constructor)

### Properties

- [emitter](purista_core.GenericEventEmitter.md#emitter)

### Methods

- [emit](purista_core.GenericEventEmitter.md#emit)
- [off](purista_core.GenericEventEmitter.md#off)
- [on](purista_core.GenericEventEmitter.md#on)

## Constructors

### constructor

• **new GenericEventEmitter**<`T`\>()

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`EventMap`](../modules/purista_core.md#eventmap) |

## Properties

### emitter

• `Private` **emitter**: `EventEmitter`

#### Defined in

[core/src/core/types/GenericEventEmitter.ts:15](https://github.com/sebastianwessel/purista/blob/81fe9e5/packages/core/src/core/types/GenericEventEmitter.ts#L15)

## Methods

### emit

▸ **emit**<`K`\>(`eventName`, `params`): `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends `string` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `K` |
| `params` | `T`[`K`] |

#### Returns

`void`

#### Implementation of

[IEmitter](../interfaces/purista_core.IEmitter.md).[emit](../interfaces/purista_core.IEmitter.md#emit)

#### Defined in

[core/src/core/types/GenericEventEmitter.ts:24](https://github.com/sebastianwessel/purista/blob/81fe9e5/packages/core/src/core/types/GenericEventEmitter.ts#L24)

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

#### Implementation of

[IEmitter](../interfaces/purista_core.IEmitter.md).[off](../interfaces/purista_core.IEmitter.md#off)

#### Defined in

[core/src/core/types/GenericEventEmitter.ts:20](https://github.com/sebastianwessel/purista/blob/81fe9e5/packages/core/src/core/types/GenericEventEmitter.ts#L20)

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

#### Implementation of

[IEmitter](../interfaces/purista_core.IEmitter.md).[on](../interfaces/purista_core.IEmitter.md#on)

#### Defined in

[core/src/core/types/GenericEventEmitter.ts:16](https://github.com/sebastianwessel/purista/blob/81fe9e5/packages/core/src/core/types/GenericEventEmitter.ts#L16)
