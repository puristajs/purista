[PURISTA API - v1.4.9](../README.md) / [Modules](../modules.md) / [@purista/k8s-sdk](../modules/purista_k8s_sdk.md) / [internal](../modules/purista_k8s_sdk.internal.md) / GenericEventEmitter

# Class: GenericEventEmitter<T\>

[@purista/k8s-sdk](../modules/purista_k8s_sdk.md).[internal](../modules/purista_k8s_sdk.internal.md).GenericEventEmitter

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`EventMap`](../modules/purista_k8s_sdk.internal.md#eventmap) |

## Hierarchy

- **`GenericEventEmitter`**

  ↳ [`ServiceBaseClass`](purista_k8s_sdk.internal.ServiceBaseClass.md)

## Implements

- [`IEmitter`](../interfaces/purista_k8s_sdk.internal.IEmitter.md)<`T`\>

## Table of contents

### Constructors

- [constructor](purista_k8s_sdk.internal.GenericEventEmitter.md#constructor)

### Properties

- [emitter](purista_k8s_sdk.internal.GenericEventEmitter.md#emitter)

### Methods

- [emit](purista_k8s_sdk.internal.GenericEventEmitter.md#emit)
- [off](purista_k8s_sdk.internal.GenericEventEmitter.md#off)
- [on](purista_k8s_sdk.internal.GenericEventEmitter.md#on)
- [removeAllListeners](purista_k8s_sdk.internal.GenericEventEmitter.md#removealllisteners)

## Constructors

### constructor

• **new GenericEventEmitter**<`T`\>()

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`EventMap`](../modules/purista_k8s_sdk.internal.md#eventmap) |

## Properties

### emitter

• `Private` **emitter**: `any`

#### Defined in

packages/core/lib/core/types/GenericEventEmitter.d.ts:10

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

#### Implementation of

[IEmitter](../interfaces/purista_k8s_sdk.internal.IEmitter.md).[emit](../interfaces/purista_k8s_sdk.internal.IEmitter.md#emit)

#### Defined in

packages/core/lib/core/types/GenericEventEmitter.d.ts:13

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
| `fn` | [`EventReceiver`](../modules/purista_k8s_sdk.internal.md#eventreceiver)<`T`[`K`]\> |

#### Returns

`void`

#### Implementation of

[IEmitter](../interfaces/purista_k8s_sdk.internal.IEmitter.md).[off](../interfaces/purista_k8s_sdk.internal.IEmitter.md#off)

#### Defined in

packages/core/lib/core/types/GenericEventEmitter.d.ts:12

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
| `fn` | [`EventReceiver`](../modules/purista_k8s_sdk.internal.md#eventreceiver)<`T`[`K`]\> |

#### Returns

`void`

#### Implementation of

[IEmitter](../interfaces/purista_k8s_sdk.internal.IEmitter.md).[on](../interfaces/purista_k8s_sdk.internal.IEmitter.md#on)

#### Defined in

packages/core/lib/core/types/GenericEventEmitter.d.ts:11

___

### removeAllListeners

▸ **removeAllListeners**(): `void`

#### Returns

`void`

#### Defined in

packages/core/lib/core/types/GenericEventEmitter.d.ts:14
