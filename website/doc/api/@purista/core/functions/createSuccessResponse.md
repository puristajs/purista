[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / createSuccessResponse

# Function: createSuccessResponse()

> **createSuccessResponse**\<`T`\>(`instanceId`, `originalEBMessage`, `payload`, `eventName?`, `contentType?`, `contentEncoding?`): `Readonly`\<[`CommandSuccessResponse`](../type-aliases/CommandSuccessResponse.md)\<`T`\>\>

Defined in: [core/helper/createSuccessResponse.impl.ts:18](https://github.com/puristajs/purista/blob/master/packages/core/src/core/helper/createSuccessResponse.impl.ts#L18)

## Type Parameters

### T

`T`

## Parameters

### instanceId

`string`

### originalEBMessage

`Readonly`\<[`Command`](../type-aliases/Command.md)\>

### payload

`T`

### eventName?

`string`

### contentType?

`string` = `'application/json'`

### contentEncoding?

`string` = `'utf-8'`

## Returns

`Readonly`\<[`CommandSuccessResponse`](../type-aliases/CommandSuccessResponse.md)\<`T`\>\>
