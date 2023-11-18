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

```typescript
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

- `SecretStoreBaseClass`\<[`InfisicalSecretConfig`](../modules/purista_infisical_secret_store.md#infisicalsecretconfig)\>

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
- [removeSecret](purista_infisical_secret_store.InfisicalSecretStore.md#removesecret)
- [setSecret](purista_infisical_secret_store.InfisicalSecretStore.md#setsecret)

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
| `config.logLevel?` | `LogLevelName` | A log level for new logger if logger is not set |
| `config.logger?` | `Logger` | A logger instance |
| `config.name?` | `string` | Name of the client |
| `config.spanProcessor?` | `SpanProcessor` | Opentelemetry span processor |

#### Returns

[`InfisicalSecretStore`](purista_infisical_secret_store.InfisicalSecretStore.md)

#### Overrides

SecretStoreBaseClass\&lt;InfisicalSecretConfig\&gt;.constructor

#### Defined in

[infisical-secret-store/src/InfisicalSecretStore.impl.ts:40](https://github.com/sebastianwessel/purista/blob/master/packages/infisical-secret-store/src/InfisicalSecretStore.impl.ts#L40)

## Properties

### cache

• **cache**: `SecretStoreCacheMap`

#### Inherited from

SecretStoreBaseClass.cache

#### Defined in

core/lib/types/core/SecretStore/SecretStoreBaseClass.impl.d.ts:12

___

### client

• **client**: [`InfisicalClient`](purista_infisical_secret_store.InfisicalClient.md)

#### Defined in

[infisical-secret-store/src/InfisicalSecretStore.impl.ts:38](https://github.com/sebastianwessel/purista/blob/master/packages/infisical-secret-store/src/InfisicalSecretStore.impl.ts#L38)

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
| `logLevel?` | `LogLevelName` | A log level for new logger if logger is not set |
| `logger?` | `Logger` | A logger instance |
| `name?` | `string` | Name of the client |
| `spanProcessor?` | `SpanProcessor` | Opentelemetry span processor |

#### Inherited from

SecretStoreBaseClass.config

#### Defined in

core/lib/types/core/SecretStore/SecretStoreBaseClass.impl.d.ts:10

___

### logger

• **logger**: `Logger`

#### Inherited from

SecretStoreBaseClass.logger

#### Defined in

core/lib/types/core/SecretStore/SecretStoreBaseClass.impl.d.ts:9

___

### name

• **name**: `string`

#### Inherited from

SecretStoreBaseClass.name

#### Defined in

core/lib/types/core/SecretStore/SecretStoreBaseClass.impl.d.ts:11

## Methods

### destroy

▸ **destroy**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Inherited from

SecretStoreBaseClass.destroy

#### Defined in

core/lib/types/core/SecretStore/SecretStoreBaseClass.impl.d.ts:17

___

### getSecret

▸ **getSecret**(`...secretNames`): `Promise`\<`Record`\<`string`, `undefined` \| `string`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `...secretNames` | `string`[] |

#### Returns

`Promise`\<`Record`\<`string`, `undefined` \| `string`\>\>

#### Overrides

SecretStoreBaseClass.getSecret

#### Defined in

[infisical-secret-store/src/InfisicalSecretStore.impl.ts:49](https://github.com/sebastianwessel/purista/blob/master/packages/infisical-secret-store/src/InfisicalSecretStore.impl.ts#L49)

___

### removeSecret

▸ **removeSecret**(`secretName`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `secretName` | `string` |

#### Returns

`Promise`\<`void`\>

#### Overrides

SecretStoreBaseClass.removeSecret

#### Defined in

[infisical-secret-store/src/InfisicalSecretStore.impl.ts:80](https://github.com/sebastianwessel/purista/blob/master/packages/infisical-secret-store/src/InfisicalSecretStore.impl.ts#L80)

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

#### Overrides

SecretStoreBaseClass.setSecret

#### Defined in

[infisical-secret-store/src/InfisicalSecretStore.impl.ts:96](https://github.com/sebastianwessel/purista/blob/master/packages/infisical-secret-store/src/InfisicalSecretStore.impl.ts#L96)
