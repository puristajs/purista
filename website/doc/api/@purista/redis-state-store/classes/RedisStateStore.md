[**@purista/redis-state-store v2.0.5**](../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/redis-state-store](../README.md) / RedisStateStore

# Class: RedisStateStore\<M, F, S\>

Defined in: [redis-state-store/src/RedisStateStore.impl.ts:41](https://github.com/puristajs/purista/blob/master/packages/redis-state-store/src/RedisStateStore.impl.ts#L41)

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

• **M** *extends* `RedisModules` = `RedisModules`

• **F** *extends* `RedisFunctions` = `RedisFunctions`

• **S** *extends* `RedisScripts` = `RedisScripts`

## Constructors

### new RedisStateStore()

> **new RedisStateStore**\<`M`, `F`, `S`\>(`config`?): [`RedisStateStore`](RedisStateStore.md)\<`M`, `F`, `S`\>

Defined in: [redis-state-store/src/RedisStateStore.impl.ts:48](https://github.com/puristajs/purista/blob/master/packages/redis-state-store/src/RedisStateStore.impl.ts#L48)

#### Parameters

##### config?

###### cacheTtl?

`number`

Cache time to live in ms

###### config?

`RedisClientOptions`\<`M`, `F`, `S`\>

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

[`RedisStateStore`](RedisStateStore.md)\<`M`, `F`, `S`\>

#### Overrides

[`StateStoreBaseClass`](../../core/classes/StateStoreBaseClass.md).[`constructor`](../../core/classes/StateStoreBaseClass.md#constructors)

## Properties

### client

> **client**: `RedisClientType`\<`M`, `F`, `S`\>

Defined in: [redis-state-store/src/RedisStateStore.impl.ts:46](https://github.com/puristajs/purista/blob/master/packages/redis-state-store/src/RedisStateStore.impl.ts#L46)

***

### config

> **config**: `object`

Defined in: core/dist/commonjs/core/StateStore/StateStoreBaseClass.impl.d.ts:16

#### cacheTtl?

> `optional` **cacheTtl**: `number`

Cache time to live in ms

#### config?

> `optional` **config**: `RedisClientOptions`\<`M`, `F`, `S`\>

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

[`StateStoreBaseClass`](../../core/classes/StateStoreBaseClass.md).[`config`](../../core/classes/StateStoreBaseClass.md#config-1)

***

### logger

> **logger**: [`Logger`](../../core/classes/Logger.md)

Defined in: core/dist/commonjs/core/StateStore/StateStoreBaseClass.impl.d.ts:15

#### Inherited from

[`StateStoreBaseClass`](../../core/classes/StateStoreBaseClass.md).[`logger`](../../core/classes/StateStoreBaseClass.md#logger)

***

### name

> **name**: `string`

Defined in: core/dist/commonjs/core/StateStore/StateStoreBaseClass.impl.d.ts:17

#### Inherited from

[`StateStoreBaseClass`](../../core/classes/StateStoreBaseClass.md).[`name`](../../core/classes/StateStoreBaseClass.md#name-1)

## Methods

### destroy()

> **destroy**(): `Promise`\<`void`\>

Defined in: [redis-state-store/src/RedisStateStore.impl.ts:107](https://github.com/puristajs/purista/blob/master/packages/redis-state-store/src/RedisStateStore.impl.ts#L107)

#### Returns

`Promise`\<`void`\>

#### Overrides

[`StateStoreBaseClass`](../../core/classes/StateStoreBaseClass.md).[`destroy`](../../core/classes/StateStoreBaseClass.md#destroy)

***

### getClient()

> `protected` **getClient**(): `Promise`\<`RedisClientType`\<`M`, `F`, `S`\>\>

Defined in: [redis-state-store/src/RedisStateStore.impl.ts:54](https://github.com/puristajs/purista/blob/master/packages/redis-state-store/src/RedisStateStore.impl.ts#L54)

#### Returns

`Promise`\<`RedisClientType`\<`M`, `F`, `S`\>\>

***

### getState()

> **getState**\<`StateNames`\>(...`stateNames`): `Promise`\<[`ObjectWithKeysFromStringArray`](../../core/type-aliases/ObjectWithKeysFromStringArray.md)\<`StateNames`\>\>

Defined in: core/dist/commonjs/core/StateStore/StateStoreBaseClass.impl.d.ts:20

#### Type Parameters

• **StateNames** *extends* `string`[]

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

Defined in: [redis-state-store/src/RedisStateStore.impl.ts:61](https://github.com/puristajs/purista/blob/master/packages/redis-state-store/src/RedisStateStore.impl.ts#L61)

#### Type Parameters

• **StateNames** *extends* `string`[]

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

Defined in: core/dist/commonjs/core/StateStore/StateStoreBaseClass.impl.d.ts:22

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

Defined in: [redis-state-store/src/RedisStateStore.impl.ts:80](https://github.com/puristajs/purista/blob/master/packages/redis-state-store/src/RedisStateStore.impl.ts#L80)

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

Defined in: core/dist/commonjs/core/StateStore/StateStoreBaseClass.impl.d.ts:24

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

Defined in: [redis-state-store/src/RedisStateStore.impl.ts:92](https://github.com/puristajs/purista/blob/master/packages/redis-state-store/src/RedisStateStore.impl.ts#L92)

#### Parameters

##### stateName

`string`

##### stateValue

`unknown`

#### Returns

`Promise`\<`void`\>

#### Overrides

[`StateStoreBaseClass`](../../core/classes/StateStoreBaseClass.md).[`setStateImpl`](../../core/classes/StateStoreBaseClass.md#setstateimpl)
