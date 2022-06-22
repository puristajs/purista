[PURISTA API](../README.md) / [@purista/core](purista_core.md) / internal

# Namespace: internal

[@purista/core](purista_core.md).internal

## Table of contents

### Type Aliases

- [PendigInvocation](purista_core.internal.md#pendiginvocation)
- [SubscriptionStorageEntry](purista_core.internal.md#subscriptionstorageentry)

## Type Aliases

### PendigInvocation

Ƭ **PendigInvocation**: `Object`

Internal type for holding pending invocations

#### Type declaration

| Name | Type |
| :------ | :------ |
| `command` | [`Command`](purista_core.md#command) |
| `reject` | (`error`: [`UnhandledError`](../classes/purista_core.UnhandledError.md) \| [`HandledError`](../classes/purista_core.HandledError.md)) => `void` |
| `resolve` | (`responsePayload`: `unknown`) => `void` |

#### Defined in

[core/src/core/Service/Service.impl.ts:36](https://github.com/sebastianwessel/purista/blob/17388e9/packages/core/src/core/Service/Service.impl.ts#L36)

___

### SubscriptionStorageEntry

Ƭ **SubscriptionStorageEntry**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `subscription` | [`Subscription`](purista_core.md#subscription) |
| `isMatchingMessageType` | (`input`: [`EBMessageType`](../enums/purista_core.EBMessageType.md)) => `boolean` |
| `isMatchingReceiverServiceName` | (`input`: `string`) => `boolean` |
| `isMatchingReceiverServiceTarget` | (`input`: `string`) => `boolean` |
| `isMatchingReceiverServiceVersion` | (`input`: `string`) => `boolean` |
| `isMatchingSenderServiceName` | (`input`: `string`) => `boolean` |
| `isMatchingSenderServiceTarget` | (`input`: `string`) => `boolean` |
| `isMatchingSenderServiceVersion` | (`input`: `string`) => `boolean` |

#### Defined in

[core/src/core/DefaultEventBridge/types/SubscriptionStorageEntry.ts:3](https://github.com/sebastianwessel/purista/blob/17388e9/packages/core/src/core/DefaultEventBridge/types/SubscriptionStorageEntry.ts#L3)
