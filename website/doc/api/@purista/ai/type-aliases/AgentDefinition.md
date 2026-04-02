[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentDefinition

# Type Alias: AgentDefinition\<SkillNames, Resources, ConfigInput, Config, EmitPayloads\>

> **AgentDefinition**\<`SkillNames`, `Resources`, `ConfigInput`, `Config`, `EmitPayloads`\> = `object`

Defined in: [packages/ai/src/types/AgentDefinition.ts:78](https://github.com/puristajs/purista/blob/a54e4eedd3278d44c6382db014435e1a5908fb6f/packages/ai/src/types/AgentDefinition.ts#L78)

## Type Parameters

### SkillNames

`SkillNames` *extends* `string` = `string`

### Resources

`Resources` *extends* `Record`\<`string`, `unknown`\> = [`EmptyObject`](../../core/type-aliases/EmptyObject.md)

### ConfigInput

`ConfigInput` *extends* `Record`\<`string`, `unknown`\> = [`EmptyObject`](../../core/type-aliases/EmptyObject.md)

### Config

`Config` *extends* `Record`\<`string`, `unknown`\> = `ConfigInput`

### EmitPayloads

`EmitPayloads` *extends* `Record`\<`string`, `unknown`\> = [`EmptyObject`](../../core/type-aliases/EmptyObject.md)

## Properties

### info

> **info**: [`AgentInfo`](AgentInfo.md)

Defined in: [packages/ai/src/types/AgentDefinition.ts:85](https://github.com/puristajs/purista/blob/a54e4eedd3278d44c6382db014435e1a5908fb6f/packages/ai/src/types/AgentDefinition.ts#L85)

***

### manifest

> **manifest**: [`AgentManifest`](AgentManifest.md)

Defined in: [packages/ai/src/types/AgentDefinition.ts:86](https://github.com/puristajs/purista/blob/a54e4eedd3278d44c6382db014435e1a5908fb6f/packages/ai/src/types/AgentDefinition.ts#L86)

***

### schemas

> **schemas**: `object`

Defined in: [packages/ai/src/types/AgentDefinition.ts:87](https://github.com/puristajs/purista/blob/a54e4eedd3278d44c6382db014435e1a5908fb6f/packages/ai/src/types/AgentDefinition.ts#L87)

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

Defined in: [packages/ai/src/types/AgentDefinition.ts:99](https://github.com/puristajs/purista/blob/a54e4eedd3278d44c6382db014435e1a5908fb6f/packages/ai/src/types/AgentDefinition.ts#L99)

#### Returns

[`Complete`](../../core/type-aliases/Complete.md)\<`Config`\> \| `undefined`

***

### getExternalRuntimeMetadata()

> **getExternalRuntimeMetadata**(): [`ExternalRuntimeMetadata`](ExternalRuntimeMetadata.md)

Defined in: [packages/ai/src/types/AgentDefinition.ts:94](https://github.com/puristajs/purista/blob/a54e4eedd3278d44c6382db014435e1a5908fb6f/packages/ai/src/types/AgentDefinition.ts#L94)

#### Returns

[`ExternalRuntimeMetadata`](ExternalRuntimeMetadata.md)

***

### getInstance()

> **getInstance**(`eventBridge`, `options?`): `Promise`\<[`AgentRuntimeInstance`](AgentRuntimeInstance.md)\<`EmitPayloads`\>\>

Defined in: [packages/ai/src/types/AgentDefinition.ts:95](https://github.com/puristajs/purista/blob/a54e4eedd3278d44c6382db014435e1a5908fb6f/packages/ai/src/types/AgentDefinition.ts#L95)

#### Parameters

##### eventBridge

[`EventBridge`](../../core/interfaces/EventBridge.md)

##### options?

[`AgentInstanceOptions`](AgentInstanceOptions.md)\<`SkillNames`, `Resources`, `ConfigInput`\>

#### Returns

`Promise`\<[`AgentRuntimeInstance`](AgentRuntimeInstance.md)\<`EmitPayloads`\>\>

***

### getManifest()

> **getManifest**(): [`AgentManifest`](AgentManifest.md)

Defined in: [packages/ai/src/types/AgentDefinition.ts:93](https://github.com/puristajs/purista/blob/a54e4eedd3278d44c6382db014435e1a5908fb6f/packages/ai/src/types/AgentDefinition.ts#L93)

#### Returns

[`AgentManifest`](AgentManifest.md)
