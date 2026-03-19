[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / agentRunRecoverySchema

# Variable: agentRunRecoverySchema

> `const` **agentRunRecoverySchema**: `ZodObject`\<\{ `checkpoint`: `ZodOptional`\<`ZodString`\>; `reason`: `ZodOptional`\<`ZodString`\>; `resumedAt`: `ZodOptional`\<`ZodString`\>; `status`: `ZodEnum`\<\{ `fresh`: `"fresh"`; `recovered-stale`: `"recovered-stale"`; `resumed`: `"resumed"`; `retrying`: `"retrying"`; \}\>; \}, `$strip`\>

Defined in: [packages/ai/src/runtime/runState.ts:104](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/runtime/runState.ts#L104)
