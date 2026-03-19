[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / toolEventFrameSchema

# Variable: toolEventFrameSchema

> `const` **toolEventFrameSchema**: `ZodObject`\<\{ `errorCode`: `ZodOptional`\<`ZodString`\>; `input`: `ZodOptional`\<`ZodUnknown`\>; `kind`: `ZodLiteral`\<`"tool"`\>; `message`: `ZodOptional`\<`ZodString`\>; `output`: `ZodOptional`\<`ZodUnknown`\>; `status`: `ZodEnum`\<\{ `error`: `"error"`; `invoked`: `"invoked"`; `success`: `"success"`; \}\>; `toolName`: `ZodString`; \}, `$strip`\>

Defined in: [packages/ai/src/protocol/types.ts:54](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/protocol/types.ts#L54)
