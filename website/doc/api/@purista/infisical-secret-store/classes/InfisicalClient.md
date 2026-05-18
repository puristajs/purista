[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/infisical-secret-store](../README.md) / InfisicalClient

# Class: InfisicalClient

Defined in: [infisical-secret-store/src/InfisicalClient/InfisicalClient.impl.ts:13](https://github.com/puristajs/purista/blob/master/packages/infisical-secret-store/src/InfisicalClient/InfisicalClient.impl.ts#L13)

The internal http client to connect to the Infisical server.

## Extends

- [`HttpClient`](../../core/classes/HttpClient.md)\<[`HttpClientConfigCustom`](../type-aliases/HttpClientConfigCustom.md)\>

## Constructors

### Constructor

> **new InfisicalClient**(`conf`): `InfisicalClient`

Defined in: [infisical-secret-store/src/InfisicalClient/InfisicalClient.impl.ts:31](https://github.com/puristajs/purista/blob/master/packages/infisical-secret-store/src/InfisicalClient/InfisicalClient.impl.ts#L31)

#### Parameters

##### conf

###### baseUrl?

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

###### enableOpentelemetry?

`boolean`

enable Opentelemetry tracing.
The client will be handled as own resource.

###### isKeepAlive?

`boolean`

If set to false, the HTTP client will not reuse the same connection for multiple requests.
Default is true.

###### logger?

[`Logger`](../../core/classes/Logger.md)

A logger instance

###### logLevel?

[`LogLevelName`](../../core/type-aliases/LogLevelName.md)

the loglevel if no logger instance is given

###### metricsRecorder?

[`PuristaMetricsRecorderInterface`](../../core/interfaces/PuristaMetricsRecorderInterface.md)

Optional metrics recorder for HTTP client framework metrics.

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

`InfisicalClient`

#### Overrides

[`HttpClient`](../../core/classes/HttpClient.md).[`constructor`](../../core/classes/HttpClient.md#constructor)

## Properties

### auth

> `protected` **auth**: [`AuthCredentials`](../../core/type-aliases/AuthCredentials.md)

Defined in: core/dist/HttpClient/HttpClient.impl.d.ts:32

#### Inherited from

[`HttpClient`](../../core/classes/HttpClient.md).[`auth`](../../core/classes/HttpClient.md#auth)

***

### baseUrl

> **baseUrl**: `URL` \| `undefined`

Defined in: core/dist/HttpClient/HttpClient.impl.d.ts:28

#### Inherited from

[`HttpClient`](../../core/classes/HttpClient.md).[`baseUrl`](../../core/classes/HttpClient.md#baseurl)

***

### config

> **config**: `object`

Defined in: core/dist/HttpClient/HttpClient.impl.d.ts:26

#### baseUrl?

> `optional` **baseUrl?**: `string`

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

> `optional` **basicAuth?**: `object`

Basic-Auth information

##### basicAuth.password

> **password**: `string`

Basic-Auth password

##### basicAuth.username

> **username**: `string`

Basic-Auth username

#### bearerToken?

> `optional` **bearerToken?**: `string`

Auth-Bearer token

#### defaultHeaders?

> `optional` **defaultHeaders?**: `Record`\<`string`, `string`\>

Add your default headers here
These headers will be part of every request.
They can be overwritten per request option

#### defaultTimeout?

> `optional` **defaultTimeout?**: `number`

set global timeout for requests in ms

##### Default

```ts
30000
```

#### enableOpentelemetry?

> `optional` **enableOpentelemetry?**: `boolean`

enable Opentelemetry tracing.
The client will be handled as own resource.

#### isKeepAlive?

> `optional` **isKeepAlive?**: `boolean`

If set to false, the HTTP client will not reuse the same connection for multiple requests.
Default is true.

#### logger?

> `optional` **logger?**: [`Logger`](../../core/classes/Logger.md)

A logger instance

#### logLevel?

> `optional` **logLevel?**: [`LogLevelName`](../../core/type-aliases/LogLevelName.md)

the loglevel if no logger instance is given

#### metricsRecorder?

> `optional` **metricsRecorder?**: [`PuristaMetricsRecorderInterface`](../../core/interfaces/PuristaMetricsRecorderInterface.md)

Optional metrics recorder for HTTP client framework metrics.

#### name?

> `optional` **name?**: `string`

Name of the client

#### spanProcessor?

> `optional` **spanProcessor?**: `SpanProcessor`

Opentelemetry span processor

#### traceId?

> `optional` **traceId?**: `string`

Custom trace Id

#### Inherited from

[`HttpClient`](../../core/classes/HttpClient.md).[`config`](../../core/classes/HttpClient.md#config)

***

### logger

> **logger**: [`Logger`](../../core/classes/Logger.md)

Defined in: core/dist/HttpClient/HttpClient.impl.d.ts:25

#### Inherited from

[`HttpClient`](../../core/classes/HttpClient.md).[`logger`](../../core/classes/HttpClient.md#logger)

***

### name

> **name**: `string`

Defined in: core/dist/HttpClient/HttpClient.impl.d.ts:24

#### Inherited from

[`HttpClient`](../../core/classes/HttpClient.md).[`name`](../../core/classes/HttpClient.md#name)

***

### spanProcessor

> **spanProcessor**: `SpanProcessor` \| `undefined`

Defined in: core/dist/HttpClient/HttpClient.impl.d.ts:29

#### Inherited from

[`HttpClient`](../../core/classes/HttpClient.md).[`spanProcessor`](../../core/classes/HttpClient.md#spanprocessor)

***

### timeout

> **timeout**: `number`

Defined in: core/dist/HttpClient/HttpClient.impl.d.ts:27

#### Inherited from

[`HttpClient`](../../core/classes/HttpClient.md).[`timeout`](../../core/classes/HttpClient.md#timeout)

***

### traceProvider

> **traceProvider**: `NodeTracerProvider`

Defined in: core/dist/HttpClient/HttpClient.impl.d.ts:30

#### Inherited from

[`HttpClient`](../../core/classes/HttpClient.md).[`traceProvider`](../../core/classes/HttpClient.md#traceprovider)

## Methods

### delete()

> **delete**\<`T`\>(`path`, `options?`, `payload?`): `Promise`\<`T`\>

Defined in: core/dist/HttpClient/HttpClient.impl.d.ts:103

DELETE request

#### Type Parameters

##### T

`T`

#### Parameters

##### path

`string`

##### options?

[`HttpClientRequestOptions`](../../core/type-aliases/HttpClientRequestOptions.md)

##### payload?

`unknown`

#### Returns

`Promise`\<`T`\>

#### Inherited from

[`HttpClient`](../../core/classes/HttpClient.md).[`delete`](../../core/classes/HttpClient.md#delete)

***

### execute()

> `protected` **execute**(`method`, `path`, `options?`, `payload?`): `Promise`\<`any`\>

Defined in: core/dist/HttpClient/HttpClient.impl.d.ts:68

Helper method

#### Parameters

##### method

`string`

##### path

`string`

##### options?

[`HttpClientRequestOptions`](../../core/type-aliases/HttpClientRequestOptions.md)

##### payload?

`unknown`

#### Returns

`Promise`\<`any`\>

#### Throws

UnhandledError

#### Inherited from

[`HttpClient`](../../core/classes/HttpClient.md).[`execute`](../../core/classes/HttpClient.md#execute)

***

### get()

> **get**\<`T`\>(`path`, `options?`): `Promise`\<`T`\>

Defined in: core/dist/HttpClient/HttpClient.impl.d.ts:75

GET request

#### Type Parameters

##### T

`T`

#### Parameters

##### path

`string`

##### options?

[`HttpClientRequestOptions`](../../core/type-aliases/HttpClientRequestOptions.md)

#### Returns

`Promise`\<`T`\>

#### Inherited from

[`HttpClient`](../../core/classes/HttpClient.md).[`get`](../../core/classes/HttpClient.md#get)

***

### getSecret()

> **getSecret**(`name`): `Promise`\<`string` \| `undefined`\>

Defined in: [infisical-secret-store/src/InfisicalClient/InfisicalClient.impl.ts:108](https://github.com/puristajs/purista/blob/master/packages/infisical-secret-store/src/InfisicalClient/InfisicalClient.impl.ts#L108)

Get a single secret

#### Parameters

##### name

`string`

#### Returns

`Promise`\<`string` \| `undefined`\>

***

### getServiceTokenData()

> **getServiceTokenData**(): `Promise`\<[`TokenData`](../type-aliases/TokenData.md)\>

Defined in: [infisical-secret-store/src/InfisicalClient/InfisicalClient.impl.ts:92](https://github.com/puristajs/purista/blob/master/packages/infisical-secret-store/src/InfisicalClient/InfisicalClient.impl.ts#L92)

Fetches the token data from the server for given access token

#### Returns

`Promise`\<[`TokenData`](../type-aliases/TokenData.md)\>

***

### getTracer()

> **getTracer**(): `Tracer`

Defined in: core/dist/HttpClient/HttpClient.impl.d.ts:39

Returns open telemetry tracer of this service

#### Returns

`Tracer`

Tracer

#### Inherited from

[`HttpClient`](../../core/classes/HttpClient.md).[`getTracer`](../../core/classes/HttpClient.md#gettracer)

***

### getUrlAndHeader()

> `protected` **getUrlAndHeader**(`path`, `options?`): `object`

Defined in: core/dist/HttpClient/HttpClient.impl.d.ts:50

#### Parameters

##### path

`string`

##### options?

[`HttpClientRequestOptions`](../../core/type-aliases/HttpClientRequestOptions.md)

#### Returns

`object`

##### headers

> **headers**: `Record`\<`string`, `string`\>

##### url

> **url**: `URL`

#### Inherited from

[`HttpClient`](../../core/classes/HttpClient.md).[`getUrlAndHeader`](../../core/classes/HttpClient.md#geturlandheader)

***

### patch()

> **patch**\<`T`\>(`path`, `payload`, `options?`): `Promise`\<`T`\>

Defined in: core/dist/HttpClient/HttpClient.impl.d.ts:96

PATCH request

#### Type Parameters

##### T

`T`

#### Parameters

##### path

`string`

##### payload

`unknown`

##### options?

[`HttpClientRequestOptions`](../../core/type-aliases/HttpClientRequestOptions.md)

#### Returns

`Promise`\<`T`\>

#### Inherited from

[`HttpClient`](../../core/classes/HttpClient.md).[`patch`](../../core/classes/HttpClient.md#patch)

***

### post()

> **post**\<`T`\>(`path`, `payload`, `options?`): `Promise`\<`T`\>

Defined in: core/dist/HttpClient/HttpClient.impl.d.ts:82

POST request

#### Type Parameters

##### T

`T`

#### Parameters

##### path

`string`

##### payload

`unknown`

##### options?

[`HttpClientRequestOptions`](../../core/type-aliases/HttpClientRequestOptions.md)

#### Returns

`Promise`\<`T`\>

#### Inherited from

[`HttpClient`](../../core/classes/HttpClient.md).[`post`](../../core/classes/HttpClient.md#post)

***

### put()

> **put**\<`T`\>(`path`, `payload`, `options?`): `Promise`\<`T`\>

Defined in: core/dist/HttpClient/HttpClient.impl.d.ts:89

PUT request

#### Type Parameters

##### T

`T`

#### Parameters

##### path

`string`

##### payload

`unknown`

##### options?

[`HttpClientRequestOptions`](../../core/type-aliases/HttpClientRequestOptions.md)

#### Returns

`Promise`\<`T`\>

#### Inherited from

[`HttpClient`](../../core/classes/HttpClient.md).[`put`](../../core/classes/HttpClient.md#put)

***

### removeSecret()

> **removeSecret**(`name`): `Promise`\<`void`\>

Defined in: [infisical-secret-store/src/InfisicalClient/InfisicalClient.impl.ts:189](https://github.com/puristajs/purista/blob/master/packages/infisical-secret-store/src/InfisicalClient/InfisicalClient.impl.ts#L189)

Remove a secret

#### Parameters

##### name

`string`

#### Returns

`Promise`\<`void`\>

***

### setBearerToken()

> **setBearerToken**(`token`): `void`

Defined in: core/dist/HttpClient/HttpClient.impl.d.ts:58

Set the bearer token for all following requests.

#### Parameters

##### token

`string` \| `undefined`

the bearer token

#### Returns

`void`

#### Inherited from

[`HttpClient`](../../core/classes/HttpClient.md).[`setBearerToken`](../../core/classes/HttpClient.md#setbearertoken)

***

### setSecret()

> **setSecret**(`name`, `value`): `Promise`\<`void`\>

Defined in: [infisical-secret-store/src/InfisicalClient/InfisicalClient.impl.ts:148](https://github.com/puristajs/purista/blob/master/packages/infisical-secret-store/src/InfisicalClient/InfisicalClient.impl.ts#L148)

Set a secret.
It will first try to update and if the secret does not exist, it will create a new one

#### Parameters

##### name

`string`

##### value

`string`

#### Returns

`Promise`\<`void`\>

***

### startActiveSpan()

> **startActiveSpan**\<`F`\>(`name`, `opts`, `context`, `fn`): `Promise`\<`F`\>

Defined in: core/dist/HttpClient/HttpClient.impl.d.ts:48

Start a child span for opentelemetry tracking

#### Type Parameters

##### F

`F`

#### Parameters

##### name

`string`

name of span

##### opts

`SpanOptions`

span options

##### context

`Context` \| `undefined`

optional context

##### fn

(`span`) => `Promise`\<`F`\>

function to be executed within the span

#### Returns

`Promise`\<`F`\>

return value of fn

#### Inherited from

[`HttpClient`](../../core/classes/HttpClient.md).[`startActiveSpan`](../../core/classes/HttpClient.md#startactivespan)
