[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / agentRunRecoverySchema

# Variable: agentRunRecoverySchema

> `const` **agentRunRecoverySchema**: `ZodObject`\<\{ `checkpoint`: `ZodOptional`\<`ZodString`\>; `reason`: `ZodOptional`\<`ZodString`\>; `resumedAt`: `ZodOptional`\<`ZodString`\>; `status`: `ZodEnum`\<\{ `fresh`: `"fresh"`; `recovered-stale`: `"recovered-stale"`; `resumed`: `"resumed"`; `retrying`: `"retrying"`; \}\>; \}, `$strip`\>

Defined in: [packages/ai/src/runtime/runState.ts:104](https://github.com/puristajs/purista/blob/22fd555ef1ada6d421f1292a01620a9b2b527601/packages/ai/src/runtime/runState.ts#L104)
