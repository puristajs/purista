[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / ModelProvider

# Interface: ModelProvider

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:161](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/providers/runtime/ModelProvider.ts#L161)

Minimal interface providers must satisfy so they can be swapped at runtime.

## Properties

### capabilities

> `readonly` **capabilities**: [`ModelProviderCapabilities`](../type-aliases/ModelProviderCapabilities.md)

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:163](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/providers/runtime/ModelProvider.ts#L163)

***

### name

> `readonly` **name**: `string`

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:162](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/providers/runtime/ModelProvider.ts#L162)

## Methods

### embed()?

> `optional` **embed**(`request`): `Promise`\<[`ProviderEmbedResponse`](../type-aliases/ProviderEmbedResponse.md)\>

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:172](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/providers/runtime/ModelProvider.ts#L172)

#### Parameters

##### request

[`ProviderEmbedRequest`](../type-aliases/ProviderEmbedRequest.md)

#### Returns

`Promise`\<[`ProviderEmbedResponse`](../type-aliases/ProviderEmbedResponse.md)\>

***

### embedMany()?

> `optional` **embedMany**(`request`): `Promise`\<[`ProviderEmbedManyResponse`](../type-aliases/ProviderEmbedManyResponse.md)\>

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:173](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/providers/runtime/ModelProvider.ts#L173)

#### Parameters

##### request

[`ProviderEmbedManyRequest`](../type-aliases/ProviderEmbedManyRequest.md)

#### Returns

`Promise`\<[`ProviderEmbedManyResponse`](../type-aliases/ProviderEmbedManyResponse.md)\>

***

### generate()?

> `optional` **generate**(`request`): `Promise`\<[`ProviderResponse`](../type-aliases/ProviderResponse.md)\>

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:164](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/providers/runtime/ModelProvider.ts#L164)

#### Parameters

##### request

[`ProviderRequest`](../type-aliases/ProviderRequest.md)

#### Returns

`Promise`\<[`ProviderResponse`](../type-aliases/ProviderResponse.md)\>

***

### generateJson()?

> `optional` **generateJson**\<`T`\>(`request`): `Promise`\<[`ProviderJsonResponse`](../type-aliases/ProviderJsonResponse.md)\<`T`\>\>

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:171](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/providers/runtime/ModelProvider.ts#L171)

#### Type Parameters

##### T

`T` = `unknown`

#### Parameters

##### request

[`ProviderJsonRequest`](../type-aliases/ProviderJsonRequest.md)

#### Returns

`Promise`\<[`ProviderJsonResponse`](../type-aliases/ProviderJsonResponse.md)\<`T`\>\>

***

### generateText()?

> `optional` **generateText**(`request`): `Promise`\<`string`\>

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:170](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/providers/runtime/ModelProvider.ts#L170)

High-level helper that yields one final text output while automatically
preferring `stream()` and falling back to `generate()`.

#### Parameters

##### request

[`ProviderGenerateTextRequest`](../type-aliases/ProviderGenerateTextRequest.md)

#### Returns

`Promise`\<`string`\>

***

### rerank()?

> `optional` **rerank**\<`Document`\>(`request`): `Promise`\<[`ProviderRerankResponse`](../type-aliases/ProviderRerankResponse.md)\<`Document`\>\>

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:174](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/providers/runtime/ModelProvider.ts#L174)

#### Type Parameters

##### Document

`Document` = `string` \| `Record`\<`string`, `unknown`\>

#### Parameters

##### request

[`ProviderRerankRequest`](../type-aliases/ProviderRerankRequest.md)\<`Document`\>

#### Returns

`Promise`\<[`ProviderRerankResponse`](../type-aliases/ProviderRerankResponse.md)\<`Document`\>\>

***

### stream()?

> `optional` **stream**(`request`): [`ProviderStream`](../type-aliases/ProviderStream.md)

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:165](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/providers/runtime/ModelProvider.ts#L165)

#### Parameters

##### request

[`ProviderRequest`](../type-aliases/ProviderRequest.md)

#### Returns

[`ProviderStream`](../type-aliases/ProviderStream.md)
