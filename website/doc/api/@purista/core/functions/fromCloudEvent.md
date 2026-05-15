[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / fromCloudEvent

# Function: fromCloudEvent()

> **fromCloudEvent**\<`Payload`\>(`cloudEvent`, `options`): `object`

Defined in: [helper/enterpriseInterop.ts:456](https://github.com/puristajs/purista/blob/master/packages/core/src/helper/enterpriseInterop.ts#L456)

Convert a CloudEvents 1.0 object into a PURISTA custom event message.

Strict mode requires PURISTA sender extension metadata. Compat mode accepts
external CloudEvents and derives explicit external sender defaults.

## Type Parameters

### Payload

`Payload` = `unknown`

## Parameters

### cloudEvent

`JsonRecord` \| [`CloudEvent`](../type-aliases/CloudEvent.md)

### options

[`FromCloudEventOptions`](../type-aliases/FromCloudEventOptions.md)

## Returns

### contentEncoding

> **contentEncoding**: `string`

content encoding of message payload

### contentType

> **contentType**: `string`

content type of message payload

### correlationId?

> `optional` **correlationId?**: `string`

correlation id to know which command response referrs to which command

### eventName

> **eventName**: `string`

event name for this message

### id

> **id**: `string`

global unique id of message

### messageType

> **messageType**: [`CustomMessage`](../enumerations/EBMessageType.md#custommessage)

Message type musst be EBMessageType.CustomMessage

### otp?

> `optional` **otp?**: `string`

stringified Opentelemetry parent trace id

### payload?

> `optional` **payload?**: `Payload`

the message payload

### principalId?

> `optional` **principalId?**: `string`

principal id

### receiver?

> `optional` **receiver?**: [`EBMessageAddress`](../type-aliases/EBMessageAddress.md)

an optional receiver

### sender

> **sender**: `object`

#### sender.instanceId

> **instanceId**: `string`

instance id of eventbridge

#### sender.serviceName

> **serviceName**: `string`

the name of the service

#### sender.serviceTarget

> **serviceTarget**: `string`

the name of the command or subscription

#### sender.serviceVersion

> **serviceVersion**: `string`

the version of the service

### tenantId?

> `optional` **tenantId?**: `string`

principal id

### timestamp

> **timestamp**: `number`

timestamp of message creation time

### traceId?

> `optional` **traceId?**: `string`

trace id of message
