[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / createInMemorySandboxRegistry

# Function: createInMemorySandboxRegistry()

> **createInMemorySandboxRegistry**(`options?`): [`SandboxRegistry`](../classes/SandboxRegistry.md)

Defined in: packages/ai/src/sandbox/resources/createInMemorySandboxRegistry.ts:15

Creates a SandboxRegistry backed by PURISTA's in-memory DefaultStateStore.

This is intended for local development, tests, and single-process apps that
want sandbox lifecycle support without wiring a separate persistent store.

## Parameters

### options?

[`CreateInMemorySandboxRegistryOptions`](../type-aliases/CreateInMemorySandboxRegistryOptions.md)

## Returns

[`SandboxRegistry`](../classes/SandboxRegistry.md)
