[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / telemetryFrameSchema

# Variable: telemetryFrameSchema

> `const` **telemetryFrameSchema**: `ZodObject`\<\{ `durationMs`: `ZodOptional`\<`ZodNumber`\>; `kind`: `ZodLiteral`\<`"telemetry"`\>; `usage`: `ZodOptional`\<`ZodObject`\<\{ `completionTokens`: `ZodOptional`\<`ZodNumber`\>; `costUsd`: `ZodOptional`\<`ZodNumber`\>; `promptTokens`: `ZodOptional`\<`ZodNumber`\>; `totalTokens`: `ZodOptional`\<`ZodNumber`\>; \}, `$strip`\>\>; \}, `$strip`\>

Defined in: protocol/types.ts:62
