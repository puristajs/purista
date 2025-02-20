[**@purista/aws-config-store v2.0.5**](../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/aws-config-store](../README.md) / AWSConfigStore

# Class: AWSConfigStore

Defined in: [aws-config-store/src/AWSConfigStore.impl.ts:27](https://github.com/puristajs/purista/blob/master/packages/aws-config-store/src/AWSConfigStore.impl.ts#L27)

The config store adapter for AWS System Manager.
It will store, retrive, update or remove configs in AWS System Manager.

For performance reasons, and to reduce costs, the config values are cached in memory after first fetch.

You can disable the whole caching via config by setting enableCache to false.
If the cache is enabled, you can set the ttl for cached config values via config cacheTtl (in ms).

This will return the cached config if available and if ttl is not exceeded.
If a config value exceeds the ttl, it does not automatically get removed from cache.
It will be removed/overwritten on next get request.

## Extends

- [`ConfigStoreBaseClass`](../../core/classes/ConfigStoreBaseClass.md)\<[`AWSConfigStoreConfig`](../type-aliases/AWSConfigStoreConfig.md)\>

## Constructors

### new AWSConfigStore()

> **new AWSConfigStore**(`config`): [`AWSConfigStore`](AWSConfigStore.md)

Defined in: [aws-config-store/src/AWSConfigStore.impl.ts:30](https://github.com/puristajs/purista/blob/master/packages/aws-config-store/src/AWSConfigStore.impl.ts#L30)

#### Parameters

##### config

###### cacheTtl?

`number`

Cache time to live in ms

###### client

`SSMClientConfig`

AWS client options

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

[`AWSConfigStore`](AWSConfigStore.md)

#### Overrides

[`ConfigStoreBaseClass`](../../core/classes/ConfigStoreBaseClass.md).[`constructor`](../../core/classes/ConfigStoreBaseClass.md#constructors)

## Properties

### cache

> **cache**: [`ConfigStoreCacheMap`](../../core/type-aliases/ConfigStoreCacheMap.md)

Defined in: core/dist/commonjs/core/ConfigStore/ConfigStoreBaseClass.impl.d.ts:20

#### Inherited from

[`ConfigStoreBaseClass`](../../core/classes/ConfigStoreBaseClass.md).[`cache`](../../core/classes/ConfigStoreBaseClass.md#cache)

***

### client

> **client**: `SSMClient`

Defined in: [aws-config-store/src/AWSConfigStore.impl.ts:28](https://github.com/puristajs/purista/blob/master/packages/aws-config-store/src/AWSConfigStore.impl.ts#L28)

***

### config

> **config**: `object`

Defined in: core/dist/commonjs/core/ConfigStore/ConfigStoreBaseClass.impl.d.ts:18

#### cacheTtl?

> `optional` **cacheTtl**: `number`

Cache time to live in ms

#### client

> **client**: `SSMClientConfig`

AWS client options

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

[`ConfigStoreBaseClass`](../../core/classes/ConfigStoreBaseClass.md).[`config`](../../core/classes/ConfigStoreBaseClass.md#config-1)

***

### logger

> **logger**: [`Logger`](../../core/classes/Logger.md)

Defined in: core/dist/commonjs/core/ConfigStore/ConfigStoreBaseClass.impl.d.ts:17

#### Inherited from

[`ConfigStoreBaseClass`](../../core/classes/ConfigStoreBaseClass.md).[`logger`](../../core/classes/ConfigStoreBaseClass.md#logger)

***

### name

> **name**: `string`

Defined in: core/dist/commonjs/core/ConfigStore/ConfigStoreBaseClass.impl.d.ts:19

#### Inherited from

[`ConfigStoreBaseClass`](../../core/classes/ConfigStoreBaseClass.md).[`name`](../../core/classes/ConfigStoreBaseClass.md#name-1)

## Methods

### destroy()

> **destroy**(): `Promise`\<`void`\>

Defined in: core/dist/commonjs/core/ConfigStore/ConfigStoreBaseClass.impl.d.ts:70

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`ConfigStoreBaseClass`](../../core/classes/ConfigStoreBaseClass.md).[`destroy`](../../core/classes/ConfigStoreBaseClass.md#destroy)

***

### getConfig()

> **getConfig**\<`ConfigNames`\>(...`configNames`): `Promise`\<[`ObjectWithKeysFromStringArray`](../../core/type-aliases/ObjectWithKeysFromStringArray.md)\<`ConfigNames`\>\>

Defined in: core/dist/commonjs/core/ConfigStore/ConfigStoreBaseClass.impl.d.ts:37

Returns the values for given config properties.
This function **SHOULD NOT** be overwritten by store implementation.
For implementation overwrite protected `getConfigImpl`

#### Type Parameters

• **ConfigNames** *extends* `string`[]

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

Defined in: [aws-config-store/src/AWSConfigStore.impl.ts:35](https://github.com/puristajs/purista/blob/master/packages/aws-config-store/src/AWSConfigStore.impl.ts#L35)

This method must be overwritten by actual store implementation.

#### Type Parameters

• **ConfigNames** *extends* `string`[]

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

Defined in: core/dist/commonjs/core/ConfigStore/ConfigStoreBaseClass.impl.d.ts:52

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

Defined in: [aws-config-store/src/AWSConfigStore.impl.ts:58](https://github.com/puristajs/purista/blob/master/packages/aws-config-store/src/AWSConfigStore.impl.ts#L58)

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

Defined in: core/dist/commonjs/core/ConfigStore/ConfigStoreBaseClass.impl.d.ts:69

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

Defined in: [aws-config-store/src/AWSConfigStore.impl.ts:66](https://github.com/puristajs/purista/blob/master/packages/aws-config-store/src/AWSConfigStore.impl.ts#L66)

This method must be overwritten by actual store implementation.

#### Parameters

##### configName

`string`

##### configValue

`string`

#### Returns

`Promise`\<`void`\>

#### Overrides

[`ConfigStoreBaseClass`](../../core/classes/ConfigStoreBaseClass.md).[`setConfigImpl`](../../core/classes/ConfigStoreBaseClass.md#setconfigimpl)
