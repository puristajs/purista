[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / EBMessageBase

# Type Alias: EBMessageBase

> **EBMessageBase** = `object`

Defined in: [core/types/EBMessageBase.ts:12](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/EBMessageBase.ts#L12)

Default fields which are part of any purista message

## Properties

### contentEncoding

> **contentEncoding**: `string`

Defined in: [core/types/EBMessageBase.ts:20](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/EBMessageBase.ts#L20)

content encoding of message payload

***

### contentType

> **contentType**: [`ContentType`](ContentType.md)

Defined in: [core/types/EBMessageBase.ts:18](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/EBMessageBase.ts#L18)

content type of message payload

***

### correlationId?

> `optional` **correlationId?**: [`CorrelationId`](CorrelationId.md)

Defined in: [core/types/EBMessageBase.ts:24](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/EBMessageBase.ts#L24)

correlation id to know which command response referrs to which command

***

### eventName?

> `optional` **eventName?**: `string`

Defined in: [core/types/EBMessageBase.ts:30](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/EBMessageBase.ts#L30)

event name for this message

***

### id

> **id**: [`EBMessageId`](EBMessageId.md)

Defined in: [core/types/EBMessageBase.ts:14](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/EBMessageBase.ts#L14)

global unique id of message

***

### otp?

> `optional` **otp?**: `string`

Defined in: [core/types/EBMessageBase.ts:32](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/EBMessageBase.ts#L32)

stringified Opentelemetry parent trace id

***

### principalId?

> `optional` **principalId?**: [`PrincipalId`](PrincipalId.md)

Defined in: [core/types/EBMessageBase.ts:26](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/EBMessageBase.ts#L26)

principal id

***

### sender

> **sender**: [`EBMessageSenderAddress`](EBMessageSenderAddress.md)

Defined in: [core/types/EBMessageBase.ts:33](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/EBMessageBase.ts#L33)

***

### tenantId?

> `optional` **tenantId?**: [`TenantId`](TenantId.md)

Defined in: [core/types/EBMessageBase.ts:28](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/EBMessageBase.ts#L28)

principal id

***

### timestamp

> **timestamp**: `number`

Defined in: [core/types/EBMessageBase.ts:16](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/EBMessageBase.ts#L16)

timestamp of message creation time

***

### traceId?

> `optional` **traceId?**: [`TraceId`](TraceId.md)

Defined in: [core/types/EBMessageBase.ts:22](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/EBMessageBase.ts#L22)

trace id of message
