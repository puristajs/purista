[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / GenerateTextOptions

# Type Alias: GenerateTextOptions

> **GenerateTextOptions** = `object`

Defined in: [packages/ai/src/providers/runtime/generateText.ts:7](https://github.com/puristajs/purista/blob/6304710cc2bd8718e85e838752c7933f343ed2ce/packages/ai/src/providers/runtime/generateText.ts#L7)

## Properties

### label?

> `optional` **label**: `string`

Defined in: [packages/ai/src/providers/runtime/generateText.ts:13](https://github.com/puristajs/purista/blob/6304710cc2bd8718e85e838752c7933f343ed2ce/packages/ai/src/providers/runtime/generateText.ts#L13)

***

### model

> **model**: `Pick`\<[`ModelProvider`](../interfaces/ModelProvider.md), `"generate"` \| `"stream"` \| `"generateText"`\>

Defined in: [packages/ai/src/providers/runtime/generateText.ts:8](https://github.com/puristajs/purista/blob/6304710cc2bd8718e85e838752c7933f343ed2ce/packages/ai/src/providers/runtime/generateText.ts#L8)

***

### onReasoning()?

> `optional` **onReasoning**: (`text`) => `void` \| `Promise`\<`void`\>

Defined in: [packages/ai/src/providers/runtime/generateText.ts:10](https://github.com/puristajs/purista/blob/6304710cc2bd8718e85e838752c7933f343ed2ce/packages/ai/src/providers/runtime/generateText.ts#L10)

#### Parameters

##### text

`string`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onTextDelta()?

> `optional` **onTextDelta**: (`delta`) => `void` \| `Promise`\<`void`\>

Defined in: [packages/ai/src/providers/runtime/generateText.ts:11](https://github.com/puristajs/purista/blob/6304710cc2bd8718e85e838752c7933f343ed2ce/packages/ai/src/providers/runtime/generateText.ts#L11)

#### Parameters

##### delta

`string`

#### Returns

`void` \| `Promise`\<`void`\>

***

### policy?

> `optional` **policy**: [`ModelInvocationPolicy`](ModelInvocationPolicy.md)

Defined in: [packages/ai/src/providers/runtime/generateText.ts:12](https://github.com/puristajs/purista/blob/6304710cc2bd8718e85e838752c7933f343ed2ce/packages/ai/src/providers/runtime/generateText.ts#L12)

***

### request

> **request**: [`ProviderRequest`](ProviderRequest.md)

Defined in: [packages/ai/src/providers/runtime/generateText.ts:9](https://github.com/puristajs/purista/blob/6304710cc2bd8718e85e838752c7933f343ed2ce/packages/ai/src/providers/runtime/generateText.ts#L9)
