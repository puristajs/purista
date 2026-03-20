[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentInstance

# Class: AgentInstance

Defined in: [packages/ai/src/runtime/AgentInstance.ts:112](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/runtime/AgentInstance.ts#L112)

## Implements

- [`AgentRuntimeInstance`](../type-aliases/AgentRuntimeInstance.md)

## Constructors

### Constructor

> **new AgentInstance**(`deps`, `eventBridge`, `runtime?`): `AgentInstance`

Defined in: [packages/ai/src/runtime/AgentInstance.ts:117](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/runtime/AgentInstance.ts#L117)

#### Parameters

##### deps

[`AgentInstanceDependencies`](../type-aliases/AgentInstanceDependencies.md)

##### eventBridge

[`EventBridge`](../../core/interfaces/EventBridge.md)

##### runtime?

`BaseAgentInstanceOptions` = `{}`

#### Returns

`AgentInstance`

## Methods

### getExternalRuntimeMetadata()

> **getExternalRuntimeMetadata**(): `object`

Defined in: [packages/ai/src/runtime/AgentInstance.ts:231](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/runtime/AgentInstance.ts#L231)

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

Defined in: [packages/ai/src/runtime/AgentInstance.ts:206](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/runtime/AgentInstance.ts#L206)

#### Returns

[`AgentRuntimeStatus`](../type-aliases/AgentRuntimeStatus.md)

#### Implementation of

`AgentInstanceContract.getStatus`

***

### invoke()

> **invoke**(`request`, `contextOverrides?`): `Promise`\<[`AgentInvokeResult`](../type-aliases/AgentInvokeResult.md)\>

Defined in: [packages/ai/src/runtime/AgentInstance.ts:252](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/runtime/AgentInstance.ts#L252)

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

Defined in: [packages/ai/src/runtime/AgentInstance.ts:156](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/runtime/AgentInstance.ts#L156)

#### Returns

`Promise`\<`void`\>

#### Implementation of

`AgentInstanceContract.start`

***

### stop()

> **stop**(): `Promise`\<`void`\>

Defined in: [packages/ai/src/runtime/AgentInstance.ts:198](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/runtime/AgentInstance.ts#L198)

#### Returns

`Promise`\<`void`\>

#### Implementation of

`AgentInstanceContract.stop`
