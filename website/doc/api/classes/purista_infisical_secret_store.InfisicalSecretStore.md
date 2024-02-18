[PURISTA API](../README.md) / [Modules](../modules.md) / [@purista/infisical-secret-store](../modules/purista_infisical_secret_store.md) / InfisicalSecretStore

# Class: InfisicalSecretStore

[@purista/infisical-secret-store](../modules/purista_infisical_secret_store.md).InfisicalSecretStore

A secret store for using [Infisical](https://infisical.com/) as storage.  

For performance reasons, and to reduce costs, the secret values are cached in memory after first fetch.

You can disable the whole caching via config by setting enableCache to false.  
If the cache is enabled, you can set the ttl for cached secret values via config cacheTtl (in ms).  

This will return the cached secret if available and if ttl is not exceeded.  
If a secret value exceeds the ttl, it does not automatically get removed from cache.  
It will be removed/overwritten on next get request.

**`Example`**

* ```typescript
const config = {
  baseUrl: 'http://example.com'
}

const store = new InfisicalSecretStore( config )

await store.setSecret('mySecret', 'value')

let value = await store.getSecret('mySecret')
console.log(value) // outputs: { mySecret: 'value' }

await store.removeSecret('mySecret')

value = await store.getSecret('mySecret')
console.log(value) // outputs: undefined

```

## Hierarchy

- [`SecretStoreBaseClass`](purista_core.SecretStoreBaseClass.md)\<[`InfisicalSecretConfig`](../modules/purista_infisical_secret_store.md#infisicalsecretconfig)\>

  ↳ **`InfisicalSecretStore`**

## Table of contents

### Constructors

- [constructor](purista_infisical_secret_store.InfisicalSecretStore.md#constructor)

### Properties

- [cache](purista_infisical_secret_store.InfisicalSecretStore.md#cache)
- [client](purista_infisical_secret_store.InfisicalSecretStore.md#client)
- [config](purista_infisical_secret_store.InfisicalSecretStore.md#config)
- [logger](purista_infisical_secret_store.InfisicalSecretStore.md#logger)
- [name](purista_infisical_secret_store.InfisicalSecretStore.md#name)

### Methods

- [destroy](purista_infisical_secret_store.InfisicalSecretStore.md#destroy)
- [getSecret](purista_infisical_secret_store.InfisicalSecretStore.md#getsecret)
- [getSecretImpl](purista_infisical_secret_store.InfisicalSecretStore.md#getsecretimpl)
- [removeSecret](purista_infisical_secret_store.InfisicalSecretStore.md#removesecret)
- [removeSecretImpl](purista_infisical_secret_store.InfisicalSecretStore.md#removesecretimpl)
- [setSecret](purista_infisical_secret_store.InfisicalSecretStore.md#setsecret)
- [setSecretImpl](purista_infisical_secret_store.InfisicalSecretStore.md#setsecretimpl)

## Constructors

### constructor

• **new InfisicalSecretStore**(`config`): [`InfisicalSecretStore`](purista_infisical_secret_store.InfisicalSecretStore.md)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `config` | `Object` | - |
| `config.baseUrl` | `string` | the base url to be used **`Example`** ```typescript const config = { baseUrl: 'http://localhost/api` } // each request will be below http://localhost/api // get('v1/orders') will call http://localhost/api/v1/orders ``` |
| `config.basicAuth?` | `Object` | Basic-Auth information |
| `config.basicAuth.password` | `string` | Basic-Auth password |
| `config.basicAuth.username` | `string` | Basic-Auth username |
| `config.bearerToken` | `string` | Auth-Bearer token |
| `config.cacheTtl?` | `number` | Cache time to live in ms |
| `config.defaultHeaders?` | `Record`\<`string`, `string`\> | Add your default headers here These headers will be part of every request. They can be overwritten per request option |
| `config.defaultTimeout?` | `number` | set global timeout for requests in ms **`Default`** ```ts 30000 ``` |
| `config.enableCache?` | `boolean` | Enable cache |
| `config.enableGet?` | `boolean` | Enable generally get method |
| `config.enableOpentelemetry?` | `boolean` | enable Opentelemetry tracing. The client will be handled as own ressource. |
| `config.enableRemove?` | `boolean` | Enable generally remove method |
| `config.enableSet?` | `boolean` | Enable generally set method |
| `config.isKeepAlive?` | `boolean` | If set to false, the HTTP client will not reuse the same connection for multiple requests. Default is true. |
| `config.logLevel?` | [`LogLevelName`](../modules/purista_core.md#loglevelname) | A log level for new logger if logger is not set |
| `config.logger?` | [`Logger`](purista_core.Logger.md) | A logger instance |
| `config.name?` | `string` | Name of the client |
| `config.spanProcessor?` | `SpanProcessor` | Opentelemetry span processor |
| `config.traceId?` | `string` | Custom trace Id |

#### Returns

[`InfisicalSecretStore`](purista_infisical_secret_store.InfisicalSecretStore.md)

#### Overrides

[SecretStoreBaseClass](purista_core.SecretStoreBaseClass.md).[constructor](purista_core.SecretStoreBaseClass.md#constructor)

#### Defined in

[infisical-secret-store/src/InfisicalSecretStore.impl.ts:42](https://github.com/sebastianwessel/purista/blob/master/packages/infisical-secret-store/src/InfisicalSecretStore.impl.ts#L42)

## Properties

### cache

• **cache**: [`SecretStoreCacheMap`](../modules/purista_core.md#secretstorecachemap)

#### Inherited from

[SecretStoreBaseClass](purista_core.SecretStoreBaseClass.md).[cache](purista_core.SecretStoreBaseClass.md#cache)

#### Defined in

core/dist/commonjs/core/SecretStore/SecretStoreBaseClass.impl.d.ts:20

___

### client

• **client**: [`InfisicalClient`](purista_infisical_secret_store.InfisicalClient.md)

#### Defined in

[infisical-secret-store/src/InfisicalSecretStore.impl.ts:40](https://github.com/sebastianwessel/purista/blob/master/packages/infisical-secret-store/src/InfisicalSecretStore.impl.ts#L40)

___

### config

• **config**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `baseUrl` | `string` | the base url to be used **`Example`** ```typescript const config = { baseUrl: 'http://localhost/api` } // each request will be below http://localhost/api // get('v1/orders') will call http://localhost/api/v1/orders ``` |
| `basicAuth?` | \{ `password`: `string` ; `username`: `string`  } | Basic-Auth information |
| `basicAuth.password` | `string` | Basic-Auth password |
| `basicAuth.username` | `string` | Basic-Auth username |
| `bearerToken` | `string` | Auth-Bearer token |
| `cacheTtl?` | `number` | Cache time to live in ms |
| `defaultHeaders?` | `Record`\<`string`, `string`\> | Add your default headers here These headers will be part of every request. They can be overwritten per request option |
| `defaultTimeout?` | `number` | set global timeout for requests in ms **`Default`** ```ts 30000 ``` |
| `enableCache?` | `boolean` | Enable cache |
| `enableGet?` | `boolean` | Enable generally get method |
| `enableOpentelemetry?` | `boolean` | enable Opentelemetry tracing. The client will be handled as own ressource. |
| `enableRemove?` | `boolean` | Enable generally remove method |
| `enableSet?` | `boolean` | Enable generally set method |
| `isKeepAlive?` | `boolean` | If set to false, the HTTP client will not reuse the same connection for multiple requests. Default is true. |
| `logLevel?` | [`LogLevelName`](../modules/purista_core.md#loglevelname) | A log level for new logger if logger is not set |
| `logger?` | [`Logger`](purista_core.Logger.md) | A logger instance |
| `name?` | `string` | Name of the client |
| `spanProcessor?` | `SpanProcessor` | Opentelemetry span processor |
| `traceId?` | `string` | Custom trace Id |

#### Inherited from

[SecretStoreBaseClass](purista_core.SecretStoreBaseClass.md).[config](purista_core.SecretStoreBaseClass.md#config)

#### Defined in

core/dist/commonjs/core/SecretStore/SecretStoreBaseClass.impl.d.ts:18

___

### logger

• **logger**: [`Logger`](purista_core.Logger.md)

#### Inherited from

[SecretStoreBaseClass](purista_core.SecretStoreBaseClass.md).[logger](purista_core.SecretStoreBaseClass.md#logger)

#### Defined in

core/dist/commonjs/core/SecretStore/SecretStoreBaseClass.impl.d.ts:17

___

### name

• **name**: `string`

name of store

#### Inherited from

[SecretStoreBaseClass](purista_core.SecretStoreBaseClass.md).[name](purista_core.SecretStoreBaseClass.md#name)

#### Defined in

core/dist/commonjs/core/SecretStore/SecretStoreBaseClass.impl.d.ts:19

## Methods

### destroy

▸ **destroy**(): `Promise`\<`void`\>

disconnects and shuts down the secret store

#### Returns

`Promise`\<`void`\>

#### Inherited from

[SecretStoreBaseClass](purista_core.SecretStoreBaseClass.md).[destroy](purista_core.SecretStoreBaseClass.md#destroy)

#### Defined in

core/dist/commonjs/core/SecretStore/SecretStoreBaseClass.impl.d.ts:28

___

### getSecret

▸ **getSecret**\<`SecretNames`\>(`...secretNames`): `Promise`\<[`ObjectWithKeysFromStringArray`](../modules/purista_core.md#objectwithkeysfromstringarray)\<`SecretNames`, `undefined` \| `string`\>\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `SecretNames` | extends `string`[] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...secretNames` | `SecretNames` |

#### Returns

`Promise`\<[`ObjectWithKeysFromStringArray`](../modules/purista_core.md#objectwithkeysfromstringarray)\<`SecretNames`, `undefined` \| `string`\>\>

#### Inherited from

[SecretStoreBaseClass](purista_core.SecretStoreBaseClass.md).[getSecret](purista_core.SecretStoreBaseClass.md#getsecret)

#### Defined in

core/dist/commonjs/core/SecretStore/SecretStoreBaseClass.impl.d.ts:23

___

### getSecretImpl

▸ **getSecretImpl**\<`SecretNames`\>(`...secretNames`): `Promise`\<[`ObjectWithKeysFromStringArray`](../modules/purista_core.md#objectwithkeysfromstringarray)\<`SecretNames`, `undefined` \| `string`\>\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `SecretNames` | extends `string`[] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...secretNames` | `SecretNames` |

#### Returns

`Promise`\<[`ObjectWithKeysFromStringArray`](../modules/purista_core.md#objectwithkeysfromstringarray)\<`SecretNames`, `undefined` \| `string`\>\>

#### Overrides

[SecretStoreBaseClass](purista_core.SecretStoreBaseClass.md).[getSecretImpl](purista_core.SecretStoreBaseClass.md#getsecretimpl)

#### Defined in

[infisical-secret-store/src/InfisicalSecretStore.impl.ts:51](https://github.com/sebastianwessel/purista/blob/master/packages/infisical-secret-store/src/InfisicalSecretStore.impl.ts#L51)

___

### removeSecret

▸ **removeSecret**(`secretName`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `secretName` | `string` |

#### Returns

`Promise`\<`void`\>

#### Inherited from

[SecretStoreBaseClass](purista_core.SecretStoreBaseClass.md).[removeSecret](purista_core.SecretStoreBaseClass.md#removesecret)

#### Defined in

core/dist/commonjs/core/SecretStore/SecretStoreBaseClass.impl.d.ts:25

___

### removeSecretImpl

▸ **removeSecretImpl**(`secretName`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `secretName` | `string` |

#### Returns

`Promise`\<`void`\>

#### Overrides

[SecretStoreBaseClass](purista_core.SecretStoreBaseClass.md).[removeSecretImpl](purista_core.SecretStoreBaseClass.md#removesecretimpl)

#### Defined in

[infisical-secret-store/src/InfisicalSecretStore.impl.ts:67](https://github.com/sebastianwessel/purista/blob/master/packages/infisical-secret-store/src/InfisicalSecretStore.impl.ts#L67)

___

### setSecret

▸ **setSecret**(`secretName`, `secretValue`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `secretName` | `string` |
| `secretValue` | `string` |

#### Returns

`Promise`\<`void`\>

#### Inherited from

[SecretStoreBaseClass](purista_core.SecretStoreBaseClass.md).[setSecret](purista_core.SecretStoreBaseClass.md#setsecret)

#### Defined in

core/dist/commonjs/core/SecretStore/SecretStoreBaseClass.impl.d.ts:27

___

### setSecretImpl

▸ **setSecretImpl**(`secretName`, `secretValue`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `secretName` | `string` |
| `secretValue` | `string` |

#### Returns

`Promise`\<`void`\>

#### Overrides

[SecretStoreBaseClass](purista_core.SecretStoreBaseClass.md).[setSecretImpl](purista_core.SecretStoreBaseClass.md#setsecretimpl)

#### Defined in

[infisical-secret-store/src/InfisicalSecretStore.impl.ts:77](https://github.com/sebastianwessel/purista/blob/master/packages/infisical-secret-store/src/InfisicalSecretStore.impl.ts#L77)
