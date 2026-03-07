[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentDefinition

# Type Alias: AgentDefinition

> **AgentDefinition** = `object`

Defined in: [ai/src/types/AgentDefinition.ts:18](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/types/AgentDefinition.ts#L18)

## Properties

### info

> **info**: [`AgentInfo`](AgentInfo.md)

Defined in: [ai/src/types/AgentDefinition.ts:19](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/types/AgentDefinition.ts#L19)

***

### manifest

> **manifest**: [`AgentManifest`](AgentManifest.md)

Defined in: [ai/src/types/AgentDefinition.ts:20](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/types/AgentDefinition.ts#L20)

***

### schemas

> **schemas**: `object`

Defined in: [ai/src/types/AgentDefinition.ts:21](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/types/AgentDefinition.ts#L21)

#### context?

> `optional` **context**: [`Schema`](../../core/type-aliases/Schema.md)

#### output?

> `optional` **output**: [`Schema`](../../core/type-aliases/Schema.md)

#### parameter?

> `optional` **parameter**: [`Schema`](../../core/type-aliases/Schema.md)

#### payload?

> `optional` **payload**: [`Schema`](../../core/type-aliases/Schema.md)

## Methods

### getInstance()

> **getInstance**(`eventBridge`, `options?`): `Promise`\<[`AgentRuntimeInstance`](AgentRuntimeInstance.md)\>

Defined in: [ai/src/types/AgentDefinition.ts:28](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/types/AgentDefinition.ts#L28)

#### Parameters

##### eventBridge

[`EventBridge`](../../core/interfaces/EventBridge.md)

##### options?

[`AgentInstanceOptions`](AgentInstanceOptions.md)

#### Returns

`Promise`\<[`AgentRuntimeInstance`](AgentRuntimeInstance.md)\>

***

### getManifest()

> **getManifest**(): [`AgentManifest`](AgentManifest.md)

Defined in: [ai/src/types/AgentDefinition.ts:27](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/types/AgentDefinition.ts#L27)

#### Returns

[`AgentManifest`](AgentManifest.md)
