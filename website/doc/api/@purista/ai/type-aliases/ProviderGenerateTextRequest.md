[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / ProviderGenerateTextRequest

# Type Alias: ProviderGenerateTextRequest

> **ProviderGenerateTextRequest** = [`ProviderRequest`](ProviderRequest.md) & `object`

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:57](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/providers/runtime/ModelProvider.ts#L57)

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
