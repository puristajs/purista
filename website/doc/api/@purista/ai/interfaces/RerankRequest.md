[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / [](../README.md) / RerankRequest

# Interface: RerankRequest

Defined in: ai/node\_modules/@purista/harness/dist/ports/model-provider.d.ts:232

Request for document reranking.

## Properties

### call?

> `optional` **call**: `ModelCallOptions`

Defined in: ai/node\_modules/@purista/harness/dist/ports/model-provider.d.ts:237

***

### documents

> **documents**: readonly `RerankDocument`[]

Defined in: ai/node\_modules/@purista/harness/dist/ports/model-provider.d.ts:235

***

### model

> **model**: `string`

Defined in: ai/node\_modules/@purista/harness/dist/ports/model-provider.d.ts:233

***

### query

> **query**: `string`

Defined in: ai/node\_modules/@purista/harness/dist/ports/model-provider.d.ts:234

***

### signal

> **signal**: `AbortSignal`

Defined in: ai/node\_modules/@purista/harness/dist/ports/model-provider.d.ts:238

***

### topN?

> `optional` **topN**: `number`

Defined in: ai/node\_modules/@purista/harness/dist/ports/model-provider.d.ts:236

***

### traceparent?

> `optional` **traceparent**: `string`

Defined in: ai/node\_modules/@purista/harness/dist/ports/model-provider.d.ts:239
