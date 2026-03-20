[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/sandbox](../README.md) / SandboxMetadataSchema

# Variable: SandboxMetadataSchema

> `const` **SandboxMetadataSchema**: `ZodObject`\<\{ `containerName`: `ZodString`; `createdAt`: `ZodNumber`; `gitConfigured`: `ZodOptional`\<`ZodBoolean`\>; `organizationId`: `ZodString`; `projectId`: `ZodString`; `sandboxId`: `ZodString`; `userId`: `ZodString`; \}, `$strip`\>

Defined in: [sandbox-service/src/types/SandboxDriver.ts:27](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/sandbox-service/src/types/SandboxDriver.ts#L27)

Metadata for a sandbox instance used for registry and reconciliation.
