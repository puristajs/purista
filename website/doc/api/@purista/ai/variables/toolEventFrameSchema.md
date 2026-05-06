[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / toolEventFrameSchema

# Variable: toolEventFrameSchema

> `const` **toolEventFrameSchema**: `ZodObject`\<\{ `errorCode`: `ZodOptional`\<`ZodString`\>; `input`: `ZodOptional`\<`ZodUnknown`\>; `kind`: `ZodLiteral`\<`"tool"`\>; `message`: `ZodOptional`\<`ZodString`\>; `output`: `ZodOptional`\<`ZodUnknown`\>; `status`: `ZodEnum`\<\{ `error`: `"error"`; `invoked`: `"invoked"`; `success`: `"success"`; \}\>; `toolName`: `ZodString`; \}, `$strip`\>

Defined in: [packages/ai/src/protocol/types.ts:67](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/protocol/types.ts#L67)
