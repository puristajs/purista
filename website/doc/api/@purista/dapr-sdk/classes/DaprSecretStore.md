[**@purista/dapr-sdk v1.11.0**](../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/dapr-sdk](../README.md) / DaprSecretStore

# Class: DaprSecretStore

Defined in: [dapr-sdk/src/DaprSecretStore/DaprSecretStore.impl.ts:17](https://github.com/puristajs/purista/blob/master/packages/dapr-sdk/src/DaprSecretStore/DaprSecretStore.impl.ts#L17)

DaprSecretStore is an adapter which connects to the secret store provided by the underlaying Dapr infrastructure.

Dapr currently provides only the possibility to fetch a secret. Creating a new secret, changing an existing secret or removal of secrets is not supported.

## Extends

- [`SecretStoreBaseClass`](../../core/classes/SecretStoreBaseClass.md)\<[`DaprSecretStoreConfig`](../type-aliases/DaprSecretStoreConfig.md)\>

## Constructors

### new DaprSecretStore()

> **new DaprSecretStore**(`config`?): [`DaprSecretStore`](DaprSecretStore.md)

Defined in: [dapr-sdk/src/DaprSecretStore/DaprSecretStore.impl.ts:20](https://github.com/puristajs/purista/blob/master/packages/dapr-sdk/src/DaprSecretStore/DaprSecretStore.impl.ts#L20)

#### Parameters

##### config?

###### cacheTtl?

`number`

Cache time to live in ms

###### clientConfig?

[`DaprClientConfig`](../type-aliases/DaprClientConfig.md)

The Dapr client config to interact with Dapr sidecar

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

###### metadata?

\{ `namespace`: `string`; \}

Dapr secret store metadata

###### metadata.namespace?

`string`

In case of deploying into namespace other than default, the namespace (e.g. production) must be set

###### secretStoreName?

`string`

The name of the secret store

#### Returns

[`DaprSecretStore`](DaprSecretStore.md)

#### Overrides

[`SecretStoreBaseClass`](../../core/classes/SecretStoreBaseClass.md).[`constructor`](../../core/classes/SecretStoreBaseClass.md#constructors)

## Properties

### cache

> **cache**: [`SecretStoreCacheMap`](../../core/type-aliases/SecretStoreCacheMap.md)

Defined in: core/dist/commonjs/core/SecretStore/SecretStoreBaseClass.impl.d.ts:20

#### Inherited from

[`SecretStoreBaseClass`](../../core/classes/SecretStoreBaseClass.md).[`cache`](../../core/classes/SecretStoreBaseClass.md#cache)

***

### config

> **config**: `object`

Defined in: core/dist/commonjs/core/SecretStore/SecretStoreBaseClass.impl.d.ts:18

#### cacheTtl?

> `optional` **cacheTtl**: `number`

Cache time to live in ms

#### clientConfig?

> `optional` **clientConfig**: [`DaprClientConfig`](../type-aliases/DaprClientConfig.md)

The Dapr client config to interact with Dapr sidecar

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

#### metadata?

> `optional` **metadata**: `object`

Dapr secret store metadata

##### metadata.namespace?

> `optional` **metadata.namespace**: `string`

In case of deploying into namespace other than default, the namespace (e.g. production) must be set

#### secretStoreName?

> `optional` **secretStoreName**: `string`

The name of the secret store

#### Inherited from

[`SecretStoreBaseClass`](../../core/classes/SecretStoreBaseClass.md).[`config`](../../core/classes/SecretStoreBaseClass.md#config-1)

***

### logger

> **logger**: [`Logger`](../../core/classes/Logger.md)

Defined in: core/dist/commonjs/core/SecretStore/SecretStoreBaseClass.impl.d.ts:17

#### Inherited from

[`SecretStoreBaseClass`](../../core/classes/SecretStoreBaseClass.md).[`logger`](../../core/classes/SecretStoreBaseClass.md#logger)

***

### name

> **name**: `string`

Defined in: core/dist/commonjs/core/SecretStore/SecretStoreBaseClass.impl.d.ts:19

#### Inherited from

[`SecretStoreBaseClass`](../../core/classes/SecretStoreBaseClass.md).[`name`](../../core/classes/SecretStoreBaseClass.md#name-1)

## Methods

### destroy()

> **destroy**(): `Promise`\<`void`\>

Defined in: core/dist/commonjs/core/SecretStore/SecretStoreBaseClass.impl.d.ts:28

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`SecretStoreBaseClass`](../../core/classes/SecretStoreBaseClass.md).[`destroy`](../../core/classes/SecretStoreBaseClass.md#destroy)

***

### getSecret()

> **getSecret**\<`SecretNames`\>(...`secretNames`): `Promise`\<[`ObjectWithKeysFromStringArray`](../../core/type-aliases/ObjectWithKeysFromStringArray.md)\<`SecretNames`, `undefined` \| `string`\>\>

Defined in: core/dist/commonjs/core/SecretStore/SecretStoreBaseClass.impl.d.ts:23

#### Type Parameters

• **SecretNames** *extends* `string`[]

#### Parameters

##### secretNames

...`SecretNames`

#### Returns

`Promise`\<[`ObjectWithKeysFromStringArray`](../../core/type-aliases/ObjectWithKeysFromStringArray.md)\<`SecretNames`, `undefined` \| `string`\>\>

#### Inherited from

[`SecretStoreBaseClass`](../../core/classes/SecretStoreBaseClass.md).[`getSecret`](../../core/classes/SecretStoreBaseClass.md#getsecret)

***

### getSecretImpl()

> `protected` **getSecretImpl**\<`SecretNames`\>(...`secretNames`): `Promise`\<[`ObjectWithKeysFromStringArray`](../../core/type-aliases/ObjectWithKeysFromStringArray.md)\<`SecretNames`, `undefined` \| `string`\>\>

Defined in: [dapr-sdk/src/DaprSecretStore/DaprSecretStore.impl.ts:55](https://github.com/puristajs/purista/blob/master/packages/dapr-sdk/src/DaprSecretStore/DaprSecretStore.impl.ts#L55)

#### Type Parameters

• **SecretNames** *extends* `string`[]

#### Parameters

##### secretNames

...`SecretNames`

#### Returns

`Promise`\<[`ObjectWithKeysFromStringArray`](../../core/type-aliases/ObjectWithKeysFromStringArray.md)\<`SecretNames`, `undefined` \| `string`\>\>

#### Overrides

[`SecretStoreBaseClass`](../../core/classes/SecretStoreBaseClass.md).[`getSecretImpl`](../../core/classes/SecretStoreBaseClass.md#getsecretimpl)

***

### removeSecret()

> **removeSecret**(`secretName`): `Promise`\<`void`\>

Defined in: core/dist/commonjs/core/SecretStore/SecretStoreBaseClass.impl.d.ts:25

#### Parameters

##### secretName

`string`

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`SecretStoreBaseClass`](../../core/classes/SecretStoreBaseClass.md).[`removeSecret`](../../core/classes/SecretStoreBaseClass.md#removesecret)

***

### removeSecretImpl()

> `protected` **removeSecretImpl**(`_secretName`): `Promise`\<`void`\>

Defined in: [dapr-sdk/src/DaprSecretStore/DaprSecretStore.impl.ts:93](https://github.com/puristajs/purista/blob/master/packages/dapr-sdk/src/DaprSecretStore/DaprSecretStore.impl.ts#L93)

#### Parameters

##### \_secretName

`string`

#### Returns

`Promise`\<`void`\>

#### Overrides

[`SecretStoreBaseClass`](../../core/classes/SecretStoreBaseClass.md).[`removeSecretImpl`](../../core/classes/SecretStoreBaseClass.md#removesecretimpl)

***

### setSecret()

> **setSecret**(`secretName`, `secretValue`): `Promise`\<`void`\>

Defined in: core/dist/commonjs/core/SecretStore/SecretStoreBaseClass.impl.d.ts:27

#### Parameters

##### secretName

`string`

##### secretValue

`string`

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`SecretStoreBaseClass`](../../core/classes/SecretStoreBaseClass.md).[`setSecret`](../../core/classes/SecretStoreBaseClass.md#setsecret)

***

### setSecretImpl()

> `protected` **setSecretImpl**(`_secretName`): `Promise`\<`void`\>

Defined in: [dapr-sdk/src/DaprSecretStore/DaprSecretStore.impl.ts:89](https://github.com/puristajs/purista/blob/master/packages/dapr-sdk/src/DaprSecretStore/DaprSecretStore.impl.ts#L89)

#### Parameters

##### \_secretName

`string`

#### Returns

`Promise`\<`void`\>

#### Overrides

[`SecretStoreBaseClass`](../../core/classes/SecretStoreBaseClass.md).[`setSecretImpl`](../../core/classes/SecretStoreBaseClass.md#setsecretimpl)
