[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/hono-http-server](../README.md) / collectAggregateStreamResult

# Function: collectAggregateStreamResult()

> **collectAggregateStreamResult**(`handle`): `Promise`\<\{ `payload`: `object` & `object`; `status`: `"error"`; `statusCode`: [`StatusCode`](../../core/enumerations/StatusCode.md) \| `ContentfulStatusCode`; \} \| \{ `payload`: \{ \} \| `null`; `status`: `"success"`; `statusCode`: `ContentfulStatusCode`; \}\>

Defined in: [hono-http-server/src/helper/streamTransport.ts:62](https://github.com/puristajs/purista/blob/master/packages/hono-http-server/src/helper/streamTransport.ts#L62)

## Parameters

### handle

[`StreamHandle`](../../core/interfaces/StreamHandle.md)

## Returns

`Promise`\<\{ `payload`: `object` & `object`; `status`: `"error"`; `statusCode`: [`StatusCode`](../../core/enumerations/StatusCode.md) \| `ContentfulStatusCode`; \} \| \{ `payload`: \{ \} \| `null`; `status`: `"success"`; `statusCode`: `ContentfulStatusCode`; \}\>
