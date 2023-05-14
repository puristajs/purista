[PURISTA API](../README.md) / [Modules](../modules.md) / [@purista/core](../modules/purista_core.md) / RestClient

# Interface: RestClient

[@purista/core](../modules/purista_core.md).RestClient

A REST API client which will provide GET, POST, PUT, PATCH, DELETE methods
The client provides error and timeout handling and tries to decode the responses

## Implemented by

- [`HttpClient`](../classes/purista_core.HttpClient.md)
- [`HttpClient`](../classes/purista_core.HttpClient.md)

## Table of contents

### Methods

- [delete](purista_core.RestClient.md#delete)
- [get](purista_core.RestClient.md#get)
- [patch](purista_core.RestClient.md#patch)
- [post](purista_core.RestClient.md#post)
- [put](purista_core.RestClient.md#put)
- [setBearerToken](purista_core.RestClient.md#setbearertoken)

## Methods

### delete

▸ **delete**<`T`\>(`path`, `options`): `Promise`<`T`\>

Make a DELETE request against baseUrl+path
Returns body text if response content type is not set to `application/json`.
If response content type is `application/json`, the JSON parsed result will be returned

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `string` |
| `options` | [`HttpClientRequestOptions`](../modules/purista_core.md#httpclientrequestoptions) |

#### Returns

`Promise`<`T`\>

#### Defined in

[HttpClient/types/RestClient.ts:60](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/HttpClient/types/RestClient.ts#L60)

___

### get

▸ **get**<`T`\>(`path`, `options`): `Promise`<`T`\>

Make a GET request against baseUrl+path
Returns body text if response content type is not set to `application/json`.
If response content type is `application/json`, the JSON parsed result will be returned

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `string` |
| `options` | [`HttpClientRequestOptions`](../modules/purista_core.md#httpclientrequestoptions) |

#### Returns

`Promise`<`T`\>

#### Defined in

[HttpClient/types/RestClient.ts:21](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/HttpClient/types/RestClient.ts#L21)

___

### patch

▸ **patch**<`T`\>(`path`, `payload`, `options`): `Promise`<`T`\>

Make a PATCH request against baseUrl+path
Returns body text if response content type is not set to `application/json`.
If response content type is `application/json`, the JSON parsed result will be returned

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `string` |
| `payload` | `unknown` |
| `options` | [`HttpClientRequestOptions`](../modules/purista_core.md#httpclientrequestoptions) |

#### Returns

`Promise`<`T`\>

#### Defined in

[HttpClient/types/RestClient.ts:51](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/HttpClient/types/RestClient.ts#L51)

___

### post

▸ **post**<`T`\>(`path`, `payload`, `options`): `Promise`<`T`\>

Make a POST request against baseUrl+path
Returns body text if response content type is not set to `application/json`.
If response content type is `application/json`, the JSON parsed result will be returned

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `string` |
| `payload` | `unknown` |
| `options` | [`HttpClientRequestOptions`](../modules/purista_core.md#httpclientrequestoptions) |

#### Returns

`Promise`<`T`\>

#### Defined in

[HttpClient/types/RestClient.ts:31](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/HttpClient/types/RestClient.ts#L31)

___

### put

▸ **put**<`T`\>(`path`, `payload`, `options`): `Promise`<`T`\>

Make a PUT request against baseUrl+path
Returns body text if response content type is not set to `application/json`.
If response content type is `application/json`, the JSON parsed result will be returned

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `string` |
| `payload` | `unknown` |
| `options` | [`HttpClientRequestOptions`](../modules/purista_core.md#httpclientrequestoptions) |

#### Returns

`Promise`<`T`\>

#### Defined in

[HttpClient/types/RestClient.ts:41](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/HttpClient/types/RestClient.ts#L41)

___

### setBearerToken

▸ **setBearerToken**(`token`): `void`

Set the Auth-Bearer-Token for all following requests

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `token` | `undefined` \| `string` | the bearer token |

#### Returns

`void`

#### Defined in

[HttpClient/types/RestClient.ts:12](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/HttpClient/types/RestClient.ts#L12)
