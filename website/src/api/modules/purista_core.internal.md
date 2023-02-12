[PURISTA API - v1.4.9](../README.md) / [@purista/core](purista_core.md) / internal

# Namespace: internal

[@purista/core](purista_core.md).internal

## Table of contents

### Classes

- [ServiceBaseClass](../classes/purista_core.internal.ServiceBaseClass.md)

### Type Aliases

- [CustomEvents](purista_core.internal.md#customevents)
- [CustomEvents](purista_core.internal.md#customevents-1)
- [EventReceiver](purista_core.internal.md#eventreceiver)

## Type Aliases

### CustomEvents

Ƭ **CustomEvents**: `Object`

#### Index signature

▪ [key: `string`]: `unknown`

#### Defined in

[core/src/core/types/EventBridgeEvents.ts:24](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/core/src/core/types/EventBridgeEvents.ts#L24)

___

### CustomEvents

Ƭ **CustomEvents**: `Object`

#### Index signature

▪ [key: `string`]: `unknown`

#### Defined in

[core/src/core/types/ServiceEvents.ts:44](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/core/src/core/types/ServiceEvents.ts#L44)

___

### EventReceiver

Ƭ **EventReceiver**<`T`\>: (`parameter`: `T`) => `void`

#### Type parameters

| Name |
| :------ |
| `T` |

#### Type declaration

▸ (`parameter`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `parameter` | `T` |

##### Returns

`void`

#### Defined in

[core/src/core/types/GenericEventEmitter.ts:6](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/core/src/core/types/GenericEventEmitter.ts#L6)
