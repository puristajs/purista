[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / artifactFrameSchema

# Variable: artifactFrameSchema

> `const` **artifactFrameSchema**: `ZodObject`\<\{ `artifactId`: `ZodString`; `content`: `ZodUnion`\<readonly \[`ZodString`, `ZodRecord`\<`ZodString`, `ZodUnknown`\>\]\>; `kind`: `ZodLiteral`\<`"artifact"`\>; `lastChunk`: `ZodOptional`\<`ZodBoolean`\>; `mimeType`: `ZodOptional`\<`ZodString`\>; `phase`: `ZodEnum`\<\{ `chunk`: `"chunk"`; `final`: `"final"`; \}\>; `sequence`: `ZodOptional`\<`ZodNumber`\>; `total`: `ZodOptional`\<`ZodNumber`\>; \}, `$strip`\>

Defined in: [packages/ai/src/protocol/types.ts:40](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/protocol/types.ts#L40)
