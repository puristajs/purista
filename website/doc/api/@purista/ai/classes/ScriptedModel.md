[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / ScriptedModel

# Class: ScriptedModel

Defined in: [packages/ai/src/testing/ScriptedModel.ts:36](https://github.com/puristajs/purista/blob/430e29c621b412b5f21de4eb9697723299bc616e/packages/ai/src/testing/ScriptedModel.ts#L36)

Minimal interface providers must satisfy so they can be swapped at runtime.

## Implements

- [`ModelProvider`](../interfaces/ModelProvider.md)

## Constructors

### Constructor

> **new ScriptedModel**(): `ScriptedModel`

#### Returns

`ScriptedModel`

## Properties

### calls

> `readonly` **calls**: (\{ `method`: `"stream"` \| `"generateText"` \| `"generate"`; `request`: [`ProviderRequest`](../type-aliases/ProviderRequest.md); \} \| \{ `method`: `"generateJson"`; `request`: [`ProviderJsonRequest`](../type-aliases/ProviderJsonRequest.md); \})[] = `[]`

Defined in: [packages/ai/src/testing/ScriptedModel.ts:43](https://github.com/puristajs/purista/blob/430e29c621b412b5f21de4eb9697723299bc616e/packages/ai/src/testing/ScriptedModel.ts#L43)

***

### capabilities

> `readonly` **capabilities**: `object`

Defined in: [packages/ai/src/testing/ScriptedModel.ts:38](https://github.com/puristajs/purista/blob/430e29c621b412b5f21de4eb9697723299bc616e/packages/ai/src/testing/ScriptedModel.ts#L38)

#### json

> **json**: `boolean` = `true`

#### stream

> **stream**: `boolean` = `true`

#### text

> **text**: `boolean` = `true`

#### Implementation of

[`ModelProvider`](../interfaces/ModelProvider.md).[`capabilities`](../interfaces/ModelProvider.md#capabilities)

***

### name

> `readonly` **name**: `"scripted-model"` = `'scripted-model'`

Defined in: [packages/ai/src/testing/ScriptedModel.ts:37](https://github.com/puristajs/purista/blob/430e29c621b412b5f21de4eb9697723299bc616e/packages/ai/src/testing/ScriptedModel.ts#L37)

#### Implementation of

[`ModelProvider`](../interfaces/ModelProvider.md).[`name`](../interfaces/ModelProvider.md#name)

## Methods

### generate()

> **generate**(`request`): `Promise`\<[`ProviderResponse`](../type-aliases/ProviderResponse.md)\>

Defined in: [packages/ai/src/testing/ScriptedModel.ts:113](https://github.com/puristajs/purista/blob/430e29c621b412b5f21de4eb9697723299bc616e/packages/ai/src/testing/ScriptedModel.ts#L113)

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

Defined in: [packages/ai/src/testing/ScriptedModel.ts:182](https://github.com/puristajs/purista/blob/430e29c621b412b5f21de4eb9697723299bc616e/packages/ai/src/testing/ScriptedModel.ts#L182)

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

Defined in: [packages/ai/src/testing/ScriptedModel.ts:167](https://github.com/puristajs/purista/blob/430e29c621b412b5f21de4eb9697723299bc616e/packages/ai/src/testing/ScriptedModel.ts#L167)

High-level helper that yields one final text output while automatically
preferring `stream()` and falling back to `generate()`.

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
  onTextDelta: delta => context.stream.sendChunk(delta),
})
```

In normal handler code the PURISTA runtime fills in declared skills and
allowlisted bindings automatically when you omit them.

#### Implementation of

[`ModelProvider`](../interfaces/ModelProvider.md).[`generateText`](../interfaces/ModelProvider.md#generatetext)

***

### nextError()

> **nextError**(`error`): `ScriptedModel`

Defined in: [packages/ai/src/testing/ScriptedModel.ts:71](https://github.com/puristajs/purista/blob/430e29c621b412b5f21de4eb9697723299bc616e/packages/ai/src/testing/ScriptedModel.ts#L71)

#### Parameters

##### error

[`ScriptedErrorReply`](../type-aliases/ScriptedErrorReply.md)

#### Returns

`ScriptedModel`

***

### nextJson()

> **nextJson**(`reply`): `ScriptedModel`

Defined in: [packages/ai/src/testing/ScriptedModel.ts:66](https://github.com/puristajs/purista/blob/430e29c621b412b5f21de4eb9697723299bc616e/packages/ai/src/testing/ScriptedModel.ts#L66)

#### Parameters

##### reply

`unknown`

#### Returns

`ScriptedModel`

***

### nextStream()

> **nextStream**(`chunks`, `options?`): `ScriptedModel`

Defined in: [packages/ai/src/testing/ScriptedModel.ts:56](https://github.com/puristajs/purista/blob/430e29c621b412b5f21de4eb9697723299bc616e/packages/ai/src/testing/ScriptedModel.ts#L56)

#### Parameters

##### chunks

[`ScriptedChunksReply`](../type-aliases/ScriptedChunksReply.md)

##### options?

###### final?

[`ScriptedTextReply`](../type-aliases/ScriptedTextReply.md)

###### reasoning?

[`ScriptedReasoningReply`](../type-aliases/ScriptedReasoningReply.md)

#### Returns

`ScriptedModel`

***

### nextText()

> **nextText**(`reply`, `options?`): `ScriptedModel`

Defined in: [packages/ai/src/testing/ScriptedModel.ts:51](https://github.com/puristajs/purista/blob/430e29c621b412b5f21de4eb9697723299bc616e/packages/ai/src/testing/ScriptedModel.ts#L51)

#### Parameters

##### reply

[`ScriptedTextReply`](../type-aliases/ScriptedTextReply.md)

##### options?

###### chunks?

[`ScriptedChunksReply`](../type-aliases/ScriptedChunksReply.md)

###### reasoning?

[`ScriptedReasoningReply`](../type-aliases/ScriptedReasoningReply.md)

#### Returns

`ScriptedModel`

***

### reset()

> **reset**(): `ScriptedModel`

Defined in: [packages/ai/src/testing/ScriptedModel.ts:76](https://github.com/puristajs/purista/blob/430e29c621b412b5f21de4eb9697723299bc616e/packages/ai/src/testing/ScriptedModel.ts#L76)

#### Returns

`ScriptedModel`

***

### stream()

> **stream**(`request`): [`ProviderStream`](../type-aliases/ProviderStream.md)

Defined in: [packages/ai/src/testing/ScriptedModel.ts:120](https://github.com/puristajs/purista/blob/430e29c621b412b5f21de4eb9697723299bc616e/packages/ai/src/testing/ScriptedModel.ts#L120)

#### Parameters

##### request

[`ProviderRequest`](../type-aliases/ProviderRequest.md)

#### Returns

[`ProviderStream`](../type-aliases/ProviderStream.md)

#### Implementation of

[`ModelProvider`](../interfaces/ModelProvider.md).[`stream`](../interfaces/ModelProvider.md#stream)
