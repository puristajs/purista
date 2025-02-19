[**@purista/dapr-sdk v2.0.0**](../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/dapr-sdk](../README.md) / DaprConfigStore

# Class: DaprConfigStore

Defined in: [dapr-sdk/src/DaprConfigStore/DaprConfigStore.impl.ts:16](https://github.com/puristajs/purista/blob/master/packages/dapr-sdk/src/DaprConfigStore/DaprConfigStore.impl.ts#L16)

DaprConfigStore is an adapter which connects to the config store provided by the underlaying Dapr infrastructure

## Extends

- [`ConfigStoreBaseClass`](../../core/classes/ConfigStoreBaseClass.md)\<[`DaprConfigStoreConfig`](../type-aliases/DaprConfigStoreConfig.md)\>

## Constructors

### new DaprConfigStore()

> **new DaprConfigStore**(`config`?): [`DaprConfigStore`](DaprConfigStore.md)

Defined in: [dapr-sdk/src/DaprConfigStore/DaprConfigStore.impl.ts:19](https://github.com/puristajs/purista/blob/master/packages/dapr-sdk/src/DaprConfigStore/DaprConfigStore.impl.ts#L19)

#### Parameters

##### config?

###### cacheTtl?

`number`

Cache time to live in ms

###### clientConfig?

[`DaprClientConfig`](../type-aliases/DaprClientConfig.md)

The Dapr client config to interact with Dapr sidecar

###### configStoreName?

`string`

The name of the config store

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

[`DaprConfigStore`](DaprConfigStore.md)

#### Overrides

[`ConfigStoreBaseClass`](../../core/classes/ConfigStoreBaseClass.md).[`constructor`](../../core/classes/ConfigStoreBaseClass.md#constructors)

## Properties

### cache

> **cache**: [`ConfigStoreCacheMap`](../../core/type-aliases/ConfigStoreCacheMap.md)

Defined in: core/dist/commonjs/core/ConfigStore/ConfigStoreBaseClass.impl.d.ts:20

#### Inherited from

[`ConfigStoreBaseClass`](../../core/classes/ConfigStoreBaseClass.md).[`cache`](../../core/classes/ConfigStoreBaseClass.md#cache)

***

### config

> **config**: `object`

Defined in: core/dist/commonjs/core/ConfigStore/ConfigStoreBaseClass.impl.d.ts:18

#### cacheTtl?

> `optional` **cacheTtl**: `number`

Cache time to live in ms

#### clientConfig?

> `optional` **clientConfig**: [`DaprClientConfig`](../type-aliases/DaprClientConfig.md)

The Dapr client config to interact with Dapr sidecar

#### configStoreName?

> `optional` **configStoreName**: `string`

The name of the config store

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

> **getConfigImpl**\<`ConfigNames`\>(...`configNames`): `Promise`\<[`ObjectWithKeysFromStringArray`](../../core/type-aliases/ObjectWithKeysFromStringArray.md)\<`ConfigNames`\>\>

Defined in: [dapr-sdk/src/DaprConfigStore/DaprConfigStore.impl.ts:54](https://github.com/puristajs/purista/blob/master/packages/dapr-sdk/src/DaprConfigStore/DaprConfigStore.impl.ts#L54)

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

> **removeConfigImpl**(`_configName`): `Promise`\<`void`\>

Defined in: [dapr-sdk/src/DaprConfigStore/DaprConfigStore.impl.ts:84](https://github.com/puristajs/purista/blob/master/packages/dapr-sdk/src/DaprConfigStore/DaprConfigStore.impl.ts#L84)

This method must be overwritten by actual store implementation.

#### Parameters

##### \_configName

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

> **setConfigImpl**(`_configName`, `_configValue`): `Promise`\<`void`\>

Defined in: [dapr-sdk/src/DaprConfigStore/DaprConfigStore.impl.ts:80](https://github.com/puristajs/purista/blob/master/packages/dapr-sdk/src/DaprConfigStore/DaprConfigStore.impl.ts#L80)

This method must be overwritten by actual store implementation.

#### Parameters

##### \_configName

`string`

##### \_configValue

`unknown`

#### Returns

`Promise`\<`void`\>

#### Overrides

[`ConfigStoreBaseClass`](../../core/classes/ConfigStoreBaseClass.md).[`setConfigImpl`](../../core/classes/ConfigStoreBaseClass.md#setconfigimpl)
