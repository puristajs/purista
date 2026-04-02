[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/gcloud-secret-store](../README.md) / GoogleSecretStore

# Class: GoogleSecretStore

Defined in: [gcloud-secret-store/src/GoogleSecretStore.impl.ts:27](https://github.com/puristajs/purista/blob/master/packages/gcloud-secret-store/src/GoogleSecretStore.impl.ts#L27)

The secret store adapter for Google Secret Manager.
It will store, retrive, update or remove secrets in Google Secret Manager.

For performance reasons, and to reduce costs, the secret values are cached in memory after first fetch.

You can disable the whole caching via config by setting enableCache to false.
If the cache is enabled, you can set the ttl for cached secret values via config cacheTtl (in ms).

This will return the cached secret if available and if ttl is not exceeded.
If a secret value exceeds the ttl, it does not automatically get removed from cache.
It will be removed/overwritten on next get request.

## Extends

- [`SecretStoreBaseClass`](../../core/classes/SecretStoreBaseClass.md)\<[`GoogleSecretStoreConfig`](../type-aliases/GoogleSecretStoreConfig.md)\>

## Constructors

### Constructor

> **new GoogleSecretStore**(`config`): `GoogleSecretStore`

Defined in: [gcloud-secret-store/src/GoogleSecretStore.impl.ts:30](https://github.com/puristajs/purista/blob/master/packages/gcloud-secret-store/src/GoogleSecretStore.impl.ts#L30)

#### Parameters

##### config

###### cacheTtl?

`number`

Cache time to live in ms

###### client?

`ClientOptions`

Google client options

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

###### project

`string`

The google project id in format of projects/* without ending /secrets

**Example**

```ts
projects/428371962963
```

#### Returns

`GoogleSecretStore`

#### Overrides

[`SecretStoreBaseClass`](../../core/classes/SecretStoreBaseClass.md).[`constructor`](../../core/classes/SecretStoreBaseClass.md#constructor)

## Properties

### cache

> **cache**: [`SecretStoreCacheMap`](../../core/type-aliases/SecretStoreCacheMap.md)

Defined in: core/dist/commonjs/core/SecretStore/SecretStoreBaseClass.impl.d.ts:23

#### Inherited from

[`SecretStoreBaseClass`](../../core/classes/SecretStoreBaseClass.md).[`cache`](../../core/classes/SecretStoreBaseClass.md#cache)

***

### client

> **client**: `SecretManagerServiceClient`

Defined in: [gcloud-secret-store/src/GoogleSecretStore.impl.ts:28](https://github.com/puristajs/purista/blob/master/packages/gcloud-secret-store/src/GoogleSecretStore.impl.ts#L28)

***

### config

> **config**: `object`

Defined in: core/dist/commonjs/core/SecretStore/SecretStoreBaseClass.impl.d.ts:21

#### cacheTtl?

> `optional` **cacheTtl**: `number`

Cache time to live in ms

#### client?

> `optional` **client**: `ClientOptions`

Google client options

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

#### logLevel?

> `optional` **logLevel**: [`LogLevelName`](../../core/type-aliases/LogLevelName.md)

#### project

> **project**: `string`

The google project id in format of projects/* without ending /secrets

##### Example

```ts
projects/428371962963
```

#### Inherited from

[`SecretStoreBaseClass`](../../core/classes/SecretStoreBaseClass.md).[`config`](../../core/classes/SecretStoreBaseClass.md#config)

***

### logger

> **logger**: [`Logger`](../../core/classes/Logger.md)

Defined in: core/dist/commonjs/core/SecretStore/SecretStoreBaseClass.impl.d.ts:20

#### Inherited from

[`SecretStoreBaseClass`](../../core/classes/SecretStoreBaseClass.md).[`logger`](../../core/classes/SecretStoreBaseClass.md#logger)

***

### name

> **name**: `string`

Defined in: core/dist/commonjs/core/SecretStore/SecretStoreBaseClass.impl.d.ts:22

#### Inherited from

[`SecretStoreBaseClass`](../../core/classes/SecretStoreBaseClass.md).[`name`](../../core/classes/SecretStoreBaseClass.md#name)

## Methods

### destroy()

> **destroy**(): `Promise`\<`void`\>

Defined in: core/dist/commonjs/core/SecretStore/SecretStoreBaseClass.impl.d.ts:31

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`SecretStoreBaseClass`](../../core/classes/SecretStoreBaseClass.md).[`destroy`](../../core/classes/SecretStoreBaseClass.md#destroy)

***

### getSecret()

> **getSecret**\<`SecretNames`\>(...`secretNames`): `Promise`\<[`ObjectWithKeysFromStringArray`](../../core/type-aliases/ObjectWithKeysFromStringArray.md)\<`SecretNames`, `string` \| `undefined`\>\>

Defined in: core/dist/commonjs/core/SecretStore/SecretStoreBaseClass.impl.d.ts:26

#### Type Parameters

##### SecretNames

`SecretNames` *extends* `string`[]

#### Parameters

##### secretNames

...`SecretNames`

#### Returns

`Promise`\<[`ObjectWithKeysFromStringArray`](../../core/type-aliases/ObjectWithKeysFromStringArray.md)\<`SecretNames`, `string` \| `undefined`\>\>

#### Inherited from

[`SecretStoreBaseClass`](../../core/classes/SecretStoreBaseClass.md).[`getSecret`](../../core/classes/SecretStoreBaseClass.md#getsecret)

***

### getSecretImpl()

> `protected` **getSecretImpl**\<`SecretNames`\>(...`secretNames`): `Promise`\<[`ObjectWithKeysFromStringArray`](../../core/type-aliases/ObjectWithKeysFromStringArray.md)\<`SecretNames`, `string` \| `undefined`\>\>

Defined in: [gcloud-secret-store/src/GoogleSecretStore.impl.ts:44](https://github.com/puristajs/purista/blob/master/packages/gcloud-secret-store/src/GoogleSecretStore.impl.ts#L44)

#### Type Parameters

##### SecretNames

`SecretNames` *extends* `string`[]

#### Parameters

##### secretNames

...`SecretNames`

#### Returns

`Promise`\<[`ObjectWithKeysFromStringArray`](../../core/type-aliases/ObjectWithKeysFromStringArray.md)\<`SecretNames`, `string` \| `undefined`\>\>

#### Overrides

[`SecretStoreBaseClass`](../../core/classes/SecretStoreBaseClass.md).[`getSecretImpl`](../../core/classes/SecretStoreBaseClass.md#getsecretimpl)

***

### removeSecret()

> **removeSecret**(`secretName`): `Promise`\<`void`\>

Defined in: core/dist/commonjs/core/SecretStore/SecretStoreBaseClass.impl.d.ts:28

#### Parameters

##### secretName

`string`

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`SecretStoreBaseClass`](../../core/classes/SecretStoreBaseClass.md).[`removeSecret`](../../core/classes/SecretStoreBaseClass.md#removesecret)

***

### removeSecretImpl()

> **removeSecretImpl**(`secretName`): `Promise`\<`void`\>

Defined in: [gcloud-secret-store/src/GoogleSecretStore.impl.ts:69](https://github.com/puristajs/purista/blob/master/packages/gcloud-secret-store/src/GoogleSecretStore.impl.ts#L69)

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

Defined in: core/dist/commonjs/core/SecretStore/SecretStoreBaseClass.impl.d.ts:30

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

> **setSecretImpl**(`secretName`, `secretValue`): `Promise`\<`void`\>

Defined in: [gcloud-secret-store/src/GoogleSecretStore.impl.ts:73](https://github.com/puristajs/purista/blob/master/packages/gcloud-secret-store/src/GoogleSecretStore.impl.ts#L73)

#### Parameters

##### secretName

`string`

##### secretValue

`string`

#### Returns

`Promise`\<`void`\>

#### Overrides

[`SecretStoreBaseClass`](../../core/classes/SecretStoreBaseClass.md).[`setSecretImpl`](../../core/classes/SecretStoreBaseClass.md#setsecretimpl)
