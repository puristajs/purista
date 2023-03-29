[PURISTA API - v1.4.9](../README.md) / [Modules](../modules.md) / [@purista/amqpbridge](../modules/purista_amqpbridge.md) / [internal](../modules/purista_amqpbridge.internal.md) / GenericEventEmitter

# Class: GenericEventEmitter<T\>

[@purista/amqpbridge](../modules/purista_amqpbridge.md).[internal](../modules/purista_amqpbridge.internal.md).GenericEventEmitter

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`EventMap`](../modules/purista_amqpbridge.internal.md#eventmap) |

## Hierarchy

- **`GenericEventEmitter`**

  ↳ [`EventBridgeBaseClass`](purista_amqpbridge.internal.EventBridgeBaseClass.md)

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
- [removeAllListeners](purista_amqpbridge.internal.GenericEventEmitter.md#removealllisteners)

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

[IEmitter](../interfaces/purista_amqpbridge.internal.IEmitter.md).[emit](../interfaces/purista_amqpbridge.internal.IEmitter.md#emit)

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
| `fn` | [`EventReceiver`](../modules/purista_amqpbridge.internal.md#eventreceiver)<`T`[`K`]\> |

#### Returns

`void`

#### Implementation of

[IEmitter](../interfaces/purista_amqpbridge.internal.IEmitter.md).[off](../interfaces/purista_amqpbridge.internal.IEmitter.md#off)

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
| `fn` | [`EventReceiver`](../modules/purista_amqpbridge.internal.md#eventreceiver)<`T`[`K`]\> |

#### Returns

`void`

#### Implementation of

[IEmitter](../interfaces/purista_amqpbridge.internal.IEmitter.md).[on](../interfaces/purista_amqpbridge.internal.IEmitter.md#on)

#### Defined in

packages/core/lib/core/types/GenericEventEmitter.d.ts:11

___

### removeAllListeners

▸ **removeAllListeners**(): `void`

#### Returns

`void`

#### Defined in

packages/core/lib/core/types/GenericEventEmitter.d.ts:14
