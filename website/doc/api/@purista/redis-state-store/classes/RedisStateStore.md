[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/redis-state-store](../README.md) / RedisStateStore

# Class: RedisStateStore\<M, F, S\>

Defined in: [redis-state-store/src/RedisStateStore.impl.ts:48](https://github.com/puristajs/purista/blob/master/packages/redis-state-store/src/RedisStateStore.impl.ts#L48)

A state store for using redis as storage.
State values are stored as stringified JSON.

Per default, setting/changing and removal of values are enabled.

## Example

```typescript
const config = {
 enableGet: true, // optional, default is true
 enableRemove: true, // optional, default is true
 enableSet: true, // optional, default is true
 url: 'redis://alice:foobared@awesome.redis.server:6379'
}

const store = new RedisStateStore({ config })

await store.setState('stateKey',{ myState: 'value' })

let value = await store.getState('stateKey')
console.log(value) // outputs: { stateKey: { myState: 'value' } }

await store.removeState('stateKey')

value = await store.getState('stateKey')
console.log(value) // outputs: undefined
```

See documentation of underlaying redis lib package for detailed configuration options.

## See

[NODE-REDIS](https://redis.js.org)

## Extends

- [`StateStoreBaseClass`](../../core/classes/StateStoreBaseClass.md)\<[`RedisStoreConfig`](../type-aliases/RedisStoreConfig.md)\<`M`, `F`, `S`\>\>

## Type Parameters

### M

`M` *extends* `RedisModules` = `RedisModules`

### F

`F` *extends* `RedisFunctions` = `RedisFunctions`

### S

`S` *extends* `RedisScripts` = `RedisScripts`

## Constructors

### Constructor

> **new RedisStateStore**\<`M`, `F`, `S`\>(`config?`): `RedisStateStore`\<`M`, `F`, `S`\>

Defined in: [redis-state-store/src/RedisStateStore.impl.ts:55](https://github.com/puristajs/purista/blob/master/packages/redis-state-store/src/RedisStateStore.impl.ts#L55)

#### Parameters

##### config?

###### cacheTtl?

`number`

Cache time to live in ms

###### config?

`RedisClientOptions`\<`M`, `F`, `S`, `RespVersions`, `TypeMapping`, `RedisSocketOptions`\>

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

#### Returns

`RedisStateStore`\<`M`, `F`, `S`\>

#### Overrides

[`StateStoreBaseClass`](../../core/classes/StateStoreBaseClass.md).[`constructor`](../../core/classes/StateStoreBaseClass.md#constructor)

## Properties

### client

> **client**: `RedisClientType`\<`M`, `F`, `S`, `RespVersions`, `TypeMapping`\>

Defined in: [redis-state-store/src/RedisStateStore.impl.ts:53](https://github.com/puristajs/purista/blob/master/packages/redis-state-store/src/RedisStateStore.impl.ts#L53)

***

### config

> **config**: `object`

Defined in: core/dist/commonjs/core/StateStore/StateStoreBaseClass.impl.d.ts:18

#### cacheTtl?

> `optional` **cacheTtl**: `number`

Cache time to live in ms

#### config?

> `optional` **config**: `RedisClientOptions`\<`M`, `F`, `S`, `RespVersions`, `TypeMapping`, `RedisSocketOptions`\>

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

#### Inherited from

[`StateStoreBaseClass`](../../core/classes/StateStoreBaseClass.md).[`config`](../../core/classes/StateStoreBaseClass.md#config)

***

### logger

> **logger**: [`Logger`](../../core/classes/Logger.md)

Defined in: core/dist/commonjs/core/StateStore/StateStoreBaseClass.impl.d.ts:17

#### Inherited from

[`StateStoreBaseClass`](../../core/classes/StateStoreBaseClass.md).[`logger`](../../core/classes/StateStoreBaseClass.md#logger)

***

### name

> **name**: `string`

Defined in: core/dist/commonjs/core/StateStore/StateStoreBaseClass.impl.d.ts:19

#### Inherited from

[`StateStoreBaseClass`](../../core/classes/StateStoreBaseClass.md).[`name`](../../core/classes/StateStoreBaseClass.md#name)

## Methods

### destroy()

> **destroy**(): `Promise`\<`void`\>

Defined in: [redis-state-store/src/RedisStateStore.impl.ts:114](https://github.com/puristajs/purista/blob/master/packages/redis-state-store/src/RedisStateStore.impl.ts#L114)

#### Returns

`Promise`\<`void`\>

#### Overrides

[`StateStoreBaseClass`](../../core/classes/StateStoreBaseClass.md).[`destroy`](../../core/classes/StateStoreBaseClass.md#destroy)

***

### getClient()

> `protected` **getClient**(): `Promise`\<`RedisClientType`\<`M`, `F`, `S`, `RespVersions`, `TypeMapping`\>\>

Defined in: [redis-state-store/src/RedisStateStore.impl.ts:61](https://github.com/puristajs/purista/blob/master/packages/redis-state-store/src/RedisStateStore.impl.ts#L61)

#### Returns

`Promise`\<`RedisClientType`\<`M`, `F`, `S`, `RespVersions`, `TypeMapping`\>\>

***

### getState()

> **getState**\<`StateNames`\>(...`stateNames`): `Promise`\<[`ObjectWithKeysFromStringArray`](../../core/type-aliases/ObjectWithKeysFromStringArray.md)\<`StateNames`\>\>

Defined in: core/dist/commonjs/core/StateStore/StateStoreBaseClass.impl.d.ts:22

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

Defined in: [redis-state-store/src/RedisStateStore.impl.ts:68](https://github.com/puristajs/purista/blob/master/packages/redis-state-store/src/RedisStateStore.impl.ts#L68)

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

Defined in: core/dist/commonjs/core/StateStore/StateStoreBaseClass.impl.d.ts:24

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

Defined in: [redis-state-store/src/RedisStateStore.impl.ts:87](https://github.com/puristajs/purista/blob/master/packages/redis-state-store/src/RedisStateStore.impl.ts#L87)

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

Defined in: core/dist/commonjs/core/StateStore/StateStoreBaseClass.impl.d.ts:26

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

Defined in: [redis-state-store/src/RedisStateStore.impl.ts:99](https://github.com/puristajs/purista/blob/master/packages/redis-state-store/src/RedisStateStore.impl.ts#L99)

#### Parameters

##### stateName

`string`

##### stateValue

`unknown`

#### Returns

`Promise`\<`void`\>

#### Overrides

[`StateStoreBaseClass`](../../core/classes/StateStoreBaseClass.md).[`setStateImpl`](../../core/classes/StateStoreBaseClass.md#setstateimpl)
