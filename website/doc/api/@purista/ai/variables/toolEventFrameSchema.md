[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / toolEventFrameSchema

# Variable: toolEventFrameSchema

> `const` **toolEventFrameSchema**: `ZodObject`\<\{ `errorCode`: `ZodOptional`\<`ZodString`\>; `input`: `ZodOptional`\<`ZodUnknown`\>; `kind`: `ZodLiteral`\<`"tool"`\>; `message`: `ZodOptional`\<`ZodString`\>; `output`: `ZodOptional`\<`ZodUnknown`\>; `status`: `ZodEnum`\<\{ `error`: `"error"`; `invoked`: `"invoked"`; `success`: `"success"`; \}\>; `toolName`: `ZodString`; \}, `$strip`\>

Defined in: [ai/src/protocol/types.ts:54](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/protocol/types.ts#L54)
