[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AiSdkProviderOptions

# Type Alias: AiSdkProviderOptions

> **AiSdkProviderOptions** = `object`

Defined in: [packages/ai/src/providers/runtime/AiSdkProvider.ts:34](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/ai/src/providers/runtime/AiSdkProvider.ts#L34)

Options accepted by [AiSdkProvider](../classes/AiSdkProvider.md).

## Properties

### defaults?

> `optional` **defaults**: [`AiSdkProviderOverrides`](AiSdkProviderOverrides.md)

Defined in: [packages/ai/src/providers/runtime/AiSdkProvider.ts:58](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/ai/src/providers/runtime/AiSdkProvider.ts#L58)

Default call options forwarded to `generateText` (temperature, maxOutputTokens, tools, ...).

***

### embeddingModel?

> `optional` **embeddingModel**: `EmbeddingModel`

Defined in: [packages/ai/src/providers/runtime/AiSdkProvider.ts:42](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/ai/src/providers/runtime/AiSdkProvider.ts#L42)

Optional embedding model used for `embed` / `embedMany` capability calls.

***

### middleware?

> `optional` **middleware**: `LanguageModelMiddleware` \| `LanguageModelMiddleware`[]

Defined in: [packages/ai/src/providers/runtime/AiSdkProvider.ts:66](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/ai/src/providers/runtime/AiSdkProvider.ts#L66)

Optional AI SDK language model middleware chain.

***

### model

> **model**: `LanguageModel`

Defined in: [packages/ai/src/providers/runtime/AiSdkProvider.ts:38](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/ai/src/providers/runtime/AiSdkProvider.ts#L38)

Language model instance (or provider id) created via the Vercel AI SDK (e.g. `openai('')`).

***

### name?

> `optional` **name**: `string`

Defined in: [packages/ai/src/providers/runtime/AiSdkProvider.ts:50](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/ai/src/providers/runtime/AiSdkProvider.ts#L50)

Optional readable name that shows up in telemetry. Defaults to the model identifier.

***

### rerankingModel?

> `optional` **rerankingModel**: `RerankingModel`

Defined in: [packages/ai/src/providers/runtime/AiSdkProvider.ts:46](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/ai/src/providers/runtime/AiSdkProvider.ts#L46)

Optional reranking model used for `rerank` capability calls.

***

### systemPrompt?

> `optional` **systemPrompt**: `string`

Defined in: [packages/ai/src/providers/runtime/AiSdkProvider.ts:54](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/ai/src/providers/runtime/AiSdkProvider.ts#L54)

Static system prompt prepended to every request.

***

### tracer?

> `optional` **tracer**: `Tracer`

Defined in: [packages/ai/src/providers/runtime/AiSdkProvider.ts:62](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/ai/src/providers/runtime/AiSdkProvider.ts#L62)

Optional tracer injected by the runtime. When set, AI SDK telemetry uses this tracer.
