[PURISTA API](../README.md) / [Modules](../modules.md) / [@purista/infisical-secret-store](../modules/purista_infisical_secret_store.md) / InfisicalClient

# Class: InfisicalClient

[@purista/infisical-secret-store](../modules/purista_infisical_secret_store.md).InfisicalClient

The internal http client to connect to the Infisical server.

## Hierarchy

- `HttpClient`<[`HttpClientConfigCustom`](../modules/purista_infisical_secret_store.md#httpclientconfigcustom)\>

  ↳ **`InfisicalClient`**

## Table of contents

### Constructors

- [constructor](purista_infisical_secret_store.InfisicalClient.md#constructor)

### Properties

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
- [get](purista_infisical_secret_store.InfisicalClient.md#get)
- [getSecret](purista_infisical_secret_store.InfisicalClient.md#getsecret)
- [getServiceTokenData](purista_infisical_secret_store.InfisicalClient.md#getservicetokendata)
- [getTracer](purista_infisical_secret_store.InfisicalClient.md#gettracer)
- [patch](purista_infisical_secret_store.InfisicalClient.md#patch)
- [post](purista_infisical_secret_store.InfisicalClient.md#post)
- [put](purista_infisical_secret_store.InfisicalClient.md#put)
- [removeSecret](purista_infisical_secret_store.InfisicalClient.md#removesecret)
- [setBearerToken](purista_infisical_secret_store.InfisicalClient.md#setbearertoken)
- [setSecret](purista_infisical_secret_store.InfisicalClient.md#setsecret)
- [startActiveSpan](purista_infisical_secret_store.InfisicalClient.md#startactivespan)

## Constructors

### constructor

• **new InfisicalClient**(`conf`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `conf` | `Object` | - |
| `conf.baseUrl` | `string` | the base url to be used **`Example`** ```typescript const config = { baseUrl: 'http://localhost/api` } // each request will be below http://localhost/api // get('v1/orders') will call http://localhost/api/v1/orders ``` |
| `conf.basicAuth?` | `Object` | Basic-Auth information |
| `conf.basicAuth.password` | `string` | Basic-Auth password |
| `conf.basicAuth.username` | `string` | Basic-Auth username |
| `conf.bearerToken` | `string` | Auth-Bearer token |
| `conf.defaultHeaders?` | `Record`<`string`, `string`\> | Add your default headers here These headers will be part of every request. They can be overwritten per request option |
| `conf.defaultTimeout?` | `number` | set global timeout for requests in ms **`Default`** ```ts 30000 ``` |
| `conf.enableOpentelemetry?` | `boolean` | enable Opentelemetry tracing. The client will be handled as own ressource. |
| `conf.isKeepAlive?` | `boolean` | If set to false, the HTTP client will not reuse the same connection for multiple requests. Default is true. |
| `conf.logLevel?` | `LogLevelName` | the loglevel if no logger instance is given |
| `conf.logger?` | `Logger` | A logger instance |
| `conf.name?` | `string` | Name of the client |
| `conf.spanProcessor?` | `SpanProcessor` | Opentelemetry span processor |

#### Overrides

HttpClient&lt;HttpClientConfigCustom\&gt;.constructor

#### Defined in

[infisical-secret-store/src/InfisicalClient/InfisicalClient.impl.ts:16](https://github.com/sebastianwessel/purista/blob/master/packages/infisical-secret-store/src/InfisicalClient/InfisicalClient.impl.ts#L16)

## Properties

### baseUrl

• **baseUrl**: `URL`

#### Inherited from

HttpClient.baseUrl

#### Defined in

core/lib/types/HttpClient/HttpClient.impl.d.ts:22

___

### config

• **config**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `baseUrl` | `string` | the base url to be used **`Example`** ```typescript const config = { baseUrl: 'http://localhost/api` } // each request will be below http://localhost/api // get('v1/orders') will call http://localhost/api/v1/orders ``` |
| `basicAuth?` | { `password`: `string` ; `username`: `string`  } | Basic-Auth information |
| `basicAuth.password` | `string` | Basic-Auth password |
| `basicAuth.username` | `string` | Basic-Auth username |
| `bearerToken?` | `string` | Auth-Bearer token |
| `defaultHeaders?` | `Record`<`string`, `string`\> | Add your default headers here These headers will be part of every request. They can be overwritten per request option |
| `defaultTimeout?` | `number` | set global timeout for requests in ms **`Default`** ```ts 30000 ``` |
| `enableOpentelemetry?` | `boolean` | enable Opentelemetry tracing. The client will be handled as own ressource. |
| `isKeepAlive?` | `boolean` | If set to false, the HTTP client will not reuse the same connection for multiple requests. Default is true. |
| `logLevel?` | `LogLevelName` | the loglevel if no logger instance is given |
| `logger?` | `Logger` | A logger instance |
| `name?` | `string` | Name of the client |
| `spanProcessor?` | `SpanProcessor` | Opentelemetry span processor |

#### Inherited from

HttpClient.config

#### Defined in

core/lib/types/HttpClient/HttpClient.impl.d.ts:20

___

### logger

• **logger**: `Logger`

#### Inherited from

HttpClient.logger

#### Defined in

core/lib/types/HttpClient/HttpClient.impl.d.ts:19

___

### name

• **name**: `string`

#### Inherited from

HttpClient.name

#### Defined in

core/lib/types/HttpClient/HttpClient.impl.d.ts:18

___

### projectKey

• `Private` **projectKey**: `string` = `''`

#### Defined in

[infisical-secret-store/src/InfisicalClient/InfisicalClient.impl.ts:14](https://github.com/sebastianwessel/purista/blob/master/packages/infisical-secret-store/src/InfisicalClient/InfisicalClient.impl.ts#L14)

___

### serviceTokenSecret

• `Private` **serviceTokenSecret**: `string`

#### Defined in

[infisical-secret-store/src/InfisicalClient/InfisicalClient.impl.ts:12](https://github.com/sebastianwessel/purista/blob/master/packages/infisical-secret-store/src/InfisicalClient/InfisicalClient.impl.ts#L12)

___

### spanProcessor

• **spanProcessor**: `undefined` \| `SpanProcessor`

#### Inherited from

HttpClient.spanProcessor

#### Defined in

core/lib/types/HttpClient/HttpClient.impl.d.ts:23

___

### timeout

• **timeout**: `number`

#### Inherited from

HttpClient.timeout

#### Defined in

core/lib/types/HttpClient/HttpClient.impl.d.ts:21

___

### tokenData

• `Private` **tokenData**: `undefined` \| [`TokenData`](../modules/purista_infisical_secret_store.md#tokendata)

#### Defined in

[infisical-secret-store/src/InfisicalClient/InfisicalClient.impl.ts:13](https://github.com/sebastianwessel/purista/blob/master/packages/infisical-secret-store/src/InfisicalClient/InfisicalClient.impl.ts#L13)

___

### traceProvider

• **traceProvider**: `NodeTracerProvider`

#### Inherited from

HttpClient.traceProvider

#### Defined in

core/lib/types/HttpClient/HttpClient.impl.d.ts:24

## Methods

### delete

▸ **delete**<`T`\>(`path`, `options?`, `payload?`): `Promise`<`T`\>

DELETE request

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `string` |
| `options?` | `HttpClientRequestOptions` |
| `payload?` | `unknown` |

#### Returns

`Promise`<`T`\>

#### Inherited from

HttpClient.delete

#### Defined in

core/lib/types/HttpClient/HttpClient.impl.d.ts:92

___

### encryptSecret

▸ `Private` **encryptSecret**(`secretKey`, `secretValue`, `secretComment?`): `Object`

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

[infisical-secret-store/src/InfisicalClient/InfisicalClient.impl.ts:33](https://github.com/sebastianwessel/purista/blob/master/packages/infisical-secret-store/src/InfisicalClient/InfisicalClient.impl.ts#L33)

___

### get

▸ **get**<`T`\>(`path`, `options?`): `Promise`<`T`\>

GET request

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `string` |
| `options?` | `HttpClientRequestOptions` |

#### Returns

`Promise`<`T`\>

#### Inherited from

HttpClient.get

#### Defined in

core/lib/types/HttpClient/HttpClient.impl.d.ts:64

___

### getSecret

▸ **getSecret**(`name`): `Promise`<`undefined` \| `string`\>

Get a single secret

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |

#### Returns

`Promise`<`undefined` \| `string`\>

#### Defined in

[infisical-secret-store/src/InfisicalClient/InfisicalClient.impl.ts:93](https://github.com/sebastianwessel/purista/blob/master/packages/infisical-secret-store/src/InfisicalClient/InfisicalClient.impl.ts#L93)

___

### getServiceTokenData

▸ **getServiceTokenData**(): `Promise`<[`TokenData`](../modules/purista_infisical_secret_store.md#tokendata)\>

Fetches the token data from the server for given access token

#### Returns

`Promise`<[`TokenData`](../modules/purista_infisical_secret_store.md#tokendata)\>

#### Defined in

[infisical-secret-store/src/InfisicalClient/InfisicalClient.impl.ts:77](https://github.com/sebastianwessel/purista/blob/master/packages/infisical-secret-store/src/InfisicalClient/InfisicalClient.impl.ts#L77)

___

### getTracer

▸ **getTracer**(): `Tracer`

Returns open telemetry tracer of this service

#### Returns

`Tracer`

Tracer

#### Inherited from

HttpClient.getTracer

#### Defined in

core/lib/types/HttpClient/HttpClient.impl.d.ts:32

___

### patch

▸ **patch**<`T`\>(`path`, `payload`, `options?`): `Promise`<`T`\>

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
| `options?` | `HttpClientRequestOptions` |

#### Returns

`Promise`<`T`\>

#### Inherited from

HttpClient.patch

#### Defined in

core/lib/types/HttpClient/HttpClient.impl.d.ts:85

___

### post

▸ **post**<`T`\>(`path`, `payload`, `options?`): `Promise`<`T`\>

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
| `options?` | `HttpClientRequestOptions` |

#### Returns

`Promise`<`T`\>

#### Inherited from

HttpClient.post

#### Defined in

core/lib/types/HttpClient/HttpClient.impl.d.ts:71

___

### put

▸ **put**<`T`\>(`path`, `payload`, `options?`): `Promise`<`T`\>

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
| `options?` | `HttpClientRequestOptions` |

#### Returns

`Promise`<`T`\>

#### Inherited from

HttpClient.put

#### Defined in

core/lib/types/HttpClient/HttpClient.impl.d.ts:78

___

### removeSecret

▸ **removeSecret**(`name`): `Promise`<`void`\>

Remove a secret

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |

#### Returns

`Promise`<`void`\>

#### Defined in

[infisical-secret-store/src/InfisicalClient/InfisicalClient.impl.ts:156](https://github.com/sebastianwessel/purista/blob/master/packages/infisical-secret-store/src/InfisicalClient/InfisicalClient.impl.ts#L156)

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

HttpClient.setBearerToken

#### Defined in

core/lib/types/HttpClient/HttpClient.impl.d.ts:47

___

### setSecret

▸ **setSecret**(`name`, `value`): `Promise`<`void`\>

Set a secret.
It will first try to update and if the secret does not exist, it will create a new one

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `value` | `string` |

#### Returns

`Promise`<`void`\>

#### Defined in

[infisical-secret-store/src/InfisicalClient/InfisicalClient.impl.ts:127](https://github.com/sebastianwessel/purista/blob/master/packages/infisical-secret-store/src/InfisicalClient/InfisicalClient.impl.ts#L127)

___

### startActiveSpan

▸ **startActiveSpan**<`F`\>(`name`, `opts`, `context`, `fn`): `Promise`<`F`\>

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
| `fn` | (`span`: `Span`) => `Promise`<`F`\> | function to be executed within the span |

#### Returns

`Promise`<`F`\>

return value of fn

#### Inherited from

HttpClient.startActiveSpan

#### Defined in

core/lib/types/HttpClient/HttpClient.impl.d.ts:41
