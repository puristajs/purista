[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / DefaultConfigStore

# Class: DefaultConfigStore

Defined in: [DefaultConfigStore/DefaultConfigStore.impl.ts:31](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultConfigStore/DefaultConfigStore.impl.ts#L31)

The DefaultConfigStore is a placeholder which offers all needed methods.
Getters and setters will throw a UnhandledError with status `Unauthorized`, when a disabled operation is called.

For development and testing purpose, you can initiate the store with values.

## Example

```typescript
const store = new DefaultConfigStore({
   enableGet: true,
   enableRemove: true,
   enableSet: true,
   config: {
     initialValue: 'initial',
   },
})

console.log(await store.getConfig('initialValue') // outputs: { initialValue: 'initial' }
```

## Extends

- [`ConfigStoreBaseClass`](ConfigStoreBaseClass.md)\<[`DefaultConfigStoreConfig`](../type-aliases/DefaultConfigStoreConfig.md)\>

## Implements

- [`ConfigStore`](../interfaces/ConfigStore.md)

## Constructors

### Constructor

> **new DefaultConfigStore**(`config?`): `DefaultConfigStore`

Defined in: [DefaultConfigStore/DefaultConfigStore.impl.ts:33](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultConfigStore/DefaultConfigStore.impl.ts#L33)

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

###### logLevel?

[`LogLevelName`](../type-aliases/LogLevelName.md)

#### Returns

`DefaultConfigStore`

#### Overrides

[`ConfigStoreBaseClass`](ConfigStoreBaseClass.md).[`constructor`](ConfigStoreBaseClass.md#constructor)

## Properties

### cache

> **cache**: [`ConfigStoreCacheMap`](../type-aliases/ConfigStoreCacheMap.md)

Defined in: [core/ConfigStore/ConfigStoreBaseClass.impl.ts:28](https://github.com/puristajs/purista/blob/master/packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts#L28)

#### Inherited from

[`ConfigStoreBaseClass`](ConfigStoreBaseClass.md).[`cache`](ConfigStoreBaseClass.md#cache)

***

### config

> **config**: `object`

Defined in: [core/ConfigStore/ConfigStoreBaseClass.impl.ts:24](https://github.com/puristajs/purista/blob/master/packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts#L24)

#### Index Signature

\[`key`: `string`\]: `unknown`

#### cacheTtl?

> `optional` **cacheTtl?**: `number`

Cache time to live in ms

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

> `optional` **logger?**: [`Logger`](Logger.md)

#### logLevel?

> `optional` **logLevel?**: [`LogLevelName`](../type-aliases/LogLevelName.md)

#### Inherited from

[`ConfigStoreBaseClass`](ConfigStoreBaseClass.md).[`config`](ConfigStoreBaseClass.md#config)

***

### logger

> **logger**: [`Logger`](Logger.md)

Defined in: [core/ConfigStore/ConfigStoreBaseClass.impl.ts:23](https://github.com/puristajs/purista/blob/master/packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts#L23)

#### Inherited from

[`ConfigStoreBaseClass`](ConfigStoreBaseClass.md).[`logger`](ConfigStoreBaseClass.md#logger)

***

### name

> **name**: `string`

Defined in: [core/ConfigStore/ConfigStoreBaseClass.impl.ts:26](https://github.com/puristajs/purista/blob/master/packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts#L26)

name of store

#### Implementation of

[`ConfigStore`](../interfaces/ConfigStore.md).[`name`](../interfaces/ConfigStore.md#name)

#### Inherited from

[`ConfigStoreBaseClass`](ConfigStoreBaseClass.md).[`name`](ConfigStoreBaseClass.md#name)

## Methods

### destroy()

> **destroy**(): `Promise`\<`void`\>

Defined in: [core/ConfigStore/ConfigStoreBaseClass.impl.ts:128](https://github.com/puristajs/purista/blob/master/packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts#L128)

disconnects and shuts down the config store

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`ConfigStore`](../interfaces/ConfigStore.md).[`destroy`](../interfaces/ConfigStore.md#destroy)

#### Inherited from

[`ConfigStoreBaseClass`](ConfigStoreBaseClass.md).[`destroy`](ConfigStoreBaseClass.md#destroy)

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

#### Implementation of

`ConfigStore.getConfig`

#### Inherited from

[`ConfigStoreBaseClass`](ConfigStoreBaseClass.md).[`getConfig`](ConfigStoreBaseClass.md#getconfig)

***

### getConfigImpl()

> `protected` **getConfigImpl**\<`ConfigNames`\>(...`configNames`): `Promise`\<[`ObjectWithKeysFromStringArray`](../type-aliases/ObjectWithKeysFromStringArray.md)\<`ConfigNames`\>\>

Defined in: [DefaultConfigStore/DefaultConfigStore.impl.ts:43](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultConfigStore/DefaultConfigStore.impl.ts#L43)

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

#### Overrides

[`ConfigStoreBaseClass`](ConfigStoreBaseClass.md).[`getConfigImpl`](ConfigStoreBaseClass.md#getconfigimpl)

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

#### Implementation of

`ConfigStore.removeConfig`

#### Inherited from

[`ConfigStoreBaseClass`](ConfigStoreBaseClass.md).[`removeConfig`](ConfigStoreBaseClass.md#removeconfig)

***

### removeConfigImpl()

> `protected` **removeConfigImpl**(`configName`): `Promise`\<`void`\>

Defined in: [DefaultConfigStore/DefaultConfigStore.impl.ts:65](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultConfigStore/DefaultConfigStore.impl.ts#L65)

This method must be overwritten by actual store implementation.

#### Parameters

##### configName

`string`

#### Returns

`Promise`\<`void`\>

#### Overrides

[`ConfigStoreBaseClass`](ConfigStoreBaseClass.md).[`removeConfigImpl`](ConfigStoreBaseClass.md#removeconfigimpl)

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

#### Implementation of

`ConfigStore.setConfig`

#### Inherited from

[`ConfigStoreBaseClass`](ConfigStoreBaseClass.md).[`setConfig`](ConfigStoreBaseClass.md#setconfig)

***

### setConfigImpl()

> `protected` **setConfigImpl**(`configName`, `configValue`): `Promise`\<`void`\>

Defined in: [DefaultConfigStore/DefaultConfigStore.impl.ts:61](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultConfigStore/DefaultConfigStore.impl.ts#L61)

This method must be overwritten by actual store implementation.

#### Parameters

##### configName

`string`

##### configValue

`unknown`

#### Returns

`Promise`\<`void`\>

#### Overrides

[`ConfigStoreBaseClass`](ConfigStoreBaseClass.md).[`setConfigImpl`](ConfigStoreBaseClass.md#setconfigimpl)
