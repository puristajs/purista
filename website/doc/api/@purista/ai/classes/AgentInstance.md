[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentInstance

# Class: AgentInstance

Defined in: [packages/ai/src/runtime/AgentInstance.ts:118](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/runtime/AgentInstance.ts#L118)

## Implements

- [`AgentRuntimeInstance`](../type-aliases/AgentRuntimeInstance.md)

## Constructors

### Constructor

> **new AgentInstance**(`deps`, `eventBridge`, `runtime?`): `AgentInstance`

Defined in: [packages/ai/src/runtime/AgentInstance.ts:123](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/runtime/AgentInstance.ts#L123)

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

Defined in: [packages/ai/src/runtime/AgentInstance.ts:241](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/runtime/AgentInstance.ts#L241)

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

Defined in: [packages/ai/src/runtime/AgentInstance.ts:216](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/runtime/AgentInstance.ts#L216)

#### Returns

[`AgentRuntimeStatus`](../type-aliases/AgentRuntimeStatus.md)

#### Implementation of

`AgentInstanceContract.getStatus`

***

### invoke()

> **invoke**(`request`, `contextOverrides?`): `Promise`\<[`AgentInvokeResult`](../type-aliases/AgentInvokeResult.md)\>

Defined in: [packages/ai/src/runtime/AgentInstance.ts:262](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/runtime/AgentInstance.ts#L262)

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

Defined in: [packages/ai/src/runtime/AgentInstance.ts:165](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/runtime/AgentInstance.ts#L165)

#### Returns

`Promise`\<`void`\>

#### Implementation of

`AgentInstanceContract.start`

***

### stop()

> **stop**(): `Promise`\<`void`\>

Defined in: [packages/ai/src/runtime/AgentInstance.ts:208](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/runtime/AgentInstance.ts#L208)

#### Returns

`Promise`\<`void`\>

#### Implementation of

`AgentInstanceContract.stop`
