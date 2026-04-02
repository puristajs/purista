[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / compileProviderJsonSchema

# Function: compileProviderJsonSchema()

> **compileProviderJsonSchema**(`schema`): `Promise`\<`JsonSchemaObject` \| `undefined`\>

Defined in: [packages/ai/src/providers/runtime/providerJsonSchema.ts:164](https://github.com/puristajs/purista/blob/6304710cc2bd8718e85e838752c7933f343ed2ce/packages/ai/src/providers/runtime/providerJsonSchema.ts#L164)

Compiles a schema into a provider-safe JSON Schema object for strict structured output.

The compiler accepts PURISTA Standard Schema values as well as plain JSON Schema objects.
It normalizes nodes so provider strict-schema validators do not see unsupported keywords
such as `propertyNames`.

## Parameters

### schema

`unknown`

## Returns

`Promise`\<`JsonSchemaObject` \| `undefined`\>
