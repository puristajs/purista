[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentDefinition

# Type Alias: AgentDefinition

> **AgentDefinition** = `object`

Defined in: [packages/ai/src/types/AgentDefinition.ts:52](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/types/AgentDefinition.ts#L52)

## Properties

### info

> **info**: [`AgentInfo`](AgentInfo.md)

Defined in: [packages/ai/src/types/AgentDefinition.ts:53](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/types/AgentDefinition.ts#L53)

***

### manifest

> **manifest**: [`AgentManifest`](AgentManifest.md)

Defined in: [packages/ai/src/types/AgentDefinition.ts:54](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/types/AgentDefinition.ts#L54)

***

### schemas

> **schemas**: `object`

Defined in: [packages/ai/src/types/AgentDefinition.ts:55](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/types/AgentDefinition.ts#L55)

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

Defined in: [packages/ai/src/types/AgentDefinition.ts:62](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/types/AgentDefinition.ts#L62)

#### Returns

[`ExternalRuntimeMetadata`](ExternalRuntimeMetadata.md)

***

### getInstance()

> **getInstance**(`eventBridge`, `options?`): `Promise`\<[`AgentRuntimeInstance`](AgentRuntimeInstance.md)\>

Defined in: [packages/ai/src/types/AgentDefinition.ts:63](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/types/AgentDefinition.ts#L63)

#### Parameters

##### eventBridge

[`EventBridge`](../../core/interfaces/EventBridge.md)

##### options?

`BaseAgentInstanceOptions`

#### Returns

`Promise`\<[`AgentRuntimeInstance`](AgentRuntimeInstance.md)\>

***

### getManifest()

> **getManifest**(): [`AgentManifest`](AgentManifest.md)

Defined in: [packages/ai/src/types/AgentDefinition.ts:61](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/types/AgentDefinition.ts#L61)

#### Returns

[`AgentManifest`](AgentManifest.md)
