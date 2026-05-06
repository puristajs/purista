[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / [](../README.md) / ModelProvider

# Interface: ModelProvider

Defined in: ai/node\_modules/@purista/harness/dist/ports/model-provider.d.ts:261

Provider adapter interface implemented by packages such as `@purista/harness-openai`.

## Properties

### genAiSystem

> `readonly` **genAiSystem**: `string`

Defined in: ai/node\_modules/@purista/harness/dist/ports/model-provider.d.ts:263

***

### id

> `readonly` **id**: `string`

Defined in: ai/node\_modules/@purista/harness/dist/ports/model-provider.d.ts:262

***

### info?

> `readonly` `optional` **info**: `ModelProviderInfo`

Defined in: ai/node\_modules/@purista/harness/dist/ports/model-provider.d.ts:264

## Methods

### close()?

> `optional` **close**(): `Promise`\<`void`\>

Defined in: ai/node\_modules/@purista/harness/dist/ports/model-provider.d.ts:271

#### Returns

`Promise`\<`void`\>

***

### embed()?

> `optional` **embed**(`req`): `Promise`\<[`EmbeddingResponse`](EmbeddingResponse.md)\>

Defined in: ai/node\_modules/@purista/harness/dist/ports/model-provider.d.ts:269

#### Parameters

##### req

[`EmbeddingRequest`](EmbeddingRequest.md)

#### Returns

`Promise`\<[`EmbeddingResponse`](EmbeddingResponse.md)\>

***

### object()?

> `optional` **object**\<`T`\>(`req`): `Promise`\<`ObjectResponse`\<`T`\>\>

Defined in: ai/node\_modules/@purista/harness/dist/ports/model-provider.d.ts:267

#### Type Parameters

##### T

`T` *extends* `JsonValue` = `JsonValue`

#### Parameters

##### req

`ObjectRequest`\<`T`\>

#### Returns

`Promise`\<`ObjectResponse`\<`T`\>\>

***

### objectStream()?

> `optional` **objectStream**\<`T`\>(`req`): `AsyncIterable`\<`ObjectStreamChunk`\<`T`\>\>

Defined in: ai/node\_modules/@purista/harness/dist/ports/model-provider.d.ts:268

#### Type Parameters

##### T

`T` *extends* `JsonValue` = `JsonValue`

#### Parameters

##### req

`ObjectRequest`\<`T`\>

#### Returns

`AsyncIterable`\<`ObjectStreamChunk`\<`T`\>\>

***

### rerank()?

> `optional` **rerank**(`req`): `Promise`\<[`RerankResponse`](RerankResponse.md)\>

Defined in: ai/node\_modules/@purista/harness/dist/ports/model-provider.d.ts:270

#### Parameters

##### req

[`RerankRequest`](RerankRequest.md)

#### Returns

`Promise`\<[`RerankResponse`](RerankResponse.md)\>

***

### text()?

> `optional` **text**(`req`): `Promise`\<`TextResponse`\>

Defined in: ai/node\_modules/@purista/harness/dist/ports/model-provider.d.ts:265

#### Parameters

##### req

`TextRequest`

#### Returns

`Promise`\<`TextResponse`\>

***

### textStream()?

> `optional` **textStream**(`req`): `AsyncIterable`\<`TextStreamChunk`\>

Defined in: ai/node\_modules/@purista/harness/dist/ports/model-provider.d.ts:266

#### Parameters

##### req

`TextRequest`

#### Returns

`AsyncIterable`\<`TextStreamChunk`\>
