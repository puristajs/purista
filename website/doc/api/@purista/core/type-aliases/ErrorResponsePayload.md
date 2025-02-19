[**@purista/core v2.0.0**](../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / ErrorResponsePayload

# Type Alias: ErrorResponsePayload

> **ErrorResponsePayload**: `object`

Defined in: [packages/core/src/core/types/ErrorResponsePayload.ts:7](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ErrorResponsePayload.ts#L7)

Error message payload

## Type declaration

### data?

> `optional` **data**: `unknown`

addition data

### message

> **message**: `string`

a human readable error message

### status

> **status**: [`StatusCode`](../enumerations/StatusCode.md)

the error status code

### traceId?

> `optional` **traceId**: [`TraceId`](TraceId.md)

the trace if of the request
