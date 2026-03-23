[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/dapr-sdk](../README.md) / DaprStateStore

# Class: DaprStateStore

Defined in: [dapr-sdk/src/DaprStateStore/DaprStateStore.impl.ts:15](https://github.com/puristajs/purista/blob/master/packages/dapr-sdk/src/DaprStateStore/DaprStateStore.impl.ts#L15)

DaprStateStore is an adapter which connects to the state store provided by the underlaying Dapr infrastructure

## Extends

- [`StateStoreBaseClass`](../../core/classes/StateStoreBaseClass.md)\<[`DaprStateStoreConfig`](../type-aliases/DaprStateStoreConfig.md)\>

## Constructors

### Constructor

> **new DaprStateStore**(`config?`): `DaprStateStore`

Defined in: [dapr-sdk/src/DaprStateStore/DaprStateStore.impl.ts:18](https://github.com/puristajs/purista/blob/master/packages/dapr-sdk/src/DaprStateStore/DaprStateStore.impl.ts#L18)

#### Parameters

##### config?

###### cacheTtl?

`number`

Cache time to live in ms

###### clientConfig?

[`DaprClientConfig`](../type-aliases/DaprClientConfig.md)

The Dapr client config to interact with Dapr sidecar

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

[`Logger`](../../core/classes/Logger.md)

A logger instance

###### logLevel?

[`LogLevelName`](../../core/type-aliases/LogLevelName.md)

A log level for new logger if logger is not set

###### stateStoreName?

`string`

The name of the state store

#### Returns

`DaprStateStore`

#### Overrides

[`StateStoreBaseClass`](../../core/classes/StateStoreBaseClass.md).[`constructor`](../../core/classes/StateStoreBaseClass.md#constructor)

## Properties

### config

> **config**: `object`

Defined in: [core/src/core/StateStore/StateStoreBaseClass.impl.ts:22](https://github.com/puristajs/purista/blob/master/packages/core/src/core/StateStore/StateStoreBaseClass.impl.ts#L22)

#### cacheTtl?

> `optional` **cacheTtl**: `number`

Cache time to live in ms

#### clientConfig?

> `optional` **clientConfig**: [`DaprClientConfig`](../type-aliases/DaprClientConfig.md)

The Dapr client config to interact with Dapr sidecar

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

> `optional` **logger**: [`Logger`](../../core/classes/Logger.md)

A logger instance

#### logLevel?

> `optional` **logLevel**: [`LogLevelName`](../../core/type-aliases/LogLevelName.md)

A log level for new logger if logger is not set

#### stateStoreName?

> `optional` **stateStoreName**: `string`

The name of the state store

#### Inherited from

[`StateStoreBaseClass`](../../core/classes/StateStoreBaseClass.md).[`config`](../../core/classes/StateStoreBaseClass.md#config)

***

### logger

> **logger**: [`Logger`](../../core/classes/Logger.md)

Defined in: [core/src/core/StateStore/StateStoreBaseClass.impl.ts:21](https://github.com/puristajs/purista/blob/master/packages/core/src/core/StateStore/StateStoreBaseClass.impl.ts#L21)

#### Inherited from

[`StateStoreBaseClass`](../../core/classes/StateStoreBaseClass.md).[`logger`](../../core/classes/StateStoreBaseClass.md#logger)

***

### name

> **name**: `string`

Defined in: [core/src/core/StateStore/StateStoreBaseClass.impl.ts:24](https://github.com/puristajs/purista/blob/master/packages/core/src/core/StateStore/StateStoreBaseClass.impl.ts#L24)

#### Inherited from

[`StateStoreBaseClass`](../../core/classes/StateStoreBaseClass.md).[`name`](../../core/classes/StateStoreBaseClass.md#name)

## Methods

### destroy()

> **destroy**(): `Promise`\<`void`\>

Defined in: [core/src/core/StateStore/StateStoreBaseClass.impl.ts:84](https://github.com/puristajs/purista/blob/master/packages/core/src/core/StateStore/StateStoreBaseClass.impl.ts#L84)

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`StateStoreBaseClass`](../../core/classes/StateStoreBaseClass.md).[`destroy`](../../core/classes/StateStoreBaseClass.md#destroy)

***

### getState()

> **getState**\<`StateNames`\>(...`stateNames`): `Promise`\<[`ObjectWithKeysFromStringArray`](../../core/type-aliases/ObjectWithKeysFromStringArray.md)\<`StateNames`\>\>

Defined in: [core/src/core/StateStore/StateStoreBaseClass.impl.ts:45](https://github.com/puristajs/purista/blob/master/packages/core/src/core/StateStore/StateStoreBaseClass.impl.ts#L45)

#### Type Parameters

##### StateNames

`StateNames` *extends* `string`[]

#### Parameters

##### stateNames

...`StateNames`

#### Returns

`Promise`\<[`ObjectWithKeysFromStringArray`](../../core/type-aliases/ObjectWithKeysFromStringArray.md)\<`StateNames`\>\>

#### Inherited from

[`StateStoreBaseClass`](../../core/classes/StateStoreBaseClass.md).[`getState`](../../core/classes/StateStoreBaseClass.md#getstate)

***

### getStateImpl()

> `protected` **getStateImpl**\<`StateNames`\>(...`stateNames`): `Promise`\<[`ObjectWithKeysFromStringArray`](../../core/type-aliases/ObjectWithKeysFromStringArray.md)\<`StateNames`\>\>

Defined in: [dapr-sdk/src/DaprStateStore/DaprStateStore.impl.ts:53](https://github.com/puristajs/purista/blob/master/packages/dapr-sdk/src/DaprStateStore/DaprStateStore.impl.ts#L53)

#### Type Parameters

##### StateNames

`StateNames` *extends* `string`[]

#### Parameters

##### stateNames

...`StateNames`

#### Returns

`Promise`\<[`ObjectWithKeysFromStringArray`](../../core/type-aliases/ObjectWithKeysFromStringArray.md)\<`StateNames`\>\>

#### Overrides

[`StateStoreBaseClass`](../../core/classes/StateStoreBaseClass.md).[`getStateImpl`](../../core/classes/StateStoreBaseClass.md#getstateimpl)

***

### removeState()

> **removeState**(`stateName`): `Promise`\<`void`\>

Defined in: [core/src/core/StateStore/StateStoreBaseClass.impl.ts:60](https://github.com/puristajs/purista/blob/master/packages/core/src/core/StateStore/StateStoreBaseClass.impl.ts#L60)

#### Parameters

##### stateName

`string`

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`StateStoreBaseClass`](../../core/classes/StateStoreBaseClass.md).[`removeState`](../../core/classes/StateStoreBaseClass.md#removestate)

***

### removeStateImpl()

> `protected` **removeStateImpl**(`stateName`): `Promise`\<`void`\>

Defined in: [dapr-sdk/src/DaprStateStore/DaprStateStore.impl.ts:99](https://github.com/puristajs/purista/blob/master/packages/dapr-sdk/src/DaprStateStore/DaprStateStore.impl.ts#L99)

#### Parameters

##### stateName

`string`

#### Returns

`Promise`\<`void`\>

#### Overrides

[`StateStoreBaseClass`](../../core/classes/StateStoreBaseClass.md).[`removeStateImpl`](../../core/classes/StateStoreBaseClass.md#removestateimpl)

***

### setState()

> **setState**(`stateName`, `stateValue`): `Promise`\<`void`\>

Defined in: [core/src/core/StateStore/StateStoreBaseClass.impl.ts:74](https://github.com/puristajs/purista/blob/master/packages/core/src/core/StateStore/StateStoreBaseClass.impl.ts#L74)

#### Parameters

##### stateName

`string`

##### stateValue

`unknown`

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`StateStoreBaseClass`](../../core/classes/StateStoreBaseClass.md).[`setState`](../../core/classes/StateStoreBaseClass.md#setstate)

***

### setStateImpl()

> `protected` **setStateImpl**(`stateName`, `stateValue`): `Promise`\<`void`\>

Defined in: [dapr-sdk/src/DaprStateStore/DaprStateStore.impl.ts:82](https://github.com/puristajs/purista/blob/master/packages/dapr-sdk/src/DaprStateStore/DaprStateStore.impl.ts#L82)

#### Parameters

##### stateName

`string`

##### stateValue

`unknown`

#### Returns

`Promise`\<`void`\>

#### Overrides

[`StateStoreBaseClass`](../../core/classes/StateStoreBaseClass.md).[`setStateImpl`](../../core/classes/StateStoreBaseClass.md#setstateimpl)
