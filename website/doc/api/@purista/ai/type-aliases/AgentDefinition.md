[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentDefinition

# Type Alias: AgentDefinition\<KnowledgeAliases\>

> **AgentDefinition**\<`KnowledgeAliases`\> = `object`

Defined in: [packages/ai/src/types/AgentDefinition.ts:60](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/types/AgentDefinition.ts#L60)

## Type Parameters

### KnowledgeAliases

`KnowledgeAliases` *extends* `string` = `never`

## Properties

### info

> **info**: [`AgentInfo`](AgentInfo.md)

Defined in: [packages/ai/src/types/AgentDefinition.ts:61](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/types/AgentDefinition.ts#L61)

***

### manifest

> **manifest**: [`AgentManifest`](AgentManifest.md)

Defined in: [packages/ai/src/types/AgentDefinition.ts:62](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/types/AgentDefinition.ts#L62)

***

### schemas

> **schemas**: `object`

Defined in: [packages/ai/src/types/AgentDefinition.ts:63](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/types/AgentDefinition.ts#L63)

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

Defined in: [packages/ai/src/types/AgentDefinition.ts:70](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/types/AgentDefinition.ts#L70)

#### Returns

[`ExternalRuntimeMetadata`](ExternalRuntimeMetadata.md)

***

### getInstance()

> **getInstance**(`eventBridge`, ...`options`): `Promise`\<[`AgentRuntimeInstance`](AgentRuntimeInstance.md)\>

Defined in: [packages/ai/src/types/AgentDefinition.ts:71](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/types/AgentDefinition.ts#L71)

#### Parameters

##### eventBridge

[`EventBridge`](../../core/interfaces/EventBridge.md)

##### options

...\[`KnowledgeAliases`\] *extends* \[`never`\] ? \[[`AgentInstanceOptions`](AgentInstanceOptions.md)\<`KnowledgeAliases`\<`KnowledgeAliases`\>\>\] : \[[`AgentInstanceOptions`](AgentInstanceOptions.md)\<`KnowledgeAliases`\>\]

#### Returns

`Promise`\<[`AgentRuntimeInstance`](AgentRuntimeInstance.md)\>

***

### getManifest()

> **getManifest**(): [`AgentManifest`](AgentManifest.md)

Defined in: [packages/ai/src/types/AgentDefinition.ts:69](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/types/AgentDefinition.ts#L69)

#### Returns

[`AgentManifest`](AgentManifest.md)
