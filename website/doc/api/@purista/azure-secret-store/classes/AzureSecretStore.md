[**@purista/azure-secret-store v1.11.0**](../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/azure-secret-store](../README.md) / AzureSecretStore

# Class: AzureSecretStore

Defined in: [azure-secret-store/src/AzureSecretStore.impl.ts:26](https://github.com/puristajs/purista/blob/master/packages/azure-secret-store/src/AzureSecretStore.impl.ts#L26)

The secret store adapter for Azure Secrets Manager.
It will store, retrive, update or remove secrets in Azure Secrets Manager.

For performance reasons, and to reduce costs, the secret values are cached in memory after first fetch.

You can disable the whole caching via config by setting enableCache to false.
If the cache is enabled, you can set the ttl for cached secret values via config cacheTtl (in ms).

This will return the cached secret if available and if ttl is not exceeded.
If a secret value exceeds the ttl, it does not automatically get removed from cache.
It will be removed/overwritten on next get request.

## Extends

- [`SecretStoreBaseClass`](../../core/classes/SecretStoreBaseClass.md)\<[`AzureSecretStoreConfig`](../type-aliases/AzureSecretStoreConfig.md)\>

## Constructors

### new AzureSecretStore()

> **new AzureSecretStore**(`config`): [`AzureSecretStore`](AzureSecretStore.md)

Defined in: [azure-secret-store/src/AzureSecretStore.impl.ts:29](https://github.com/puristajs/purista/blob/master/packages/azure-secret-store/src/AzureSecretStore.impl.ts#L29)

#### Parameters

##### config

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

[`Logger`](../../core/classes/Logger.md)

A logger instance

###### logLevel?

[`LogLevelName`](../../core/type-aliases/LogLevelName.md)

A log level for new logger if logger is not set

###### options?

`SecretClientOptions`

###### vaultUrl

`string`

The URL to reach the Azure Key Vault

**Example**

```ts
https://[KEY_VAULT_NAME].vault.azure.net
```

#### Returns

[`AzureSecretStore`](AzureSecretStore.md)

#### Overrides

[`SecretStoreBaseClass`](../../core/classes/SecretStoreBaseClass.md).[`constructor`](../../core/classes/SecretStoreBaseClass.md#constructors)

## Properties

### cache

> **cache**: [`SecretStoreCacheMap`](../../core/type-aliases/SecretStoreCacheMap.md)

Defined in: core/dist/commonjs/core/SecretStore/SecretStoreBaseClass.impl.d.ts:20

#### Inherited from

[`SecretStoreBaseClass`](../../core/classes/SecretStoreBaseClass.md).[`cache`](../../core/classes/SecretStoreBaseClass.md#cache)

***

### client

> **client**: `SecretClient`

Defined in: [azure-secret-store/src/AzureSecretStore.impl.ts:27](https://github.com/puristajs/purista/blob/master/packages/azure-secret-store/src/AzureSecretStore.impl.ts#L27)

***

### config

> **config**: `object`

Defined in: core/dist/commonjs/core/SecretStore/SecretStoreBaseClass.impl.d.ts:18

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

> `optional` **logger**: [`Logger`](../../core/classes/Logger.md)

A logger instance

#### logLevel?

> `optional` **logLevel**: [`LogLevelName`](../../core/type-aliases/LogLevelName.md)

A log level for new logger if logger is not set

#### options?

> `optional` **options**: `SecretClientOptions`

#### vaultUrl

> **vaultUrl**: `string`

The URL to reach the Azure Key Vault

##### Example

```ts
https://[KEY_VAULT_NAME].vault.azure.net
```

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

Defined in: [azure-secret-store/src/AzureSecretStore.impl.ts:37](https://github.com/puristajs/purista/blob/master/packages/azure-secret-store/src/AzureSecretStore.impl.ts#L37)

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

> `protected` **removeSecretImpl**(`secretName`): `Promise`\<`void`\>

Defined in: [azure-secret-store/src/AzureSecretStore.impl.ts:56](https://github.com/puristajs/purista/blob/master/packages/azure-secret-store/src/AzureSecretStore.impl.ts#L56)

#### Parameters

##### secretName

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

> `protected` **setSecretImpl**(`secretName`, `secretValue`): `Promise`\<`void`\>

Defined in: [azure-secret-store/src/AzureSecretStore.impl.ts:60](https://github.com/puristajs/purista/blob/master/packages/azure-secret-store/src/AzureSecretStore.impl.ts#L60)

#### Parameters

##### secretName

`string`

##### secretValue

`string`

#### Returns

`Promise`\<`void`\>

#### Overrides

[`SecretStoreBaseClass`](../../core/classes/SecretStoreBaseClass.md).[`setSecretImpl`](../../core/classes/SecretStoreBaseClass.md#setsecretimpl)
