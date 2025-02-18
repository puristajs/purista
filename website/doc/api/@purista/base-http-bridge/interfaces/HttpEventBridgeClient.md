[**@purista/base-http-bridge v1.11.0**](../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/base-http-bridge](../README.md) / HttpEventBridgeClient

# Interface: HttpEventBridgeClient

Defined in: [base-http-bridge/src/HttpEventBridge/types/HttpEventBridgeClient.ts:7](https://github.com/puristajs/purista/blob/master/packages/base-http-bridge/src/HttpEventBridge/types/HttpEventBridgeClient.ts#L7)

The HttpEventBridgeClient connects the HTTPEventBridge with the sidecar service.
This client is responsible for the communication to the sidecar service.

## Properties

### getApiPathForCommand()

> **getApiPathForCommand**: (`addess`, `metadata`) => `string`

Defined in: [base-http-bridge/src/HttpEventBridge/types/HttpEventBridgeClient.ts:22](https://github.com/puristajs/purista/blob/master/packages/base-http-bridge/src/HttpEventBridge/types/HttpEventBridgeClient.ts#L22)

Generate the url path of the command based on the command builder `exposeAsHttpEndpoint` settings.
This url is a POST endpoint and expects the payload and parameter as defined for exposing.

#### Parameters

##### addess

[`EBMessageAddress`](../../core/type-aliases/EBMessageAddress.md)

##### metadata

###### expose

`object` & `object`

#### Returns

`string`

url path of endpoint

***

### getInternalPathForCommand()

> **getInternalPathForCommand**: (`address`) => `string`

Defined in: [base-http-bridge/src/HttpEventBridge/types/HttpEventBridgeClient.ts:14](https://github.com/puristajs/purista/blob/master/packages/base-http-bridge/src/HttpEventBridge/types/HttpEventBridgeClient.ts#L14)

Generate the url path of the command.
This url is a POST endpoint and expects a command message as payload

#### Parameters

##### address

[`EBMessageAddress`](../../core/type-aliases/EBMessageAddress.md)

#### Returns

`string`

url path of endpoint

***

### getInternalPathForSubscription()

> **getInternalPathForSubscription**: (`address`) => `string`

Defined in: [base-http-bridge/src/HttpEventBridge/types/HttpEventBridgeClient.ts:31](https://github.com/puristajs/purista/blob/master/packages/base-http-bridge/src/HttpEventBridge/types/HttpEventBridgeClient.ts#L31)

Generate the url path of the subscription.
This url is a POST endpoint.
The expected payload is a EBMessage or an CloudEvent with an EBMessage as data depending on config settings

#### Parameters

##### address

[`EBMessageAddress`](../../core/type-aliases/EBMessageAddress.md)

#### Returns

`string`

url path of endpoint

***

### invoke()

> **invoke**: (`command`, `headers`?, `timeout`?) => `Promise`\<[`CommandResponse`](../../core/type-aliases/CommandResponse.md)\>

Defined in: [base-http-bridge/src/HttpEventBridge/types/HttpEventBridgeClient.ts:40](https://github.com/puristajs/purista/blob/master/packages/base-http-bridge/src/HttpEventBridge/types/HttpEventBridgeClient.ts#L40)

Invoke a command

#### Parameters

##### command

Command

###### contentEncoding

`string`

content encoding of message payload

###### contentType

`string`

content type of message payload

###### correlationId

`string`

correlation id to know which command response referrs to which command

###### eventName?

`string`

event name for this message

###### id

`string`

global unique id of message

###### messageType

[`Command`](../../core/enumerations/EBMessageType.md#command)

###### otp?

`string`

stringified Opentelemetry parent trace id

###### payload

\{ `parameter`: `unknown`; `payload`: `unknown`; \}

###### payload.parameter

`unknown`

###### payload.payload

`unknown`

###### principalId?

`string`

principal id

###### receiver

[`EBMessageAddress`](../../core/type-aliases/EBMessageAddress.md)

###### sender

\{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}

###### sender.instanceId

`string`

instance id of eventbridge

###### sender.serviceName

`string`

the name of the service

###### sender.serviceTarget

`string`

the name of the command or subscription

###### sender.serviceVersion

`string`

the version of the service

###### tenantId?

`string`

principal id

###### timestamp

`number`

timestamp of message creation time

###### traceId?

`string`

trace id of message

##### headers?

`Record`\<`string`, `string`\>

optional HTTP header

##### timeout?

`number`

the command timeout

#### Returns

`Promise`\<[`CommandResponse`](../../core/type-aliases/CommandResponse.md)\>

***

### isSidecarAvailable()

> **isSidecarAvailable**: () => `Promise`\<`boolean`\>

Defined in: [base-http-bridge/src/HttpEventBridge/types/HttpEventBridgeClient.ts:54](https://github.com/puristajs/purista/blob/master/packages/base-http-bridge/src/HttpEventBridge/types/HttpEventBridgeClient.ts#L54)

Checks if the sidecar container is available to be able to send events and invoke commands

#### Returns

`Promise`\<`boolean`\>

boolean

***

### sendEvent()

> **sendEvent**: (`message`, `headers`?) => `Promise`\<`void`\>

Defined in: [base-http-bridge/src/HttpEventBridge/types/HttpEventBridgeClient.ts:48](https://github.com/puristajs/purista/blob/master/packages/base-http-bridge/src/HttpEventBridge/types/HttpEventBridgeClient.ts#L48)

Send a EBMessage as event to the underlaying message infrastructure.

#### Parameters

##### message

[`EBMessage`](../../core/type-aliases/EBMessage.md)

##### headers?

`Record`\<`string`, `string`\>

#### Returns

`Promise`\<`void`\>
