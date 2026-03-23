[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / ProviderEmbedManyResponse

# Type Alias: ProviderEmbedManyResponse

> **ProviderEmbedManyResponse** = `object`

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:106](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/providers/runtime/ModelProvider.ts#L106)

Response emitted by batch embedding-capable providers.

## Properties

### embeddings

> **embeddings**: `number`[][]

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:107](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/providers/runtime/ModelProvider.ts#L107)

***

### metadata?

> `optional` **metadata**: `Record`\<`string`, `unknown`\>

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:111](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/providers/runtime/ModelProvider.ts#L111)

***

### usage?

> `optional` **usage**: `object`

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:108](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/providers/runtime/ModelProvider.ts#L108)

#### tokens?

> `optional` **tokens**: `number`
