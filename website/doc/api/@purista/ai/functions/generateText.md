[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / generateText

# Function: generateText()

> **generateText**(`input`): `Promise`\<`string`\>

Defined in: [packages/ai/src/providers/runtime/generateText.ts:19](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/providers/runtime/generateText.ts#L19)

Generates one final text output from a model provider.

Strategy:
1. Prefer `stream()` when available and forward reasoning/text callbacks.
2. Fallback to `generate()` when streaming is not available.

## Parameters

### input

[`GenerateTextOptions`](../type-aliases/GenerateTextOptions.md)

## Returns

`Promise`\<`string`\>
