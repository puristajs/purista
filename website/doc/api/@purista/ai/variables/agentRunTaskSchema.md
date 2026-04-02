[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / agentRunTaskSchema

# Variable: agentRunTaskSchema

> `const` **agentRunTaskSchema**: `ZodObject`\<\{ `completedAt`: `ZodOptional`\<`ZodString`\>; `detail`: `ZodOptional`\<`ZodString`\>; `id`: `ZodString`; `order`: `ZodNumber`; `startedAt`: `ZodOptional`\<`ZodString`\>; `status`: `ZodEnum`\<\{ `completed`: `"completed"`; `failed`: `"failed"`; `pending`: `"pending"`; `running`: `"running"`; \}\>; `title`: `ZodString`; `updatedAt`: `ZodOptional`\<`ZodString`\>; \}, `$strip`\>

Defined in: [packages/ai/src/runtime/runState.ts:53](https://github.com/puristajs/purista/blob/28d9337ab7fa6d33001a8b6c36fb84bb9236b736/packages/ai/src/runtime/runState.ts#L53)
