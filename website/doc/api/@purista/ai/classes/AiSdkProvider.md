[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AiSdkProvider

# Class: AiSdkProvider

Defined in: [packages/ai/src/providers/runtime/AiSdkProvider.ts:230](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/providers/runtime/AiSdkProvider.ts#L230)

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

const result = await provider.generateText({ prompt: 'Reset password instructions?' })
console.log(result)
```

## Implements

- [`ModelProvider`](../interfaces/ModelProvider.md)

## Constructors

### Constructor

> **new AiSdkProvider**(`options`): `AiSdkProvider`

Defined in: [packages/ai/src/providers/runtime/AiSdkProvider.ts:245](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/providers/runtime/AiSdkProvider.ts#L245)

#### Parameters

##### options

[`AiSdkProviderOptions`](../type-aliases/AiSdkProviderOptions.md)

#### Returns

`AiSdkProvider`

## Properties

### capabilities

> `readonly` **capabilities**: [`ModelProviderCapabilities`](../type-aliases/ModelProviderCapabilities.md)

Defined in: [packages/ai/src/providers/runtime/AiSdkProvider.ts:232](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/providers/runtime/AiSdkProvider.ts#L232)

#### Implementation of

[`ModelProvider`](../interfaces/ModelProvider.md).[`capabilities`](../interfaces/ModelProvider.md#capabilities)

***

### name

> `readonly` **name**: `string`

Defined in: [packages/ai/src/providers/runtime/AiSdkProvider.ts:231](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/providers/runtime/AiSdkProvider.ts#L231)

#### Implementation of

[`ModelProvider`](../interfaces/ModelProvider.md).[`name`](../interfaces/ModelProvider.md#name)

## Methods

### embed()

> **embed**(`request`): `Promise`\<[`ProviderEmbedResponse`](../type-aliases/ProviderEmbedResponse.md)\>

Defined in: [packages/ai/src/providers/runtime/AiSdkProvider.ts:810](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/providers/runtime/AiSdkProvider.ts#L810)

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

Defined in: [packages/ai/src/providers/runtime/AiSdkProvider.ts:829](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/providers/runtime/AiSdkProvider.ts#L829)

#### Parameters

##### request

[`ProviderEmbedManyRequest`](../type-aliases/ProviderEmbedManyRequest.md)

#### Returns

`Promise`\<[`ProviderEmbedManyResponse`](../type-aliases/ProviderEmbedManyResponse.md)\>

#### Implementation of

[`ModelProvider`](../interfaces/ModelProvider.md).[`embedMany`](../interfaces/ModelProvider.md#embedmany)

***

### generateObject()

> **generateObject**\<`T`, `OutputSchema`\>(`request`): `Promise`\<[`ProviderJsonResponse`](../type-aliases/ProviderJsonResponse.md)\<[`ProviderJsonOutputFromSchema`](../type-aliases/ProviderJsonOutputFromSchema.md)\<`OutputSchema`, `T`\>\>\>

Defined in: [packages/ai/src/providers/runtime/AiSdkProvider.ts:475](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/providers/runtime/AiSdkProvider.ts#L475)

#### Type Parameters

##### T

`T` = `unknown`

##### OutputSchema

`OutputSchema` = `unknown`

#### Parameters

##### request

[`ProviderJsonRequest`](../type-aliases/ProviderJsonRequest.md)\<`OutputSchema`\>

#### Returns

`Promise`\<[`ProviderJsonResponse`](../type-aliases/ProviderJsonResponse.md)\<[`ProviderJsonOutputFromSchema`](../type-aliases/ProviderJsonOutputFromSchema.md)\<`OutputSchema`, `T`\>\>\>

#### Implementation of

[`ModelProvider`](../interfaces/ModelProvider.md).[`generateObject`](../interfaces/ModelProvider.md#generateobject)

***

### generateText()

> **generateText**(`request`): `Promise`\<`string`\>

Defined in: [packages/ai/src/providers/runtime/AiSdkProvider.ts:794](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/providers/runtime/AiSdkProvider.ts#L794)

High-level helper that yields one final text output while automatically
preferring `streamText()` when available.

#### Parameters

##### request

[`ProviderGenerateTextRequest`](../type-aliases/ProviderGenerateTextRequest.md)

#### Returns

`Promise`\<`string`\>

#### Example

```ts
const answer = await context.models['openai:primary'].generateText({
  developerInstruction: 'Use the available tools before answering.',
  prompt: payload.prompt,
  onTextDelta: delta => context.stream.sendDelta(delta),
})
```

In normal handler code the PURISTA runtime fills in declared skills and
allowlisted bindings automatically when you omit them.

#### Implementation of

[`ModelProvider`](../interfaces/ModelProvider.md).[`generateText`](../interfaces/ModelProvider.md#generatetext)

***

### rerank()

> **rerank**\<`Document`\>(`request`): `Promise`\<[`ProviderRerankResponse`](../type-aliases/ProviderRerankResponse.md)\<`Document`\>\>

Defined in: [packages/ai/src/providers/runtime/AiSdkProvider.ts:848](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/providers/runtime/AiSdkProvider.ts#L848)

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

### streamObject()

> **streamObject**\<`T`, `OutputSchema`\>(`request`): [`ProviderObjectStream`](../type-aliases/ProviderObjectStream.md)\<[`ProviderJsonOutputFromSchema`](../type-aliases/ProviderJsonOutputFromSchema.md)\<`OutputSchema`, `T`\>\>

Defined in: [packages/ai/src/providers/runtime/AiSdkProvider.ts:632](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/providers/runtime/AiSdkProvider.ts#L632)

#### Type Parameters

##### T

`T` = `unknown`

##### OutputSchema

`OutputSchema` = `unknown`

#### Parameters

##### request

[`ProviderObjectStreamRequest`](../type-aliases/ProviderObjectStreamRequest.md)\<[`ProviderJsonOutputFromSchema`](../type-aliases/ProviderJsonOutputFromSchema.md)\<`OutputSchema`, `T`\>, `OutputSchema`\>

#### Returns

[`ProviderObjectStream`](../type-aliases/ProviderObjectStream.md)\<[`ProviderJsonOutputFromSchema`](../type-aliases/ProviderJsonOutputFromSchema.md)\<`OutputSchema`, `T`\>\>

#### Implementation of

[`ModelProvider`](../interfaces/ModelProvider.md).[`streamObject`](../interfaces/ModelProvider.md#streamobject)

***

### streamText()

> **streamText**(`request`): [`ProviderStream`](../type-aliases/ProviderStream.md)

Defined in: [packages/ai/src/providers/runtime/AiSdkProvider.ts:563](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/providers/runtime/AiSdkProvider.ts#L563)

#### Parameters

##### request

[`ProviderRequest`](../type-aliases/ProviderRequest.md)

#### Returns

[`ProviderStream`](../type-aliases/ProviderStream.md)

#### Implementation of

[`ModelProvider`](../interfaces/ModelProvider.md).[`streamText`](../interfaces/ModelProvider.md#streamtext)
