[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/sandbox](../README.md) / createPuristaSandboxAdapter

# Function: createPuristaSandboxAdapter()

> **createPuristaSandboxAdapter**(`eventBridge`, `identity`): [`SandboxAdapter`](../type-aliases/SandboxAdapter.md)

Defined in: [sandbox-service/src/adapter/BashTool/createPuristaSandboxAdapter.ts:21](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/sandbox-service/src/adapter/BashTool/createPuristaSandboxAdapter.ts#L21)

Creates a generic sandbox adapter for command-based bash runtimes.

The adapter forwards operations to the PURISTA sandbox service commands.

## Parameters

### eventBridge

[`EventBridge`](../../core/interfaces/EventBridge.md)

### identity

[`SandboxAdapterIdentity`](../type-aliases/SandboxAdapterIdentity.md)

## Returns

[`SandboxAdapter`](../type-aliases/SandboxAdapter.md)
