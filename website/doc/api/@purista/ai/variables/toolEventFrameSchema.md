[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / toolEventFrameSchema

# Variable: toolEventFrameSchema

> `const` **toolEventFrameSchema**: `ZodObject`\<\{ `errorCode`: `ZodOptional`\<`ZodString`\>; `input`: `ZodOptional`\<`ZodUnknown`\>; `kind`: `ZodLiteral`\<`"tool"`\>; `message`: `ZodOptional`\<`ZodString`\>; `output`: `ZodOptional`\<`ZodUnknown`\>; `status`: `ZodEnum`\<\{ `error`: `"error"`; `invoked`: `"invoked"`; `success`: `"success"`; \}\>; `toolName`: `ZodString`; \}, `$strip`\>

Defined in: [packages/ai/src/protocol/types.ts:54](https://github.com/puristajs/purista/blob/a54e4eedd3278d44c6382db014435e1a5908fb6f/packages/ai/src/protocol/types.ts#L54)
