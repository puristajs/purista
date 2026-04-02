[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / ProviderGenerateTextRequest

# Type Alias: ProviderGenerateTextRequest

> **ProviderGenerateTextRequest** = [`ProviderRequest`](ProviderRequest.md) & `object`

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:56](https://github.com/puristajs/purista/blob/6304710cc2bd8718e85e838752c7933f343ed2ce/packages/ai/src/providers/runtime/ModelProvider.ts#L56)

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
