[**@purista/infisical-secret-store v1.11.0**](../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/infisical-secret-store](../README.md) / InfisicalSecretStore

# Class: InfisicalSecretStore

Defined in: [infisical-secret-store/src/InfisicalSecretStore.impl.ts:39](https://github.com/puristajs/purista/blob/master/packages/infisical-secret-store/src/InfisicalSecretStore.impl.ts#L39)

A secret store for using [Infisical](https://infisical.com/) as storage.  

For performance reasons, and to reduce costs, the secret values are cached in memory after first fetch.

You can disable the whole caching via config by setting enableCache to false.  
If the cache is enabled, you can set the ttl for cached secret values via config cacheTtl (in ms).  

This will return the cached secret if available and if ttl is not exceeded.  
If a secret value exceeds the ttl, it does not automatically get removed from cache.  
It will be removed/overwritten on next get request.

## Example

```ts
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
```

## Extends

- [`SecretStoreBaseClass`](../../core/classes/SecretStoreBaseClass.md)\<[`InfisicalSecretConfig`](../type-aliases/InfisicalSecretConfig.md)\>

## Constructors

### new InfisicalSecretStore()

> **new InfisicalSecretStore**(`config`): [`InfisicalSecretStore`](InfisicalSecretStore.md)

Defined in: [infisical-secret-store/src/InfisicalSecretStore.impl.ts:42](https://github.com/puristajs/purista/blob/master/packages/infisical-secret-store/src/InfisicalSecretStore.impl.ts#L42)

#### Parameters

##### config

###### baseUrl

`string`

the base url to be used

**Example**

```typescript
const config = {
  baseUrl: 'http://localhost/api`
}
// each request will be below http://localhost/api
// get('v1/orders') will call http://localhost/api/v1/orders
```

###### basicAuth?

\{ `password`: `string`; `username`: `string`; \}

Basic-Auth information

###### basicAuth.password

`string`

Basic-Auth password

###### basicAuth.username

`string`

Basic-Auth username

###### bearerToken

`string`

Auth-Bearer token

###### cacheTtl?

`number`

Cache time to live in ms

###### defaultHeaders?

`Record`\<`string`, `string`\>

Add your default headers here
These headers will be part of every request.
They can be overwritten per request option

###### defaultTimeout?

`number`

set global timeout for requests in ms

**Default**

```ts
30000
```

###### enableCache?

`boolean`

Enable cache

###### enableGet?

`boolean`

Enable generally get method

###### enableOpentelemetry?

`boolean`

enable Opentelemetry tracing.
The client will be handled as own resource.

###### enableRemove?

`boolean`

Enable generally remove method

###### enableSet?

`boolean`

Enable generally set method

###### isKeepAlive?

`boolean`

If set to false, the HTTP client will not reuse the same connection for multiple requests.
Default is true.

###### logger?

[`Logger`](../../core/classes/Logger.md)

A logger instance

###### logLevel?

[`LogLevelName`](../../core/type-aliases/LogLevelName.md)

A log level for new logger if logger is not set

###### name?

`string`

Name of the client

###### spanProcessor?

`SpanProcessor`

Opentelemetry span processor

###### traceId?

`string`

Custom trace Id

#### Returns

[`InfisicalSecretStore`](InfisicalSecretStore.md)

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

> **client**: [`InfisicalClient`](InfisicalClient.md)

Defined in: [infisical-secret-store/src/InfisicalSecretStore.impl.ts:40](https://github.com/puristajs/purista/blob/master/packages/infisical-secret-store/src/InfisicalSecretStore.impl.ts#L40)

***

### config

> **config**: `object`

Defined in: core/dist/commonjs/core/SecretStore/SecretStoreBaseClass.impl.d.ts:18

#### baseUrl

> **baseUrl**: `string`

the base url to be used

##### Example

```typescript
const config = {
  baseUrl: 'http://localhost/api`
}
// each request will be below http://localhost/api
// get('v1/orders') will call http://localhost/api/v1/orders
```

#### basicAuth?

> `optional` **basicAuth**: `object`

Basic-Auth information

##### basicAuth.password

> **basicAuth.password**: `string`

Basic-Auth password

##### basicAuth.username

> **basicAuth.username**: `string`

Basic-Auth username

#### bearerToken

> **bearerToken**: `string`

Auth-Bearer token

#### cacheTtl?

> `optional` **cacheTtl**: `number`

Cache time to live in ms

#### defaultHeaders?

> `optional` **defaultHeaders**: `Record`\<`string`, `string`\>

Add your default headers here
These headers will be part of every request.
They can be overwritten per request option

#### defaultTimeout?

> `optional` **defaultTimeout**: `number`

set global timeout for requests in ms

##### Default

```ts
30000
```

#### enableCache?

> `optional` **enableCache**: `boolean`

Enable cache

#### enableGet?

> `optional` **enableGet**: `boolean`

Enable generally get method

#### enableOpentelemetry?

> `optional` **enableOpentelemetry**: `boolean`

enable Opentelemetry tracing.
The client will be handled as own resource.

#### enableRemove?

> `optional` **enableRemove**: `boolean`

Enable generally remove method

#### enableSet?

> `optional` **enableSet**: `boolean`

Enable generally set method

#### isKeepAlive?

> `optional` **isKeepAlive**: `boolean`

If set to false, the HTTP client will not reuse the same connection for multiple requests.
Default is true.

#### logger?

> `optional` **logger**: [`Logger`](../../core/classes/Logger.md)

A logger instance

#### logLevel?

> `optional` **logLevel**: [`LogLevelName`](../../core/type-aliases/LogLevelName.md)

A log level for new logger if logger is not set

#### name?

> `optional` **name**: `string`

Name of the client

#### spanProcessor?

> `optional` **spanProcessor**: `SpanProcessor`

Opentelemetry span processor

#### traceId?

> `optional` **traceId**: `string`

Custom trace Id

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

Defined in: [infisical-secret-store/src/InfisicalSecretStore.impl.ts:51](https://github.com/puristajs/purista/blob/master/packages/infisical-secret-store/src/InfisicalSecretStore.impl.ts#L51)

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

Defined in: [infisical-secret-store/src/InfisicalSecretStore.impl.ts:67](https://github.com/puristajs/purista/blob/master/packages/infisical-secret-store/src/InfisicalSecretStore.impl.ts#L67)

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

Defined in: [infisical-secret-store/src/InfisicalSecretStore.impl.ts:77](https://github.com/puristajs/purista/blob/master/packages/infisical-secret-store/src/InfisicalSecretStore.impl.ts#L77)

#### Parameters

##### secretName

`string`

##### secretValue

`string`

#### Returns

`Promise`\<`void`\>

#### Overrides

[`SecretStoreBaseClass`](../../core/classes/SecretStoreBaseClass.md).[`setSecretImpl`](../../core/classes/SecretStoreBaseClass.md#setsecretimpl)
