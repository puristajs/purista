[PURISTA API - v1.4.9](../README.md) / [Modules](../modules.md) / [@purista/k8s-sdk](../modules/purista_k8s_sdk.md) / [internal](../modules/purista_k8s_sdk.internal.md) / StateStore

# Interface: StateStore

[@purista/k8s-sdk](../modules/purista_k8s_sdk.md).[internal](../modules/purista_k8s_sdk.internal.md).StateStore

Interface definition for state store implementations

## Table of contents

### Properties

- [getState](purista_k8s_sdk.internal.StateStore.md#getstate)
- [name](purista_k8s_sdk.internal.StateStore.md#name)
- [removeState](purista_k8s_sdk.internal.StateStore.md#removestate)
- [setState](purista_k8s_sdk.internal.StateStore.md#setstate)

### Methods

- [destroy](purista_k8s_sdk.internal.StateStore.md#destroy)

## Properties

### getState

• **getState**: [`StateGetterFunction`](../modules/purista_k8s_sdk.internal.md#stategetterfunction)

get a state value

**`Param`**

name of state

**`Throws`**

UnhandledError

#### Defined in

packages/core/lib/core/StateStore/types/StateStore.d.ts:18

___

### name

• **name**: `string`

name of store

#### Defined in

packages/core/lib/core/StateStore/types/StateStore.d.ts:11

___

### removeState

• **removeState**: [`StateDeleteFunction`](../modules/purista_k8s_sdk.internal.md#statedeletefunction)

delete a state value

**`Param`**

name of state

**`Throws`**

UnhandledError

#### Defined in

packages/core/lib/core/StateStore/types/StateStore.d.ts:24

___

### setState

• **setState**: [`StateSetterFunction`](../modules/purista_k8s_sdk.internal.md#statesetterfunction)

set a state value

**`Param`**

name of state

**`Param`**

value of state

**`Throws`**

UnhandledError

#### Defined in

packages/core/lib/core/StateStore/types/StateStore.d.ts:31

## Methods

### destroy

▸ **destroy**(): `Promise`<`void`\>

disconnects and shuts down the state store

#### Returns

`Promise`<`void`\>

#### Defined in

packages/core/lib/core/StateStore/types/StateStore.d.ts:35
