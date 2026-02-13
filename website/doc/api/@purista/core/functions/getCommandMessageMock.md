[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / getCommandMessageMock

# Function: getCommandMessageMock()

> **getCommandMessageMock**\<`Payload`, `Parameter`\>(`input?`): `Readonly`\<[`Command`](../type-aliases/Command.md)\<`Payload`, `Parameter`\>\>

Defined in: [mocks/messages/getCommandMessage.mock.ts:13](https://github.com/puristajs/purista/blob/master/packages/core/src/mocks/messages/getCommandMessage.mock.ts#L13)

A function that returns a mocked command message.

## Type Parameters

### Payload

`Payload`

### Parameter

`Parameter`

## Parameters

### input?

`Partial`\<\{ `contentEncoding`: `string`; `contentType`: `string`; `correlationId`: `string`; `eventName?`: `string`; `id`: `string`; `messageType`: [`Command`](../enumerations/EBMessageType.md#command); `otp?`: `string`; `payload`: \{ `parameter`: `Parameter`; `payload`: `Payload`; \}; `principalId?`: `string`; `receiver`: [`EBMessageAddress`](../type-aliases/EBMessageAddress.md); `sender`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `tenantId?`: `string`; `timestamp`: `number`; `traceId?`: `string`; \}\> & `object`

## Returns

`Readonly`\<[`Command`](../type-aliases/Command.md)\<`Payload`, `Parameter`\>\>
