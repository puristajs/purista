[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / ErrorResponsePayload

# Type Alias: ErrorResponsePayload

> **ErrorResponsePayload** = `object`

Defined in: [core/types/ErrorResponsePayload.ts:7](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ErrorResponsePayload.ts#L7)

Error message payload

## Properties

### data?

> `optional` **data?**: `unknown`

Defined in: [core/types/ErrorResponsePayload.ts:15](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ErrorResponsePayload.ts#L15)

addition data

***

### message

> **message**: `string`

Defined in: [core/types/ErrorResponsePayload.ts:11](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ErrorResponsePayload.ts#L11)

a human readable error message

***

### status

> **status**: [`StatusCode`](../enumerations/StatusCode.md)

Defined in: [core/types/ErrorResponsePayload.ts:9](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ErrorResponsePayload.ts#L9)

the error status code

***

### traceId?

> `optional` **traceId?**: [`TraceId`](TraceId.md)

Defined in: [core/types/ErrorResponsePayload.ts:13](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ErrorResponsePayload.ts#L13)

the trace if of the request
