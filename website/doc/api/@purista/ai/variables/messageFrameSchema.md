[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / messageFrameSchema

# Variable: messageFrameSchema

> `const` **messageFrameSchema**: `ZodObject`\<\{ `content`: `ZodString`; `final`: `ZodOptional`\<`ZodBoolean`\>; `kind`: `ZodLiteral`\<`"message"`\>; `partial`: `ZodOptional`\<`ZodBoolean`\>; `role`: `ZodEnum`\<\{ `assistant`: `"assistant"`; `developer`: `"developer"`; `system`: `"system"`; `tool`: `"tool"`; `user`: `"user"`; \}\>; `summary`: `ZodOptional`\<`ZodString`\>; \}, `$strip`\>

Defined in: [packages/ai/src/protocol/types.ts:28](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/protocol/types.ts#L28)
