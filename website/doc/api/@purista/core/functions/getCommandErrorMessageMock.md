[**@purista/core v2.0.0**](../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / getCommandErrorMessageMock

# Function: getCommandErrorMessageMock()

> **getCommandErrorMessageMock**(`error`?, `input`?, `commandMessage`?): `Readonly`\<\{ `contentEncoding`: `"utf-8"`; `contentType`: `"application/json"`; `correlationId`: `string`; `eventName`: `string`; `id`: `string`; `isHandledError`: `boolean`; `messageType`: [`CommandErrorResponse`](../enumerations/EBMessageType.md#commanderrorresponse); `otp`: `string`; `payload`: \{ `data`: `unknown`; `message`: `string`; `status`: [`StatusCode`](../enumerations/StatusCode.md); \}; `principalId`: `string`; `receiver`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `sender`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `tenantId`: `string`; `timestamp`: `number`; `traceId`: `string`; \}\>

Defined in: [packages/core/src/mocks/messages/getCommandErrorMessage.mock.ts:16](https://github.com/puristajs/purista/blob/master/packages/core/src/mocks/messages/getCommandErrorMessage.mock.ts#L16)

A function that returns a mocked command error response message

## Parameters

### error?

[`UnhandledError`](../classes/UnhandledError.md) | [`HandledError`](../classes/HandledError.md)

### input?

`Partial`\<\{ `contentEncoding`: `"utf-8"`; `contentType`: `"application/json"`; `correlationId`: `string`; `eventName`: `string`; `id`: `string`; `isHandledError`: `boolean`; `messageType`: [`CommandErrorResponse`](../enumerations/EBMessageType.md#commanderrorresponse); `otp`: `string`; `payload`: \{ `data`: `unknown`; `message`: `string`; `status`: [`StatusCode`](../enumerations/StatusCode.md); \}; `principalId`: `string`; `receiver`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `sender`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `tenantId`: `string`; `timestamp`: `number`; `traceId`: `string`; \}\>

### commandMessage?

#### contentEncoding

`string`

content encoding of message payload

#### contentType

`string`

content type of message payload

#### correlationId

`string`

correlation id to know which command response referrs to which command

#### eventName?

`string`

event name for this message

#### id

`string`

global unique id of message

#### messageType

[`Command`](../enumerations/EBMessageType.md#command)

#### otp?

`string`

stringified Opentelemetry parent trace id

#### payload

\{ `parameter`: `unknown`; `payload`: `unknown`; \}

#### payload.parameter

`unknown`

#### payload.payload

`unknown`

#### principalId?

`string`

principal id

#### receiver

[`EBMessageAddress`](../type-aliases/EBMessageAddress.md)

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

`Readonly`\<\{ `contentEncoding`: `"utf-8"`; `contentType`: `"application/json"`; `correlationId`: `string`; `eventName`: `string`; `id`: `string`; `isHandledError`: `boolean`; `messageType`: [`CommandErrorResponse`](../enumerations/EBMessageType.md#commanderrorresponse); `otp`: `string`; `payload`: \{ `data`: `unknown`; `message`: `string`; `status`: [`StatusCode`](../enumerations/StatusCode.md); \}; `principalId`: `string`; `receiver`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `sender`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `tenantId`: `string`; `timestamp`: `number`; `traceId`: `string`; \}\>
