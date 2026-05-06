[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / agentRunTaskExecutorSchema

# Variable: agentRunTaskExecutorSchema

> `const` **agentRunTaskExecutorSchema**: `ZodDiscriminatedUnion`\<\[`ZodObject`\<\{ `handler`: `ZodString`; `type`: `ZodLiteral`\<`"local"`\>; \}, `$strip`\>, `ZodObject`\<\{ `commandName`: `ZodString`; `serviceName`: `ZodString`; `serviceVersion`: `ZodString`; `type`: `ZodLiteral`\<`"tool"`\>; \}, `$strip`\>, `ZodObject`\<\{ `agentName`: `ZodString`; `forwardToCurrentStream`: `ZodOptional`\<`ZodUnion`\<readonly \[`ZodBoolean`, `ZodObject`\<\{ `artifacts`: `ZodOptional`\<`ZodUnion`\<...\>\>; `assistant`: `ZodOptional`\<`ZodBoolean`\>; `errors`: `ZodOptional`\<`ZodBoolean`\>; `reasoning`: `ZodOptional`\<`ZodBoolean`\>; `toolEvents`: `ZodOptional`\<`ZodBoolean`\>; \}, `$strip`\>\]\>\>; `serviceVersion`: `ZodString`; `type`: `ZodLiteral`\<`"agent"`\>; \}, `$strip`\>, `ZodObject`\<\{ `checkpoint`: `ZodString`; `type`: `ZodLiteral`\<`"approval"`\>; \}, `$strip`\>\], `"type"`\>

Defined in: [packages/ai/src/runtime/runState.ts:85](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/runState.ts#L85)
