[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / artifactFrameSchema

# Variable: artifactFrameSchema

> `const` **artifactFrameSchema**: `ZodObject`\<\{ `artifactId`: `ZodString`; `content`: `ZodUnion`\<readonly \[`ZodString`, `ZodRecord`\<`ZodString`, `ZodUnknown`\>\]\>; `kind`: `ZodLiteral`\<`"artifact"`\>; `lastChunk`: `ZodOptional`\<`ZodBoolean`\>; `mimeType`: `ZodOptional`\<`ZodString`\>; `phase`: `ZodEnum`\<\{ `chunk`: `"chunk"`; `final`: `"final"`; \}\>; \}, `$strip`\>

Defined in: protocol/types.ts:38
