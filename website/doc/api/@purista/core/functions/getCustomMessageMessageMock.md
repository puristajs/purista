[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / getCustomMessageMessageMock

# Function: getCustomMessageMessageMock()

> **getCustomMessageMessageMock**\<`PayloadType`\>(`eventName`, `payload`, `input?`): `Readonly`\<[`CustomMessage`](../type-aliases/CustomMessage.md)\<`PayloadType`\>\>

Defined in: [mocks/messages/getCustomMessage.mock.ts:13](https://github.com/puristajs/purista/blob/master/packages/core/src/mocks/messages/getCustomMessage.mock.ts#L13)

A function that returns a mocked custom message.

## Type Parameters

### PayloadType

`PayloadType`

## Parameters

### eventName

`string`

### payload

`PayloadType`

### input?

`Partial`\<\{ `contentEncoding`: `string`; `contentType`: `string`; `correlationId?`: `string`; `eventName`: `string`; `id`: `string`; `messageType`: [`CustomMessage`](../enumerations/EBMessageType.md#custommessage); `otp?`: `string`; `payload?`: `PayloadType`; `principalId?`: `string`; `receiver?`: [`EBMessageAddress`](../type-aliases/EBMessageAddress.md); `sender`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `tenantId?`: `string`; `timestamp`: `number`; `traceId?`: `string`; \}\>

## Returns

`Readonly`\<[`CustomMessage`](../type-aliases/CustomMessage.md)\<`PayloadType`\>\>
