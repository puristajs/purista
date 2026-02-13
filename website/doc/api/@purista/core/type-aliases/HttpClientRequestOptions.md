[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / HttpClientRequestOptions

# Type Alias: HttpClientRequestOptions

> **HttpClientRequestOptions** = `object`

Defined in: [HttpClient/types/HttpClientRequestOptions.ts:4](https://github.com/puristajs/purista/blob/master/packages/core/src/HttpClient/types/HttpClientRequestOptions.ts#L4)

Options for a single request

## Properties

### hash?

> `optional` **hash**: `string`

Defined in: [HttpClient/types/HttpClientRequestOptions.ts:17](https://github.com/puristajs/purista/blob/master/packages/core/src/HttpClient/types/HttpClientRequestOptions.ts#L17)

url hash
@example: http://example.com/index.html#hash

***

### headers?

> `optional` **headers**: `Record`\<`string`, `string`\>

Defined in: [HttpClient/types/HttpClientRequestOptions.ts:8](https://github.com/puristajs/purista/blob/master/packages/core/src/HttpClient/types/HttpClientRequestOptions.ts#L8)

additional headers

***

### query?

> `optional` **query**: `Record`\<`string`, `string`\>

Defined in: [HttpClient/types/HttpClientRequestOptions.ts:12](https://github.com/puristajs/purista/blob/master/packages/core/src/HttpClient/types/HttpClientRequestOptions.ts#L12)

query/search string parameter

***

### timeout?

> `optional` **timeout**: `number`

Defined in: [HttpClient/types/HttpClientRequestOptions.ts:22](https://github.com/puristajs/purista/blob/master/packages/core/src/HttpClient/types/HttpClientRequestOptions.ts#L22)

Timeout for the request in ms

#### Default

```ts
30000
```
