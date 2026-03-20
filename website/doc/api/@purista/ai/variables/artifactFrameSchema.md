[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / artifactFrameSchema

# Variable: artifactFrameSchema

> `const` **artifactFrameSchema**: `ZodObject`\<\{ `artifactId`: `ZodString`; `content`: `ZodUnion`\<readonly \[`ZodString`, `ZodRecord`\<`ZodString`, `ZodUnknown`\>\]\>; `kind`: `ZodLiteral`\<`"artifact"`\>; `lastChunk`: `ZodOptional`\<`ZodBoolean`\>; `mimeType`: `ZodOptional`\<`ZodString`\>; `phase`: `ZodEnum`\<\{ `chunk`: `"chunk"`; `final`: `"final"`; \}\>; `sequence`: `ZodOptional`\<`ZodNumber`\>; `total`: `ZodOptional`\<`ZodNumber`\>; \}, `$strip`\>

Defined in: [packages/ai/src/protocol/types.ts:40](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/protocol/types.ts#L40)
