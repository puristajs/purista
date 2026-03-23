[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentInstance

# Class: AgentInstance\<EmitPayloads\>

Defined in: [packages/ai/src/runtime/AgentInstance.ts:155](https://github.com/puristajs/purista/blob/4404dd96f5462503c1bc6e1de335782a5a892137/packages/ai/src/runtime/AgentInstance.ts#L155)

## Type Parameters

### EmitPayloads

`EmitPayloads` *extends* `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\>

## Implements

- [`AgentRuntimeInstance`](../type-aliases/AgentRuntimeInstance.md)\<`EmitPayloads`\>

## Constructors

### Constructor

> **new AgentInstance**\<`EmitPayloads`\>(`deps`, `eventBridge`, `runtime?`): `AgentInstance`\<`EmitPayloads`\>

Defined in: [packages/ai/src/runtime/AgentInstance.ts:162](https://github.com/puristajs/purista/blob/4404dd96f5462503c1bc6e1de335782a5a892137/packages/ai/src/runtime/AgentInstance.ts#L162)

#### Parameters

##### deps

[`AgentInstanceDependencies`](../type-aliases/AgentInstanceDependencies.md)\<`EmitPayloads`\>

##### eventBridge

[`EventBridge`](../../core/interfaces/EventBridge.md)

##### runtime?

[`AgentRuntimeDependencies`](../type-aliases/AgentRuntimeDependencies.md) = `{}`

#### Returns

`AgentInstance`\<`EmitPayloads`\>

## Methods

### getExternalRuntimeMetadata()

> **getExternalRuntimeMetadata**(): `object`

Defined in: [packages/ai/src/runtime/AgentInstance.ts:305](https://github.com/puristajs/purista/blob/4404dd96f5462503c1bc6e1de335782a5a892137/packages/ai/src/runtime/AgentInstance.ts#L305)

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

Defined in: [packages/ai/src/runtime/AgentInstance.ts:280](https://github.com/puristajs/purista/blob/4404dd96f5462503c1bc6e1de335782a5a892137/packages/ai/src/runtime/AgentInstance.ts#L280)

#### Returns

[`AgentRuntimeStatus`](../type-aliases/AgentRuntimeStatus.md)

#### Implementation of

`AgentInstanceContract.getStatus`

***

### invoke()

> **invoke**(`request`, `contextOverrides?`): `Promise`\<[`AgentInvokeResult`](../type-aliases/AgentInvokeResult.md)\>

Defined in: [packages/ai/src/runtime/AgentInstance.ts:326](https://github.com/puristajs/purista/blob/4404dd96f5462503c1bc6e1de335782a5a892137/packages/ai/src/runtime/AgentInstance.ts#L326)

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

Defined in: [packages/ai/src/runtime/AgentInstance.ts:210](https://github.com/puristajs/purista/blob/4404dd96f5462503c1bc6e1de335782a5a892137/packages/ai/src/runtime/AgentInstance.ts#L210)

#### Returns

`Promise`\<`void`\>

#### Implementation of

`AgentInstanceContract.start`

***

### stop()

> **stop**(): `Promise`\<`void`\>

Defined in: [packages/ai/src/runtime/AgentInstance.ts:272](https://github.com/puristajs/purista/blob/4404dd96f5462503c1bc6e1de335782a5a892137/packages/ai/src/runtime/AgentInstance.ts#L272)

#### Returns

`Promise`\<`void`\>

#### Implementation of

`AgentInstanceContract.stop`
