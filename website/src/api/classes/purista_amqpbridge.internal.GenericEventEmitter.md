[PURISTA API - v1.4.3](../README.md) / [@purista/amqpbridge](../modules/purista_amqpbridge.md) / [internal](../modules/purista_amqpbridge.internal.md) / GenericEventEmitter

# Class: GenericEventEmitter<T\>

[@purista/amqpbridge](../modules/purista_amqpbridge.md).[internal](../modules/purista_amqpbridge.internal.md).GenericEventEmitter

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`EventMap`](../modules/purista_amqpbridge.internal.md#eventmap) |

## Hierarchy

- **`GenericEventEmitter`**

  ↳ [`EventBridge`](purista_amqpbridge.internal.EventBridge.md)

## Implements

- [`IEmitter`](../interfaces/purista_amqpbridge.internal.IEmitter.md)<`T`\>

## Table of contents

### Constructors

- [constructor](purista_amqpbridge.internal.GenericEventEmitter.md#constructor)

### Properties

- [emitter](purista_amqpbridge.internal.GenericEventEmitter.md#emitter)

### Methods

- [emit](purista_amqpbridge.internal.GenericEventEmitter.md#emit)
- [off](purista_amqpbridge.internal.GenericEventEmitter.md#off)
- [on](purista_amqpbridge.internal.GenericEventEmitter.md#on)

## Constructors

### constructor

• **new GenericEventEmitter**<`T`\>()

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`EventMap`](../modules/purista_amqpbridge.internal.md#eventmap) |

## Properties

### emitter

• `Private` **emitter**: `any`

#### Defined in

core/lib/types/core/types/GenericEventEmitter.d.ts:10

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

[IEmitter](../interfaces/purista_amqpbridge.internal.IEmitter.md).[emit](../interfaces/purista_amqpbridge.internal.IEmitter.md#emit)

#### Defined in

core/lib/types/core/types/GenericEventEmitter.d.ts:13

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

#### Implementation of

[IEmitter](../interfaces/purista_amqpbridge.internal.IEmitter.md).[off](../interfaces/purista_amqpbridge.internal.IEmitter.md#off)

#### Defined in

core/lib/types/core/types/GenericEventEmitter.d.ts:12

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

#### Implementation of

[IEmitter](../interfaces/purista_amqpbridge.internal.IEmitter.md).[on](../interfaces/purista_amqpbridge.internal.IEmitter.md#on)

#### Defined in

core/lib/types/core/types/GenericEventEmitter.d.ts:11
