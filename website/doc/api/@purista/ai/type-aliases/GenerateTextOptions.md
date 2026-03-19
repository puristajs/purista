[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / GenerateTextOptions

# Type Alias: GenerateTextOptions

> **GenerateTextOptions** = `object`

Defined in: [packages/ai/src/providers/runtime/generateText.ts:5](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/providers/runtime/generateText.ts#L5)

## Properties

### model

> **model**: `Pick`\<[`ModelProvider`](../interfaces/ModelProvider.md), `"generate"` \| `"stream"`\>

Defined in: [packages/ai/src/providers/runtime/generateText.ts:6](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/providers/runtime/generateText.ts#L6)

***

### onReasoning()?

> `optional` **onReasoning**: (`text`) => `void` \| `Promise`\<`void`\>

Defined in: [packages/ai/src/providers/runtime/generateText.ts:8](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/providers/runtime/generateText.ts#L8)

#### Parameters

##### text

`string`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onTextDelta()?

> `optional` **onTextDelta**: (`delta`) => `void` \| `Promise`\<`void`\>

Defined in: [packages/ai/src/providers/runtime/generateText.ts:9](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/providers/runtime/generateText.ts#L9)

#### Parameters

##### delta

`string`

#### Returns

`void` \| `Promise`\<`void`\>

***

### request

> **request**: [`ProviderRequest`](ProviderRequest.md)

Defined in: [packages/ai/src/providers/runtime/generateText.ts:7](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/providers/runtime/generateText.ts#L7)
