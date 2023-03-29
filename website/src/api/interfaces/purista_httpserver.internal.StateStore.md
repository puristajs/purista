[PURISTA API - v1.4.9](../README.md) / [Modules](../modules.md) / [@purista/httpserver](../modules/purista_httpserver.md) / [internal](../modules/purista_httpserver.internal.md) / StateStore

# Interface: StateStore

[@purista/httpserver](../modules/purista_httpserver.md).[internal](../modules/purista_httpserver.internal.md).StateStore

Interface definition for state store implementations

## Table of contents

### Properties

- [getState](purista_httpserver.internal.StateStore.md#getstate)
- [name](purista_httpserver.internal.StateStore.md#name)
- [removeState](purista_httpserver.internal.StateStore.md#removestate)
- [setState](purista_httpserver.internal.StateStore.md#setstate)

### Methods

- [destroy](purista_httpserver.internal.StateStore.md#destroy)

## Properties

### getState

• **getState**: [`StateGetterFunction`](../modules/purista_httpserver.internal.md#stategetterfunction)

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

• **removeState**: [`StateDeleteFunction`](../modules/purista_httpserver.internal.md#statedeletefunction)

delete a state value

**`Param`**

name of state

**`Throws`**

UnhandledError

#### Defined in

packages/core/lib/core/StateStore/types/StateStore.d.ts:24

___

### setState

• **setState**: [`StateSetterFunction`](../modules/purista_httpserver.internal.md#statesetterfunction)

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
