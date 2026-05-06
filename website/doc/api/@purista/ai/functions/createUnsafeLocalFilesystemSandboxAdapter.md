[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / createUnsafeLocalFilesystemSandboxAdapter

# Function: createUnsafeLocalFilesystemSandboxAdapter()

> **createUnsafeLocalFilesystemSandboxAdapter**(`projectRoot`): [`FilesystemSandboxAdapter`](../type-aliases/FilesystemSandboxAdapter.md)

Defined in: packages/ai/src/sandbox/adapter/local/createUnsafeLocalFilesystemSandboxAdapter.ts:19

Creates an unsafe local-development adapter constrained to one project root for
file I/O, but still executing shell commands directly on the host machine.

This helper does not provide real sandbox isolation and must not be treated as
equivalent to a container or VM-backed sandbox provider.

## Parameters

### projectRoot

`string`

## Returns

[`FilesystemSandboxAdapter`](../type-aliases/FilesystemSandboxAdapter.md)
