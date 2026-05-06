[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / ProviderRerankRequest

# Type Alias: ProviderRerankRequest\<Document\>

> **ProviderRerankRequest**\<`Document`\> = `object`

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:115](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/providers/runtime/ModelProvider.ts#L115)

Payload sent to reranking-capable providers.

## Type Parameters

### Document

`Document` = `string` \| `Record`\<`string`, `unknown`\>

## Properties

### documents

> **documents**: `Document`[]

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:117](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/providers/runtime/ModelProvider.ts#L117)

***

### metadata?

> `optional` **metadata**: `Record`\<`string`, `unknown`\>

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:119](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/providers/runtime/ModelProvider.ts#L119)

***

### query

> **query**: `string`

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:116](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/providers/runtime/ModelProvider.ts#L116)

***

### topN?

> `optional` **topN**: `number`

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:118](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/providers/runtime/ModelProvider.ts#L118)
