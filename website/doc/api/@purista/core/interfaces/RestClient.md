[**@purista/core v2.0.0**](../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / RestClient

# Interface: RestClient

Defined in: [packages/core/src/HttpClient/types/RestClient.ts:7](https://github.com/puristajs/purista/blob/master/packages/core/src/HttpClient/types/RestClient.ts#L7)

A REST API client which will provide GET, POST, PUT, PATCH, DELETE methods
The client provides error and timeout handling and tries to decode the responses

## Methods

### delete()

> **delete**\<`T`\>(`path`, `options`): `Promise`\<`T`\>

Defined in: [packages/core/src/HttpClient/types/RestClient.ts:60](https://github.com/puristajs/purista/blob/master/packages/core/src/HttpClient/types/RestClient.ts#L60)

Make a DELETE request against baseUrl+path
Returns body text if response content type is not set to `application/json`.
If response content type is `application/json`, the JSON parsed result will be returned

#### Type Parameters

• **T**

#### Parameters

##### path

`string`

##### options

[`HttpClientRequestOptions`](../type-aliases/HttpClientRequestOptions.md)

#### Returns

`Promise`\<`T`\>

***

### get()

> **get**\<`T`\>(`path`, `options`): `Promise`\<`T`\>

Defined in: [packages/core/src/HttpClient/types/RestClient.ts:21](https://github.com/puristajs/purista/blob/master/packages/core/src/HttpClient/types/RestClient.ts#L21)

Make a GET request against baseUrl+path
Returns body text if response content type is not set to `application/json`.
If response content type is `application/json`, the JSON parsed result will be returned

#### Type Parameters

• **T**

#### Parameters

##### path

`string`

##### options

[`HttpClientRequestOptions`](../type-aliases/HttpClientRequestOptions.md)

#### Returns

`Promise`\<`T`\>

***

### patch()

> **patch**\<`T`\>(`path`, `payload`, `options`): `Promise`\<`T`\>

Defined in: [packages/core/src/HttpClient/types/RestClient.ts:51](https://github.com/puristajs/purista/blob/master/packages/core/src/HttpClient/types/RestClient.ts#L51)

Make a PATCH request against baseUrl+path
Returns body text if response content type is not set to `application/json`.
If response content type is `application/json`, the JSON parsed result will be returned

#### Type Parameters

• **T**

#### Parameters

##### path

`string`

##### payload

`unknown`

##### options

[`HttpClientRequestOptions`](../type-aliases/HttpClientRequestOptions.md)

#### Returns

`Promise`\<`T`\>

***

### post()

> **post**\<`T`\>(`path`, `payload`, `options`): `Promise`\<`T`\>

Defined in: [packages/core/src/HttpClient/types/RestClient.ts:31](https://github.com/puristajs/purista/blob/master/packages/core/src/HttpClient/types/RestClient.ts#L31)

Make a POST request against baseUrl+path
Returns body text if response content type is not set to `application/json`.
If response content type is `application/json`, the JSON parsed result will be returned

#### Type Parameters

• **T**

#### Parameters

##### path

`string`

##### payload

`unknown`

##### options

[`HttpClientRequestOptions`](../type-aliases/HttpClientRequestOptions.md)

#### Returns

`Promise`\<`T`\>

***

### put()

> **put**\<`T`\>(`path`, `payload`, `options`): `Promise`\<`T`\>

Defined in: [packages/core/src/HttpClient/types/RestClient.ts:41](https://github.com/puristajs/purista/blob/master/packages/core/src/HttpClient/types/RestClient.ts#L41)

Make a PUT request against baseUrl+path
Returns body text if response content type is not set to `application/json`.
If response content type is `application/json`, the JSON parsed result will be returned

#### Type Parameters

• **T**

#### Parameters

##### path

`string`

##### payload

`unknown`

##### options

[`HttpClientRequestOptions`](../type-aliases/HttpClientRequestOptions.md)

#### Returns

`Promise`\<`T`\>

***

### setBearerToken()

> **setBearerToken**(`token`): `void`

Defined in: [packages/core/src/HttpClient/types/RestClient.ts:12](https://github.com/puristajs/purista/blob/master/packages/core/src/HttpClient/types/RestClient.ts#L12)

Set the Auth-Bearer-Token for all following requests

#### Parameters

##### token

the bearer token

`undefined` | `string`

#### Returns

`void`
