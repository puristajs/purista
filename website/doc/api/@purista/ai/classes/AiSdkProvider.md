[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AiSdkProvider

# Class: AiSdkProvider

Defined in: [packages/ai/src/providers/runtime/AiSdkProvider.ts:198](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/providers/runtime/AiSdkProvider.ts#L198)

Wraps any Vercel AI SDK [LanguageModel](https://ai-sdk.dev/docs/reference/ai-sdk-core/stream-text) and exposes it through the lightweight [ModelProvider](../interfaces/ModelProvider.md) interface
consumed by the PURISTA agent runtime.

## Example

```ts
import { openai } from '@ai-sdk/openai'
import { AiSdkProvider } from '@purista/ai'

const provider = new AiSdkProvider({
  model: openai(''),
  systemPrompt: 'You are a helpful support engineer',
})

const result = await provider.generate({ prompt: 'Reset password instructions?' })
console.log(result.output)
```

## Implements

- [`ModelProvider`](../interfaces/ModelProvider.md)

## Constructors

### Constructor

> **new AiSdkProvider**(`options`): `AiSdkProvider`

Defined in: [packages/ai/src/providers/runtime/AiSdkProvider.ts:212](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/providers/runtime/AiSdkProvider.ts#L212)

#### Parameters

##### options

[`AiSdkProviderOptions`](../type-aliases/AiSdkProviderOptions.md)

#### Returns

`AiSdkProvider`

## Properties

### capabilities

> `readonly` **capabilities**: [`ModelProviderCapabilities`](../type-aliases/ModelProviderCapabilities.md)

Defined in: [packages/ai/src/providers/runtime/AiSdkProvider.ts:200](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/providers/runtime/AiSdkProvider.ts#L200)

#### Implementation of

[`ModelProvider`](../interfaces/ModelProvider.md).[`capabilities`](../interfaces/ModelProvider.md#capabilities)

***

### name

> `readonly` **name**: `string`

Defined in: [packages/ai/src/providers/runtime/AiSdkProvider.ts:199](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/providers/runtime/AiSdkProvider.ts#L199)

#### Implementation of

[`ModelProvider`](../interfaces/ModelProvider.md).[`name`](../interfaces/ModelProvider.md#name)

## Methods

### embed()

> **embed**(`request`): `Promise`\<[`ProviderEmbedResponse`](../type-aliases/ProviderEmbedResponse.md)\>

Defined in: [packages/ai/src/providers/runtime/AiSdkProvider.ts:544](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/providers/runtime/AiSdkProvider.ts#L544)

#### Parameters

##### request

[`ProviderEmbedRequest`](../type-aliases/ProviderEmbedRequest.md)

#### Returns

`Promise`\<[`ProviderEmbedResponse`](../type-aliases/ProviderEmbedResponse.md)\>

#### Implementation of

[`ModelProvider`](../interfaces/ModelProvider.md).[`embed`](../interfaces/ModelProvider.md#embed)

***

### embedMany()

> **embedMany**(`request`): `Promise`\<[`ProviderEmbedManyResponse`](../type-aliases/ProviderEmbedManyResponse.md)\>

Defined in: [packages/ai/src/providers/runtime/AiSdkProvider.ts:559](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/providers/runtime/AiSdkProvider.ts#L559)

#### Parameters

##### request

[`ProviderEmbedManyRequest`](../type-aliases/ProviderEmbedManyRequest.md)

#### Returns

`Promise`\<[`ProviderEmbedManyResponse`](../type-aliases/ProviderEmbedManyResponse.md)\>

#### Implementation of

[`ModelProvider`](../interfaces/ModelProvider.md).[`embedMany`](../interfaces/ModelProvider.md#embedmany)

***

### generate()

> **generate**(`request`): `Promise`\<[`ProviderResponse`](../type-aliases/ProviderResponse.md)\>

Defined in: [packages/ai/src/providers/runtime/AiSdkProvider.ts:389](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/providers/runtime/AiSdkProvider.ts#L389)

#### Parameters

##### request

[`ProviderRequest`](../type-aliases/ProviderRequest.md)

#### Returns

`Promise`\<[`ProviderResponse`](../type-aliases/ProviderResponse.md)\>

#### Implementation of

[`ModelProvider`](../interfaces/ModelProvider.md).[`generate`](../interfaces/ModelProvider.md#generate)

***

### generateJson()

> **generateJson**\<`T`\>(`request`): `Promise`\<[`ProviderJsonResponse`](../type-aliases/ProviderJsonResponse.md)\<`T`\>\>

Defined in: [packages/ai/src/providers/runtime/AiSdkProvider.ts:410](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/providers/runtime/AiSdkProvider.ts#L410)

#### Type Parameters

##### T

`T` = `unknown`

#### Parameters

##### request

[`ProviderJsonRequest`](../type-aliases/ProviderJsonRequest.md)

#### Returns

`Promise`\<[`ProviderJsonResponse`](../type-aliases/ProviderJsonResponse.md)\<`T`\>\>

#### Implementation of

[`ModelProvider`](../interfaces/ModelProvider.md).[`generateJson`](../interfaces/ModelProvider.md#generatejson)

***

### generateText()

> **generateText**(`request`): `Promise`\<`string`\>

Defined in: [packages/ai/src/providers/runtime/AiSdkProvider.ts:524](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/providers/runtime/AiSdkProvider.ts#L524)

High-level helper that yields one final text output while automatically
preferring `stream()` and falling back to `generate()`.

#### Parameters

##### request

[`ProviderGenerateTextRequest`](../type-aliases/ProviderGenerateTextRequest.md)

#### Returns

`Promise`\<`string`\>

#### Implementation of

[`ModelProvider`](../interfaces/ModelProvider.md).[`generateText`](../interfaces/ModelProvider.md#generatetext)

***

### rerank()

> **rerank**\<`Document`\>(`request`): `Promise`\<[`ProviderRerankResponse`](../type-aliases/ProviderRerankResponse.md)\<`Document`\>\>

Defined in: [packages/ai/src/providers/runtime/AiSdkProvider.ts:574](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/providers/runtime/AiSdkProvider.ts#L574)

#### Type Parameters

##### Document

`Document` = `string` \| `Record`\<`string`, `unknown`\>

#### Parameters

##### request

[`ProviderRerankRequest`](../type-aliases/ProviderRerankRequest.md)\<`Document`\>

#### Returns

`Promise`\<[`ProviderRerankResponse`](../type-aliases/ProviderRerankResponse.md)\<`Document`\>\>

#### Implementation of

[`ModelProvider`](../interfaces/ModelProvider.md).[`rerank`](../interfaces/ModelProvider.md#rerank)

***

### stream()

> **stream**(`request`): [`ProviderStream`](../type-aliases/ProviderStream.md)

Defined in: [packages/ai/src/providers/runtime/AiSdkProvider.ts:469](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/providers/runtime/AiSdkProvider.ts#L469)

#### Parameters

##### request

[`ProviderRequest`](../type-aliases/ProviderRequest.md)

#### Returns

[`ProviderStream`](../type-aliases/ProviderStream.md)

#### Implementation of

[`ModelProvider`](../interfaces/ModelProvider.md).[`stream`](../interfaces/ModelProvider.md#stream)
