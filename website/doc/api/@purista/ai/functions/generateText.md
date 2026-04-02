[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / generateText

# Function: generateText()

> **generateText**(`input`): `Promise`\<`string`\>

Defined in: [packages/ai/src/providers/runtime/generateText.ts:23](https://github.com/puristajs/purista/blob/28d9337ab7fa6d33001a8b6c36fb84bb9236b736/packages/ai/src/providers/runtime/generateText.ts#L23)

Generates one final text output from a model provider with optional bounded invocation policy.

Strategy:
1. Prefer `stream()` when available and forward reasoning/text callbacks.
2. Fallback to `generate()` when streaming is not available.

## Parameters

### input

[`GenerateTextOptions`](../type-aliases/GenerateTextOptions.md)

## Returns

`Promise`\<`string`\>
