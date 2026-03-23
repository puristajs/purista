[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / ProviderRerankRequest

# Type Alias: ProviderRerankRequest\<Document\>

> **ProviderRerankRequest**\<`Document`\> = `object`

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:60](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/providers/runtime/ModelProvider.ts#L60)

Payload sent to reranking-capable providers.

## Type Parameters

### Document

`Document` = `string` \| `Record`\<`string`, `unknown`\>

## Properties

### documents

> **documents**: `Document`[]

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:62](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/providers/runtime/ModelProvider.ts#L62)

***

### metadata?

> `optional` **metadata**: `Record`\<`string`, `unknown`\>

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:64](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/providers/runtime/ModelProvider.ts#L64)

***

### query

> **query**: `string`

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:61](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/providers/runtime/ModelProvider.ts#L61)

***

### topN?

> `optional` **topN**: `number`

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:63](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/providers/runtime/ModelProvider.ts#L63)
