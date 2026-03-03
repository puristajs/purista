[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentInstance

# Class: AgentInstance

Defined in: [ai/src/runtime/AgentInstance.ts:83](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/runtime/AgentInstance.ts#L83)

## Implements

- [`AgentRuntimeInstance`](../type-aliases/AgentRuntimeInstance.md)

## Constructors

### Constructor

> **new AgentInstance**(`deps`, `runtime`): `AgentInstance`

Defined in: [ai/src/runtime/AgentInstance.ts:88](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/runtime/AgentInstance.ts#L88)

#### Parameters

##### deps

[`AgentInstanceDependencies`](../type-aliases/AgentInstanceDependencies.md)

##### runtime

[`AgentRuntimeDependencies`](../type-aliases/AgentRuntimeDependencies.md)

#### Returns

`AgentInstance`

## Methods

### invoke()

> **invoke**(`request`, `contextOverrides?`): `Promise`\<[`AgentInvokeResult`](../type-aliases/AgentInvokeResult.md)\>

Defined in: [ai/src/runtime/AgentInstance.ts:174](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/runtime/AgentInstance.ts#L174)

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

Defined in: [ai/src/runtime/AgentInstance.ts:122](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/runtime/AgentInstance.ts#L122)

#### Returns

`Promise`\<`void`\>

#### Implementation of

`AgentInstanceContract.start`

***

### stop()

> **stop**(): `Promise`\<`void`\>

Defined in: [ai/src/runtime/AgentInstance.ts:152](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/runtime/AgentInstance.ts#L152)

#### Returns

`Promise`\<`void`\>

#### Implementation of

`AgentInstanceContract.stop`
