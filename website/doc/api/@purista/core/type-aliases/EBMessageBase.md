[**@purista/core v1.11.0**](../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / EBMessageBase

# Type Alias: EBMessageBase

> **EBMessageBase**: `object`

Defined in: [packages/core/src/core/types/EBMessageBase.ts:12](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/EBMessageBase.ts#L12)

Default fields which are part of any purista message

## Type declaration

### contentEncoding

> **contentEncoding**: `string`

content encoding of message payload

### contentType

> **contentType**: [`ContentType`](ContentType.md)

content type of message payload

### correlationId?

> `optional` **correlationId**: [`CorrelationId`](CorrelationId.md)

correlation id to know which command response referrs to which command

### eventName?

> `optional` **eventName**: `string`

event name for this message

### id

> **id**: [`EBMessageId`](EBMessageId.md)

global unique id of message

### otp?

> `optional` **otp**: `string`

stringified Opentelemetry parent trace id

### principalId?

> `optional` **principalId**: [`PrincipalId`](PrincipalId.md)

principal id

### sender

> **sender**: [`EBMessageSenderAddress`](EBMessageSenderAddress.md)

### tenantId?

> `optional` **tenantId**: [`TenantId`](TenantId.md)

principal id

### timestamp

> **timestamp**: `number`

timestamp of message creation time

### traceId?

> `optional` **traceId**: [`TraceId`](TraceId.md)

trace id of message
