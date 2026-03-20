[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / agentRunRecoverySchema

# Variable: agentRunRecoverySchema

> `const` **agentRunRecoverySchema**: `ZodObject`\<\{ `checkpoint`: `ZodOptional`\<`ZodString`\>; `reason`: `ZodOptional`\<`ZodString`\>; `resumedAt`: `ZodOptional`\<`ZodString`\>; `status`: `ZodEnum`\<\{ `fresh`: `"fresh"`; `recovered-stale`: `"recovered-stale"`; `resumed`: `"resumed"`; `retrying`: `"retrying"`; \}\>; \}, `$strip`\>

Defined in: [packages/ai/src/runtime/runState.ts:104](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/runtime/runState.ts#L104)
