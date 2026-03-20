[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / telemetryFrameSchema

# Variable: telemetryFrameSchema

> `const` **telemetryFrameSchema**: `ZodObject`\<\{ `activeWorkers`: `ZodOptional`\<`ZodNumber`\>; `durationMs`: `ZodOptional`\<`ZodNumber`\>; `effectiveMaxConcurrencyHint`: `ZodOptional`\<`ZodNumber`\>; `kind`: `ZodLiteral`\<`"telemetry"`\>; `maxConcurrencyPerInstance`: `ZodOptional`\<`ZodNumber`\>; `poolId`: `ZodOptional`\<`ZodString`\>; `provider`: `ZodOptional`\<`ZodString`\>; `replicaCountHint`: `ZodOptional`\<`ZodNumber`\>; `usage`: `ZodOptional`\<`ZodObject`\<\{ `completionTokens`: `ZodOptional`\<`ZodNumber`\>; `costUsd`: `ZodOptional`\<`ZodNumber`\>; `promptTokens`: `ZodOptional`\<`ZodNumber`\>; `totalTokens`: `ZodOptional`\<`ZodNumber`\>; \}, `$strip`\>\>; `waitingWorkers`: `ZodOptional`\<`ZodNumber`\>; `waitTimeMs`: `ZodOptional`\<`ZodNumber`\>; \}, `$strip`\>

Defined in: [packages/ai/src/protocol/types.ts:67](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/ai/src/protocol/types.ts#L67)
