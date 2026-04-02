[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / ProviderStreamChunk

# Type Alias: ProviderStreamChunk

> **ProviderStreamChunk** = \{ `textDelta`: `string`; `type`: `"text-delta"`; \} \| \{ `reasoningDelta`: `string`; `type`: `"reasoning-delta"`; \} \| \{ `error`: `unknown`; `type`: `"error"`; \}

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:237](https://github.com/puristajs/purista/blob/22fd555ef1ada6d421f1292a01620a9b2b527601/packages/ai/src/providers/runtime/ModelProvider.ts#L237)

Incremental events emitted by [ModelProvider.stream](../interfaces/ModelProvider.md#stream).
