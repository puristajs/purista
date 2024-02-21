[PURISTA API](../README.md) / [Modules](../modules.md) / [@purista/core](../modules/purista_core.md) / StateStore

# Interface: StateStore

[@purista/core](../modules/purista_core.md).StateStore

Interface definition for state store implementations

## Implemented by

- [`DefaultStateStore`](../classes/purista_core.DefaultStateStore.md)

## Table of contents

### Properties

- [getState](purista_core.StateStore.md#getstate)
- [name](purista_core.StateStore.md#name)
- [removeState](purista_core.StateStore.md#removestate)
- [setState](purista_core.StateStore.md#setstate)

### Methods

- [destroy](purista_core.StateStore.md#destroy)

## Properties

### getState

• **getState**: [`StateGetterFunction`](../modules/purista_core.md#stategetterfunction)

get a state value

**`Param`**

name of state

**`Throws`**

UnhandledError

#### Defined in

[core/StateStore/types/StateStore.ts:19](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/StateStore/types/StateStore.ts#L19)

___

### name

• **name**: `string`

name of store

#### Defined in

[core/StateStore/types/StateStore.ts:12](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/StateStore/types/StateStore.ts#L12)

___

### removeState

• **removeState**: [`StateDeleteFunction`](../modules/purista_core.md#statedeletefunction)

delete a state value

**`Param`**

name of state

**`Throws`**

UnhandledError

#### Defined in

[core/StateStore/types/StateStore.ts:26](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/StateStore/types/StateStore.ts#L26)

___

### setState

• **setState**: [`StateSetterFunction`](../modules/purista_core.md#statesetterfunction)

set a state value

**`Param`**

name of state

**`Param`**

value of state

**`Throws`**

UnhandledError

#### Defined in

[core/StateStore/types/StateStore.ts:34](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/StateStore/types/StateStore.ts#L34)

## Methods

### destroy

▸ **destroy**(): `Promise`\<`void`\>

disconnects and shuts down the state store

#### Returns

`Promise`\<`void`\>

#### Defined in

[core/StateStore/types/StateStore.ts:39](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/StateStore/types/StateStore.ts#L39)
