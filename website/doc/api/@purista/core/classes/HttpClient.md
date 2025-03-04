[**@purista/core v2.0.6**](../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / HttpClient

# Class: HttpClient\<CustomConfig\>

Defined in: [packages/core/src/HttpClient/HttpClient.impl.ts:43](https://github.com/puristajs/purista/blob/master/packages/core/src/HttpClient/HttpClient.impl.ts#L43)

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

• **CustomConfig** *extends* `Record`\<`string`, `unknown`\> = [`EmptyObject`](../type-aliases/EmptyObject.md)

## Implements

- [`RestClient`](../interfaces/RestClient.md)

## Constructors

### new HttpClient()

> **new HttpClient**\<`CustomConfig`\>(`config`): [`HttpClient`](HttpClient.md)\<`CustomConfig`\>

Defined in: [packages/core/src/HttpClient/HttpClient.impl.ts:56](https://github.com/puristajs/purista/blob/master/packages/core/src/HttpClient/HttpClient.impl.ts#L56)

#### Parameters

##### config

\{ \[K in string \| number \| symbol\]: (\{ baseUrl?: string; basicAuth?: \{ password: string; username: string \}; bearerToken?: string; defaultHeaders?: Record\<string, string\>; defaultTimeout?: number; enableOpentelemetry?: boolean; isKeepAlive?: boolean; logger?: Logger; logLevel?: LogLevelName; name?: string; spanProcessor?: SpanProcessor; traceId?: string \} & CustomConfig)\[K\] \}

#### Returns

[`HttpClient`](HttpClient.md)\<`CustomConfig`\>

## Properties

### auth

> `protected` **auth**: [`AuthCredentials`](../type-aliases/AuthCredentials.md)

Defined in: [packages/core/src/HttpClient/HttpClient.impl.ts:55](https://github.com/puristajs/purista/blob/master/packages/core/src/HttpClient/HttpClient.impl.ts#L55)

***

### baseUrl

> **baseUrl**: `undefined` \| `URL` = `undefined`

Defined in: [packages/core/src/HttpClient/HttpClient.impl.ts:50](https://github.com/puristajs/purista/blob/master/packages/core/src/HttpClient/HttpClient.impl.ts#L50)

***

### config

> **config**: \{ \[K in string \| number \| symbol\]: (\{ baseUrl?: string; basicAuth?: \{ password: string; username: string \}; bearerToken?: string; defaultHeaders?: Record\<string, string\>; defaultTimeout?: number; enableOpentelemetry?: boolean; isKeepAlive?: boolean; logger?: Logger; logLevel?: LogLevelName; name?: string; spanProcessor?: SpanProcessor; traceId?: string \} & CustomConfig)\[K\] \}

Defined in: [packages/core/src/HttpClient/HttpClient.impl.ts:46](https://github.com/puristajs/purista/blob/master/packages/core/src/HttpClient/HttpClient.impl.ts#L46)

***

### logger

> **logger**: [`Logger`](Logger.md)

Defined in: [packages/core/src/HttpClient/HttpClient.impl.ts:45](https://github.com/puristajs/purista/blob/master/packages/core/src/HttpClient/HttpClient.impl.ts#L45)

***

### name

> **name**: `string` = `'HttpClient'`

Defined in: [packages/core/src/HttpClient/HttpClient.impl.ts:44](https://github.com/puristajs/purista/blob/master/packages/core/src/HttpClient/HttpClient.impl.ts#L44)

***

### spanProcessor

> **spanProcessor**: `undefined` \| `SpanProcessor`

Defined in: [packages/core/src/HttpClient/HttpClient.impl.ts:52](https://github.com/puristajs/purista/blob/master/packages/core/src/HttpClient/HttpClient.impl.ts#L52)

***

### timeout

> **timeout**: `number`

Defined in: [packages/core/src/HttpClient/HttpClient.impl.ts:48](https://github.com/puristajs/purista/blob/master/packages/core/src/HttpClient/HttpClient.impl.ts#L48)

***

### traceProvider

> **traceProvider**: `NodeTracerProvider`

Defined in: [packages/core/src/HttpClient/HttpClient.impl.ts:53](https://github.com/puristajs/purista/blob/master/packages/core/src/HttpClient/HttpClient.impl.ts#L53)

## Methods

### delete()

> **delete**\<`T`\>(`path`, `options`?, `payload`?): `Promise`\<`T`\>

Defined in: [packages/core/src/HttpClient/HttpClient.impl.ts:336](https://github.com/puristajs/purista/blob/master/packages/core/src/HttpClient/HttpClient.impl.ts#L336)

DELETE request

#### Type Parameters

• **T**

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

> `protected` **execute**(`method`, `path`, `options`?, `payload`?): `Promise`\<`any`\>

Defined in: [packages/core/src/HttpClient/HttpClient.impl.ts:200](https://github.com/puristajs/purista/blob/master/packages/core/src/HttpClient/HttpClient.impl.ts#L200)

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

> **get**\<`T`\>(`path`, `options`?): `Promise`\<`T`\>

Defined in: [packages/core/src/HttpClient/HttpClient.impl.ts:296](https://github.com/puristajs/purista/blob/master/packages/core/src/HttpClient/HttpClient.impl.ts#L296)

GET request

#### Type Parameters

• **T**

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

Defined in: [packages/core/src/HttpClient/HttpClient.impl.ts:101](https://github.com/puristajs/purista/blob/master/packages/core/src/HttpClient/HttpClient.impl.ts#L101)

Returns open telemetry tracer of this service

#### Returns

`Tracer`

Tracer

***

### getUrlAndHeader()

> `protected` **getUrlAndHeader**(`path`, `options`?): `object`

Defined in: [packages/core/src/HttpClient/HttpClient.impl.ts:148](https://github.com/puristajs/purista/blob/master/packages/core/src/HttpClient/HttpClient.impl.ts#L148)

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

> **patch**\<`T`\>(`path`, `payload`, `options`?): `Promise`\<`T`\>

Defined in: [packages/core/src/HttpClient/HttpClient.impl.ts:326](https://github.com/puristajs/purista/blob/master/packages/core/src/HttpClient/HttpClient.impl.ts#L326)

PATCH request

#### Type Parameters

• **T**

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

> **post**\<`T`\>(`path`, `payload`, `options`?): `Promise`\<`T`\>

Defined in: [packages/core/src/HttpClient/HttpClient.impl.ts:306](https://github.com/puristajs/purista/blob/master/packages/core/src/HttpClient/HttpClient.impl.ts#L306)

POST request

#### Type Parameters

• **T**

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

> **put**\<`T`\>(`path`, `payload`, `options`?): `Promise`\<`T`\>

Defined in: [packages/core/src/HttpClient/HttpClient.impl.ts:316](https://github.com/puristajs/purista/blob/master/packages/core/src/HttpClient/HttpClient.impl.ts#L316)

PUT request

#### Type Parameters

• **T**

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

Defined in: [packages/core/src/HttpClient/HttpClient.impl.ts:187](https://github.com/puristajs/purista/blob/master/packages/core/src/HttpClient/HttpClient.impl.ts#L187)

Set the bearer token for all following requests.

#### Parameters

##### token

the bearer token

`undefined` | `string`

#### Returns

`void`

#### Implementation of

[`RestClient`](../interfaces/RestClient.md).[`setBearerToken`](../interfaces/RestClient.md#setbearertoken)

***

### startActiveSpan()

> **startActiveSpan**\<`F`\>(`name`, `opts`, `context`, `fn`): `Promise`\<`F`\>

Defined in: [packages/core/src/HttpClient/HttpClient.impl.ts:113](https://github.com/puristajs/purista/blob/master/packages/core/src/HttpClient/HttpClient.impl.ts#L113)

Start a child span for opentelemetry tracking

#### Type Parameters

• **F**

#### Parameters

##### name

`string`

name of span

##### opts

`SpanOptions`

span options

##### context

optional context

`undefined` | `Context`

##### fn

(`span`) => `Promise`\<`F`\>

function to be executed within the span

#### Returns

`Promise`\<`F`\>

return value of fn
