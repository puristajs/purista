[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / ProviderRerankResponse

# Type Alias: ProviderRerankResponse\<Document\>

> **ProviderRerankResponse**\<`Document`\> = `object`

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:205](https://github.com/puristajs/purista/blob/6e0354b1e51abc331c66c917ee95829470c9fba2/packages/ai/src/providers/runtime/ModelProvider.ts#L205)

Response emitted by reranking-capable providers.

## Type Parameters

### Document

`Document` = `string` \| `Record`\<`string`, `unknown`\>

## Properties

### metadata?

> `optional` **metadata**: `Record`\<`string`, `unknown`\>

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:212](https://github.com/puristajs/purista/blob/6e0354b1e51abc331c66c917ee95829470c9fba2/packages/ai/src/providers/runtime/ModelProvider.ts#L212)

***

### ranking

> **ranking**: `object`[]

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:206](https://github.com/puristajs/purista/blob/6e0354b1e51abc331c66c917ee95829470c9fba2/packages/ai/src/providers/runtime/ModelProvider.ts#L206)

#### document

> **document**: `Document`

#### originalIndex

> **originalIndex**: `number`

#### score

> **score**: `number`

***

### rerankedDocuments

> **rerankedDocuments**: `Document`[]

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:211](https://github.com/puristajs/purista/blob/6e0354b1e51abc331c66c917ee95829470c9fba2/packages/ai/src/providers/runtime/ModelProvider.ts#L211)
