[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/nats-config-store](../README.md) / NatsConfigStore

# Class: NatsConfigStore

Defined in: [nats-config-store/src/NatsConfigStore.impl.ts:31](https://github.com/puristajs/purista/blob/master/packages/nats-config-store/src/NatsConfigStore.impl.ts#L31)

A config store for using NATS (with JetStream) as storage.
JetStream must be enabled at the NATS broker.

## Example

```ts
* ```typescript
const config = {
  port: 8222
}

const store = new NatsConfigStore({ config })

await store.setConfig('configKey',{ myConfig: 'value' })

let value = await store.getConfig('configKey')
console.log(value) // outputs: { configKey: { myConfig: 'value' } }

await store.removeConfig('configKey')

value = await store.getConfig('configKey')
console.log(value) // outputs: undefined
```
```

## Extends

- [`ConfigStoreBaseClass`](../../core/classes/ConfigStoreBaseClass.md)\<[`NatsConfigStoreConfig`](../type-aliases/NatsConfigStoreConfig.md)\>

## Constructors

### Constructor

> **new NatsConfigStore**(`config?`): `NatsConfigStore`

Defined in: [nats-config-store/src/NatsConfigStore.impl.ts:37](https://github.com/puristajs/purista/blob/master/packages/nats-config-store/src/NatsConfigStore.impl.ts#L37)

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

###### keyValueStoreName?

`string`

###### logger?

[`Logger`](../../core/classes/Logger.md)

###### logLevel?

[`LogLevelName`](../../core/type-aliases/LogLevelName.md)

#### Returns

`NatsConfigStore`

#### Overrides

[`ConfigStoreBaseClass`](../../core/classes/ConfigStoreBaseClass.md).[`constructor`](../../core/classes/ConfigStoreBaseClass.md#constructor)

## Properties

### cache

> **cache**: [`ConfigStoreCacheMap`](../../core/type-aliases/ConfigStoreCacheMap.md)

Defined in: core/dist/commonjs/core/ConfigStore/ConfigStoreBaseClass.impl.d.ts:22

#### Inherited from

[`ConfigStoreBaseClass`](../../core/classes/ConfigStoreBaseClass.md).[`cache`](../../core/classes/ConfigStoreBaseClass.md#cache)

***

### config

> **config**: `object`

Defined in: core/dist/commonjs/core/ConfigStore/ConfigStoreBaseClass.impl.d.ts:20

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

#### keyValueStoreName

> **keyValueStoreName**: `string`

#### logger?

> `optional` **logger**: [`Logger`](../../core/classes/Logger.md)

#### logLevel?

> `optional` **logLevel**: [`LogLevelName`](../../core/type-aliases/LogLevelName.md)

#### Inherited from

[`ConfigStoreBaseClass`](../../core/classes/ConfigStoreBaseClass.md).[`config`](../../core/classes/ConfigStoreBaseClass.md#config)

***

### connection

> **connection**: `NatsConnection` \| `undefined`

Defined in: [nats-config-store/src/NatsConfigStore.impl.ts:32](https://github.com/puristajs/purista/blob/master/packages/nats-config-store/src/NatsConfigStore.impl.ts#L32)

***

### kv

> **kv**: `KV` \| `undefined`

Defined in: [nats-config-store/src/NatsConfigStore.impl.ts:35](https://github.com/puristajs/purista/blob/master/packages/nats-config-store/src/NatsConfigStore.impl.ts#L35)

***

### logger

> **logger**: [`Logger`](../../core/classes/Logger.md)

Defined in: core/dist/commonjs/core/ConfigStore/ConfigStoreBaseClass.impl.d.ts:19

#### Inherited from

[`ConfigStoreBaseClass`](../../core/classes/ConfigStoreBaseClass.md).[`logger`](../../core/classes/ConfigStoreBaseClass.md#logger)

***

### name

> **name**: `string`

Defined in: core/dist/commonjs/core/ConfigStore/ConfigStoreBaseClass.impl.d.ts:21

#### Inherited from

[`ConfigStoreBaseClass`](../../core/classes/ConfigStoreBaseClass.md).[`name`](../../core/classes/ConfigStoreBaseClass.md#name)

***

### sc

> **sc**: `Codec`\<`unknown`\>

Defined in: [nats-config-store/src/NatsConfigStore.impl.ts:34](https://github.com/puristajs/purista/blob/master/packages/nats-config-store/src/NatsConfigStore.impl.ts#L34)

## Methods

### destroy()

> **destroy**(): `Promise`\<`void`\>

Defined in: [nats-config-store/src/NatsConfigStore.impl.ts:118](https://github.com/puristajs/purista/blob/master/packages/nats-config-store/src/NatsConfigStore.impl.ts#L118)

#### Returns

`Promise`\<`void`\>

#### Overrides

[`ConfigStoreBaseClass`](../../core/classes/ConfigStoreBaseClass.md).[`destroy`](../../core/classes/ConfigStoreBaseClass.md#destroy)

***

### getConfig()

> **getConfig**\<`ConfigNames`\>(...`configNames`): `Promise`\<[`ObjectWithKeysFromStringArray`](../../core/type-aliases/ObjectWithKeysFromStringArray.md)\<`ConfigNames`\>\>

Defined in: core/dist/commonjs/core/ConfigStore/ConfigStoreBaseClass.impl.d.ts:39

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

> `protected` **getConfigImpl**\<`ConfigNames`\>(...`stateNames`): `Promise`\<[`ObjectWithKeysFromStringArray`](../../core/type-aliases/ObjectWithKeysFromStringArray.md)\<`ConfigNames`\>\>

Defined in: [nats-config-store/src/NatsConfigStore.impl.ts:75](https://github.com/puristajs/purista/blob/master/packages/nats-config-store/src/NatsConfigStore.impl.ts#L75)

This method must be overwritten by actual store implementation.

#### Type Parameters

##### ConfigNames

`ConfigNames` *extends* `string`[]

#### Parameters

##### stateNames

...`ConfigNames`

list of config items

#### Returns

`Promise`\<[`ObjectWithKeysFromStringArray`](../../core/type-aliases/ObjectWithKeysFromStringArray.md)\<`ConfigNames`\>\>

an object of { [configName]: value | undefined }

#### Overrides

[`ConfigStoreBaseClass`](../../core/classes/ConfigStoreBaseClass.md).[`getConfigImpl`](../../core/classes/ConfigStoreBaseClass.md#getconfigimpl)

***

### getStore()

> **getStore**(): `Promise`\<`KV`\>

Defined in: [nats-config-store/src/NatsConfigStore.impl.ts:45](https://github.com/puristajs/purista/blob/master/packages/nats-config-store/src/NatsConfigStore.impl.ts#L45)

#### Returns

`Promise`\<`KV`\>

***

### removeConfig()

> **removeConfig**(`configName`): `Promise`\<`void`\>

Defined in: core/dist/commonjs/core/ConfigStore/ConfigStoreBaseClass.impl.d.ts:54

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

> `protected` **removeConfigImpl**(`stateName`): `Promise`\<`void`\>

Defined in: [nats-config-store/src/NatsConfigStore.impl.ts:94](https://github.com/puristajs/purista/blob/master/packages/nats-config-store/src/NatsConfigStore.impl.ts#L94)

This method must be overwritten by actual store implementation.

#### Parameters

##### stateName

`string`

#### Returns

`Promise`\<`void`\>

#### Overrides

[`ConfigStoreBaseClass`](../../core/classes/ConfigStoreBaseClass.md).[`removeConfigImpl`](../../core/classes/ConfigStoreBaseClass.md#removeconfigimpl)

***

### setConfig()

> **setConfig**(`configName`, `configValue`): `Promise`\<`void`\>

Defined in: core/dist/commonjs/core/ConfigStore/ConfigStoreBaseClass.impl.d.ts:71

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

> `protected` **setConfigImpl**(`stateName`, `stateValue`): `Promise`\<`void`\>

Defined in: [nats-config-store/src/NatsConfigStore.impl.ts:106](https://github.com/puristajs/purista/blob/master/packages/nats-config-store/src/NatsConfigStore.impl.ts#L106)

This method must be overwritten by actual store implementation.

#### Parameters

##### stateName

`string`

##### stateValue

`unknown`

#### Returns

`Promise`\<`void`\>

#### Overrides

[`ConfigStoreBaseClass`](../../core/classes/ConfigStoreBaseClass.md).[`setConfigImpl`](../../core/classes/ConfigStoreBaseClass.md#setconfigimpl)
