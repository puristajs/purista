[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / ModelProvider

# Interface: ModelProvider

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:167](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/providers/runtime/ModelProvider.ts#L167)

Minimal interface providers must satisfy so they can be swapped at runtime.

## Properties

### capabilities

> `readonly` **capabilities**: [`ModelProviderCapabilities`](../type-aliases/ModelProviderCapabilities.md)

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:169](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/providers/runtime/ModelProvider.ts#L169)

***

### name

> `readonly` **name**: `string`

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:168](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/providers/runtime/ModelProvider.ts#L168)

## Methods

### embed()?

> `optional` **embed**(`request`): `Promise`\<[`ProviderEmbedResponse`](../type-aliases/ProviderEmbedResponse.md)\>

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:178](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/providers/runtime/ModelProvider.ts#L178)

#### Parameters

##### request

[`ProviderEmbedRequest`](../type-aliases/ProviderEmbedRequest.md)

#### Returns

`Promise`\<[`ProviderEmbedResponse`](../type-aliases/ProviderEmbedResponse.md)\>

***

### embedMany()?

> `optional` **embedMany**(`request`): `Promise`\<[`ProviderEmbedManyResponse`](../type-aliases/ProviderEmbedManyResponse.md)\>

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:179](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/providers/runtime/ModelProvider.ts#L179)

#### Parameters

##### request

[`ProviderEmbedManyRequest`](../type-aliases/ProviderEmbedManyRequest.md)

#### Returns

`Promise`\<[`ProviderEmbedManyResponse`](../type-aliases/ProviderEmbedManyResponse.md)\>

***

### generate()?

> `optional` **generate**(`request`): `Promise`\<[`ProviderResponse`](../type-aliases/ProviderResponse.md)\>

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:170](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/providers/runtime/ModelProvider.ts#L170)

#### Parameters

##### request

[`ProviderRequest`](../type-aliases/ProviderRequest.md)

#### Returns

`Promise`\<[`ProviderResponse`](../type-aliases/ProviderResponse.md)\>

***

### generateJson()?

> `optional` **generateJson**\<`T`\>(`request`): `Promise`\<[`ProviderJsonResponse`](../type-aliases/ProviderJsonResponse.md)\<`T`\>\>

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:177](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/providers/runtime/ModelProvider.ts#L177)

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

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:176](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/providers/runtime/ModelProvider.ts#L176)

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

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:180](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/providers/runtime/ModelProvider.ts#L180)

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

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:171](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/providers/runtime/ModelProvider.ts#L171)

#### Parameters

##### request

[`ProviderRequest`](../type-aliases/ProviderRequest.md)

#### Returns

[`ProviderStream`](../type-aliases/ProviderStream.md)
