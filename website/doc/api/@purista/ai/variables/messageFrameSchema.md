[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / messageFrameSchema

# Variable: messageFrameSchema

> `const` **messageFrameSchema**: `ZodObject`\<\{ `content`: `ZodString`; `final`: `ZodOptional`\<`ZodBoolean`\>; `kind`: `ZodLiteral`\<`"message"`\>; `partial`: `ZodOptional`\<`ZodBoolean`\>; `role`: `ZodEnum`\<\{ `assistant`: `"assistant"`; `developer`: `"developer"`; `system`: `"system"`; `tool`: `"tool"`; `user`: `"user"`; \}\>; `summary`: `ZodOptional`\<`ZodString`\>; \}, `$strip`\>

Defined in: [packages/ai/src/protocol/types.ts:28](https://github.com/puristajs/purista/blob/430e29c621b412b5f21de4eb9697723299bc616e/packages/ai/src/protocol/types.ts#L28)
