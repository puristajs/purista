[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/sandbox](../README.md) / SandboxScopeSchema

# Variable: SandboxScopeSchema

> `const` **SandboxScopeSchema**: `ZodDiscriminatedUnion`\<\[`ZodObject`\<\{ `kind`: `ZodLiteral`\<`"shared-project-user"`\>; \}, `$strip`\>, `ZodObject`\<\{ `key`: `ZodString`; `kind`: `ZodLiteral`\<`"agent-run"`\>; \}, `$strip`\>, `ZodObject`\<\{ `key`: `ZodString`; `kind`: `ZodLiteral`\<`"agent-instance"`\>; \}, `$strip`\>, `ZodObject`\<\{ `key`: `ZodString`; `kind`: `ZodLiteral`\<`"conversation"`\>; \}, `$strip`\>, `ZodObject`\<\{ `key`: `ZodString`; `kind`: `ZodLiteral`\<`"runtime-instance"`\>; \}, `$strip`\>, `ZodObject`\<\{ `key`: `ZodString`; `kind`: `ZodLiteral`\<`"custom"`\>; \}, `$strip`\>\], `"kind"`\>

Defined in: [packages/sandbox-service/src/types/SandboxDriver.ts:11](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/sandbox-service/src/types/SandboxDriver.ts#L11)

Optional isolation scope for sandbox ownership and reuse.
When omitted, sandboxes are shared per organization + project + user.
