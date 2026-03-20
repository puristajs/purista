[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / ProviderStreamChunk

# Type Alias: ProviderStreamChunk

> **ProviderStreamChunk** = \{ `textDelta`: `string`; `type`: `"text-delta"`; \} \| \{ `reasoningDelta`: `string`; `type`: `"reasoning-delta"`; \} \| \{ `error`: `unknown`; `type`: `"error"`; \}

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:136](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/ai/src/providers/runtime/ModelProvider.ts#L136)

Incremental events emitted by [ModelProvider.stream](../interfaces/ModelProvider.md#stream).
