[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentInstanceDependencies

# Type Alias: AgentInstanceDependencies\<EmitPayloads\>

> **AgentInstanceDependencies**\<`EmitPayloads`\> = `object`

Defined in: [packages/ai/src/runtime/AgentInstance.ts:44](https://github.com/puristajs/purista/blob/6e0354b1e51abc331c66c917ee95829470c9fba2/packages/ai/src/runtime/AgentInstance.ts#L44)

## Type Parameters

### EmitPayloads

`EmitPayloads` *extends* `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\>

## Properties

### callOptionsSchema?

> `optional` **callOptionsSchema**: `ZodType`

Defined in: [packages/ai/src/runtime/AgentInstance.ts:51](https://github.com/puristajs/purista/blob/6e0354b1e51abc331c66c917ee95829470c9fba2/packages/ai/src/runtime/AgentInstance.ts#L51)

***

### configSchema?

> `optional` **configSchema**: [`Schema`](../../core/type-aliases/Schema.md)

Defined in: [packages/ai/src/runtime/AgentInstance.ts:54](https://github.com/puristajs/purista/blob/6e0354b1e51abc331c66c917ee95829470c9fba2/packages/ai/src/runtime/AgentInstance.ts#L54)

***

### defaultConfig?

> `optional` **defaultConfig**: [`Complete`](../../core/type-aliases/Complete.md)\<`Record`\<`string`, `unknown`\>\>

Defined in: [packages/ai/src/runtime/AgentInstance.ts:55](https://github.com/puristajs/purista/blob/6e0354b1e51abc331c66c917ee95829470c9fba2/packages/ai/src/runtime/AgentInstance.ts#L55)

***

### handler

> **handler**: [`AgentHandler`](AgentHandler.md)\<`any`, `any`, `Record`\<`string`, `unknown`\>, `Record`\<`string`, [`ModelProvider`](../interfaces/ModelProvider.md)\>, `any`, `EmitPayloads`\>

Defined in: [packages/ai/src/runtime/AgentInstance.ts:50](https://github.com/puristajs/purista/blob/6e0354b1e51abc331c66c917ee95829470c9fba2/packages/ai/src/runtime/AgentInstance.ts#L50)

***

### info

> **info**: [`AgentInfo`](AgentInfo.md)

Defined in: [packages/ai/src/runtime/AgentInstance.ts:45](https://github.com/puristajs/purista/blob/6e0354b1e51abc331c66c917ee95829470c9fba2/packages/ai/src/runtime/AgentInstance.ts#L45)

***

### manifest

> **manifest**: [`AgentManifest`](AgentManifest.md)

Defined in: [packages/ai/src/runtime/AgentInstance.ts:46](https://github.com/puristajs/purista/blob/6e0354b1e51abc331c66c917ee95829470c9fba2/packages/ai/src/runtime/AgentInstance.ts#L46)

***

### prepareCall?

> `optional` **prepareCall**: [`AgentPrepareCallHook`](AgentPrepareCallHook.md)

Defined in: [packages/ai/src/runtime/AgentInstance.ts:52](https://github.com/puristajs/purista/blob/6e0354b1e51abc331c66c917ee95829470c9fba2/packages/ai/src/runtime/AgentInstance.ts#L52)

***

### prepareStep?

> `optional` **prepareStep**: [`AgentPrepareStepHook`](AgentPrepareStepHook.md)

Defined in: [packages/ai/src/runtime/AgentInstance.ts:53](https://github.com/puristajs/purista/blob/6e0354b1e51abc331c66c917ee95829470c9fba2/packages/ai/src/runtime/AgentInstance.ts#L53)

***

### serviceBuilder

> **serviceBuilder**: [`ServiceBuilder`](../../core/classes/ServiceBuilder.md)\<[`ServiceBuilderTypes`](../../core/type-aliases/ServiceBuilderTypes.md)\<`Record`\<`string`, `unknown`\>, `Record`\<`string`, `unknown`\>, `Record`\<`string`, `unknown`\>\>\>

Defined in: [packages/ai/src/runtime/AgentInstance.ts:47](https://github.com/puristajs/purista/blob/6e0354b1e51abc331c66c917ee95829470c9fba2/packages/ai/src/runtime/AgentInstance.ts#L47)
