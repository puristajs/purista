[**@purista/core v2.0.0**](../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / StateStore

# Interface: StateStore

Defined in: [packages/core/src/core/StateStore/types/StateStore.ts:10](https://github.com/puristajs/purista/blob/master/packages/core/src/core/StateStore/types/StateStore.ts#L10)

Interface definition for state store implementations

## Properties

### getState

> **getState**: [`StateGetterFunction`](../type-aliases/StateGetterFunction.md)

Defined in: [packages/core/src/core/StateStore/types/StateStore.ts:19](https://github.com/puristajs/purista/blob/master/packages/core/src/core/StateStore/types/StateStore.ts#L19)

get a state value

#### Param

name of state

#### Returns

the state

#### Throws

UnhandledError

***

### name

> **name**: `string`

Defined in: [packages/core/src/core/StateStore/types/StateStore.ts:12](https://github.com/puristajs/purista/blob/master/packages/core/src/core/StateStore/types/StateStore.ts#L12)

name of store

***

### removeState

> **removeState**: [`StateDeleteFunction`](../type-aliases/StateDeleteFunction.md)

Defined in: [packages/core/src/core/StateStore/types/StateStore.ts:26](https://github.com/puristajs/purista/blob/master/packages/core/src/core/StateStore/types/StateStore.ts#L26)

delete a state value

#### Param

name of state

#### Throws

UnhandledError

***

### setState

> **setState**: [`StateSetterFunction`](../type-aliases/StateSetterFunction.md)

Defined in: [packages/core/src/core/StateStore/types/StateStore.ts:34](https://github.com/puristajs/purista/blob/master/packages/core/src/core/StateStore/types/StateStore.ts#L34)

set a state value

#### Param

name of state

#### Param

value of state

#### Throws

UnhandledError

## Methods

### destroy()

> **destroy**(): `Promise`\<`void`\>

Defined in: [packages/core/src/core/StateStore/types/StateStore.ts:39](https://github.com/puristajs/purista/blob/master/packages/core/src/core/StateStore/types/StateStore.ts#L39)

disconnects and shuts down the state store

#### Returns

`Promise`\<`void`\>
