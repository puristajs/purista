[PURISTA API](../README.md) / [Modules](../modules.md) / [@purista/core](../modules/purista_core.md) / HttpClient

# Class: HttpClient\<CustomConfig\>

[@purista/core](../modules/purista_core.md).HttpClient

A HTTP client which will provide simple methods for GET, POST, PATCH, PUT and DELETE.
Body payload will be handled as JSON requests
It includes timeout and error handling and simple json response body parsing

**`Example`**

```typescript
const client = new HttpClient({baseUrl: 'http://localhost/api})

// GET http://localhost/api/v1/orders
const result = await client.get('v1/orders')
```

## Type parameters

| Name | Type |
| :------ | :------ |
| `CustomConfig` | extends `Record`\<`string`, `unknown`\> = {} |

## Hierarchy

- **`HttpClient`**

## Implements

- [`RestClient`](../interfaces/purista_core.RestClient.md)

## Table of contents

### Constructors

- [constructor](purista_core.HttpClient.md#constructor)

### Properties

- [auth](purista_core.HttpClient.md#auth)
- [baseUrl](purista_core.HttpClient.md#baseurl)
- [config](purista_core.HttpClient.md#config)
- [logger](purista_core.HttpClient.md#logger)
- [name](purista_core.HttpClient.md#name)
- [spanProcessor](purista_core.HttpClient.md#spanprocessor)
- [timeout](purista_core.HttpClient.md#timeout)
- [traceProvider](purista_core.HttpClient.md#traceprovider)

### Methods

- [delete](purista_core.HttpClient.md#delete)
- [execute](purista_core.HttpClient.md#execute)
- [get](purista_core.HttpClient.md#get)
- [getTracer](purista_core.HttpClient.md#gettracer)
- [getUrlAndHeader](purista_core.HttpClient.md#geturlandheader)
- [patch](purista_core.HttpClient.md#patch)
- [post](purista_core.HttpClient.md#post)
- [put](purista_core.HttpClient.md#put)
- [setBearerToken](purista_core.HttpClient.md#setbearertoken)
- [startActiveSpan](purista_core.HttpClient.md#startactivespan)

## Constructors

### constructor

• **new HttpClient**\<`CustomConfig`\>(`config`): [`HttpClient`](purista_core.HttpClient.md)\<`CustomConfig`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `CustomConfig` | extends `Record`\<`string`, `unknown`\> = {} |

#### Parameters

| Name | Type |
| :------ | :------ |
| `config` | \{ [K in string \| number \| symbol]: (Object & CustomConfig)[K] } |

#### Returns

[`HttpClient`](purista_core.HttpClient.md)\<`CustomConfig`\>

#### Defined in

[HttpClient/HttpClient.impl.ts:41](https://github.com/puristajs/purista/blob/master/packages/core/src/HttpClient/HttpClient.impl.ts#L41)

## Properties

### auth

• `Protected` **auth**: [`AuthCredentials`](../modules/purista_core.md#authcredentials)

#### Defined in

[HttpClient/HttpClient.impl.ts:40](https://github.com/puristajs/purista/blob/master/packages/core/src/HttpClient/HttpClient.impl.ts#L40)

___

### baseUrl

• **baseUrl**: `URL`

#### Defined in

[HttpClient/HttpClient.impl.ts:35](https://github.com/puristajs/purista/blob/master/packages/core/src/HttpClient/HttpClient.impl.ts#L35)

___

### config

• **config**: \{ [K in string \| number \| symbol]: (Object & CustomConfig)[K] }

#### Defined in

[HttpClient/HttpClient.impl.ts:31](https://github.com/puristajs/purista/blob/master/packages/core/src/HttpClient/HttpClient.impl.ts#L31)

___

### logger

• **logger**: [`Logger`](purista_core.Logger.md)

#### Defined in

[HttpClient/HttpClient.impl.ts:30](https://github.com/puristajs/purista/blob/master/packages/core/src/HttpClient/HttpClient.impl.ts#L30)

___

### name

• **name**: `string` = `'HttpClient'`

#### Defined in

[HttpClient/HttpClient.impl.ts:29](https://github.com/puristajs/purista/blob/master/packages/core/src/HttpClient/HttpClient.impl.ts#L29)

___

### spanProcessor

• **spanProcessor**: `undefined` \| `SpanProcessor`

#### Defined in

[HttpClient/HttpClient.impl.ts:37](https://github.com/puristajs/purista/blob/master/packages/core/src/HttpClient/HttpClient.impl.ts#L37)

___

### timeout

• **timeout**: `number`

#### Defined in

[HttpClient/HttpClient.impl.ts:33](https://github.com/puristajs/purista/blob/master/packages/core/src/HttpClient/HttpClient.impl.ts#L33)

___

### traceProvider

• **traceProvider**: `NodeTracerProvider`

#### Defined in

[HttpClient/HttpClient.impl.ts:38](https://github.com/puristajs/purista/blob/master/packages/core/src/HttpClient/HttpClient.impl.ts#L38)

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

#### Implementation of

[RestClient](../interfaces/purista_core.RestClient.md).[delete](../interfaces/purista_core.RestClient.md#delete)

#### Defined in

[HttpClient/HttpClient.impl.ts:319](https://github.com/puristajs/purista/blob/master/packages/core/src/HttpClient/HttpClient.impl.ts#L319)

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

#### Defined in

[HttpClient/HttpClient.impl.ts:183](https://github.com/puristajs/purista/blob/master/packages/core/src/HttpClient/HttpClient.impl.ts#L183)

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

#### Implementation of

[RestClient](../interfaces/purista_core.RestClient.md).[get](../interfaces/purista_core.RestClient.md#get)

#### Defined in

[HttpClient/HttpClient.impl.ts:279](https://github.com/puristajs/purista/blob/master/packages/core/src/HttpClient/HttpClient.impl.ts#L279)

___

### getTracer

▸ **getTracer**(): `Tracer`

Returns open telemetry tracer of this service

#### Returns

`Tracer`

Tracer

#### Defined in

[HttpClient/HttpClient.impl.ts:84](https://github.com/puristajs/purista/blob/master/packages/core/src/HttpClient/HttpClient.impl.ts#L84)

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

#### Defined in

[HttpClient/HttpClient.impl.ts:131](https://github.com/puristajs/purista/blob/master/packages/core/src/HttpClient/HttpClient.impl.ts#L131)

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

#### Implementation of

[RestClient](../interfaces/purista_core.RestClient.md).[patch](../interfaces/purista_core.RestClient.md#patch)

#### Defined in

[HttpClient/HttpClient.impl.ts:309](https://github.com/puristajs/purista/blob/master/packages/core/src/HttpClient/HttpClient.impl.ts#L309)

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

#### Implementation of

[RestClient](../interfaces/purista_core.RestClient.md).[post](../interfaces/purista_core.RestClient.md#post)

#### Defined in

[HttpClient/HttpClient.impl.ts:289](https://github.com/puristajs/purista/blob/master/packages/core/src/HttpClient/HttpClient.impl.ts#L289)

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

#### Implementation of

[RestClient](../interfaces/purista_core.RestClient.md).[put](../interfaces/purista_core.RestClient.md#put)

#### Defined in

[HttpClient/HttpClient.impl.ts:299](https://github.com/puristajs/purista/blob/master/packages/core/src/HttpClient/HttpClient.impl.ts#L299)

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

#### Implementation of

[RestClient](../interfaces/purista_core.RestClient.md).[setBearerToken](../interfaces/purista_core.RestClient.md#setbearertoken)

#### Defined in

[HttpClient/HttpClient.impl.ts:170](https://github.com/puristajs/purista/blob/master/packages/core/src/HttpClient/HttpClient.impl.ts#L170)

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

#### Defined in

[HttpClient/HttpClient.impl.ts:96](https://github.com/puristajs/purista/blob/master/packages/core/src/HttpClient/HttpClient.impl.ts#L96)
