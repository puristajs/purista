[PURISTA API](../README.md) / [Modules](../modules.md) / [@purista/core](../modules/purista_core.md) / HttpClient

# Class: HttpClient<CustomConfig\>

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
| `CustomConfig` | extends `Record`<`string`, `unknown`\> = {} |

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

• **new HttpClient**<`CustomConfig`\>(`config`)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `CustomConfig` | extends `Record`<`string`, `unknown`\> = {} |

#### Parameters

| Name | Type |
| :------ | :------ |
| `config` | { [K in string \| number \| symbol]: (Object & CustomConfig)[K] } |

#### Defined in

[HttpClient/HttpClient.impl.ts:37](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/HttpClient/HttpClient.impl.ts#L37)

## Properties

### auth

• `Private` **auth**: [`AuthCredentials`](../modules/purista_core.md#authcredentials)

#### Defined in

[HttpClient/HttpClient.impl.ts:36](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/HttpClient/HttpClient.impl.ts#L36)

___

### baseUrl

• **baseUrl**: `URL`

#### Defined in

[HttpClient/HttpClient.impl.ts:31](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/HttpClient/HttpClient.impl.ts#L31)

___

### config

• **config**: { [K in string \| number \| symbol]: (Object & CustomConfig)[K] }

#### Defined in

[HttpClient/HttpClient.impl.ts:27](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/HttpClient/HttpClient.impl.ts#L27)

___

### logger

• **logger**: [`Logger`](purista_core.Logger.md)

#### Defined in

[HttpClient/HttpClient.impl.ts:26](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/HttpClient/HttpClient.impl.ts#L26)

___

### name

• **name**: `string` = `'HttpClient'`

#### Defined in

[HttpClient/HttpClient.impl.ts:25](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/HttpClient/HttpClient.impl.ts#L25)

___

### spanProcessor

• **spanProcessor**: `undefined` \| `SpanProcessor`

#### Defined in

[HttpClient/HttpClient.impl.ts:33](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/HttpClient/HttpClient.impl.ts#L33)

___

### timeout

• **timeout**: `number`

#### Defined in

[HttpClient/HttpClient.impl.ts:29](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/HttpClient/HttpClient.impl.ts#L29)

___

### traceProvider

• **traceProvider**: `NodeTracerProvider`

#### Defined in

[HttpClient/HttpClient.impl.ts:34](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/HttpClient/HttpClient.impl.ts#L34)

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
| `options?` | [`HttpClientRequestOptions`](../modules/purista_core.md#httpclientrequestoptions) |
| `payload?` | `unknown` |

#### Returns

`Promise`<`T`\>

#### Implementation of

[RestClient](../interfaces/purista_core.RestClient.md).[delete](../interfaces/purista_core.RestClient.md#delete)

#### Defined in

[HttpClient/HttpClient.impl.ts:314](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/HttpClient/HttpClient.impl.ts#L314)

___

### execute

▸ `Private` **execute**(`method`, `path`, `options?`, `payload?`): `Promise`<`any`\>

Helper method

**`Throws`**

UnhandledError

#### Parameters

| Name | Type |
| :------ | :------ |
| `method` | `string` |
| `path` | `string` |
| `options?` | [`HttpClientRequestOptions`](../modules/purista_core.md#httpclientrequestoptions) |
| `payload?` | `unknown` |

#### Returns

`Promise`<`any`\>

#### Defined in

[HttpClient/HttpClient.impl.ts:179](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/HttpClient/HttpClient.impl.ts#L179)

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
| `options?` | [`HttpClientRequestOptions`](../modules/purista_core.md#httpclientrequestoptions) |

#### Returns

`Promise`<`T`\>

#### Implementation of

[RestClient](../interfaces/purista_core.RestClient.md).[get](../interfaces/purista_core.RestClient.md#get)

#### Defined in

[HttpClient/HttpClient.impl.ts:274](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/HttpClient/HttpClient.impl.ts#L274)

___

### getTracer

▸ **getTracer**(): `Tracer`

Returns open telemetry tracer of this service

#### Returns

`Tracer`

Tracer

#### Defined in

[HttpClient/HttpClient.impl.ts:80](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/HttpClient/HttpClient.impl.ts#L80)

___

### getUrlAndHeader

▸ `Private` **getUrlAndHeader**(`path`, `options?`): `Object`

#### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `string` |
| `options?` | [`HttpClientRequestOptions`](../modules/purista_core.md#httpclientrequestoptions) |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `headers` | `Record`<`string`, `string`\> |
| `url` | `URL` |

#### Defined in

[HttpClient/HttpClient.impl.ts:127](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/HttpClient/HttpClient.impl.ts#L127)

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
| `options?` | [`HttpClientRequestOptions`](../modules/purista_core.md#httpclientrequestoptions) |

#### Returns

`Promise`<`T`\>

#### Implementation of

[RestClient](../interfaces/purista_core.RestClient.md).[patch](../interfaces/purista_core.RestClient.md#patch)

#### Defined in

[HttpClient/HttpClient.impl.ts:304](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/HttpClient/HttpClient.impl.ts#L304)

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
| `options?` | [`HttpClientRequestOptions`](../modules/purista_core.md#httpclientrequestoptions) |

#### Returns

`Promise`<`T`\>

#### Implementation of

[RestClient](../interfaces/purista_core.RestClient.md).[post](../interfaces/purista_core.RestClient.md#post)

#### Defined in

[HttpClient/HttpClient.impl.ts:284](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/HttpClient/HttpClient.impl.ts#L284)

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
| `options?` | [`HttpClientRequestOptions`](../modules/purista_core.md#httpclientrequestoptions) |

#### Returns

`Promise`<`T`\>

#### Implementation of

[RestClient](../interfaces/purista_core.RestClient.md).[put](../interfaces/purista_core.RestClient.md#put)

#### Defined in

[HttpClient/HttpClient.impl.ts:294](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/HttpClient/HttpClient.impl.ts#L294)

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

[HttpClient/HttpClient.impl.ts:166](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/HttpClient/HttpClient.impl.ts#L166)

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

#### Defined in

[HttpClient/HttpClient.impl.ts:92](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/HttpClient/HttpClient.impl.ts#L92)
