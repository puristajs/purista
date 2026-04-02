[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / createInMemorySandboxRegistry

# Function: createInMemorySandboxRegistry()

> **createInMemorySandboxRegistry**(`options?`): [`SandboxRegistry`](../classes/SandboxRegistry.md)

Defined in: [packages/ai/src/sandbox/resources/createInMemorySandboxRegistry.ts:15](https://github.com/puristajs/purista/blob/430e29c621b412b5f21de4eb9697723299bc616e/packages/ai/src/sandbox/resources/createInMemorySandboxRegistry.ts#L15)

Creates a SandboxRegistry backed by PURISTA's in-memory DefaultStateStore.

This is intended for local development, tests, and single-process apps that
want sandbox lifecycle support without wiring a separate persistent store.

## Parameters

### options?

[`CreateInMemorySandboxRegistryOptions`](../type-aliases/CreateInMemorySandboxRegistryOptions.md)

## Returns

[`SandboxRegistry`](../classes/SandboxRegistry.md)
