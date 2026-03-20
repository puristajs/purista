[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/sandbox](../README.md) / SandboxMetadataSchema

# Variable: SandboxMetadataSchema

> `const` **SandboxMetadataSchema**: `ZodObject`\<\{ `containerName`: `ZodString`; `createdAt`: `ZodNumber`; `gitConfigured`: `ZodOptional`\<`ZodBoolean`\>; `organizationId`: `ZodString`; `projectId`: `ZodString`; `sandboxId`: `ZodString`; `scope`: `ZodOptional`\<`ZodDiscriminatedUnion`\<\[`ZodObject`\<\{ `kind`: `ZodLiteral`\<`"shared-project-user"`\>; \}, `$strip`\>, `ZodObject`\<\{ `key`: `ZodString`; `kind`: `ZodLiteral`\<`"agent-run"`\>; \}, `$strip`\>, `ZodObject`\<\{ `key`: `ZodString`; `kind`: `ZodLiteral`\<`"agent-instance"`\>; \}, `$strip`\>, `ZodObject`\<\{ `key`: `ZodString`; `kind`: `ZodLiteral`\<`"conversation"`\>; \}, `$strip`\>, `ZodObject`\<\{ `key`: `ZodString`; `kind`: `ZodLiteral`\<`"runtime-instance"`\>; \}, `$strip`\>, `ZodObject`\<\{ `key`: `ZodString`; `kind`: `ZodLiteral`\<`"custom"`\>; \}, `$strip`\>\], `"kind"`\>\>; `userId`: `ZodString`; \}, `$strip`\>

Defined in: [packages/sandbox-service/src/types/SandboxDriver.ts:59](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/sandbox-service/src/types/SandboxDriver.ts#L59)

Metadata for a sandbox instance used for registry and reconciliation.
