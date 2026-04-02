[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / ProviderRerankRequest

# Type Alias: ProviderRerankRequest\<Document\>

> **ProviderRerankRequest**\<`Document`\> = `object`

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:110](https://github.com/puristajs/purista/blob/a54e4eedd3278d44c6382db014435e1a5908fb6f/packages/ai/src/providers/runtime/ModelProvider.ts#L110)

Payload sent to reranking-capable providers.

## Type Parameters

### Document

`Document` = `string` \| `Record`\<`string`, `unknown`\>

## Properties

### documents

> **documents**: `Document`[]

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:112](https://github.com/puristajs/purista/blob/a54e4eedd3278d44c6382db014435e1a5908fb6f/packages/ai/src/providers/runtime/ModelProvider.ts#L112)

***

### metadata?

> `optional` **metadata**: `Record`\<`string`, `unknown`\>

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:114](https://github.com/puristajs/purista/blob/a54e4eedd3278d44c6382db014435e1a5908fb6f/packages/ai/src/providers/runtime/ModelProvider.ts#L114)

***

### query

> **query**: `string`

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:111](https://github.com/puristajs/purista/blob/a54e4eedd3278d44c6382db014435e1a5908fb6f/packages/ai/src/providers/runtime/ModelProvider.ts#L111)

***

### topN?

> `optional` **topN**: `number`

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:113](https://github.com/puristajs/purista/blob/a54e4eedd3278d44c6382db014435e1a5908fb6f/packages/ai/src/providers/runtime/ModelProvider.ts#L113)
