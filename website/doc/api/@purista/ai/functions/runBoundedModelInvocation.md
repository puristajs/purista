[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / runBoundedModelInvocation

# Function: runBoundedModelInvocation()

> **runBoundedModelInvocation**\<`T`\>(`input`): `Promise`\<`T`\>

Defined in: [packages/ai/src/providers/runtime/modelInvocation.ts:206](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/providers/runtime/modelInvocation.ts#L206)

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
