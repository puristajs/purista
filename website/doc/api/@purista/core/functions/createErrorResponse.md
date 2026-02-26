[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / createErrorResponse

# Function: createErrorResponse()

> **createErrorResponse**(`instanceId`, `originalEBMessage`, `statusCode?`, `error?`): `Readonly`\<`Omit`\<[`CommandErrorResponse`](../type-aliases/CommandErrorResponse.md), `"instanceId"`\>\>

Defined in: [core/helper/createErrorResponse.impl.ts:25](https://github.com/puristajs/purista/blob/master/packages/core/src/core/helper/createErrorResponse.impl.ts#L25)

Creates a error response object based on original command
Toggles sender and receiver

## Parameters

### instanceId

`string`

The service instance originating the response

### originalEBMessage

`Readonly`\<[`Command`](../type-aliases/Command.md)\>

The command that triggered the error

### statusCode?

[`StatusCode`](../enumerations/StatusCode.md) = `StatusCode.InternalServerError`

Optional HTTP-like status to propagate

### error?

`unknown`

Optional error payload

## Returns

`Readonly`\<`Omit`\<[`CommandErrorResponse`](../type-aliases/CommandErrorResponse.md), `"instanceId"`\>\>

CommandErrorResponse message object
