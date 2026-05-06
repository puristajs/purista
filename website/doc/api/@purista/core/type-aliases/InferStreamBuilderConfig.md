[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / InferStreamBuilderConfig

# Type Alias: InferStreamBuilderConfig\<T\>

> **InferStreamBuilderConfig**\<`T`\> = `T` *extends* [`StreamDefinitionBuilder`](../classes/StreamDefinitionBuilder.md)\<`any`, infer C\> ? `C` : `never`

Defined in: [testing/createStreamTestHarness.ts:27](https://github.com/puristajs/purista/blob/master/packages/core/src/testing/createStreamTestHarness.ts#L27)

Infer the definition config type from a stream builder.

## Type Parameters

### T

`T`
