[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / ProviderRerankRequest

# Type Alias: ProviderRerankRequest\<Document\>

> **ProviderRerankRequest**\<`Document`\> = `object`

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:54](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/ai/src/providers/runtime/ModelProvider.ts#L54)

Payload sent to reranking-capable providers.

## Type Parameters

### Document

`Document` = `string` \| `Record`\<`string`, `unknown`\>

## Properties

### documents

> **documents**: `Document`[]

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:56](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/ai/src/providers/runtime/ModelProvider.ts#L56)

***

### metadata?

> `optional` **metadata**: `Record`\<`string`, `unknown`\>

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:58](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/ai/src/providers/runtime/ModelProvider.ts#L58)

***

### query

> **query**: `string`

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:55](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/ai/src/providers/runtime/ModelProvider.ts#L55)

***

### topN?

> `optional` **topN**: `number`

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:57](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/ai/src/providers/runtime/ModelProvider.ts#L57)
