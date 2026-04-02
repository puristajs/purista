[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / ProviderStreamChunk

# Type Alias: ProviderStreamChunk

> **ProviderStreamChunk** = \{ `textDelta`: `string`; `type`: `"text-delta"`; \} \| \{ `reasoningDelta`: `string`; `type`: `"reasoning-delta"`; \} \| \{ `error`: `unknown`; `type`: `"error"`; \}

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:237](https://github.com/puristajs/purista/blob/430e29c621b412b5f21de4eb9697723299bc616e/packages/ai/src/providers/runtime/ModelProvider.ts#L237)

Incremental events emitted by [ModelProvider.stream](../interfaces/ModelProvider.md#stream).
