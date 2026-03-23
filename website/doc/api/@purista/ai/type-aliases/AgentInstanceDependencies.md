[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentInstanceDependencies

# Type Alias: AgentInstanceDependencies

> **AgentInstanceDependencies** = `object`

Defined in: [packages/ai/src/runtime/AgentInstance.ts:35](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/runtime/AgentInstance.ts#L35)

## Properties

### callOptionsSchema?

> `optional` **callOptionsSchema**: `ZodType`

Defined in: [packages/ai/src/runtime/AgentInstance.ts:40](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/runtime/AgentInstance.ts#L40)

***

### handler

> **handler**: [`AgentHandler`](AgentHandler.md)\<`any`, `any`, `Record`\<`string`, `unknown`\>, `Record`\<`string`, [`ModelProvider`](../interfaces/ModelProvider.md)\>, `any`\>

Defined in: [packages/ai/src/runtime/AgentInstance.ts:39](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/runtime/AgentInstance.ts#L39)

***

### info

> **info**: [`AgentInfo`](AgentInfo.md)

Defined in: [packages/ai/src/runtime/AgentInstance.ts:36](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/runtime/AgentInstance.ts#L36)

***

### manifest

> **manifest**: [`AgentManifest`](AgentManifest.md)

Defined in: [packages/ai/src/runtime/AgentInstance.ts:37](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/runtime/AgentInstance.ts#L37)

***

### prepareCall?

> `optional` **prepareCall**: [`AgentPrepareCallHook`](AgentPrepareCallHook.md)

Defined in: [packages/ai/src/runtime/AgentInstance.ts:41](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/runtime/AgentInstance.ts#L41)

***

### prepareStep?

> `optional` **prepareStep**: [`AgentPrepareStepHook`](AgentPrepareStepHook.md)

Defined in: [packages/ai/src/runtime/AgentInstance.ts:42](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/runtime/AgentInstance.ts#L42)

***

### serviceBuilder

> **serviceBuilder**: `any`

Defined in: [packages/ai/src/runtime/AgentInstance.ts:38](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/runtime/AgentInstance.ts#L38)
