[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / agentRunTaskApprovalSchema

# Variable: agentRunTaskApprovalSchema

> `const` **agentRunTaskApprovalSchema**: `ZodOptional`\<`ZodObject`\<\{ `checkpoint`: `ZodString`; `onExpiry`: `ZodOptional`\<`ZodEnum`\<\{ `fail`: `"fail"`; `return-expired`: `"return-expired"`; \}\>\>; `required`: `ZodDefault`\<`ZodBoolean`\>; `timeoutMs`: `ZodOptional`\<`ZodNumber`\>; \}, `$strip`\>\>

Defined in: [packages/ai/src/runtime/runState.ts:147](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/runState.ts#L147)
