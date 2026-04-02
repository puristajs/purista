[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / SandboxMetadataSchema

# Variable: SandboxMetadataSchema

> `const` **SandboxMetadataSchema**: `ZodObject`\<\{ `containerName`: `ZodString`; `createdAt`: `ZodNumber`; `gitConfigured`: `ZodOptional`\<`ZodBoolean`\>; `organizationId`: `ZodString`; `projectId`: `ZodString`; `sandboxId`: `ZodString`; `scope`: `ZodOptional`\<`ZodDiscriminatedUnion`\<\[`ZodObject`\<\{ `kind`: `ZodLiteral`\<`"shared-project-user"`\>; \}, `$strip`\>, `ZodObject`\<\{ `key`: `ZodString`; `kind`: `ZodLiteral`\<`"agent-run"`\>; \}, `$strip`\>, `ZodObject`\<\{ `key`: `ZodString`; `kind`: `ZodLiteral`\<`"agent-instance"`\>; \}, `$strip`\>, `ZodObject`\<\{ `key`: `ZodString`; `kind`: `ZodLiteral`\<`"conversation"`\>; \}, `$strip`\>, `ZodObject`\<\{ `key`: `ZodString`; `kind`: `ZodLiteral`\<`"runtime-instance"`\>; \}, `$strip`\>, `ZodObject`\<\{ `key`: `ZodString`; `kind`: `ZodLiteral`\<`"custom"`\>; \}, `$strip`\>\], `"kind"`\>\>; `userId`: `ZodString`; \}, `$strip`\>

Defined in: [packages/ai/src/sandbox/types/SandboxDriver.ts:59](https://github.com/puristajs/purista/blob/430e29c621b412b5f21de4eb9697723299bc616e/packages/ai/src/sandbox/types/SandboxDriver.ts#L59)

Metadata for a sandbox instance used for registry and reconciliation.
