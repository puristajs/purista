[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / agentRunRecoverySchema

# Variable: agentRunRecoverySchema

> `const` **agentRunRecoverySchema**: `ZodObject`\<\{ `checkpoint`: `ZodOptional`\<`ZodString`\>; `reason`: `ZodOptional`\<`ZodString`\>; `resumedAt`: `ZodOptional`\<`ZodString`\>; `status`: `ZodEnum`\<\{ `fresh`: `"fresh"`; `recovered-stale`: `"recovered-stale"`; `resumed`: `"resumed"`; `retrying`: `"retrying"`; \}\>; \}, `$strip`\>

Defined in: [packages/ai/src/runtime/runState.ts:104](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/runtime/runState.ts#L104)
