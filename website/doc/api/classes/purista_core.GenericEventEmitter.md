[PURISTA API](../README.md) / [Modules](../modules.md) / [@purista/core](../modules/purista_core.md) / GenericEventEmitter

# Class: GenericEventEmitter\<T\>

[@purista/core](../modules/purista_core.md).GenericEventEmitter

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`EventMap`](../modules/purista_core.md#eventmap) |

## Hierarchy

- **`GenericEventEmitter`**

  ↳ [`EventBridgeBaseClass`](purista_core.EventBridgeBaseClass.md)

## Implements

- [`IEmitter`](../interfaces/purista_core.IEmitter.md)\<`T`\>

## Table of contents

### Constructors

- [constructor](purista_core.GenericEventEmitter.md#constructor)

### Properties

- [emitter](purista_core.GenericEventEmitter.md#emitter)

### Methods

- [emit](purista_core.GenericEventEmitter.md#emit)
- [off](purista_core.GenericEventEmitter.md#off)
- [on](purista_core.GenericEventEmitter.md#on)
- [removeAllListeners](purista_core.GenericEventEmitter.md#removealllisteners)

## Constructors

### constructor

• **new GenericEventEmitter**\<`T`\>(): [`GenericEventEmitter`](purista_core.GenericEventEmitter.md)\<`T`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`EventMap`](../modules/purista_core.md#eventmap) |

#### Returns

[`GenericEventEmitter`](purista_core.GenericEventEmitter.md)\<`T`\>

## Properties

### emitter

• `Private` **emitter**: `EventEmitter`

#### Defined in

[core/types/GenericEventEmitter.ts:15](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/GenericEventEmitter.ts#L15)

## Methods

### emit

▸ **emit**\<`K`\>(`eventName`, `parameter?`): `void`

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

[IEmitter](../interfaces/purista_core.IEmitter.md).[emit](../interfaces/purista_core.IEmitter.md#emit)

#### Defined in

[core/types/GenericEventEmitter.ts:24](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/GenericEventEmitter.ts#L24)

___

### off

▸ **off**\<`K`\>(`eventName`, `fn`): `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends `string` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `K` |
| `fn` | `EventReceiver`\<`T`[`K`]\> |

#### Returns

`void`

#### Implementation of

[IEmitter](../interfaces/purista_core.IEmitter.md).[off](../interfaces/purista_core.IEmitter.md#off)

#### Defined in

[core/types/GenericEventEmitter.ts:20](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/GenericEventEmitter.ts#L20)

___

### on

▸ **on**\<`K`\>(`eventName`, `fn`): `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends `string` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `K` |
| `fn` | `EventReceiver`\<`T`[`K`]\> |

#### Returns

`void`

#### Implementation of

[IEmitter](../interfaces/purista_core.IEmitter.md).[on](../interfaces/purista_core.IEmitter.md#on)

#### Defined in

[core/types/GenericEventEmitter.ts:16](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/GenericEventEmitter.ts#L16)

___

### removeAllListeners

▸ **removeAllListeners**(): `void`

#### Returns

`void`

#### Defined in

[core/types/GenericEventEmitter.ts:28](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/GenericEventEmitter.ts#L28)
