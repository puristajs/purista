[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AiSdkProviderOptions

# Type Alias: AiSdkProviderOptions

> **AiSdkProviderOptions** = `object`

Defined in: [packages/ai/src/providers/runtime/AiSdkProvider.ts:35](https://github.com/puristajs/purista/blob/4404dd96f5462503c1bc6e1de335782a5a892137/packages/ai/src/providers/runtime/AiSdkProvider.ts#L35)

Options accepted by [AiSdkProvider](../classes/AiSdkProvider.md).

## Properties

### defaults?

> `optional` **defaults**: [`AiSdkProviderOverrides`](AiSdkProviderOverrides.md)

Defined in: [packages/ai/src/providers/runtime/AiSdkProvider.ts:59](https://github.com/puristajs/purista/blob/4404dd96f5462503c1bc6e1de335782a5a892137/packages/ai/src/providers/runtime/AiSdkProvider.ts#L59)

Default call options forwarded to `generateText` (temperature, maxOutputTokens, tools, ...).

***

### embeddingModel?

> `optional` **embeddingModel**: `EmbeddingModel`

Defined in: [packages/ai/src/providers/runtime/AiSdkProvider.ts:43](https://github.com/puristajs/purista/blob/4404dd96f5462503c1bc6e1de335782a5a892137/packages/ai/src/providers/runtime/AiSdkProvider.ts#L43)

Optional embedding model used for `embed` / `embedMany` capability calls.

***

### middleware?

> `optional` **middleware**: `LanguageModelMiddleware` \| `LanguageModelMiddleware`[]

Defined in: [packages/ai/src/providers/runtime/AiSdkProvider.ts:67](https://github.com/puristajs/purista/blob/4404dd96f5462503c1bc6e1de335782a5a892137/packages/ai/src/providers/runtime/AiSdkProvider.ts#L67)

Optional AI SDK language model middleware chain.

***

### model

> **model**: [`LanguageModel`](https://ai-sdk.dev/docs/reference/ai-sdk-core/stream-text)

Defined in: [packages/ai/src/providers/runtime/AiSdkProvider.ts:39](https://github.com/puristajs/purista/blob/4404dd96f5462503c1bc6e1de335782a5a892137/packages/ai/src/providers/runtime/AiSdkProvider.ts#L39)

Language model instance (or provider id) created via the Vercel AI SDK (e.g. `openai('')`).

***

### name?

> `optional` **name**: `string`

Defined in: [packages/ai/src/providers/runtime/AiSdkProvider.ts:51](https://github.com/puristajs/purista/blob/4404dd96f5462503c1bc6e1de335782a5a892137/packages/ai/src/providers/runtime/AiSdkProvider.ts#L51)

Optional readable name that shows up in telemetry. Defaults to the model identifier.

***

### rerankingModel?

> `optional` **rerankingModel**: `RerankingModel`

Defined in: [packages/ai/src/providers/runtime/AiSdkProvider.ts:47](https://github.com/puristajs/purista/blob/4404dd96f5462503c1bc6e1de335782a5a892137/packages/ai/src/providers/runtime/AiSdkProvider.ts#L47)

Optional reranking model used for `rerank` capability calls.

***

### systemPrompt?

> `optional` **systemPrompt**: `string`

Defined in: [packages/ai/src/providers/runtime/AiSdkProvider.ts:55](https://github.com/puristajs/purista/blob/4404dd96f5462503c1bc6e1de335782a5a892137/packages/ai/src/providers/runtime/AiSdkProvider.ts#L55)

Static system prompt prepended to every request.

***

### tracer?

> `optional` **tracer**: `Tracer`

Defined in: [packages/ai/src/providers/runtime/AiSdkProvider.ts:63](https://github.com/puristajs/purista/blob/4404dd96f5462503c1bc6e1de335782a5a892137/packages/ai/src/providers/runtime/AiSdkProvider.ts#L63)

Optional tracer injected by the runtime. When set, AI SDK telemetry uses this tracer.
