[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / ManifestValidationResult

# Type Alias: ManifestValidationResult\<TInput, TContext\>

> **ManifestValidationResult**\<`TInput`, `TContext`\> = `object`

Defined in: types/AgentManifest.ts:81

## Type Parameters

### TInput

`TInput` *extends* [`Schema`](../../core/type-aliases/Schema.md) = [`Schema`](../../core/type-aliases/Schema.md)

### TContext

`TContext` *extends* [`Schema`](../../core/type-aliases/Schema.md) = [`Schema`](../../core/type-aliases/Schema.md)

## Properties

### context?

> `optional` **context**: [`InferIn`](../../core/type-aliases/InferIn.md)\<`TContext`\>

Defined in: types/AgentManifest.ts:84

***

### input?

> `optional` **input**: [`InferIn`](../../core/type-aliases/InferIn.md)\<`TInput`\>

Defined in: types/AgentManifest.ts:83

***

### manifest

> **manifest**: [`AgentManifest`](AgentManifest.md)\<`TInput`, `TContext`\>

Defined in: types/AgentManifest.ts:82
