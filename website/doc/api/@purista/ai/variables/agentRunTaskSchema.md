[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / agentRunTaskSchema

# Variable: agentRunTaskSchema

> `const` **agentRunTaskSchema**: `ZodObject`\<\{ `completedAt`: `ZodOptional`\<`ZodString`\>; `detail`: `ZodOptional`\<`ZodString`\>; `id`: `ZodString`; `order`: `ZodNumber`; `startedAt`: `ZodOptional`\<`ZodString`\>; `status`: `ZodEnum`\<\{ `completed`: `"completed"`; `failed`: `"failed"`; `pending`: `"pending"`; `running`: `"running"`; \}\>; `title`: `ZodString`; `updatedAt`: `ZodOptional`\<`ZodString`\>; \}, `$strip`\>

Defined in: [packages/ai/src/runtime/runState.ts:53](https://github.com/puristajs/purista/blob/6e0354b1e51abc331c66c917ee95829470c9fba2/packages/ai/src/runtime/runState.ts#L53)
