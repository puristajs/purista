[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AiSdkProviderOptions

# Type Alias: AiSdkProviderOptions

> **AiSdkProviderOptions** = `object`

Defined in: [packages/ai/src/providers/runtime/AiSdkProvider.ts:48](https://github.com/puristajs/purista/blob/6e0354b1e51abc331c66c917ee95829470c9fba2/packages/ai/src/providers/runtime/AiSdkProvider.ts#L48)

Options accepted by [AiSdkProvider](../classes/AiSdkProvider.md).

## Properties

### defaults?

> `optional` **defaults**: [`AiSdkProviderDefaults`](AiSdkProviderDefaults.md)

Defined in: [packages/ai/src/providers/runtime/AiSdkProvider.ts:73](https://github.com/puristajs/purista/blob/6e0354b1e51abc331c66c917ee95829470c9fba2/packages/ai/src/providers/runtime/AiSdkProvider.ts#L73)

Default call options forwarded to `generateText` (temperature, maxOutputTokens, tools, ...).
Use `invocation` for bounded timeout/retry policy.

***

### embeddingModel?

> `optional` **embeddingModel**: `EmbeddingModel`

Defined in: [packages/ai/src/providers/runtime/AiSdkProvider.ts:56](https://github.com/puristajs/purista/blob/6e0354b1e51abc331c66c917ee95829470c9fba2/packages/ai/src/providers/runtime/AiSdkProvider.ts#L56)

Optional embedding model used for `embed` / `embedMany` capability calls.

***

### middleware?

> `optional` **middleware**: `LanguageModelMiddleware` \| `LanguageModelMiddleware`[]

Defined in: [packages/ai/src/providers/runtime/AiSdkProvider.ts:81](https://github.com/puristajs/purista/blob/6e0354b1e51abc331c66c917ee95829470c9fba2/packages/ai/src/providers/runtime/AiSdkProvider.ts#L81)

Optional AI SDK language model middleware chain.

***

### model

> **model**: [`LanguageModel`](https://ai-sdk.dev/docs/reference/ai-sdk-core/stream-text)

Defined in: [packages/ai/src/providers/runtime/AiSdkProvider.ts:52](https://github.com/puristajs/purista/blob/6e0354b1e51abc331c66c917ee95829470c9fba2/packages/ai/src/providers/runtime/AiSdkProvider.ts#L52)

Language model instance (or provider id) created via the Vercel AI SDK (e.g. `openai('')`).

***

### name?

> `optional` **name**: `string`

Defined in: [packages/ai/src/providers/runtime/AiSdkProvider.ts:64](https://github.com/puristajs/purista/blob/6e0354b1e51abc331c66c917ee95829470c9fba2/packages/ai/src/providers/runtime/AiSdkProvider.ts#L64)

Optional readable name that shows up in telemetry. Defaults to the model identifier.

***

### rerankingModel?

> `optional` **rerankingModel**: `RerankingModel`

Defined in: [packages/ai/src/providers/runtime/AiSdkProvider.ts:60](https://github.com/puristajs/purista/blob/6e0354b1e51abc331c66c917ee95829470c9fba2/packages/ai/src/providers/runtime/AiSdkProvider.ts#L60)

Optional reranking model used for `rerank` capability calls.

***

### systemPrompt?

> `optional` **systemPrompt**: `string`

Defined in: [packages/ai/src/providers/runtime/AiSdkProvider.ts:68](https://github.com/puristajs/purista/blob/6e0354b1e51abc331c66c917ee95829470c9fba2/packages/ai/src/providers/runtime/AiSdkProvider.ts#L68)

Static system prompt prepended to every request.

***

### tracer?

> `optional` **tracer**: `Tracer`

Defined in: [packages/ai/src/providers/runtime/AiSdkProvider.ts:77](https://github.com/puristajs/purista/blob/6e0354b1e51abc331c66c917ee95829470c9fba2/packages/ai/src/providers/runtime/AiSdkProvider.ts#L77)

Optional tracer injected by the runtime. When set, AI SDK telemetry uses this tracer.
