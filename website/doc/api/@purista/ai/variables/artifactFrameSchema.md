[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / artifactFrameSchema

# Variable: artifactFrameSchema

> `const` **artifactFrameSchema**: `ZodObject`\<\{ `artifactId`: `ZodString`; `content`: `ZodUnion`\<readonly \[`ZodString`, `ZodRecord`\<`ZodString`, `ZodUnknown`\>\]\>; `kind`: `ZodLiteral`\<`"artifact"`\>; `lastChunk`: `ZodOptional`\<`ZodBoolean`\>; `mimeType`: `ZodOptional`\<`ZodString`\>; `phase`: `ZodEnum`\<\{ `chunk`: `"chunk"`; `final`: `"final"`; \}\>; `sequence`: `ZodOptional`\<`ZodNumber`\>; `total`: `ZodOptional`\<`ZodNumber`\>; \}, `$strip`\>

Defined in: [ai/src/protocol/types.ts:40](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/protocol/types.ts#L40)
