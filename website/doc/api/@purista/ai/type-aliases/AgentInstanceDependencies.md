[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentInstanceDependencies

# Type Alias: AgentInstanceDependencies\<Payload, Parameter, Resources, Models, AgentInvokes, EmitPayloads, ToolInvokes\>

> **AgentInstanceDependencies**\<`Payload`, `Parameter`, `Resources`, `Models`, `AgentInvokes`, `EmitPayloads`, `ToolInvokes`\> = `object`

Defined in: [packages/ai/src/runtime/AgentInstance.ts:67](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/AgentInstance.ts#L67)

## Type Parameters

### Payload

`Payload` = `unknown`

### Parameter

`Parameter` = `unknown`

### Resources

`Resources` *extends* `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\>

### Models

`Models` *extends* `Record`\<`string`, [`ModelProvider`](../interfaces/ModelProvider.md)\> = `Record`\<`string`, [`ModelProvider`](../interfaces/ModelProvider.md)\>

### AgentInvokes

`AgentInvokes` *extends* [`AgentInvokeList`](../../core/type-aliases/AgentInvokeList.md) = [`AgentInvokeList`](../../core/type-aliases/AgentInvokeList.md)

### EmitPayloads

`EmitPayloads` *extends* `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\>

### ToolInvokes

`ToolInvokes` *extends* [`ToolInvokeMap`](ToolInvokeMap.md) = [`ToolInvokeMap`](ToolInvokeMap.md)

## Properties

### callOptionsSchema?

> `optional` **callOptionsSchema**: `ZodType`

Defined in: [packages/ai/src/runtime/AgentInstance.ts:80](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/AgentInstance.ts#L80)

***

### configSchema?

> `optional` **configSchema**: [`Schema`](../../core/type-aliases/Schema.md)

Defined in: [packages/ai/src/runtime/AgentInstance.ts:83](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/AgentInstance.ts#L83)

***

### defaultConfig?

> `optional` **defaultConfig**: [`Complete`](../../core/type-aliases/Complete.md)\<`Record`\<`string`, `unknown`\>\>

Defined in: [packages/ai/src/runtime/AgentInstance.ts:84](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/AgentInstance.ts#L84)

***

### handler

> **handler**: [`AgentHandler`](AgentHandler.md)\<`Payload`, `Parameter`, `Resources`, `Models`, `AgentInvokes`, `EmitPayloads`, `ToolInvokes`\>

Defined in: [packages/ai/src/runtime/AgentInstance.ts:79](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/AgentInstance.ts#L79)

***

### info

> **info**: [`AgentInfo`](AgentInfo.md)

Defined in: [packages/ai/src/runtime/AgentInstance.ts:76](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/AgentInstance.ts#L76)

***

### manifest

> **manifest**: [`AgentManifest`](AgentManifest.md)

Defined in: [packages/ai/src/runtime/AgentInstance.ts:77](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/AgentInstance.ts#L77)

***

### prepareCall?

> `optional` **prepareCall**: [`AgentPrepareCallHook`](AgentPrepareCallHook.md)

Defined in: [packages/ai/src/runtime/AgentInstance.ts:81](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/AgentInstance.ts#L81)

***

### prepareStep?

> `optional` **prepareStep**: [`AgentPrepareStepHook`](AgentPrepareStepHook.md)

Defined in: [packages/ai/src/runtime/AgentInstance.ts:82](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/AgentInstance.ts#L82)

***

### serviceBuilder

> **serviceBuilder**: `AgentRuntimeServiceBuilder`

Defined in: [packages/ai/src/runtime/AgentInstance.ts:78](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/AgentInstance.ts#L78)
