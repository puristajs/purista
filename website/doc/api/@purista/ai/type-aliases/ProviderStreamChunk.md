[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / ProviderStreamChunk

# Type Alias: ProviderStreamChunk

> **ProviderStreamChunk** = \{ `textDelta`: `string`; `type`: `"text-delta"`; \} \| \{ `reasoningDelta`: `string`; `type`: `"reasoning-delta"`; \} \| \{ `error`: `unknown`; `type`: `"error"`; \}

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:237](https://github.com/puristajs/purista/blob/a54e4eedd3278d44c6382db014435e1a5908fb6f/packages/ai/src/providers/runtime/ModelProvider.ts#L237)

Incremental events emitted by [ModelProvider.stream](../interfaces/ModelProvider.md#stream).
