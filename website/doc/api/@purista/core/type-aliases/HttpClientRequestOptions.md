[**@purista/core v2.0.5**](../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / HttpClientRequestOptions

# Type Alias: HttpClientRequestOptions

> **HttpClientRequestOptions**: `object`

Defined in: [packages/core/src/HttpClient/types/HttpClientRequestOptions.ts:4](https://github.com/puristajs/purista/blob/master/packages/core/src/HttpClient/types/HttpClientRequestOptions.ts#L4)

Options for a single request

## Type declaration

### hash?

> `optional` **hash**: `string`

url hash
@example: http://example.com/index.html#hash

### headers?

> `optional` **headers**: `Record`\<`string`, `string`\>

additional headers

### query?

> `optional` **query**: `Record`\<`string`, `string`\>

query/search string parameter

### timeout?

> `optional` **timeout**: `number`

Timeout for the request in ms

#### Default

```ts
30000
```
