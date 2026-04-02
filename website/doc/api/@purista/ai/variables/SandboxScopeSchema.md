[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / SandboxScopeSchema

# Variable: SandboxScopeSchema

> `const` **SandboxScopeSchema**: `ZodDiscriminatedUnion`\<\[`ZodObject`\<\{ `kind`: `ZodLiteral`\<`"shared-project-user"`\>; \}, `$strip`\>, `ZodObject`\<\{ `key`: `ZodString`; `kind`: `ZodLiteral`\<`"agent-run"`\>; \}, `$strip`\>, `ZodObject`\<\{ `key`: `ZodString`; `kind`: `ZodLiteral`\<`"agent-instance"`\>; \}, `$strip`\>, `ZodObject`\<\{ `key`: `ZodString`; `kind`: `ZodLiteral`\<`"conversation"`\>; \}, `$strip`\>, `ZodObject`\<\{ `key`: `ZodString`; `kind`: `ZodLiteral`\<`"runtime-instance"`\>; \}, `$strip`\>, `ZodObject`\<\{ `key`: `ZodString`; `kind`: `ZodLiteral`\<`"custom"`\>; \}, `$strip`\>\], `"kind"`\>

Defined in: [packages/ai/src/sandbox/types/SandboxDriver.ts:11](https://github.com/puristajs/purista/blob/22fd555ef1ada6d421f1292a01620a9b2b527601/packages/ai/src/sandbox/types/SandboxDriver.ts#L11)

Optional isolation scope for sandbox ownership and reuse.
When omitted, sandboxes are shared per organization + project + user.
