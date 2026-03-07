[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AiSdkProvider

# Class: AiSdkProvider

Defined in: [ai/src/providers/runtime/AiSdkProvider.ts:90](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/providers/runtime/AiSdkProvider.ts#L90)

Wraps any Vercel AI SDK LanguageModel and exposes it through the lightweight [ModelProvider](../interfaces/ModelProvider.md) interface
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

Defined in: [ai/src/providers/runtime/AiSdkProvider.ts:98](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/providers/runtime/AiSdkProvider.ts#L98)

#### Parameters

##### options

[`AiSdkProviderOptions`](../type-aliases/AiSdkProviderOptions.md)

#### Returns

`AiSdkProvider`

## Properties

### name

> `readonly` **name**: `string`

Defined in: [ai/src/providers/runtime/AiSdkProvider.ts:91](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/providers/runtime/AiSdkProvider.ts#L91)

#### Implementation of

[`ModelProvider`](../interfaces/ModelProvider.md).[`name`](../interfaces/ModelProvider.md#name)

## Methods

### generate()

> **generate**(`request`): `Promise`\<[`ProviderResponse`](../type-aliases/ProviderResponse.md)\>

Defined in: [ai/src/providers/runtime/AiSdkProvider.ts:106](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/providers/runtime/AiSdkProvider.ts#L106)

#### Parameters

##### request

[`ProviderRequest`](../type-aliases/ProviderRequest.md)

#### Returns

`Promise`\<[`ProviderResponse`](../type-aliases/ProviderResponse.md)\>

#### Implementation of

[`ModelProvider`](../interfaces/ModelProvider.md).[`generate`](../interfaces/ModelProvider.md#generate)
