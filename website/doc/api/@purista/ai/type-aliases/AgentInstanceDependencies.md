[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentInstanceDependencies

# Type Alias: AgentInstanceDependencies

> **AgentInstanceDependencies** = `object`

Defined in: [packages/ai/src/runtime/AgentInstance.ts:36](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/runtime/AgentInstance.ts#L36)

## Properties

### callOptionsSchema?

> `optional` **callOptionsSchema**: `ZodType`

Defined in: [packages/ai/src/runtime/AgentInstance.ts:41](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/runtime/AgentInstance.ts#L41)

***

### handler

> **handler**: [`AgentHandler`](AgentHandler.md)\<`any`, `any`, `Record`\<`string`, `unknown`\>, `Record`\<`string`, [`ModelProvider`](../interfaces/ModelProvider.md)\>, `any`\>

Defined in: [packages/ai/src/runtime/AgentInstance.ts:40](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/runtime/AgentInstance.ts#L40)

***

### info

> **info**: [`AgentInfo`](AgentInfo.md)

Defined in: [packages/ai/src/runtime/AgentInstance.ts:37](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/runtime/AgentInstance.ts#L37)

***

### manifest

> **manifest**: [`AgentManifest`](AgentManifest.md)

Defined in: [packages/ai/src/runtime/AgentInstance.ts:38](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/runtime/AgentInstance.ts#L38)

***

### prepareCall?

> `optional` **prepareCall**: [`AgentPrepareCallHook`](AgentPrepareCallHook.md)

Defined in: [packages/ai/src/runtime/AgentInstance.ts:42](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/runtime/AgentInstance.ts#L42)

***

### prepareStep?

> `optional` **prepareStep**: [`AgentPrepareStepHook`](AgentPrepareStepHook.md)

Defined in: [packages/ai/src/runtime/AgentInstance.ts:43](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/runtime/AgentInstance.ts#L43)

***

### serviceBuilder

> **serviceBuilder**: `any`

Defined in: [packages/ai/src/runtime/AgentInstance.ts:39](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/runtime/AgentInstance.ts#L39)
