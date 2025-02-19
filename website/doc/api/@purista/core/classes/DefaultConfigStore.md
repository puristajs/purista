[**@purista/core v2.0.0**](../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / DefaultConfigStore

# Class: DefaultConfigStore

Defined in: [packages/core/src/DefaultConfigStore/DefaultConfigStore.impl.ts:28](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultConfigStore/DefaultConfigStore.impl.ts#L28)

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

### new DefaultConfigStore()

> **new DefaultConfigStore**(`config`?): [`DefaultConfigStore`](DefaultConfigStore.md)

Defined in: [packages/core/src/DefaultConfigStore/DefaultConfigStore.impl.ts:30](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultConfigStore/DefaultConfigStore.impl.ts#L30)

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

[`DefaultConfigStore`](DefaultConfigStore.md)

#### Overrides

[`ConfigStoreBaseClass`](ConfigStoreBaseClass.md).[`constructor`](ConfigStoreBaseClass.md#constructors)

## Properties

### cache

> **cache**: [`ConfigStoreCacheMap`](../type-aliases/ConfigStoreCacheMap.md)

Defined in: [packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts:26](https://github.com/puristajs/purista/blob/master/packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts#L26)

#### Inherited from

[`ConfigStoreBaseClass`](ConfigStoreBaseClass.md).[`cache`](ConfigStoreBaseClass.md#cache)

***

### config

> **config**: `object`

Defined in: [packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts:22](https://github.com/puristajs/purista/blob/master/packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts#L22)

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

[`ConfigStoreBaseClass`](ConfigStoreBaseClass.md).[`config`](ConfigStoreBaseClass.md#config-1)

***

### logger

> **logger**: [`Logger`](Logger.md)

Defined in: [packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts:21](https://github.com/puristajs/purista/blob/master/packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts#L21)

#### Inherited from

[`ConfigStoreBaseClass`](ConfigStoreBaseClass.md).[`logger`](ConfigStoreBaseClass.md#logger)

***

### name

> **name**: `string`

Defined in: [packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts:24](https://github.com/puristajs/purista/blob/master/packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts#L24)

name of store

#### Implementation of

[`ConfigStore`](../interfaces/ConfigStore.md).[`name`](../interfaces/ConfigStore.md#name)

#### Inherited from

[`ConfigStoreBaseClass`](ConfigStoreBaseClass.md).[`name`](ConfigStoreBaseClass.md#name-1)

## Methods

### destroy()

> **destroy**(): `Promise`\<`void`\>

Defined in: [packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts:126](https://github.com/puristajs/purista/blob/master/packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts#L126)

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

Defined in: [packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts:62](https://github.com/puristajs/purista/blob/master/packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts#L62)

get a config value

#### Type Parameters

• **ConfigNames** *extends* `string`[]

#### Parameters

##### configNames

...`ConfigNames`

#### Returns

`Promise`\<[`ObjectWithKeysFromStringArray`](../type-aliases/ObjectWithKeysFromStringArray.md)\<`ConfigNames`\>\>

the config

an object of { [configName]: value | undefined }

#### Param

name of config

#### Throws

UnhandledError

#### Implementation of

`ConfigStore.getConfig`

#### Inherited from

[`ConfigStoreBaseClass`](ConfigStoreBaseClass.md).[`getConfig`](ConfigStoreBaseClass.md#getconfig)

***

### getConfigImpl()

> `protected` **getConfigImpl**\<`ConfigNames`\>(...`configNames`): `Promise`\<[`ObjectWithKeysFromStringArray`](../type-aliases/ObjectWithKeysFromStringArray.md)\<`ConfigNames`\>\>

Defined in: [packages/core/src/DefaultConfigStore/DefaultConfigStore.impl.ts:40](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultConfigStore/DefaultConfigStore.impl.ts#L40)

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

#### Overrides

[`ConfigStoreBaseClass`](ConfigStoreBaseClass.md).[`getConfigImpl`](ConfigStoreBaseClass.md#getconfigimpl)

***

### removeConfig()

> **removeConfig**(`configName`): `Promise`\<`void`\>

Defined in: [packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts:89](https://github.com/puristajs/purista/blob/master/packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts#L89)

delete a config value

#### Parameters

##### configName

`string`

#### Returns

`Promise`\<`void`\>

#### Param

name of config

#### Throws

UnhandledError

#### Implementation of

`ConfigStore.removeConfig`

#### Inherited from

[`ConfigStoreBaseClass`](ConfigStoreBaseClass.md).[`removeConfig`](ConfigStoreBaseClass.md#removeconfig)

***

### removeConfigImpl()

> `protected` **removeConfigImpl**(`configName`): `Promise`\<`void`\>

Defined in: [packages/core/src/DefaultConfigStore/DefaultConfigStore.impl.ts:62](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultConfigStore/DefaultConfigStore.impl.ts#L62)

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

Defined in: [packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts:116](https://github.com/puristajs/purista/blob/master/packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts#L116)

set a config value

#### Parameters

##### configName

`string`

##### configValue

`unknown`

#### Returns

`Promise`\<`void`\>

#### Param

name of config

#### Param

value of config

#### Throws

UnhandledError

#### Implementation of

`ConfigStore.setConfig`

#### Inherited from

[`ConfigStoreBaseClass`](ConfigStoreBaseClass.md).[`setConfig`](ConfigStoreBaseClass.md#setconfig)

***

### setConfigImpl()

> `protected` **setConfigImpl**(`configName`, `configValue`): `Promise`\<`void`\>

Defined in: [packages/core/src/DefaultConfigStore/DefaultConfigStore.impl.ts:58](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultConfigStore/DefaultConfigStore.impl.ts#L58)

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
