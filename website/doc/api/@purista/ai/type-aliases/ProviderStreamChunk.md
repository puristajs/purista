[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / ProviderStreamChunk

# Type Alias: ProviderStreamChunk

> **ProviderStreamChunk** = \{ `textDelta`: `string`; `type`: `"text-delta"`; \} \| \{ `reasoningDelta`: `string`; `type`: `"reasoning-delta"`; \} \| \{ `error`: `unknown`; `type`: `"error"`; \}

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:162](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/providers/runtime/ModelProvider.ts#L162)

Incremental events emitted by [ModelProvider.stream](../interfaces/ModelProvider.md#stream).
