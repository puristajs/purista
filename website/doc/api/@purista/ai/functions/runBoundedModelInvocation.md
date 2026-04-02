[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / runBoundedModelInvocation

# Function: runBoundedModelInvocation()

> **runBoundedModelInvocation**\<`T`\>(`input`): `Promise`\<`T`\>

Defined in: [packages/ai/src/providers/runtime/modelInvocation.ts:189](https://github.com/puristajs/purista/blob/28d9337ab7fa6d33001a8b6c36fb84bb9236b736/packages/ai/src/providers/runtime/modelInvocation.ts#L189)

Runs a model invocation with optional timeout and retry policy.

Provider/runtime failures surface as `UnhandledError`.
Business validation and insufficient-context outcomes should stay in handlers as `HandledError`.

## Type Parameters

### T

`T`

## Parameters

### input

#### label

`string`

#### operation

() => `Promise`\<`T`\>

#### policy?

[`ModelInvocationPolicy`](../type-aliases/ModelInvocationPolicy.md)

## Returns

`Promise`\<`T`\>
