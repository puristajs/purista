[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / StreamDefinitionMetadataBase

# Type Alias: StreamDefinitionMetadataBase

> **StreamDefinitionMetadataBase** = `object`

Defined in: [core/types/stream/StreamDefinitionMetadataBase.ts:7](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/stream/StreamDefinitionMetadataBase.ts#L7)

## Properties

### expose

> **expose**: `object`

Defined in: [core/types/stream/StreamDefinitionMetadataBase.ts:8](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/stream/StreamDefinitionMetadataBase.ts#L8)

#### chunkPayload?

> `optional` **chunkPayload?**: `SchemaObject`

#### contentEncodingRequest?

> `optional` **contentEncodingRequest?**: `string`

#### contentEncodingResponse?

> `optional` **contentEncodingResponse?**: `string`

#### contentTypeRequest?

> `optional` **contentTypeRequest?**: [`ContentType`](ContentType.md)

#### contentTypeResponse?

> `optional` **contentTypeResponse?**: `"text/event-stream"` \| `"application/json"`

#### deprecated?

> `optional` **deprecated?**: `boolean`

#### finalPayload?

> `optional` **finalPayload?**: `SchemaObject`

#### http?

> `optional` **http?**: `object`

##### http.method

> **method**: [`SupportedHttpMethod`](SupportedHttpMethod.md)

##### http.openApi?

> `optional` **openApi?**: `object`

##### http.openApi.additionalStatusCodes?

> `optional` **additionalStatusCodes?**: [`StatusCode`](../enumerations/StatusCode.md)[]

##### http.openApi.description

> **description**: `string`

##### http.openApi.isSecure

> **isSecure**: `boolean`

##### http.openApi.operationId?

> `optional` **operationId?**: `string`

##### http.openApi.query?

> `optional` **query?**: [`QueryParameter`](QueryParameter.md)\<`Record`\<`string`, `unknown`\>\>[]

##### http.openApi.summary

> **summary**: `string`

##### http.openApi.tags?

> `optional` **tags?**: `string`[]

##### http.path

> **path**: `string`

##### http.stream?

> `optional` **stream?**: `object`

##### http.stream.documentationUrl?

> `optional` **documentationUrl?**: `string`

##### http.stream.mode?

> `optional` **mode?**: `"stream"` \| `"aggregate"`

##### http.stream.protocol

> **protocol**: `string`

#### inputPayload?

> `optional` **inputPayload?**: `SchemaObject`

#### parameter?

> `optional` **parameter?**: `SchemaObject`
