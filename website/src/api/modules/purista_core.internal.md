[PURISTA API - v1.3.1](../README.md) / [@purista/core](purista_core.md) / internal

# Namespace: internal

[@purista/core](purista_core.md).internal

## Table of contents

### Type Aliases

- [EventReceiver](purista_core.internal.md#eventreceiver)
- [PendigInvocation](purista_core.internal.md#pendiginvocation)
- [SubscriptionStorageEntry](purista_core.internal.md#subscriptionstorageentry)

## Type Aliases

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

[core/src/core/types/GenericEventEmitter.ts:6](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/core/types/GenericEventEmitter.ts#L6)

___

### PendigInvocation

Ƭ **PendigInvocation**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `reject` | (`error`: [`HandledError`](../classes/purista_core.HandledError.md) \| [`UnhandledError`](../classes/purista_core.UnhandledError.md)) => `void` |
| `resolve` | (`responsePayload`: `unknown`) => `void` |

#### Defined in

[core/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts:38](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/core/DefaultEventBridge/DefaultEventBridge.impl.ts#L38)

___

### SubscriptionStorageEntry

Ƭ **SubscriptionStorageEntry**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `cb` | (`message`: [`EBMessage`](purista_core.md#ebmessage)) => `Promise`<`void`\> |
| `isMatchingEventName` | (`input?`: `string`) => `boolean` |
| `isMatchingMessageType` | (`input`: [`EBMessageType`](../enums/purista_core.EBMessageType.md)) => `boolean` |
| `isMatchingReceiverServiceName` | (`input?`: `string`) => `boolean` |
| `isMatchingReceiverServiceTarget` | (`input?`: `string`) => `boolean` |
| `isMatchingReceiverServiceVersion` | (`input?`: `string`) => `boolean` |
| `isMatchingSenderServiceName` | (`input?`: `string`) => `boolean` |
| `isMatchingSenderServiceTarget` | (`input?`: `string`) => `boolean` |
| `isMatchingSenderServiceVersion` | (`input?`: `string`) => `boolean` |

#### Defined in

[core/src/core/DefaultEventBridge/types/SubscriptionStorageEntry.ts:3](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/core/DefaultEventBridge/types/SubscriptionStorageEntry.ts#L3)
