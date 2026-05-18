[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / getCommandFunctionWithValidation

# Function: getCommandFunctionWithValidation()

> **getCommandFunctionWithValidation**\<`S`\>(`fn`, `inputPayloadSchema`, `inputParameterSchema`, `outputPayloadSchema`, `beforeGuards`): (`this`, `context`, `payload`, `parameter`) => `Promise`\<`unknown`\>

Defined in: [CommandDefinitionBuilder/getCommandFunctionWithValidation.impl.ts:16](https://github.com/puristajs/purista/blob/master/packages/core/src/CommandDefinitionBuilder/getCommandFunctionWithValidation.impl.ts#L16)

Wraps a command handler with schema validation and guard execution.
Input payload/parameter is validated before execution and output can be validated after execution.

## Type Parameters

### S

`S` *extends* [`Service`](../classes/Service.md)\<[`ServiceClassTypes`](../type-aliases/ServiceClassTypes.md)\<`any`, `any`, `any`\>\>

## Parameters

### fn

[`CommandFunction`](../type-aliases/CommandFunction.md)\<`S`, `unknown`, `unknown`, `unknown`, `unknown`, `unknown`, `any`, `any`, `any`, `any`, `any`\>

### inputPayloadSchema

[`Schema`](../type-aliases/Schema.md) \| `undefined`

### inputParameterSchema

[`Schema`](../type-aliases/Schema.md) \| `undefined`

### outputPayloadSchema

[`Schema`](../type-aliases/Schema.md) \| `undefined`

### beforeGuards

`Record`\<`string`, [`CommandBeforeGuardHook`](../type-aliases/CommandBeforeGuardHook.md)\<`S`, `unknown`, `unknown`, `unknown`, `unknown`, `any`, `any`, `any`, `any`, `any`\>\>

## Returns

(`this`, `context`, `payload`, `parameter`) => `Promise`\<`unknown`\>
