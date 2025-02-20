[**@purista/core v2.0.5**](../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / ConfigStoreBaseClass

# Class: `abstract` ConfigStoreBaseClass\<ConfigStoreConfigType\>

Defined in: [packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts:20](https://github.com/puristajs/purista/blob/master/packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts#L20)

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

• **ConfigStoreConfigType** *extends* `Record`\<`string`, `unknown`\> = [`EmptyObject`](../type-aliases/EmptyObject.md)

## Constructors

### new ConfigStoreBaseClass()

> **new ConfigStoreBaseClass**\<`ConfigStoreConfigType`\>(`name`, `config`): [`ConfigStoreBaseClass`](ConfigStoreBaseClass.md)\<`ConfigStoreConfigType`\>

Defined in: [packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts:28](https://github.com/puristajs/purista/blob/master/packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts#L28)

#### Parameters

##### name

`string`

##### config

\{ \[K in string \| number \| symbol\]: (\{ cacheTtl?: number; enableCache?: boolean; enableGet?: boolean; enableRemove?: boolean; enableSet?: boolean; logger?: Logger; logLevel?: LogLevelName \} & ConfigStoreConfigType)\[K\] \}

#### Returns

[`ConfigStoreBaseClass`](ConfigStoreBaseClass.md)\<`ConfigStoreConfigType`\>

## Properties

### cache

> **cache**: [`ConfigStoreCacheMap`](../type-aliases/ConfigStoreCacheMap.md)

Defined in: [packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts:26](https://github.com/puristajs/purista/blob/master/packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts#L26)

***

### config

> **config**: \{ \[K in string \| number \| symbol\]: (\{ cacheTtl?: number; enableCache?: boolean; enableGet?: boolean; enableRemove?: boolean; enableSet?: boolean; logger?: Logger; logLevel?: LogLevelName \} & ConfigStoreConfigType)\[K\] \}

Defined in: [packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts:22](https://github.com/puristajs/purista/blob/master/packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts#L22)

***

### logger

> **logger**: [`Logger`](Logger.md)

Defined in: [packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts:21](https://github.com/puristajs/purista/blob/master/packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts#L21)

***

### name

> **name**: `string`

Defined in: [packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts:24](https://github.com/puristajs/purista/blob/master/packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts#L24)

## Methods

### destroy()

> **destroy**(): `Promise`\<`void`\>

Defined in: [packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts:126](https://github.com/puristajs/purista/blob/master/packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts#L126)

#### Returns

`Promise`\<`void`\>

***

### getConfig()

> **getConfig**\<`ConfigNames`\>(...`configNames`): `Promise`\<[`ObjectWithKeysFromStringArray`](../type-aliases/ObjectWithKeysFromStringArray.md)\<`ConfigNames`\>\>

Defined in: [packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts:62](https://github.com/puristajs/purista/blob/master/packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts#L62)

Returns the values for given config properties.
This function **SHOULD NOT** be overwritten by store implementation.
For implementation overwrite protected `getConfigImpl`

#### Type Parameters

• **ConfigNames** *extends* `string`[]

#### Parameters

##### configNames

...`ConfigNames`

#### Returns

`Promise`\<[`ObjectWithKeysFromStringArray`](../type-aliases/ObjectWithKeysFromStringArray.md)\<`ConfigNames`\>\>

an object of { [configName]: value | undefined }

***

### getConfigImpl()

> `abstract` `protected` **getConfigImpl**\<`ConfigNames`\>(...`configNames`): `Promise`\<[`ObjectWithKeysFromStringArray`](../type-aliases/ObjectWithKeysFromStringArray.md)\<`ConfigNames`\>\>

Defined in: [packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts:49](https://github.com/puristajs/purista/blob/master/packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts#L49)

This method must be overwritten by actual store implementation.

#### Type Parameters

• **ConfigNames** *extends* `string`[]

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

Defined in: [packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts:89](https://github.com/puristajs/purista/blob/master/packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts#L89)

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

Defined in: [packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts:79](https://github.com/puristajs/purista/blob/master/packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts#L79)

This method must be overwritten by actual store implementation.

#### Parameters

##### configName

`string`

#### Returns

`Promise`\<`void`\>

***

### setConfig()

> **setConfig**(`configName`, `configValue`): `Promise`\<`void`\>

Defined in: [packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts:116](https://github.com/puristajs/purista/blob/master/packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts#L116)

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

Defined in: [packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts:105](https://github.com/puristajs/purista/blob/master/packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts#L105)

This method must be overwritten by actual store implementation.

#### Parameters

##### \_configName

`string`

##### \_configValue

`unknown`

#### Returns

`Promise`\<`void`\>
