[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/redis-config-store](../README.md) / RedisConfigStore

# Class: RedisConfigStore\<M, F, S\>

Defined in: [redis-config-store/src/RedisConfigStore.impl.ts:48](https://github.com/puristajs/purista/blob/master/packages/redis-config-store/src/RedisConfigStore.impl.ts#L48)

A config store for using redis as storage.
Config values are stored as stringified JSON.

Per default, setting/changing and removal of values are enabled.

## Example

```typescript
const config = {
 enableGet: true, // optional, default is true
 enableRemove: true, // optional, default is true
 enableSet: true, // optional, default is true
 url: 'redis://alice:foobared@awesome.redis.server:6379'
}

const store = new RedisConfigStore({ config })

await store.setConfig('configKey',{ myConfig: 'value' })

let value = await store.getConfig('configKey')
console.log(value) // outputs: { configKey: { myConfig: 'value' } }

await store.removeConfig('configKey')

value = await store.getConfig('configKey')
console.log(value) // outputs: undefined
```

See documentation of underlaying redis lib package for detailed configuration options.

## See

[NODE-REDIS](https://redis.js.org)

## Extends

- [`ConfigStoreBaseClass`](../../core/classes/ConfigStoreBaseClass.md)\<[`RedisStoreConfig`](../type-aliases/RedisStoreConfig.md)\<`M`, `F`, `S`\>\>

## Type Parameters

### M

`M` *extends* `RedisModules` = `RedisModules`

### F

`F` *extends* `RedisFunctions` = `RedisFunctions`

### S

`S` *extends* `RedisScripts` = `RedisScripts`

## Constructors

### Constructor

> **new RedisConfigStore**\<`M`, `F`, `S`\>(`config?`): `RedisConfigStore`\<`M`, `F`, `S`\>

Defined in: [redis-config-store/src/RedisConfigStore.impl.ts:55](https://github.com/puristajs/purista/blob/master/packages/redis-config-store/src/RedisConfigStore.impl.ts#L55)

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

###### logLevel?

[`LogLevelName`](../../core/type-aliases/LogLevelName.md)

#### Returns

`RedisConfigStore`\<`M`, `F`, `S`\>

#### Overrides

[`ConfigStoreBaseClass`](../../core/classes/ConfigStoreBaseClass.md).[`constructor`](../../core/classes/ConfigStoreBaseClass.md#constructor)

## Properties

### cache

> **cache**: [`ConfigStoreCacheMap`](../../core/type-aliases/ConfigStoreCacheMap.md)

Defined in: core/dist/core/ConfigStore/ConfigStoreBaseClass.impl.d.ts:22

#### Inherited from

[`ConfigStoreBaseClass`](../../core/classes/ConfigStoreBaseClass.md).[`cache`](../../core/classes/ConfigStoreBaseClass.md#cache)

***

### client

> **client**: `RedisClientType`\<`M`, `F`, `S`, `RespVersions`, `TypeMapping`\>

Defined in: [redis-config-store/src/RedisConfigStore.impl.ts:53](https://github.com/puristajs/purista/blob/master/packages/redis-config-store/src/RedisConfigStore.impl.ts#L53)

***

### config

> **config**: `object`

Defined in: core/dist/core/ConfigStore/ConfigStoreBaseClass.impl.d.ts:20

#### cacheTtl?

> `optional` **cacheTtl?**: `number`

Cache time to live in ms

#### config?

> `optional` **config?**: `RedisClientOptions`\<`M`, `F`, `S`, `RespVersions`, `TypeMapping`, `RedisSocketOptions`\>

#### enableCache?

> `optional` **enableCache?**: `boolean`

Enable cache

#### enableGet?

> `optional` **enableGet?**: `boolean`

Enable generally get method

#### enableRemove?

> `optional` **enableRemove?**: `boolean`

Enable generally remove method

#### enableSet?

> `optional` **enableSet?**: `boolean`

Enable generally set method

#### logger?

> `optional` **logger?**: [`Logger`](../../core/classes/Logger.md)

#### logLevel?

> `optional` **logLevel?**: [`LogLevelName`](../../core/type-aliases/LogLevelName.md)

#### Inherited from

[`ConfigStoreBaseClass`](../../core/classes/ConfigStoreBaseClass.md).[`config`](../../core/classes/ConfigStoreBaseClass.md#config)

***

### logger

> **logger**: [`Logger`](../../core/classes/Logger.md)

Defined in: core/dist/core/ConfigStore/ConfigStoreBaseClass.impl.d.ts:19

#### Inherited from

[`ConfigStoreBaseClass`](../../core/classes/ConfigStoreBaseClass.md).[`logger`](../../core/classes/ConfigStoreBaseClass.md#logger)

***

### name

> **name**: `string`

Defined in: core/dist/core/ConfigStore/ConfigStoreBaseClass.impl.d.ts:21

#### Inherited from

[`ConfigStoreBaseClass`](../../core/classes/ConfigStoreBaseClass.md).[`name`](../../core/classes/ConfigStoreBaseClass.md#name)

## Methods

### destroy()

> **destroy**(): `Promise`\<`void`\>

Defined in: [redis-config-store/src/RedisConfigStore.impl.ts:110](https://github.com/puristajs/purista/blob/master/packages/redis-config-store/src/RedisConfigStore.impl.ts#L110)

#### Returns

`Promise`\<`void`\>

#### Overrides

[`ConfigStoreBaseClass`](../../core/classes/ConfigStoreBaseClass.md).[`destroy`](../../core/classes/ConfigStoreBaseClass.md#destroy)

***

### getClient()

> `protected` **getClient**(): `Promise`\<`RedisClientType`\<`M`, `F`, `S`, `RespVersions`, `TypeMapping`\>\>

Defined in: [redis-config-store/src/RedisConfigStore.impl.ts:61](https://github.com/puristajs/purista/blob/master/packages/redis-config-store/src/RedisConfigStore.impl.ts#L61)

#### Returns

`Promise`\<`RedisClientType`\<`M`, `F`, `S`, `RespVersions`, `TypeMapping`\>\>

***

### getConfig()

> **getConfig**\<`ConfigNames`\>(...`configNames`): `Promise`\<[`ObjectWithKeysFromStringArray`](../../core/type-aliases/ObjectWithKeysFromStringArray.md)\<`ConfigNames`\>\>

Defined in: core/dist/core/ConfigStore/ConfigStoreBaseClass.impl.d.ts:39

Returns the values for given config properties.
This function **SHOULD NOT** be overwritten by store implementation.
For implementation overwrite protected `getConfigImpl`

#### Type Parameters

##### ConfigNames

`ConfigNames` *extends* `string`[]

#### Parameters

##### configNames

...`ConfigNames`

#### Returns

`Promise`\<[`ObjectWithKeysFromStringArray`](../../core/type-aliases/ObjectWithKeysFromStringArray.md)\<`ConfigNames`\>\>

an object of { [configName]: value | undefined }

#### Inherited from

[`ConfigStoreBaseClass`](../../core/classes/ConfigStoreBaseClass.md).[`getConfig`](../../core/classes/ConfigStoreBaseClass.md#getconfig)

***

### getConfigImpl()

> `protected` **getConfigImpl**\<`ConfigNames`\>(...`configNames`): `Promise`\<[`ObjectWithKeysFromStringArray`](../../core/type-aliases/ObjectWithKeysFromStringArray.md)\<`ConfigNames`\>\>

Defined in: [redis-config-store/src/RedisConfigStore.impl.ts:68](https://github.com/puristajs/purista/blob/master/packages/redis-config-store/src/RedisConfigStore.impl.ts#L68)

This method must be overwritten by actual store implementation.

#### Type Parameters

##### ConfigNames

`ConfigNames` *extends* `string`[]

#### Parameters

##### configNames

...`ConfigNames`

list of config items

#### Returns

`Promise`\<[`ObjectWithKeysFromStringArray`](../../core/type-aliases/ObjectWithKeysFromStringArray.md)\<`ConfigNames`\>\>

an object of { [configName]: value | undefined }

#### Overrides

[`ConfigStoreBaseClass`](../../core/classes/ConfigStoreBaseClass.md).[`getConfigImpl`](../../core/classes/ConfigStoreBaseClass.md#getconfigimpl)

***

### removeConfig()

> **removeConfig**(`configName`): `Promise`\<`void`\>

Defined in: core/dist/core/ConfigStore/ConfigStoreBaseClass.impl.d.ts:54

Removes the config item given by config name.
This function **SHOULD NOT** be overwritten by store implementation.
For implementation overwrite protected `removeConfigImpl`

#### Parameters

##### configName

`string`

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`ConfigStoreBaseClass`](../../core/classes/ConfigStoreBaseClass.md).[`removeConfig`](../../core/classes/ConfigStoreBaseClass.md#removeconfig)

***

### removeConfigImpl()

> `protected` **removeConfigImpl**(`configName`): `Promise`\<`void`\>

Defined in: [redis-config-store/src/RedisConfigStore.impl.ts:87](https://github.com/puristajs/purista/blob/master/packages/redis-config-store/src/RedisConfigStore.impl.ts#L87)

This method must be overwritten by actual store implementation.

#### Parameters

##### configName

`string`

#### Returns

`Promise`\<`void`\>

#### Overrides

[`ConfigStoreBaseClass`](../../core/classes/ConfigStoreBaseClass.md).[`removeConfigImpl`](../../core/classes/ConfigStoreBaseClass.md#removeconfigimpl)

***

### setConfig()

> **setConfig**(`configName`, `configValue`): `Promise`\<`void`\>

Defined in: core/dist/core/ConfigStore/ConfigStoreBaseClass.impl.d.ts:71

Sets a config value
This function **SHOULD NOT** be overwritten by store implementation.
For implementation overwrite protected `setConfigImpl`

#### Parameters

##### configName

`string`

##### configValue

`unknown`

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`ConfigStoreBaseClass`](../../core/classes/ConfigStoreBaseClass.md).[`setConfig`](../../core/classes/ConfigStoreBaseClass.md#setconfig)

***

### setConfigImpl()

> `protected` **setConfigImpl**(`configName`, `configValue`): `Promise`\<`void`\>

Defined in: [redis-config-store/src/RedisConfigStore.impl.ts:99](https://github.com/puristajs/purista/blob/master/packages/redis-config-store/src/RedisConfigStore.impl.ts#L99)

This method must be overwritten by actual store implementation.

#### Parameters

##### configName

`string`

##### configValue

`unknown`

#### Returns

`Promise`\<`void`\>

#### Overrides

[`ConfigStoreBaseClass`](../../core/classes/ConfigStoreBaseClass.md).[`setConfigImpl`](../../core/classes/ConfigStoreBaseClass.md#setconfigimpl)
