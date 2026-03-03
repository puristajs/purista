[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AiSdkProviderOptions

# Type Alias: AiSdkProviderOptions

> **AiSdkProviderOptions** = `object`

Defined in: [ai/src/providers/runtime/AiSdkProvider.ts:9](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/providers/runtime/AiSdkProvider.ts#L9)

Options accepted by [AiSdkProvider](../classes/AiSdkProvider.md).

## Properties

### defaults?

> `optional` **defaults**: [`AiSdkProviderOverrides`](AiSdkProviderOverrides.md)

Defined in: [ai/src/providers/runtime/AiSdkProvider.ts:25](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/providers/runtime/AiSdkProvider.ts#L25)

Default call options forwarded to `generateText` (temperature, maxOutputTokens, tools, ...).

***

### model

> **model**: `LanguageModel`

Defined in: [ai/src/providers/runtime/AiSdkProvider.ts:13](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/providers/runtime/AiSdkProvider.ts#L13)

Language model instance (or provider id) created via the Vercel AI SDK (e.g. `openai('gpt-4o-mini')`).

***

### name?

> `optional` **name**: `string`

Defined in: [ai/src/providers/runtime/AiSdkProvider.ts:17](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/providers/runtime/AiSdkProvider.ts#L17)

Optional readable name that shows up in telemetry. Defaults to the model identifier.

***

### systemPrompt?

> `optional` **systemPrompt**: `string`

Defined in: [ai/src/providers/runtime/AiSdkProvider.ts:21](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/providers/runtime/AiSdkProvider.ts#L21)

Static system prompt prepended to every request.
