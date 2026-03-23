[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / GenerateTextOptions

# Type Alias: GenerateTextOptions

> **GenerateTextOptions** = `object`

Defined in: [packages/ai/src/providers/runtime/generateText.ts:5](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/providers/runtime/generateText.ts#L5)

## Properties

### model

> **model**: `Pick`\<[`ModelProvider`](../interfaces/ModelProvider.md), `"generate"` \| `"stream"` \| `"generateText"`\>

Defined in: [packages/ai/src/providers/runtime/generateText.ts:6](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/providers/runtime/generateText.ts#L6)

***

### onReasoning()?

> `optional` **onReasoning**: (`text`) => `void` \| `Promise`\<`void`\>

Defined in: [packages/ai/src/providers/runtime/generateText.ts:8](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/providers/runtime/generateText.ts#L8)

#### Parameters

##### text

`string`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onTextDelta()?

> `optional` **onTextDelta**: (`delta`) => `void` \| `Promise`\<`void`\>

Defined in: [packages/ai/src/providers/runtime/generateText.ts:9](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/providers/runtime/generateText.ts#L9)

#### Parameters

##### delta

`string`

#### Returns

`void` \| `Promise`\<`void`\>

***

### request

> **request**: [`ProviderRequest`](ProviderRequest.md)

Defined in: [packages/ai/src/providers/runtime/generateText.ts:7](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/providers/runtime/generateText.ts#L7)
