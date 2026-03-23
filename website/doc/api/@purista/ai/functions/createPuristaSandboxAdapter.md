[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / createPuristaSandboxAdapter

# Function: createPuristaSandboxAdapter()

> **createPuristaSandboxAdapter**(`eventBridge`, `identity`): [`SandboxAdapter`](../type-aliases/SandboxAdapter.md)

Defined in: [packages/ai/src/sandbox/adapter/BashTool/createPuristaSandboxAdapter.ts:21](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/sandbox/adapter/BashTool/createPuristaSandboxAdapter.ts#L21)

Creates a generic sandbox adapter for command-based bash runtimes.

The adapter forwards operations to the PURISTA sandbox service commands.

## Parameters

### eventBridge

[`EventBridge`](../../core/interfaces/EventBridge.md)

### identity

[`SandboxAdapterIdentity`](../type-aliases/SandboxAdapterIdentity.md)

## Returns

[`SandboxAdapter`](../type-aliases/SandboxAdapter.md)
