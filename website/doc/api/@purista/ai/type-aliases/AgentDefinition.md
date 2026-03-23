[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentDefinition

# Type Alias: AgentDefinition\<SkillNames\>

> **AgentDefinition**\<`SkillNames`\> = `object`

Defined in: [packages/ai/src/types/AgentDefinition.ts:53](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/types/AgentDefinition.ts#L53)

## Type Parameters

### SkillNames

`SkillNames` *extends* `string` = `string`

## Properties

### info

> **info**: [`AgentInfo`](AgentInfo.md)

Defined in: [packages/ai/src/types/AgentDefinition.ts:54](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/types/AgentDefinition.ts#L54)

***

### manifest

> **manifest**: [`AgentManifest`](AgentManifest.md)

Defined in: [packages/ai/src/types/AgentDefinition.ts:55](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/types/AgentDefinition.ts#L55)

***

### schemas

> **schemas**: `object`

Defined in: [packages/ai/src/types/AgentDefinition.ts:56](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/types/AgentDefinition.ts#L56)

#### context?

> `optional` **context**: [`Schema`](../../core/type-aliases/Schema.md)

#### output?

> `optional` **output**: [`Schema`](../../core/type-aliases/Schema.md)

#### parameter?

> `optional` **parameter**: [`Schema`](../../core/type-aliases/Schema.md)

#### payload?

> `optional` **payload**: [`Schema`](../../core/type-aliases/Schema.md)

## Methods

### getExternalRuntimeMetadata()

> **getExternalRuntimeMetadata**(): [`ExternalRuntimeMetadata`](ExternalRuntimeMetadata.md)

Defined in: [packages/ai/src/types/AgentDefinition.ts:63](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/types/AgentDefinition.ts#L63)

#### Returns

[`ExternalRuntimeMetadata`](ExternalRuntimeMetadata.md)

***

### getInstance()

> **getInstance**(`eventBridge`, `options?`): `Promise`\<[`AgentRuntimeInstance`](AgentRuntimeInstance.md)\>

Defined in: [packages/ai/src/types/AgentDefinition.ts:64](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/types/AgentDefinition.ts#L64)

#### Parameters

##### eventBridge

[`EventBridge`](../../core/interfaces/EventBridge.md)

##### options?

[`AgentInstanceOptions`](AgentInstanceOptions.md)\<`SkillNames`\>

#### Returns

`Promise`\<[`AgentRuntimeInstance`](AgentRuntimeInstance.md)\>

***

### getManifest()

> **getManifest**(): [`AgentManifest`](AgentManifest.md)

Defined in: [packages/ai/src/types/AgentDefinition.ts:62](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/types/AgentDefinition.ts#L62)

#### Returns

[`AgentManifest`](AgentManifest.md)
