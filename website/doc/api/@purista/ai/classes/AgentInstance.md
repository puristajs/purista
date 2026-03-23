[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentInstance

# Class: AgentInstance

Defined in: [packages/ai/src/runtime/AgentInstance.ts:155](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/runtime/AgentInstance.ts#L155)

## Implements

- [`AgentRuntimeInstance`](../type-aliases/AgentRuntimeInstance.md)

## Constructors

### Constructor

> **new AgentInstance**(`deps`, `eventBridge`, `runtime?`): `AgentInstance`

Defined in: [packages/ai/src/runtime/AgentInstance.ts:160](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/runtime/AgentInstance.ts#L160)

#### Parameters

##### deps

[`AgentInstanceDependencies`](../type-aliases/AgentInstanceDependencies.md)

##### eventBridge

[`EventBridge`](../../core/interfaces/EventBridge.md)

##### runtime?

[`AgentRuntimeDependencies`](../type-aliases/AgentRuntimeDependencies.md) = `{}`

#### Returns

`AgentInstance`

## Methods

### getExternalRuntimeMetadata()

> **getExternalRuntimeMetadata**(): `object`

Defined in: [packages/ai/src/runtime/AgentInstance.ts:298](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/runtime/AgentInstance.ts#L298)

#### Returns

`object`

##### agents

> **agents**: [`AllowedAgentDefinition`](../type-aliases/AllowedAgentDefinition.md)[]

##### commands

> **commands**: [`AllowedToolDefinition`](../type-aliases/AllowedToolDefinition.md)[]

#### Implementation of

`AgentInstanceContract.getExternalRuntimeMetadata`

***

### getStatus()

> **getStatus**(): [`AgentRuntimeStatus`](../type-aliases/AgentRuntimeStatus.md)

Defined in: [packages/ai/src/runtime/AgentInstance.ts:273](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/runtime/AgentInstance.ts#L273)

#### Returns

[`AgentRuntimeStatus`](../type-aliases/AgentRuntimeStatus.md)

#### Implementation of

`AgentInstanceContract.getStatus`

***

### invoke()

> **invoke**(`request`, `contextOverrides?`): `Promise`\<[`AgentInvokeResult`](../type-aliases/AgentInvokeResult.md)\>

Defined in: [packages/ai/src/runtime/AgentInstance.ts:319](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/runtime/AgentInstance.ts#L319)

#### Parameters

##### request

[`AgentInvokeRequest`](../type-aliases/AgentInvokeRequest.md)

##### contextOverrides?

`Partial`\<[`AgentInvokeContext`](../type-aliases/AgentInvokeContext.md)\>

#### Returns

`Promise`\<[`AgentInvokeResult`](../type-aliases/AgentInvokeResult.md)\>

#### Implementation of

`AgentInstanceContract.invoke`

***

### start()

> **start**(): `Promise`\<`void`\>

Defined in: [packages/ai/src/runtime/AgentInstance.ts:204](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/runtime/AgentInstance.ts#L204)

#### Returns

`Promise`\<`void`\>

#### Implementation of

`AgentInstanceContract.start`

***

### stop()

> **stop**(): `Promise`\<`void`\>

Defined in: [packages/ai/src/runtime/AgentInstance.ts:265](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/runtime/AgentInstance.ts#L265)

#### Returns

`Promise`\<`void`\>

#### Implementation of

`AgentInstanceContract.stop`
