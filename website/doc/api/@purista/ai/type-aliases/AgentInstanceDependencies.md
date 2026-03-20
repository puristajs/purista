[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentInstanceDependencies

# Type Alias: AgentInstanceDependencies

> **AgentInstanceDependencies** = `object`

Defined in: [packages/ai/src/runtime/AgentInstance.ts:34](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/ai/src/runtime/AgentInstance.ts#L34)

## Properties

### callOptionsSchema?

> `optional` **callOptionsSchema**: `ZodType`

Defined in: [packages/ai/src/runtime/AgentInstance.ts:39](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/ai/src/runtime/AgentInstance.ts#L39)

***

### handler

> **handler**: [`AgentHandler`](AgentHandler.md)\<`any`, `any`, `Record`\<`string`, `unknown`\>, `Record`\<`string`, [`ModelProvider`](../interfaces/ModelProvider.md)\>, `any`\>

Defined in: [packages/ai/src/runtime/AgentInstance.ts:38](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/ai/src/runtime/AgentInstance.ts#L38)

***

### info

> **info**: [`AgentInfo`](AgentInfo.md)

Defined in: [packages/ai/src/runtime/AgentInstance.ts:35](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/ai/src/runtime/AgentInstance.ts#L35)

***

### manifest

> **manifest**: [`AgentManifest`](AgentManifest.md)

Defined in: [packages/ai/src/runtime/AgentInstance.ts:36](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/ai/src/runtime/AgentInstance.ts#L36)

***

### prepareCall?

> `optional` **prepareCall**: [`AgentPrepareCallHook`](AgentPrepareCallHook.md)

Defined in: [packages/ai/src/runtime/AgentInstance.ts:40](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/ai/src/runtime/AgentInstance.ts#L40)

***

### prepareStep?

> `optional` **prepareStep**: [`AgentPrepareStepHook`](AgentPrepareStepHook.md)

Defined in: [packages/ai/src/runtime/AgentInstance.ts:41](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/ai/src/runtime/AgentInstance.ts#L41)

***

### serviceBuilder

> **serviceBuilder**: `any`

Defined in: [packages/ai/src/runtime/AgentInstance.ts:37](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/ai/src/runtime/AgentInstance.ts#L37)
