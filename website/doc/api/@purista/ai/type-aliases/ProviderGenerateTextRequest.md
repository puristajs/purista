[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / ProviderGenerateTextRequest

# Type Alias: ProviderGenerateTextRequest

> **ProviderGenerateTextRequest** = [`ProviderRequest`](ProviderRequest.md) & `object`

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:45](https://github.com/puristajs/purista/blob/4404dd96f5462503c1bc6e1de335782a5a892137/packages/ai/src/providers/runtime/ModelProvider.ts#L45)

Request input for high-level text generation that auto-selects streaming
or non-streaming provider capabilities.

## Type Declaration

### onReasoning()?

> `optional` **onReasoning**: (`text`) => `void` \| `Promise`\<`void`\>

#### Parameters

##### text

`string`

#### Returns

`void` \| `Promise`\<`void`\>

### onTextDelta()?

> `optional` **onTextDelta**: (`delta`) => `void` \| `Promise`\<`void`\>

#### Parameters

##### delta

`string`

#### Returns

`void` \| `Promise`\<`void`\>
