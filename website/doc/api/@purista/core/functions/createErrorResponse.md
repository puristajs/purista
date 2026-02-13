[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / createErrorResponse

# Function: createErrorResponse()

> **createErrorResponse**(`instanceId`, `originalEBMessage`, `statusCode?`, `error?`): `Readonly`\<`Omit`\<[`CommandErrorResponse`](../type-aliases/CommandErrorResponse.md), `"instanceId"`\>\>

Defined in: [core/helper/createErrorResponse.impl.ts:24](https://github.com/puristajs/purista/blob/master/packages/core/src/core/helper/createErrorResponse.impl.ts#L24)

Creates a error response object based on original command
Toggles sender and receiver

## Parameters

### instanceId

`string`

### originalEBMessage

`Readonly`\<[`Command`](../type-aliases/Command.md)\>

### statusCode?

[`StatusCode`](../enumerations/StatusCode.md) = `StatusCode.InternalServerError`

### error?

`unknown`

## Returns

`Readonly`\<`Omit`\<[`CommandErrorResponse`](../type-aliases/CommandErrorResponse.md), `"instanceId"`\>\>

CommandErrorResponse message object
