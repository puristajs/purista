[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / messageFrameSchema

# Variable: messageFrameSchema

> `const` **messageFrameSchema**: `ZodObject`\<\{ `content`: `ZodString`; `final`: `ZodOptional`\<`ZodBoolean`\>; `kind`: `ZodLiteral`\<`"message"`\>; `partial`: `ZodOptional`\<`ZodBoolean`\>; `role`: `ZodEnum`\<\{ `assistant`: `"assistant"`; `developer`: `"developer"`; `system`: `"system"`; `tool`: `"tool"`; `user`: `"user"`; \}\>; `summary`: `ZodOptional`\<`ZodString`\>; \}, `$strip`\>

Defined in: [packages/ai/src/protocol/types.ts:28](https://github.com/puristajs/purista/blob/28d9337ab7fa6d33001a8b6c36fb84bb9236b736/packages/ai/src/protocol/types.ts#L28)
