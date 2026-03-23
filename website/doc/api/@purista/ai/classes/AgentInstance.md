[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentInstance

# Class: AgentInstance

Defined in: [packages/ai/src/runtime/AgentInstance.ts:132](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/runtime/AgentInstance.ts#L132)

## Implements

- [`AgentRuntimeInstance`](../type-aliases/AgentRuntimeInstance.md)

## Constructors

### Constructor

> **new AgentInstance**(`deps`, `eventBridge`, `runtime?`): `AgentInstance`

Defined in: [packages/ai/src/runtime/AgentInstance.ts:137](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/runtime/AgentInstance.ts#L137)

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

Defined in: [packages/ai/src/runtime/AgentInstance.ts:256](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/runtime/AgentInstance.ts#L256)

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

Defined in: [packages/ai/src/runtime/AgentInstance.ts:231](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/runtime/AgentInstance.ts#L231)

#### Returns

[`AgentRuntimeStatus`](../type-aliases/AgentRuntimeStatus.md)

#### Implementation of

`AgentInstanceContract.getStatus`

***

### invoke()

> **invoke**(`request`, `contextOverrides?`): `Promise`\<[`AgentInvokeResult`](../type-aliases/AgentInvokeResult.md)\>

Defined in: [packages/ai/src/runtime/AgentInstance.ts:277](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/runtime/AgentInstance.ts#L277)

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

Defined in: [packages/ai/src/runtime/AgentInstance.ts:181](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/runtime/AgentInstance.ts#L181)

#### Returns

`Promise`\<`void`\>

#### Implementation of

`AgentInstanceContract.start`

***

### stop()

> **stop**(): `Promise`\<`void`\>

Defined in: [packages/ai/src/runtime/AgentInstance.ts:223](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/runtime/AgentInstance.ts#L223)

#### Returns

`Promise`\<`void`\>

#### Implementation of

`AgentInstanceContract.stop`
