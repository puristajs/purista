[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / SandboxDescriptorSchema

# Variable: SandboxDescriptorSchema

> `const` **SandboxDescriptorSchema**: `ZodObject`\<\{ `created`: `ZodBoolean`; `sandboxId`: `ZodString`; `scope`: `ZodOptional`\<`ZodDiscriminatedUnion`\<\[`ZodObject`\<\{ `kind`: `ZodLiteral`\<`"shared-project-user"`\>; \}, `$strip`\>, `ZodObject`\<\{ `key`: `ZodString`; `kind`: `ZodLiteral`\<`"agent-run"`\>; \}, `$strip`\>, `ZodObject`\<\{ `key`: `ZodString`; `kind`: `ZodLiteral`\<`"agent-instance"`\>; \}, `$strip`\>, `ZodObject`\<\{ `key`: `ZodString`; `kind`: `ZodLiteral`\<`"conversation"`\>; \}, `$strip`\>, `ZodObject`\<\{ `key`: `ZodString`; `kind`: `ZodLiteral`\<`"runtime-instance"`\>; \}, `$strip`\>, `ZodObject`\<\{ `key`: `ZodString`; `kind`: `ZodLiteral`\<`"custom"`\>; \}, `$strip`\>\], `"kind"`\>\>; `status`: `ZodEnum`\<\{ `failed`: `"failed"`; `ready`: `"ready"`; `starting`: `"starting"`; \}\>; `subject`: `ZodObject`\<\{ `principalId`: `ZodString`; `projectId`: `ZodString`; `tenantId`: `ZodString`; \}, `$strip`\>; \}, `$strip`\>

Defined in: packages/ai/src/sandbox/provider.ts:40
