[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / exportAsyncApi

# Function: exportAsyncApi()

> **exportAsyncApi**(`options`): `Promise`\<\{ `asyncapi`: `string`; `channels`: [`JsonRecord`](../type-aliases/JsonRecord.md); `components`: \{ `messages`: [`JsonRecord`](../type-aliases/JsonRecord.md); `schemas`: \{ `PuristaHeaders`: \{ `properties`: \{ `contentEncoding`: \{ `type`: `string`; \}; `contentType`: \{ `type`: `string`; \}; `correlationId`: \{ `type`: `string`; \}; `messageId`: \{ `type`: `string`; \}; `principalId`: \{ `type`: `string`; \}; `tenantId`: \{ `type`: `string`; \}; `timestamp`: \{ `type`: `string`; \}; `traceId`: \{ `type`: `string`; \}; \}; `type`: `string`; \}; \}; \}; `defaultContentType`: `string`; `info`: \{ `title`: `string`; `version`: `string`; \}; `operations`: [`JsonRecord`](../type-aliases/JsonRecord.md); `x-purista`: \{ `version`: `string`; \}; \}\>

Defined in: [helper/enterpriseInterop.ts:232](https://github.com/puristajs/purista/blob/master/packages/core/src/helper/enterpriseInterop.ts#L232)

Export service definitions as a provider-neutral AsyncAPI 3 document.

The helper only reads PURISTA definitions and never starts services, brokers,
HTTP servers, or cloud adapters.

## Parameters

### options

[`ExportAsyncApiOptions`](../type-aliases/ExportAsyncApiOptions.md)

## Returns

`Promise`\<\{ `asyncapi`: `string`; `channels`: [`JsonRecord`](../type-aliases/JsonRecord.md); `components`: \{ `messages`: [`JsonRecord`](../type-aliases/JsonRecord.md); `schemas`: \{ `PuristaHeaders`: \{ `properties`: \{ `contentEncoding`: \{ `type`: `string`; \}; `contentType`: \{ `type`: `string`; \}; `correlationId`: \{ `type`: `string`; \}; `messageId`: \{ `type`: `string`; \}; `principalId`: \{ `type`: `string`; \}; `tenantId`: \{ `type`: `string`; \}; `timestamp`: \{ `type`: `string`; \}; `traceId`: \{ `type`: `string`; \}; \}; `type`: `string`; \}; \}; \}; `defaultContentType`: `string`; `info`: \{ `title`: `string`; `version`: `string`; \}; `operations`: [`JsonRecord`](../type-aliases/JsonRecord.md); `x-purista`: \{ `version`: `string`; \}; \}\>

## Example

```ts
const document = await exportAsyncApi({
  title: 'Billing contracts',
  version: '1.0.0',
  services: exportedDefinitions,
})
```
