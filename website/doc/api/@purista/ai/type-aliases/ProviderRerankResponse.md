[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / ProviderRerankResponse

# Type Alias: ProviderRerankResponse\<Document\>

> **ProviderRerankResponse**\<`Document`\> = `object`

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:111](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/providers/runtime/ModelProvider.ts#L111)

Response emitted by reranking-capable providers.

## Type Parameters

### Document

`Document` = `string` \| `Record`\<`string`, `unknown`\>

## Properties

### metadata?

> `optional` **metadata**: `Record`\<`string`, `unknown`\>

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:118](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/providers/runtime/ModelProvider.ts#L118)

***

### ranking

> **ranking**: `object`[]

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:112](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/providers/runtime/ModelProvider.ts#L112)

#### document

> **document**: `Document`

#### originalIndex

> **originalIndex**: `number`

#### score

> **score**: `number`

***

### rerankedDocuments

> **rerankedDocuments**: `Document`[]

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:117](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/providers/runtime/ModelProvider.ts#L117)
