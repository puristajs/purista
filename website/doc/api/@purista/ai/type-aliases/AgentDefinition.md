[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentDefinition

# Type Alias: AgentDefinition\<SkillNames, Resources, ConfigInput, Config\>

> **AgentDefinition**\<`SkillNames`, `Resources`, `ConfigInput`, `Config`\> = `object`

Defined in: [packages/ai/src/types/AgentDefinition.ts:77](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/types/AgentDefinition.ts#L77)

## Type Parameters

### SkillNames

`SkillNames` *extends* `string` = `string`

### Resources

`Resources` *extends* `Record`\<`string`, `unknown`\> = [`EmptyObject`](../../core/type-aliases/EmptyObject.md)

### ConfigInput

`ConfigInput` *extends* `Record`\<`string`, `unknown`\> = [`EmptyObject`](../../core/type-aliases/EmptyObject.md)

### Config

`Config` *extends* `Record`\<`string`, `unknown`\> = `ConfigInput`

## Properties

### info

> **info**: [`AgentInfo`](AgentInfo.md)

Defined in: [packages/ai/src/types/AgentDefinition.ts:83](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/types/AgentDefinition.ts#L83)

***

### manifest

> **manifest**: [`AgentManifest`](AgentManifest.md)

Defined in: [packages/ai/src/types/AgentDefinition.ts:84](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/types/AgentDefinition.ts#L84)

***

### schemas

> **schemas**: `object`

Defined in: [packages/ai/src/types/AgentDefinition.ts:85](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/types/AgentDefinition.ts#L85)

#### context?

> `optional` **context**: [`Schema`](../../core/type-aliases/Schema.md)

#### output?

> `optional` **output**: [`Schema`](../../core/type-aliases/Schema.md)

#### parameter?

> `optional` **parameter**: [`Schema`](../../core/type-aliases/Schema.md)

#### payload?

> `optional` **payload**: [`Schema`](../../core/type-aliases/Schema.md)

## Methods

### getDefaultConfig()

> **getDefaultConfig**(): [`Complete`](../../core/type-aliases/Complete.md)\<`Config`\> \| `undefined`

Defined in: [packages/ai/src/types/AgentDefinition.ts:97](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/types/AgentDefinition.ts#L97)

#### Returns

[`Complete`](../../core/type-aliases/Complete.md)\<`Config`\> \| `undefined`

***

### getExternalRuntimeMetadata()

> **getExternalRuntimeMetadata**(): [`ExternalRuntimeMetadata`](ExternalRuntimeMetadata.md)

Defined in: [packages/ai/src/types/AgentDefinition.ts:92](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/types/AgentDefinition.ts#L92)

#### Returns

[`ExternalRuntimeMetadata`](ExternalRuntimeMetadata.md)

***

### getInstance()

> **getInstance**(`eventBridge`, `options?`): `Promise`\<[`AgentRuntimeInstance`](AgentRuntimeInstance.md)\>

Defined in: [packages/ai/src/types/AgentDefinition.ts:93](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/types/AgentDefinition.ts#L93)

#### Parameters

##### eventBridge

[`EventBridge`](../../core/interfaces/EventBridge.md)

##### options?

[`AgentInstanceOptions`](AgentInstanceOptions.md)\<`SkillNames`, `Resources`, `ConfigInput`\>

#### Returns

`Promise`\<[`AgentRuntimeInstance`](AgentRuntimeInstance.md)\>

***

### getManifest()

> **getManifest**(): [`AgentManifest`](AgentManifest.md)

Defined in: [packages/ai/src/types/AgentDefinition.ts:91](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/types/AgentDefinition.ts#L91)

#### Returns

[`AgentManifest`](AgentManifest.md)
