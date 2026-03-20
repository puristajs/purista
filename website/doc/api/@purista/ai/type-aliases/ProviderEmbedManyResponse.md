[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / ProviderEmbedManyResponse

# Type Alias: ProviderEmbedManyResponse

> **ProviderEmbedManyResponse** = `object`

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:100](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/ai/src/providers/runtime/ModelProvider.ts#L100)

Response emitted by batch embedding-capable providers.

## Properties

### embeddings

> **embeddings**: `number`[][]

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:101](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/ai/src/providers/runtime/ModelProvider.ts#L101)

***

### metadata?

> `optional` **metadata**: `Record`\<`string`, `unknown`\>

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:105](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/ai/src/providers/runtime/ModelProvider.ts#L105)

***

### usage?

> `optional` **usage**: `object`

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:102](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/ai/src/providers/runtime/ModelProvider.ts#L102)

#### tokens?

> `optional` **tokens**: `number`
