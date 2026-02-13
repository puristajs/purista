[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / ConfigStoreBaseClass

# Abstract Class: ConfigStoreBaseClass\<ConfigStoreConfigType\>

Defined in: [core/ConfigStore/ConfigStoreBaseClass.impl.ts:22](https://github.com/puristajs/purista/blob/master/packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts#L22)

Base class for config store adapters.
The actual store implementation must overwrite the protected methods:

- `getConfigImpl`
- `setConfigImpl`
- `removeConfigImpl`

__DO NOT OVERWRITE__: the regular methods getConfig, setConfig or removeConfig

## Extended by

- [`DefaultConfigStore`](DefaultConfigStore.md)
- [`AWSConfigStore`](../../aws-config-store/classes/AWSConfigStore.md)
- [`DaprConfigStore`](../../dapr-sdk/classes/DaprConfigStore.md)
- [`NatsConfigStore`](../../nats-config-store/classes/NatsConfigStore.md)
- [`RedisConfigStore`](../../redis-config-store/classes/RedisConfigStore.md)

## Type Parameters

### ConfigStoreConfigType

`ConfigStoreConfigType` *extends* `Record`\<`string`, `unknown`\> = [`EmptyObject`](../type-aliases/EmptyObject.md)

## Constructors

### Constructor

> **new ConfigStoreBaseClass**\<`ConfigStoreConfigType`\>(`name`, `config`): `ConfigStoreBaseClass`\<`ConfigStoreConfigType`\>

Defined in: [core/ConfigStore/ConfigStoreBaseClass.impl.ts:30](https://github.com/puristajs/purista/blob/master/packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts#L30)

#### Parameters

##### name

`string`

##### config

\{ \[K in string \| number \| symbol\]: (\{ cacheTtl?: number; enableCache?: boolean; enableGet?: boolean; enableRemove?: boolean; enableSet?: boolean; logger?: Logger; logLevel?: LogLevelName \} & ConfigStoreConfigType)\[K\] \}

#### Returns

`ConfigStoreBaseClass`\<`ConfigStoreConfigType`\>

## Properties

### cache

> **cache**: [`ConfigStoreCacheMap`](../type-aliases/ConfigStoreCacheMap.md)

Defined in: [core/ConfigStore/ConfigStoreBaseClass.impl.ts:28](https://github.com/puristajs/purista/blob/master/packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts#L28)

***

### config

> **config**: \{ \[K in string \| number \| symbol\]: (\{ cacheTtl?: number; enableCache?: boolean; enableGet?: boolean; enableRemove?: boolean; enableSet?: boolean; logger?: Logger; logLevel?: LogLevelName \} & ConfigStoreConfigType)\[K\] \}

Defined in: [core/ConfigStore/ConfigStoreBaseClass.impl.ts:24](https://github.com/puristajs/purista/blob/master/packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts#L24)

***

### logger

> **logger**: [`Logger`](Logger.md)

Defined in: [core/ConfigStore/ConfigStoreBaseClass.impl.ts:23](https://github.com/puristajs/purista/blob/master/packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts#L23)

***

### name

> **name**: `string`

Defined in: [core/ConfigStore/ConfigStoreBaseClass.impl.ts:26](https://github.com/puristajs/purista/blob/master/packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts#L26)

## Methods

### destroy()

> **destroy**(): `Promise`\<`void`\>

Defined in: [core/ConfigStore/ConfigStoreBaseClass.impl.ts:128](https://github.com/puristajs/purista/blob/master/packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts#L128)

#### Returns

`Promise`\<`void`\>

***

### getConfig()

> **getConfig**\<`ConfigNames`\>(...`configNames`): `Promise`\<[`ObjectWithKeysFromStringArray`](../type-aliases/ObjectWithKeysFromStringArray.md)\<`ConfigNames`\>\>

Defined in: [core/ConfigStore/ConfigStoreBaseClass.impl.ts:64](https://github.com/puristajs/purista/blob/master/packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts#L64)

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

`Promise`\<[`ObjectWithKeysFromStringArray`](../type-aliases/ObjectWithKeysFromStringArray.md)\<`ConfigNames`\>\>

an object of { [configName]: value | undefined }

***

### getConfigImpl()

> `abstract` `protected` **getConfigImpl**\<`ConfigNames`\>(...`configNames`): `Promise`\<[`ObjectWithKeysFromStringArray`](../type-aliases/ObjectWithKeysFromStringArray.md)\<`ConfigNames`\>\>

Defined in: [core/ConfigStore/ConfigStoreBaseClass.impl.ts:51](https://github.com/puristajs/purista/blob/master/packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts#L51)

This method must be overwritten by actual store implementation.

#### Type Parameters

##### ConfigNames

`ConfigNames` *extends* `string`[]

#### Parameters

##### configNames

...`ConfigNames`

list of config items

#### Returns

`Promise`\<[`ObjectWithKeysFromStringArray`](../type-aliases/ObjectWithKeysFromStringArray.md)\<`ConfigNames`\>\>

an object of { [configName]: value | undefined }

***

### removeConfig()

> **removeConfig**(`configName`): `Promise`\<`void`\>

Defined in: [core/ConfigStore/ConfigStoreBaseClass.impl.ts:91](https://github.com/puristajs/purista/blob/master/packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts#L91)

Removes the config item given by config name.
This function **SHOULD NOT** be overwritten by store implementation.
For implementation overwrite protected `removeConfigImpl`

#### Parameters

##### configName

`string`

#### Returns

`Promise`\<`void`\>

***

### removeConfigImpl()

> `abstract` `protected` **removeConfigImpl**(`configName`): `Promise`\<`void`\>

Defined in: [core/ConfigStore/ConfigStoreBaseClass.impl.ts:81](https://github.com/puristajs/purista/blob/master/packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts#L81)

This method must be overwritten by actual store implementation.

#### Parameters

##### configName

`string`

#### Returns

`Promise`\<`void`\>

***

### setConfig()

> **setConfig**(`configName`, `configValue`): `Promise`\<`void`\>

Defined in: [core/ConfigStore/ConfigStoreBaseClass.impl.ts:118](https://github.com/puristajs/purista/blob/master/packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts#L118)

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

***

### setConfigImpl()

> `abstract` `protected` **setConfigImpl**(`_configName`, `_configValue`): `Promise`\<`void`\>

Defined in: [core/ConfigStore/ConfigStoreBaseClass.impl.ts:107](https://github.com/puristajs/purista/blob/master/packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts#L107)

This method must be overwritten by actual store implementation.

#### Parameters

##### \_configName

`string`

##### \_configValue

`unknown`

#### Returns

`Promise`\<`void`\>
