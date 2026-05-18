[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / toCloudEvent

# Function: toCloudEvent()

> **toCloudEvent**\<`Payload`\>(`message`): [`CloudEvent`](../type-aliases/CloudEvent.md)

Defined in: [helper/enterpriseInterop.ts:769](https://github.com/puristajs/purista/blob/master/packages/core/src/helper/enterpriseInterop.ts#L769)

Convert a PURISTA custom event message to a CloudEvents 1.0 structured object.

## Type Parameters

### Payload

`Payload`

## Parameters

### message

#### contentEncoding

`string`

content encoding of message payload

#### contentType

`string`

content type of message payload

#### correlationId?

`string`

correlation id to know which command response referrs to which command

#### eventName

`string`

event name for this message

#### id

`string`

global unique id of message

#### messageType

[`CustomMessage`](../enumerations/EBMessageType.md#custommessage)

Message type musst be EBMessageType.CustomMessage

#### otp?

`string`

stringified Opentelemetry parent trace id

#### payload?

`Payload`

the message payload

#### principalId?

`string`

principal id

#### receiver?

[`EBMessageAddress`](../type-aliases/EBMessageAddress.md)

an optional receiver

#### sender

\{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}

#### sender.instanceId

`string`

instance id of eventbridge

#### sender.serviceName

`string`

the name of the service

#### sender.serviceTarget

`string`

the name of the command or subscription

#### sender.serviceVersion

`string`

the version of the service

#### tenantId?

`string`

principal id

#### timestamp

`number`

timestamp of message creation time

#### traceId?

`string`

trace id of message

## Returns

[`CloudEvent`](../type-aliases/CloudEvent.md)

## Example

```ts
const event = toCloudEvent(puristaMessage)
```
