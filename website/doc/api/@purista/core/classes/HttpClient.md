[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / HttpClient

# Class: HttpClient\<CustomConfig\>

Defined in: [HttpClient/HttpClient.impl.ts:40](https://github.com/puristajs/purista/blob/master/packages/core/src/HttpClient/HttpClient.impl.ts#L40)

A HTTP client which will provide simple methods for GET, POST, PATCH, PUT and DELETE.
Body payload will be handled as JSON requests
It includes timeout and error handling and simple json response body parsing

## Example

```typescript
const client = new HttpClient({baseUrl: 'http://localhost/api})

// GET http://localhost/api/v1/orders
const result = await client.get('v1/orders')
```

## Extended by

- [`DaprClient`](../../dapr-sdk/classes/DaprClient.md)
- [`InfisicalClient`](../../infisical-secret-store/classes/InfisicalClient.md)

## Type Parameters

### CustomConfig

`CustomConfig` *extends* `Record`\<`string`, `unknown`\> = [`EmptyObject`](../type-aliases/EmptyObject.md)

## Implements

- [`RestClient`](../interfaces/RestClient.md)

## Constructors

### Constructor

> **new HttpClient**\<`CustomConfig`\>(`config`): `HttpClient`\<`CustomConfig`\>

Defined in: [HttpClient/HttpClient.impl.ts:53](https://github.com/puristajs/purista/blob/master/packages/core/src/HttpClient/HttpClient.impl.ts#L53)

#### Parameters

##### config

\{ \[K in string \| number \| symbol\]: (\{ baseUrl?: string; basicAuth?: \{ password: string; username: string \}; bearerToken?: string; defaultHeaders?: Record\<string, string\>; defaultTimeout?: number; enableOpentelemetry?: boolean; isKeepAlive?: boolean; logger?: Logger; logLevel?: LogLevelName; name?: string; spanProcessor?: SpanProcessor; traceId?: string \} & CustomConfig)\[K\] \}

#### Returns

`HttpClient`\<`CustomConfig`\>

## Properties

### auth

> `protected` **auth**: [`AuthCredentials`](../type-aliases/AuthCredentials.md)

Defined in: [HttpClient/HttpClient.impl.ts:52](https://github.com/puristajs/purista/blob/master/packages/core/src/HttpClient/HttpClient.impl.ts#L52)

***

### baseUrl

> **baseUrl**: `URL` \| `undefined` = `undefined`

Defined in: [HttpClient/HttpClient.impl.ts:47](https://github.com/puristajs/purista/blob/master/packages/core/src/HttpClient/HttpClient.impl.ts#L47)

***

### config

> **config**: \{ \[K in string \| number \| symbol\]: (\{ baseUrl?: string; basicAuth?: \{ password: string; username: string \}; bearerToken?: string; defaultHeaders?: Record\<string, string\>; defaultTimeout?: number; enableOpentelemetry?: boolean; isKeepAlive?: boolean; logger?: Logger; logLevel?: LogLevelName; name?: string; spanProcessor?: SpanProcessor; traceId?: string \} & CustomConfig)\[K\] \}

Defined in: [HttpClient/HttpClient.impl.ts:43](https://github.com/puristajs/purista/blob/master/packages/core/src/HttpClient/HttpClient.impl.ts#L43)

***

### logger

> **logger**: [`Logger`](Logger.md)

Defined in: [HttpClient/HttpClient.impl.ts:42](https://github.com/puristajs/purista/blob/master/packages/core/src/HttpClient/HttpClient.impl.ts#L42)

***

### name

> **name**: `string` = `'HttpClient'`

Defined in: [HttpClient/HttpClient.impl.ts:41](https://github.com/puristajs/purista/blob/master/packages/core/src/HttpClient/HttpClient.impl.ts#L41)

***

### spanProcessor

> **spanProcessor**: `SpanProcessor` \| `undefined`

Defined in: [HttpClient/HttpClient.impl.ts:49](https://github.com/puristajs/purista/blob/master/packages/core/src/HttpClient/HttpClient.impl.ts#L49)

***

### timeout

> **timeout**: `number`

Defined in: [HttpClient/HttpClient.impl.ts:45](https://github.com/puristajs/purista/blob/master/packages/core/src/HttpClient/HttpClient.impl.ts#L45)

***

### traceProvider

> **traceProvider**: `NodeTracerProvider`

Defined in: [HttpClient/HttpClient.impl.ts:50](https://github.com/puristajs/purista/blob/master/packages/core/src/HttpClient/HttpClient.impl.ts#L50)

## Methods

### delete()

> **delete**\<`T`\>(`path`, `options?`, `payload?`): `Promise`\<`T`\>

Defined in: [HttpClient/HttpClient.impl.ts:330](https://github.com/puristajs/purista/blob/master/packages/core/src/HttpClient/HttpClient.impl.ts#L330)

DELETE request

#### Type Parameters

##### T

`T`

#### Parameters

##### path

`string`

##### options?

[`HttpClientRequestOptions`](../type-aliases/HttpClientRequestOptions.md)

##### payload?

`unknown`

#### Returns

`Promise`\<`T`\>

#### Implementation of

[`RestClient`](../interfaces/RestClient.md).[`delete`](../interfaces/RestClient.md#delete)

***

### execute()

> `protected` **execute**(`method`, `path`, `options?`, `payload?`): `Promise`\<`any`\>

Defined in: [HttpClient/HttpClient.impl.ts:194](https://github.com/puristajs/purista/blob/master/packages/core/src/HttpClient/HttpClient.impl.ts#L194)

Helper method

#### Parameters

##### method

`string`

##### path

`string`

##### options?

[`HttpClientRequestOptions`](../type-aliases/HttpClientRequestOptions.md)

##### payload?

`unknown`

#### Returns

`Promise`\<`any`\>

#### Throws

UnhandledError

***

### get()

> **get**\<`T`\>(`path`, `options?`): `Promise`\<`T`\>

Defined in: [HttpClient/HttpClient.impl.ts:290](https://github.com/puristajs/purista/blob/master/packages/core/src/HttpClient/HttpClient.impl.ts#L290)

GET request

#### Type Parameters

##### T

`T`

#### Parameters

##### path

`string`

##### options?

[`HttpClientRequestOptions`](../type-aliases/HttpClientRequestOptions.md)

#### Returns

`Promise`\<`T`\>

#### Implementation of

[`RestClient`](../interfaces/RestClient.md).[`get`](../interfaces/RestClient.md#get)

***

### getTracer()

> **getTracer**(): `Tracer`

Defined in: [HttpClient/HttpClient.impl.ts:95](https://github.com/puristajs/purista/blob/master/packages/core/src/HttpClient/HttpClient.impl.ts#L95)

Returns open telemetry tracer of this service

#### Returns

`Tracer`

Tracer

***

### getUrlAndHeader()

> `protected` **getUrlAndHeader**(`path`, `options?`): `object`

Defined in: [HttpClient/HttpClient.impl.ts:142](https://github.com/puristajs/purista/blob/master/packages/core/src/HttpClient/HttpClient.impl.ts#L142)

#### Parameters

##### path

`string`

##### options?

[`HttpClientRequestOptions`](../type-aliases/HttpClientRequestOptions.md)

#### Returns

`object`

##### headers

> **headers**: `Record`\<`string`, `string`\>

##### url

> **url**: `URL`

***

### patch()

> **patch**\<`T`\>(`path`, `payload`, `options?`): `Promise`\<`T`\>

Defined in: [HttpClient/HttpClient.impl.ts:320](https://github.com/puristajs/purista/blob/master/packages/core/src/HttpClient/HttpClient.impl.ts#L320)

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

[`HttpClientRequestOptions`](../type-aliases/HttpClientRequestOptions.md)

#### Returns

`Promise`\<`T`\>

#### Implementation of

[`RestClient`](../interfaces/RestClient.md).[`patch`](../interfaces/RestClient.md#patch)

***

### post()

> **post**\<`T`\>(`path`, `payload`, `options?`): `Promise`\<`T`\>

Defined in: [HttpClient/HttpClient.impl.ts:300](https://github.com/puristajs/purista/blob/master/packages/core/src/HttpClient/HttpClient.impl.ts#L300)

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

[`HttpClientRequestOptions`](../type-aliases/HttpClientRequestOptions.md)

#### Returns

`Promise`\<`T`\>

#### Implementation of

[`RestClient`](../interfaces/RestClient.md).[`post`](../interfaces/RestClient.md#post)

***

### put()

> **put**\<`T`\>(`path`, `payload`, `options?`): `Promise`\<`T`\>

Defined in: [HttpClient/HttpClient.impl.ts:310](https://github.com/puristajs/purista/blob/master/packages/core/src/HttpClient/HttpClient.impl.ts#L310)

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

[`HttpClientRequestOptions`](../type-aliases/HttpClientRequestOptions.md)

#### Returns

`Promise`\<`T`\>

#### Implementation of

[`RestClient`](../interfaces/RestClient.md).[`put`](../interfaces/RestClient.md#put)

***

### setBearerToken()

> **setBearerToken**(`token`): `void`

Defined in: [HttpClient/HttpClient.impl.ts:181](https://github.com/puristajs/purista/blob/master/packages/core/src/HttpClient/HttpClient.impl.ts#L181)

Set the bearer token for all following requests.

#### Parameters

##### token

the bearer token

`string` | `undefined`

#### Returns

`void`

#### Implementation of

[`RestClient`](../interfaces/RestClient.md).[`setBearerToken`](../interfaces/RestClient.md#setbearertoken)

***

### startActiveSpan()

> **startActiveSpan**\<`F`\>(`name`, `opts`, `context`, `fn`): `Promise`\<`F`\>

Defined in: [HttpClient/HttpClient.impl.ts:107](https://github.com/puristajs/purista/blob/master/packages/core/src/HttpClient/HttpClient.impl.ts#L107)

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

optional context

`Context` | `undefined`

##### fn

(`span`) => `Promise`\<`F`\>

function to be executed within the span

#### Returns

`Promise`\<`F`\>

return value of fn
