[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / messageFrameSchema

# Variable: messageFrameSchema

> `const` **messageFrameSchema**: `ZodObject`\<\{ `content`: `ZodString`; `final`: `ZodOptional`\<`ZodBoolean`\>; `kind`: `ZodLiteral`\<`"message"`\>; `partial`: `ZodOptional`\<`ZodBoolean`\>; `role`: `ZodEnum`\<\{ `assistant`: `"assistant"`; `system`: `"system"`; `tool`: `"tool"`; `user`: `"user"`; \}\>; `summary`: `ZodOptional`\<`ZodString`\>; \}, `$strip`\>

Defined in: [ai/src/protocol/types.ts:28](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/protocol/types.ts#L28)
