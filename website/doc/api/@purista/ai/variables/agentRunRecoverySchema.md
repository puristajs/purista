[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / agentRunRecoverySchema

# Variable: agentRunRecoverySchema

> `const` **agentRunRecoverySchema**: `ZodObject`\<\{ `checkpoint`: `ZodOptional`\<`ZodString`\>; `reason`: `ZodOptional`\<`ZodString`\>; `resumedAt`: `ZodOptional`\<`ZodString`\>; `status`: `ZodEnum`\<\{ `fresh`: `"fresh"`; `recovered-stale`: `"recovered-stale"`; `resumed`: `"resumed"`; `retrying`: `"retrying"`; \}\>; \}, `$strip`\>

Defined in: [packages/ai/src/runtime/runState.ts:104](https://github.com/puristajs/purista/blob/6e0354b1e51abc331c66c917ee95829470c9fba2/packages/ai/src/runtime/runState.ts#L104)
