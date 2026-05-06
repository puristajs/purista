[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / ProviderStreamChunk

# Type Alias: ProviderStreamChunk

> **ProviderStreamChunk** = \{ `textDelta`: `string`; `type`: `"text-delta"`; \} \| \{ `reasoningDelta`: `string`; `type`: `"reasoning-delta"`; \} \| \{ `error`: `unknown`; `type`: `"error"`; \}

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:239](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/providers/runtime/ModelProvider.ts#L239)

Incremental events emitted by [ModelProvider.streamText](../interfaces/ModelProvider.md#streamtext).
