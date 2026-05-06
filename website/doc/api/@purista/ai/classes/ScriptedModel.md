[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / ScriptedModel

# Class: ScriptedModel

Defined in: [packages/ai/src/testing/ScriptedModel.ts:37](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/testing/ScriptedModel.ts#L37)

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

> `readonly` **calls**: (\{ `method`: `"generateText"` \| `"streamText"`; `request`: [`ProviderRequest`](../type-aliases/ProviderRequest.md); \} \| \{ `method`: `"generateObject"`; `request`: [`ProviderJsonRequest`](../type-aliases/ProviderJsonRequest.md); \})[] = `[]`

Defined in: [packages/ai/src/testing/ScriptedModel.ts:44](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/testing/ScriptedModel.ts#L44)

***

### capabilities

> `readonly` **capabilities**: `object`

Defined in: [packages/ai/src/testing/ScriptedModel.ts:39](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/testing/ScriptedModel.ts#L39)

#### object

> **object**: `boolean` = `true`

#### text

> **text**: `boolean` = `true`

#### text-stream

> **text-stream**: `boolean` = `true`

#### Implementation of

[`ModelProvider`](../interfaces/ModelProvider.md).[`capabilities`](../interfaces/ModelProvider.md#capabilities)

***

### name

> `readonly` **name**: `"scripted-model"` = `'scripted-model'`

Defined in: [packages/ai/src/testing/ScriptedModel.ts:38](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/testing/ScriptedModel.ts#L38)

#### Implementation of

[`ModelProvider`](../interfaces/ModelProvider.md).[`name`](../interfaces/ModelProvider.md#name)

## Methods

### generateObject()

> **generateObject**\<`T`, `OutputSchema`\>(`request`): `Promise`\<[`ProviderJsonResponse`](../type-aliases/ProviderJsonResponse.md)\<[`ProviderJsonOutputFromSchema`](../type-aliases/ProviderJsonOutputFromSchema.md)\<`OutputSchema`, `T`\>\>\>

Defined in: [packages/ai/src/testing/ScriptedModel.ts:176](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/testing/ScriptedModel.ts#L176)

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

Defined in: [packages/ai/src/testing/ScriptedModel.ts:161](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/testing/ScriptedModel.ts#L161)

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

### nextError()

> **nextError**(`error`): `ScriptedModel`

Defined in: [packages/ai/src/testing/ScriptedModel.ts:72](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/testing/ScriptedModel.ts#L72)

#### Parameters

##### error

[`ScriptedErrorReply`](../type-aliases/ScriptedErrorReply.md)

#### Returns

`ScriptedModel`

***

### nextJson()

> **nextJson**(`reply`): `ScriptedModel`

Defined in: [packages/ai/src/testing/ScriptedModel.ts:67](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/testing/ScriptedModel.ts#L67)

#### Parameters

##### reply

`unknown`

#### Returns

`ScriptedModel`

***

### nextStream()

> **nextStream**(`chunks`, `options?`): `ScriptedModel`

Defined in: [packages/ai/src/testing/ScriptedModel.ts:57](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/testing/ScriptedModel.ts#L57)

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

Defined in: [packages/ai/src/testing/ScriptedModel.ts:52](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/testing/ScriptedModel.ts#L52)

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

Defined in: [packages/ai/src/testing/ScriptedModel.ts:77](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/testing/ScriptedModel.ts#L77)

#### Returns

`ScriptedModel`

***

### streamText()

> **streamText**(`request`): [`ProviderStream`](../type-aliases/ProviderStream.md)

Defined in: [packages/ai/src/testing/ScriptedModel.ts:114](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/testing/ScriptedModel.ts#L114)

#### Parameters

##### request

[`ProviderRequest`](../type-aliases/ProviderRequest.md)

#### Returns

[`ProviderStream`](../type-aliases/ProviderStream.md)

#### Implementation of

[`ModelProvider`](../interfaces/ModelProvider.md).[`streamText`](../interfaces/ModelProvider.md#streamtext)
