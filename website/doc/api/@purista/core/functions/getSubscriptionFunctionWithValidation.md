[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / getSubscriptionFunctionWithValidation

# Function: getSubscriptionFunctionWithValidation()

> **getSubscriptionFunctionWithValidation**\<`S`\>(`fn`, `inputPayloadSchema`, `inputParameterSchema`, `outputPayloadSchema`, `beforeGuards?`): (`this`, `context`, `payload`, `parameter`) => `Promise`\<`unknown`\>

Defined in: [SubscriptionDefinitionBuilder/getSubscriptionFunctionWithValidation.impl.ts:18](https://github.com/puristajs/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/getSubscriptionFunctionWithValidation.impl.ts#L18)

Wraps a subscription handler with schema validation and guard execution.
Input payload/parameter is validated before execution and output can be validated after execution.

## Type Parameters

### S

`S` *extends* [`Service`](../classes/Service.md)\<[`ServiceClassTypes`](../type-aliases/ServiceClassTypes.md)\<`any`, `any`, `any`\>\>

## Parameters

### fn

[`SubscriptionFunction`](../type-aliases/SubscriptionFunction.md)\<`S`, `unknown`, `unknown`, `unknown`, `any`, `any`, `any`, `any`, `any`\>

### inputPayloadSchema

[`Schema`](../type-aliases/Schema.md) \| `undefined`

### inputParameterSchema

[`Schema`](../type-aliases/Schema.md) \| `undefined`

### outputPayloadSchema

[`Schema`](../type-aliases/Schema.md) \| `undefined`

### beforeGuards?

`Record`\<`string`, [`SubscriptionBeforeGuardHook`](../type-aliases/SubscriptionBeforeGuardHook.md)\<`S`, `unknown`, `unknown`, `any`, `any`, `any`, `any`, `any`\>\> = `{}`

## Returns

(`this`, `context`, `payload`, `parameter`) => `Promise`\<`unknown`\>
