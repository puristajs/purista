[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AiSdkProviderOptions

# Type Alias: AiSdkProviderOptions

> **AiSdkProviderOptions** = `object`

Defined in: [ai/src/providers/runtime/AiSdkProvider.ts:10](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/providers/runtime/AiSdkProvider.ts#L10)

Options accepted by [AiSdkProvider](../classes/AiSdkProvider.md).

## Properties

### defaults?

> `optional` **defaults**: [`AiSdkProviderOverrides`](AiSdkProviderOverrides.md)

Defined in: [ai/src/providers/runtime/AiSdkProvider.ts:26](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/providers/runtime/AiSdkProvider.ts#L26)

Default call options forwarded to `generateText` (temperature, maxOutputTokens, tools, ...).

***

### model

> **model**: `LanguageModel`

Defined in: [ai/src/providers/runtime/AiSdkProvider.ts:14](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/providers/runtime/AiSdkProvider.ts#L14)

Language model instance (or provider id) created via the Vercel AI SDK (e.g. `openai('gpt-4o-mini')`).

***

### name?

> `optional` **name**: `string`

Defined in: [ai/src/providers/runtime/AiSdkProvider.ts:18](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/providers/runtime/AiSdkProvider.ts#L18)

Optional readable name that shows up in telemetry. Defaults to the model identifier.

***

### systemPrompt?

> `optional` **systemPrompt**: `string`

Defined in: [ai/src/providers/runtime/AiSdkProvider.ts:22](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/providers/runtime/AiSdkProvider.ts#L22)

Static system prompt prepended to every request.

***

### tracer?

> `optional` **tracer**: `Tracer`

Defined in: [ai/src/providers/runtime/AiSdkProvider.ts:30](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/providers/runtime/AiSdkProvider.ts#L30)

Optional tracer injected by the runtime. When set, AI SDK telemetry uses this tracer.
