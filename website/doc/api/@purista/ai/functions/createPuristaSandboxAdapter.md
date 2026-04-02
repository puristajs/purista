[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / createPuristaSandboxAdapter

# Function: createPuristaSandboxAdapter()

> **createPuristaSandboxAdapter**(`eventBridge`, `identity`): [`SandboxAdapter`](../type-aliases/SandboxAdapter.md)

Defined in: [packages/ai/src/sandbox/adapter/BashTool/createPuristaSandboxAdapter.ts:21](https://github.com/puristajs/purista/blob/22fd555ef1ada6d421f1292a01620a9b2b527601/packages/ai/src/sandbox/adapter/BashTool/createPuristaSandboxAdapter.ts#L21)

Creates a generic sandbox adapter for command-based bash runtimes.

The adapter forwards operations to the PURISTA sandbox service commands.

## Parameters

### eventBridge

[`EventBridge`](../../core/interfaces/EventBridge.md)

### identity

[`SandboxAdapterIdentity`](../type-aliases/SandboxAdapterIdentity.md)

## Returns

[`SandboxAdapter`](../type-aliases/SandboxAdapter.md)
