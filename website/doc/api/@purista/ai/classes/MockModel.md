[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / MockModel

# Class: MockModel

Defined in: [packages/ai/src/testing/MockModel.ts:53](https://github.com/puristajs/purista/blob/22fd555ef1ada6d421f1292a01620a9b2b527601/packages/ai/src/testing/MockModel.ts#L53)

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

Defined in: [packages/ai/src/testing/MockModel.ts:55](https://github.com/puristajs/purista/blob/22fd555ef1ada6d421f1292a01620a9b2b527601/packages/ai/src/testing/MockModel.ts#L55)

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

> `readonly` **name**: `"mock-model"` = `'mock-model'`

Defined in: [packages/ai/src/testing/MockModel.ts:54](https://github.com/puristajs/purista/blob/22fd555ef1ada6d421f1292a01620a9b2b527601/packages/ai/src/testing/MockModel.ts#L54)

#### Implementation of

[`ModelProvider`](../interfaces/ModelProvider.md).[`name`](../interfaces/ModelProvider.md#name)

## Methods

### generate()

> **generate**(`request`): `Promise`\<[`ProviderResponse`](../type-aliases/ProviderResponse.md)\>

Defined in: [packages/ai/src/testing/MockModel.ts:98](https://github.com/puristajs/purista/blob/22fd555ef1ada6d421f1292a01620a9b2b527601/packages/ai/src/testing/MockModel.ts#L98)

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

Defined in: [packages/ai/src/testing/MockModel.ts:132](https://github.com/puristajs/purista/blob/22fd555ef1ada6d421f1292a01620a9b2b527601/packages/ai/src/testing/MockModel.ts#L132)

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

Defined in: [packages/ai/src/testing/MockModel.ts:124](https://github.com/puristajs/purista/blob/22fd555ef1ada6d421f1292a01620a9b2b527601/packages/ai/src/testing/MockModel.ts#L124)

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

### on()

> **on**(`matcher`): `object`

Defined in: [packages/ai/src/testing/MockModel.ts:64](https://github.com/puristajs/purista/blob/22fd555ef1ada6d421f1292a01620a9b2b527601/packages/ai/src/testing/MockModel.ts#L64)

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

Defined in: [packages/ai/src/testing/MockModel.ts:73](https://github.com/puristajs/purista/blob/22fd555ef1ada6d421f1292a01620a9b2b527601/packages/ai/src/testing/MockModel.ts#L73)

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

### stream()

> **stream**(`request`): [`ProviderStream`](../type-aliases/ProviderStream.md)

Defined in: [packages/ai/src/testing/MockModel.ts:102](https://github.com/puristajs/purista/blob/22fd555ef1ada6d421f1292a01620a9b2b527601/packages/ai/src/testing/MockModel.ts#L102)

#### Parameters

##### request

[`ProviderRequest`](../type-aliases/ProviderRequest.md)

#### Returns

[`ProviderStream`](../type-aliases/ProviderStream.md)

#### Implementation of

[`ModelProvider`](../interfaces/ModelProvider.md).[`stream`](../interfaces/ModelProvider.md#stream)
