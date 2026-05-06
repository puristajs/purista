[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / MockModel

# Class: MockModel

Defined in: [packages/ai/src/testing/MockModel.ts:54](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/testing/MockModel.ts#L54)

Minimal interface providers must satisfy so they can be swapped at runtime.

## Implements

- [`ModelProvider`](../interfaces/ModelProvider.md)

## Constructors

### Constructor

> **new MockModel**(): `MockModel`

#### Returns

`MockModel`

## Properties

### capabilities

> `readonly` **capabilities**: `object`

Defined in: [packages/ai/src/testing/MockModel.ts:56](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/testing/MockModel.ts#L56)

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

> `readonly` **name**: `"mock-model"` = `'mock-model'`

Defined in: [packages/ai/src/testing/MockModel.ts:55](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/testing/MockModel.ts#L55)

#### Implementation of

[`ModelProvider`](../interfaces/ModelProvider.md).[`name`](../interfaces/ModelProvider.md#name)

## Methods

### generateObject()

> **generateObject**\<`T`, `OutputSchema`\>(`request`): `Promise`\<[`ProviderJsonResponse`](../type-aliases/ProviderJsonResponse.md)\<[`ProviderJsonOutputFromSchema`](../type-aliases/ProviderJsonOutputFromSchema.md)\<`OutputSchema`, `T`\>\>\>

Defined in: [packages/ai/src/testing/MockModel.ts:129](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/testing/MockModel.ts#L129)

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

Defined in: [packages/ai/src/testing/MockModel.ts:121](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/testing/MockModel.ts#L121)

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

### on()

> **on**(`matcher`): `object`

Defined in: [packages/ai/src/testing/MockModel.ts:65](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/testing/MockModel.ts#L65)

#### Parameters

##### matcher

[`MockTextMatcher`](../type-aliases/MockTextMatcher.md)

#### Returns

`object`

##### reply()

> **reply**: (`reply`) => `MockModel`

###### Parameters

###### reply

[`MockTextReply`](../type-aliases/MockTextReply.md)

###### Returns

`MockModel`

***

### onJson()

> **onJson**(`matcher`): `object`

Defined in: [packages/ai/src/testing/MockModel.ts:74](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/testing/MockModel.ts#L74)

#### Parameters

##### matcher

[`MockJsonMatcher`](../type-aliases/MockJsonMatcher.md)

#### Returns

`object`

##### reply()

> **reply**: (`reply`) => `MockModel`

###### Parameters

###### reply

`unknown`

###### Returns

`MockModel`

***

### streamText()

> **streamText**(`request`): [`ProviderStream`](../type-aliases/ProviderStream.md)

Defined in: [packages/ai/src/testing/MockModel.ts:99](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/testing/MockModel.ts#L99)

#### Parameters

##### request

[`ProviderRequest`](../type-aliases/ProviderRequest.md)

#### Returns

[`ProviderStream`](../type-aliases/ProviderStream.md)

#### Implementation of

[`ModelProvider`](../interfaces/ModelProvider.md).[`streamText`](../interfaces/ModelProvider.md#streamtext)
