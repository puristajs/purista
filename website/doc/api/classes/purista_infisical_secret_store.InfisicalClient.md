[PURISTA API](../README.md) / [Modules](../modules.md) / [@purista/infisical-secret-store](../modules/purista_infisical_secret_store.md) / InfisicalClient

# Class: InfisicalClient

[@purista/infisical-secret-store](../modules/purista_infisical_secret_store.md).InfisicalClient

The internal http client to connect to the Infisical server.

## Hierarchy

- [`HttpClient`](purista_core.HttpClient.md)\<[`HttpClientConfigCustom`](../modules/purista_infisical_secret_store.md#httpclientconfigcustom)\>

  ↳ **`InfisicalClient`**

## Table of contents

### Constructors

- [constructor](purista_infisical_secret_store.InfisicalClient.md#constructor)

### Properties

- [auth](purista_infisical_secret_store.InfisicalClient.md#auth)
- [baseUrl](purista_infisical_secret_store.InfisicalClient.md#baseurl)
- [config](purista_infisical_secret_store.InfisicalClient.md#config)
- [logger](purista_infisical_secret_store.InfisicalClient.md#logger)
- [name](purista_infisical_secret_store.InfisicalClient.md#name)
- [projectKey](purista_infisical_secret_store.InfisicalClient.md#projectkey)
- [serviceTokenSecret](purista_infisical_secret_store.InfisicalClient.md#servicetokensecret)
- [spanProcessor](purista_infisical_secret_store.InfisicalClient.md#spanprocessor)
- [timeout](purista_infisical_secret_store.InfisicalClient.md#timeout)
- [tokenData](purista_infisical_secret_store.InfisicalClient.md#tokendata)
- [traceProvider](purista_infisical_secret_store.InfisicalClient.md#traceprovider)

### Methods

- [delete](purista_infisical_secret_store.InfisicalClient.md#delete)
- [encryptSecret](purista_infisical_secret_store.InfisicalClient.md#encryptsecret)
- [execute](purista_infisical_secret_store.InfisicalClient.md#execute)
- [get](purista_infisical_secret_store.InfisicalClient.md#get)
- [getSecret](purista_infisical_secret_store.InfisicalClient.md#getsecret)
- [getServiceTokenData](purista_infisical_secret_store.InfisicalClient.md#getservicetokendata)
- [getTracer](purista_infisical_secret_store.InfisicalClient.md#gettracer)
- [getUrlAndHeader](purista_infisical_secret_store.InfisicalClient.md#geturlandheader)
- [patch](purista_infisical_secret_store.InfisicalClient.md#patch)
- [post](purista_infisical_secret_store.InfisicalClient.md#post)
- [put](purista_infisical_secret_store.InfisicalClient.md#put)
- [removeSecret](purista_infisical_secret_store.InfisicalClient.md#removesecret)
- [setBearerToken](purista_infisical_secret_store.InfisicalClient.md#setbearertoken)
- [setSecret](purista_infisical_secret_store.InfisicalClient.md#setsecret)
- [startActiveSpan](purista_infisical_secret_store.InfisicalClient.md#startactivespan)

## Constructors

### constructor

• **new InfisicalClient**(`conf`): [`InfisicalClient`](purista_infisical_secret_store.InfisicalClient.md)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `conf` | `Object` | - |
| `conf.baseUrl` | `string` | the base url to be used **`Example`** ```typescript const config = { baseUrl: 'http://localhost/api` } // each request will be below http://localhost/api // get('v1/orders') will call http://localhost/api/v1/orders ``` |
| `conf.basicAuth?` | `Object` | Basic-Auth information |
| `conf.basicAuth.password` | `string` | Basic-Auth password |
| `conf.basicAuth.username` | `string` | Basic-Auth username |
| `conf.bearerToken` | `string` | Auth-Bearer token |
| `conf.defaultHeaders?` | `Record`\<`string`, `string`\> | Add your default headers here These headers will be part of every request. They can be overwritten per request option |
| `conf.defaultTimeout?` | `number` | set global timeout for requests in ms **`Default`** ```ts 30000 ``` |
| `conf.enableOpentelemetry?` | `boolean` | enable Opentelemetry tracing. The client will be handled as own ressource. |
| `conf.isKeepAlive?` | `boolean` | If set to false, the HTTP client will not reuse the same connection for multiple requests. Default is true. |
| `conf.logLevel?` | [`LogLevelName`](../modules/purista_core.md#loglevelname) | the loglevel if no logger instance is given |
| `conf.logger?` | [`Logger`](purista_core.Logger.md) | A logger instance |
| `conf.name?` | `string` | Name of the client |
| `conf.spanProcessor?` | `SpanProcessor` | Opentelemetry span processor |
| `conf.traceId?` | `string` | Custom trace Id |

#### Returns

[`InfisicalClient`](purista_infisical_secret_store.InfisicalClient.md)

#### Overrides

[HttpClient](purista_core.HttpClient.md).[constructor](purista_core.HttpClient.md#constructor)

#### Defined in

[infisical-secret-store/src/InfisicalClient/InfisicalClient.impl.ts:16](https://github.com/puristajs/purista/blob/master/packages/infisical-secret-store/src/InfisicalClient/InfisicalClient.impl.ts#L16)

## Properties

### auth

• `Protected` **auth**: [`AuthCredentials`](../modules/purista_core.md#authcredentials)

#### Inherited from

[HttpClient](purista_core.HttpClient.md).[auth](purista_core.HttpClient.md#auth)

#### Defined in

core/dist/commonjs/HttpClient/HttpClient.impl.d.ts:27

___

### baseUrl

• **baseUrl**: `URL`

#### Inherited from

[HttpClient](purista_core.HttpClient.md).[baseUrl](purista_core.HttpClient.md#baseurl)

#### Defined in

core/dist/commonjs/HttpClient/HttpClient.impl.d.ts:24

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
| `bearerToken?` | `string` | Auth-Bearer token |
| `defaultHeaders?` | `Record`\<`string`, `string`\> | Add your default headers here These headers will be part of every request. They can be overwritten per request option |
| `defaultTimeout?` | `number` | set global timeout for requests in ms **`Default`** ```ts 30000 ``` |
| `enableOpentelemetry?` | `boolean` | enable Opentelemetry tracing. The client will be handled as own ressource. |
| `isKeepAlive?` | `boolean` | If set to false, the HTTP client will not reuse the same connection for multiple requests. Default is true. |
| `logLevel?` | [`LogLevelName`](../modules/purista_core.md#loglevelname) | the loglevel if no logger instance is given |
| `logger?` | [`Logger`](purista_core.Logger.md) | A logger instance |
| `name?` | `string` | Name of the client |
| `spanProcessor?` | `SpanProcessor` | Opentelemetry span processor |
| `traceId?` | `string` | Custom trace Id |

#### Inherited from

[HttpClient](purista_core.HttpClient.md).[config](purista_core.HttpClient.md#config)

#### Defined in

core/dist/commonjs/HttpClient/HttpClient.impl.d.ts:22

___

### logger

• **logger**: [`Logger`](purista_core.Logger.md)

#### Inherited from

[HttpClient](purista_core.HttpClient.md).[logger](purista_core.HttpClient.md#logger)

#### Defined in

core/dist/commonjs/HttpClient/HttpClient.impl.d.ts:21

___

### name

• **name**: `string`

#### Inherited from

[HttpClient](purista_core.HttpClient.md).[name](purista_core.HttpClient.md#name)

#### Defined in

core/dist/commonjs/HttpClient/HttpClient.impl.d.ts:20

___

### projectKey

• `Private` **projectKey**: `string` = `''`

#### Defined in

[infisical-secret-store/src/InfisicalClient/InfisicalClient.impl.ts:14](https://github.com/puristajs/purista/blob/master/packages/infisical-secret-store/src/InfisicalClient/InfisicalClient.impl.ts#L14)

___

### serviceTokenSecret

• `Private` **serviceTokenSecret**: `string`

#### Defined in

[infisical-secret-store/src/InfisicalClient/InfisicalClient.impl.ts:12](https://github.com/puristajs/purista/blob/master/packages/infisical-secret-store/src/InfisicalClient/InfisicalClient.impl.ts#L12)

___

### spanProcessor

• **spanProcessor**: `undefined` \| `SpanProcessor`

#### Inherited from

[HttpClient](purista_core.HttpClient.md).[spanProcessor](purista_core.HttpClient.md#spanprocessor)

#### Defined in

core/dist/commonjs/HttpClient/HttpClient.impl.d.ts:25

___

### timeout

• **timeout**: `number`

#### Inherited from

[HttpClient](purista_core.HttpClient.md).[timeout](purista_core.HttpClient.md#timeout)

#### Defined in

core/dist/commonjs/HttpClient/HttpClient.impl.d.ts:23

___

### tokenData

• `Private` **tokenData**: `undefined` \| [`TokenData`](../modules/purista_infisical_secret_store.md#tokendata)

#### Defined in

[infisical-secret-store/src/InfisicalClient/InfisicalClient.impl.ts:13](https://github.com/puristajs/purista/blob/master/packages/infisical-secret-store/src/InfisicalClient/InfisicalClient.impl.ts#L13)

___

### traceProvider

• **traceProvider**: `NodeTracerProvider`

#### Inherited from

[HttpClient](purista_core.HttpClient.md).[traceProvider](purista_core.HttpClient.md#traceprovider)

#### Defined in

core/dist/commonjs/HttpClient/HttpClient.impl.d.ts:26

## Methods

### delete

▸ **delete**\<`T`\>(`path`, `options?`, `payload?`): `Promise`\<`T`\>

DELETE request

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `string` |
| `options?` | [`HttpClientRequestOptions`](../modules/purista_core.md#httpclientrequestoptions) |
| `payload?` | `unknown` |

#### Returns

`Promise`\<`T`\>

#### Inherited from

[HttpClient](purista_core.HttpClient.md).[delete](purista_core.HttpClient.md#delete)

#### Defined in

core/dist/commonjs/HttpClient/HttpClient.impl.d.ts:97

___

### encryptSecret

▸ **encryptSecret**(`secretKey`, `secretValue`, `secretComment?`): `Object`

Encrypt the given key, value and optional comment

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `secretKey` | `string` | `undefined` |
| `secretValue` | `string` | `undefined` |
| `secretComment` | `string` | `''` |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `secretCommentCiphertext` | `string` |
| `secretCommentIV` | `string` |
| `secretCommentTag` | `string` |
| `secretKeyCiphertext` | `string` |
| `secretKeyIV` | `string` |
| `secretKeyTag` | `string` |
| `secretValueCiphertext` | `string` |
| `secretValueIV` | `string` |
| `secretValueTag` | `string` |

#### Defined in

[infisical-secret-store/src/InfisicalClient/InfisicalClient.impl.ts:33](https://github.com/puristajs/purista/blob/master/packages/infisical-secret-store/src/InfisicalClient/InfisicalClient.impl.ts#L33)

___

### execute

▸ **execute**(`method`, `path`, `options?`, `payload?`): `Promise`\<`any`\>

Helper method

#### Parameters

| Name | Type |
| :------ | :------ |
| `method` | `string` |
| `path` | `string` |
| `options?` | [`HttpClientRequestOptions`](../modules/purista_core.md#httpclientrequestoptions) |
| `payload?` | `unknown` |

#### Returns

`Promise`\<`any`\>

**`Throws`**

UnhandledError

#### Inherited from

[HttpClient](purista_core.HttpClient.md).[execute](purista_core.HttpClient.md#execute)

#### Defined in

core/dist/commonjs/HttpClient/HttpClient.impl.d.ts:62

___

### get

▸ **get**\<`T`\>(`path`, `options?`): `Promise`\<`T`\>

GET request

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `string` |
| `options?` | [`HttpClientRequestOptions`](../modules/purista_core.md#httpclientrequestoptions) |

#### Returns

`Promise`\<`T`\>

#### Inherited from

[HttpClient](purista_core.HttpClient.md).[get](purista_core.HttpClient.md#get)

#### Defined in

core/dist/commonjs/HttpClient/HttpClient.impl.d.ts:69

___

### getSecret

▸ **getSecret**(`name`): `Promise`\<`undefined` \| `string`\>

Get a single secret

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |

#### Returns

`Promise`\<`undefined` \| `string`\>

#### Defined in

[infisical-secret-store/src/InfisicalClient/InfisicalClient.impl.ts:93](https://github.com/puristajs/purista/blob/master/packages/infisical-secret-store/src/InfisicalClient/InfisicalClient.impl.ts#L93)

___

### getServiceTokenData

▸ **getServiceTokenData**(): `Promise`\<[`TokenData`](../modules/purista_infisical_secret_store.md#tokendata)\>

Fetches the token data from the server for given access token

#### Returns

`Promise`\<[`TokenData`](../modules/purista_infisical_secret_store.md#tokendata)\>

#### Defined in

[infisical-secret-store/src/InfisicalClient/InfisicalClient.impl.ts:77](https://github.com/puristajs/purista/blob/master/packages/infisical-secret-store/src/InfisicalClient/InfisicalClient.impl.ts#L77)

___

### getTracer

▸ **getTracer**(): `Tracer`

Returns open telemetry tracer of this service

#### Returns

`Tracer`

Tracer

#### Inherited from

[HttpClient](purista_core.HttpClient.md).[getTracer](purista_core.HttpClient.md#gettracer)

#### Defined in

core/dist/commonjs/HttpClient/HttpClient.impl.d.ts:34

___

### getUrlAndHeader

▸ **getUrlAndHeader**(`path`, `options?`): `Object`

#### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `string` |
| `options?` | [`HttpClientRequestOptions`](../modules/purista_core.md#httpclientrequestoptions) |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `headers` | `Record`\<`string`, `string`\> |
| `url` | `URL` |

#### Inherited from

[HttpClient](purista_core.HttpClient.md).[getUrlAndHeader](purista_core.HttpClient.md#geturlandheader)

#### Defined in

core/dist/commonjs/HttpClient/HttpClient.impl.d.ts:44

___

### patch

▸ **patch**\<`T`\>(`path`, `payload`, `options?`): `Promise`\<`T`\>

PATCH request

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `string` |
| `payload` | `unknown` |
| `options?` | [`HttpClientRequestOptions`](../modules/purista_core.md#httpclientrequestoptions) |

#### Returns

`Promise`\<`T`\>

#### Inherited from

[HttpClient](purista_core.HttpClient.md).[patch](purista_core.HttpClient.md#patch)

#### Defined in

core/dist/commonjs/HttpClient/HttpClient.impl.d.ts:90

___

### post

▸ **post**\<`T`\>(`path`, `payload`, `options?`): `Promise`\<`T`\>

POST request

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `string` |
| `payload` | `unknown` |
| `options?` | [`HttpClientRequestOptions`](../modules/purista_core.md#httpclientrequestoptions) |

#### Returns

`Promise`\<`T`\>

#### Inherited from

[HttpClient](purista_core.HttpClient.md).[post](purista_core.HttpClient.md#post)

#### Defined in

core/dist/commonjs/HttpClient/HttpClient.impl.d.ts:76

___

### put

▸ **put**\<`T`\>(`path`, `payload`, `options?`): `Promise`\<`T`\>

PUT request

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `string` |
| `payload` | `unknown` |
| `options?` | [`HttpClientRequestOptions`](../modules/purista_core.md#httpclientrequestoptions) |

#### Returns

`Promise`\<`T`\>

#### Inherited from

[HttpClient](purista_core.HttpClient.md).[put](purista_core.HttpClient.md#put)

#### Defined in

core/dist/commonjs/HttpClient/HttpClient.impl.d.ts:83

___

### removeSecret

▸ **removeSecret**(`name`): `Promise`\<`void`\>

Remove a secret

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |

#### Returns

`Promise`\<`void`\>

#### Defined in

[infisical-secret-store/src/InfisicalClient/InfisicalClient.impl.ts:168](https://github.com/puristajs/purista/blob/master/packages/infisical-secret-store/src/InfisicalClient/InfisicalClient.impl.ts#L168)

___

### setBearerToken

▸ **setBearerToken**(`token`): `void`

Set the bearer token for all following requests.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `token` | `undefined` \| `string` | the bearer token |

#### Returns

`void`

#### Inherited from

[HttpClient](purista_core.HttpClient.md).[setBearerToken](purista_core.HttpClient.md#setbearertoken)

#### Defined in

core/dist/commonjs/HttpClient/HttpClient.impl.d.ts:52

___

### setSecret

▸ **setSecret**(`name`, `value`): `Promise`\<`void`\>

Set a secret.
It will first try to update and if the secret does not exist, it will create a new one

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `value` | `string` |

#### Returns

`Promise`\<`void`\>

#### Defined in

[infisical-secret-store/src/InfisicalClient/InfisicalClient.impl.ts:133](https://github.com/puristajs/purista/blob/master/packages/infisical-secret-store/src/InfisicalClient/InfisicalClient.impl.ts#L133)

___

### startActiveSpan

▸ **startActiveSpan**\<`F`\>(`name`, `opts`, `context`, `fn`): `Promise`\<`F`\>

Start a child span for opentelemetry tracking

#### Type parameters

| Name |
| :------ |
| `F` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | name of span |
| `opts` | `SpanOptions` | span options |
| `context` | `undefined` \| `Context` | optional context |
| `fn` | (`span`: `Span`) => `Promise`\<`F`\> | function to be executed within the span |

#### Returns

`Promise`\<`F`\>

return value of fn

#### Inherited from

[HttpClient](purista_core.HttpClient.md).[startActiveSpan](purista_core.HttpClient.md#startactivespan)

#### Defined in

core/dist/commonjs/HttpClient/HttpClient.impl.d.ts:43
