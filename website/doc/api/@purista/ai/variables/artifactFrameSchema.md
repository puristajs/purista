[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / artifactFrameSchema

# Variable: artifactFrameSchema

> `const` **artifactFrameSchema**: `ZodObject`\<\{ `artifactId`: `ZodString`; `content`: `ZodUnion`\<readonly \[`ZodString`, `ZodRecord`\<`ZodString`, `ZodUnknown`\>\]\>; `kind`: `ZodLiteral`\<`"artifact"`\>; `lastChunk`: `ZodOptional`\<`ZodBoolean`\>; `mimeType`: `ZodOptional`\<`ZodString`\>; `phase`: `ZodEnum`\<\{ `chunk`: `"chunk"`; `final`: `"final"`; \}\>; `sequence`: `ZodOptional`\<`ZodNumber`\>; `total`: `ZodOptional`\<`ZodNumber`\>; \}, `$strip`\>

Defined in: [packages/ai/src/protocol/types.ts:40](https://github.com/puristajs/purista/blob/28d9337ab7fa6d33001a8b6c36fb84bb9236b736/packages/ai/src/protocol/types.ts#L40)
