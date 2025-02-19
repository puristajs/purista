[**@purista/core v2.0.0**](../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / DefaultStateStore

# Class: DefaultStateStore

Defined in: [packages/core/src/DefaultStateStore/DefaultStateStore.impl.ts:13](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultStateStore/DefaultStateStore.impl.ts#L13)

The DefaultStateStore is a placeholder which offers all needed methods.
Getters and setters will throw a UnhandledError with status `Not implemented`

## Extends

- [`StateStoreBaseClass`](StateStoreBaseClass.md)\<[`DefaultStateStoreConfig`](../type-aliases/DefaultStateStoreConfig.md)\>

## Implements

- [`StateStore`](../interfaces/StateStore.md)

## Constructors

### new DefaultStateStore()

> **new DefaultStateStore**(`config`?): [`DefaultStateStore`](DefaultStateStore.md)

Defined in: [packages/core/src/DefaultStateStore/DefaultStateStore.impl.ts:15](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultStateStore/DefaultStateStore.impl.ts#L15)

#### Parameters

##### config?

###### cacheTtl?

`number`

Cache time to live in ms

###### enableCache?

`boolean`

Enable cache

###### enableGet?

`boolean`

Enable generally get method

###### enableRemove?

`boolean`

Enable generally remove method

###### enableSet?

`boolean`

Enable generally set method

###### logger?

[`Logger`](Logger.md)

A logger instance

###### logLevel?

[`LogLevelName`](../type-aliases/LogLevelName.md)

A log level for new logger if logger is not set

#### Returns

[`DefaultStateStore`](DefaultStateStore.md)

#### Overrides

[`StateStoreBaseClass`](StateStoreBaseClass.md).[`constructor`](StateStoreBaseClass.md#constructors)

## Properties

### config

> **config**: `object`

Defined in: [packages/core/src/core/StateStore/StateStoreBaseClass.impl.ts:20](https://github.com/puristajs/purista/blob/master/packages/core/src/core/StateStore/StateStoreBaseClass.impl.ts#L20)

#### Index Signature

\[`key`: `string`\]: `unknown`

#### cacheTtl?

> `optional` **cacheTtl**: `number`

Cache time to live in ms

#### enableCache?

> `optional` **enableCache**: `boolean`

Enable cache

#### enableGet?

> `optional` **enableGet**: `boolean`

Enable generally get method

#### enableRemove?

> `optional` **enableRemove**: `boolean`

Enable generally remove method

#### enableSet?

> `optional` **enableSet**: `boolean`

Enable generally set method

#### logger?

> `optional` **logger**: [`Logger`](Logger.md)

A logger instance

#### logLevel?

> `optional` **logLevel**: [`LogLevelName`](../type-aliases/LogLevelName.md)

A log level for new logger if logger is not set

#### Inherited from

[`StateStoreBaseClass`](StateStoreBaseClass.md).[`config`](StateStoreBaseClass.md#config-1)

***

### logger

> **logger**: [`Logger`](Logger.md)

Defined in: [packages/core/src/core/StateStore/StateStoreBaseClass.impl.ts:19](https://github.com/puristajs/purista/blob/master/packages/core/src/core/StateStore/StateStoreBaseClass.impl.ts#L19)

#### Inherited from

[`StateStoreBaseClass`](StateStoreBaseClass.md).[`logger`](StateStoreBaseClass.md#logger)

***

### name

> **name**: `string`

Defined in: [packages/core/src/core/StateStore/StateStoreBaseClass.impl.ts:22](https://github.com/puristajs/purista/blob/master/packages/core/src/core/StateStore/StateStoreBaseClass.impl.ts#L22)

name of store

#### Implementation of

[`StateStore`](../interfaces/StateStore.md).[`name`](../interfaces/StateStore.md#name)

#### Inherited from

[`StateStoreBaseClass`](StateStoreBaseClass.md).[`name`](StateStoreBaseClass.md#name-1)

## Methods

### destroy()

> **destroy**(): `Promise`\<`void`\>

Defined in: [packages/core/src/core/StateStore/StateStoreBaseClass.impl.ts:82](https://github.com/puristajs/purista/blob/master/packages/core/src/core/StateStore/StateStoreBaseClass.impl.ts#L82)

disconnects and shuts down the state store

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`StateStore`](../interfaces/StateStore.md).[`destroy`](../interfaces/StateStore.md#destroy)

#### Inherited from

[`StateStoreBaseClass`](StateStoreBaseClass.md).[`destroy`](StateStoreBaseClass.md#destroy)

***

### getState()

> **getState**\<`StateNames`\>(...`stateNames`): `Promise`\<[`ObjectWithKeysFromStringArray`](../type-aliases/ObjectWithKeysFromStringArray.md)\<`StateNames`\>\>

Defined in: [packages/core/src/core/StateStore/StateStoreBaseClass.impl.ts:43](https://github.com/puristajs/purista/blob/master/packages/core/src/core/StateStore/StateStoreBaseClass.impl.ts#L43)

get a state value

#### Type Parameters

• **StateNames** *extends* `string`[]

#### Parameters

##### stateNames

...`StateNames`

#### Returns

`Promise`\<[`ObjectWithKeysFromStringArray`](../type-aliases/ObjectWithKeysFromStringArray.md)\<`StateNames`\>\>

#### Param

name of state

#### Throws

UnhandledError

#### Implementation of

`StateStore.getState`

#### Inherited from

[`StateStoreBaseClass`](StateStoreBaseClass.md).[`getState`](StateStoreBaseClass.md#getstate)

***

### getStateImpl()

> `protected` **getStateImpl**\<`StateNames`\>(...`stateNames`): `Promise`\<[`ObjectWithKeysFromStringArray`](../type-aliases/ObjectWithKeysFromStringArray.md)\<`StateNames`\>\>

Defined in: [packages/core/src/DefaultStateStore/DefaultStateStore.impl.ts:25](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultStateStore/DefaultStateStore.impl.ts#L25)

#### Type Parameters

• **StateNames** *extends* `string`[]

#### Parameters

##### stateNames

...`StateNames`

#### Returns

`Promise`\<[`ObjectWithKeysFromStringArray`](../type-aliases/ObjectWithKeysFromStringArray.md)\<`StateNames`\>\>

#### Overrides

[`StateStoreBaseClass`](StateStoreBaseClass.md).[`getStateImpl`](StateStoreBaseClass.md#getstateimpl)

***

### removeState()

> **removeState**(`stateName`): `Promise`\<`void`\>

Defined in: [packages/core/src/core/StateStore/StateStoreBaseClass.impl.ts:58](https://github.com/puristajs/purista/blob/master/packages/core/src/core/StateStore/StateStoreBaseClass.impl.ts#L58)

delete a state value

#### Parameters

##### stateName

`string`

#### Returns

`Promise`\<`void`\>

#### Param

name of state

#### Throws

UnhandledError

#### Implementation of

`StateStore.removeState`

#### Inherited from

[`StateStoreBaseClass`](StateStoreBaseClass.md).[`removeState`](StateStoreBaseClass.md#removestate)

***

### removeStateImpl()

> `protected` **removeStateImpl**(`stateName`): `Promise`\<`void`\>

Defined in: [packages/core/src/DefaultStateStore/DefaultStateStore.impl.ts:39](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultStateStore/DefaultStateStore.impl.ts#L39)

#### Parameters

##### stateName

`string`

#### Returns

`Promise`\<`void`\>

#### Overrides

[`StateStoreBaseClass`](StateStoreBaseClass.md).[`removeStateImpl`](StateStoreBaseClass.md#removestateimpl)

***

### setState()

> **setState**(`stateName`, `stateValue`): `Promise`\<`void`\>

Defined in: [packages/core/src/core/StateStore/StateStoreBaseClass.impl.ts:72](https://github.com/puristajs/purista/blob/master/packages/core/src/core/StateStore/StateStoreBaseClass.impl.ts#L72)

set a state value

#### Parameters

##### stateName

`string`

##### stateValue

`unknown`

#### Returns

`Promise`\<`void`\>

#### Param

name of state

#### Param

value of state

#### Throws

UnhandledError

#### Implementation of

`StateStore.setState`

#### Inherited from

[`StateStoreBaseClass`](StateStoreBaseClass.md).[`setState`](StateStoreBaseClass.md#setstate)

***

### setStateImpl()

> `protected` **setStateImpl**(`stateName`, `stateValue`): `Promise`\<`void`\>

Defined in: [packages/core/src/DefaultStateStore/DefaultStateStore.impl.ts:35](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultStateStore/DefaultStateStore.impl.ts#L35)

#### Parameters

##### stateName

`string`

##### stateValue

`unknown`

#### Returns

`Promise`\<`void`\>

#### Overrides

[`StateStoreBaseClass`](StateStoreBaseClass.md).[`setStateImpl`](StateStoreBaseClass.md#setstateimpl)
