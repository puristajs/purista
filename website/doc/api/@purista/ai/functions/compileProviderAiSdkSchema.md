[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / compileProviderAiSdkSchema

# Function: compileProviderAiSdkSchema()

> **compileProviderAiSdkSchema**\<`T`\>(`schema`): `Promise`\<`Schema`\<`T`\> \| `undefined`\>

Defined in: [packages/ai/src/providers/runtime/providerJsonSchema.ts:183](https://github.com/puristajs/purista/blob/430e29c621b412b5f21de4eb9697723299bc616e/packages/ai/src/providers/runtime/providerJsonSchema.ts#L183)

Compiles an input schema into an AI SDK schema wrapper with provider-safe JSON Schema.

This preserves validation for Standard Schema / Zod / AI SDK schemas while still sanitizing
the JSON Schema that is sent to strict providers.

## Type Parameters

### T

`T` = `unknown`

## Parameters

### schema

`unknown`

## Returns

`Promise`\<`Schema`\<`T`\> \| `undefined`\>
