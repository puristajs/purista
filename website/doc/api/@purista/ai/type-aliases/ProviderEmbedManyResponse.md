[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / ProviderEmbedManyResponse

# Type Alias: ProviderEmbedManyResponse

> **ProviderEmbedManyResponse** = `object`

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:194](https://github.com/puristajs/purista/blob/6304710cc2bd8718e85e838752c7933f343ed2ce/packages/ai/src/providers/runtime/ModelProvider.ts#L194)

Response emitted by batch embedding-capable providers.

## Properties

### embeddings

> **embeddings**: `number`[][]

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:195](https://github.com/puristajs/purista/blob/6304710cc2bd8718e85e838752c7933f343ed2ce/packages/ai/src/providers/runtime/ModelProvider.ts#L195)

***

### metadata?

> `optional` **metadata**: `Record`\<`string`, `unknown`\>

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:199](https://github.com/puristajs/purista/blob/6304710cc2bd8718e85e838752c7933f343ed2ce/packages/ai/src/providers/runtime/ModelProvider.ts#L199)

***

### usage?

> `optional` **usage**: `object`

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:196](https://github.com/puristajs/purista/blob/6304710cc2bd8718e85e838752c7933f343ed2ce/packages/ai/src/providers/runtime/ModelProvider.ts#L196)

#### tokens?

> `optional` **tokens**: `number`
