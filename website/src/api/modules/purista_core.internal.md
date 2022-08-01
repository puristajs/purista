[PURISTA API - v1.4.3](../README.md) / [@purista/core](purista_core.md) / internal

# Namespace: internal

[@purista/core](purista_core.md).internal

## Table of contents

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

[core/src/core/types/EventBridgeEvents.ts:24](https://github.com/sebastianwessel/purista/blob/c89c5bf/packages/core/src/core/types/EventBridgeEvents.ts#L24)

___

### CustomEvents

Ƭ **CustomEvents**: `Object`

#### Index signature

▪ [key: `string`]: `unknown`

#### Defined in

[core/src/core/types/ServiceEvents.ts:50](https://github.com/sebastianwessel/purista/blob/c89c5bf/packages/core/src/core/types/ServiceEvents.ts#L50)

___

### EventReceiver

Ƭ **EventReceiver**<`T`\>: (`params`: `T`) => `void`

#### Type parameters

| Name |
| :------ |
| `T` |

#### Type declaration

▸ (`params`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `params` | `T` |

##### Returns

`void`

#### Defined in

[core/src/core/types/GenericEventEmitter.ts:6](https://github.com/sebastianwessel/purista/blob/c89c5bf/packages/core/src/core/types/GenericEventEmitter.ts#L6)
