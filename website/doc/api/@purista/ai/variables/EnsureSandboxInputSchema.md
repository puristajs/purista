[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / EnsureSandboxInputSchema

# Variable: EnsureSandboxInputSchema

> `const` **EnsureSandboxInputSchema**: `ZodObject`\<\{ `gitConfig`: `ZodOptional`\<`ZodObject`\<\{ `email`: `ZodString`; `token`: `ZodOptional`\<`ZodString`\>; `username`: `ZodString`; \}, `$strip`\>\>; `organizationId`: `ZodOptional`\<`ZodString`\>; `projectId`: `ZodString`; `scope`: `ZodOptional`\<`ZodDiscriminatedUnion`\<\[`ZodObject`\<\{ `kind`: `ZodLiteral`\<`"shared-project-user"`\>; \}, `$strip`\>, `ZodObject`\<\{ `key`: `ZodString`; `kind`: `ZodLiteral`\<`"agent-run"`\>; \}, `$strip`\>, `ZodObject`\<\{ `key`: `ZodString`; `kind`: `ZodLiteral`\<`"agent-instance"`\>; \}, `$strip`\>, `ZodObject`\<\{ `key`: `ZodString`; `kind`: `ZodLiteral`\<`"conversation"`\>; \}, `$strip`\>, `ZodObject`\<\{ `key`: `ZodString`; `kind`: `ZodLiteral`\<`"runtime-instance"`\>; \}, `$strip`\>, `ZodObject`\<\{ `key`: `ZodString`; `kind`: `ZodLiteral`\<`"custom"`\>; \}, `$strip`\>\], `"kind"`\>\>; `userId`: `ZodOptional`\<`ZodString`\>; \}, `$strip`\> = `CreateSandboxInputSchema`

Defined in: [packages/ai/src/sandbox/service/Sandbox/v1/command/ensureSandbox/schema.ts:4](https://github.com/puristajs/purista/blob/6e0354b1e51abc331c66c917ee95829470c9fba2/packages/ai/src/sandbox/service/Sandbox/v1/command/ensureSandbox/schema.ts#L4)
