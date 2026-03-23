[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentDefinition

# Type Alias: AgentDefinition\<SkillNames, Resources, ConfigInput, Config, EmitPayloads\>

> **AgentDefinition**\<`SkillNames`, `Resources`, `ConfigInput`, `Config`, `EmitPayloads`\> = `object`

Defined in: [packages/ai/src/types/AgentDefinition.ts:77](https://github.com/puristajs/purista/blob/4404dd96f5462503c1bc6e1de335782a5a892137/packages/ai/src/types/AgentDefinition.ts#L77)

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

Defined in: [packages/ai/src/types/AgentDefinition.ts:84](https://github.com/puristajs/purista/blob/4404dd96f5462503c1bc6e1de335782a5a892137/packages/ai/src/types/AgentDefinition.ts#L84)

***

### manifest

> **manifest**: [`AgentManifest`](AgentManifest.md)

Defined in: [packages/ai/src/types/AgentDefinition.ts:85](https://github.com/puristajs/purista/blob/4404dd96f5462503c1bc6e1de335782a5a892137/packages/ai/src/types/AgentDefinition.ts#L85)

***

### schemas

> **schemas**: `object`

Defined in: [packages/ai/src/types/AgentDefinition.ts:86](https://github.com/puristajs/purista/blob/4404dd96f5462503c1bc6e1de335782a5a892137/packages/ai/src/types/AgentDefinition.ts#L86)

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

Defined in: [packages/ai/src/types/AgentDefinition.ts:98](https://github.com/puristajs/purista/blob/4404dd96f5462503c1bc6e1de335782a5a892137/packages/ai/src/types/AgentDefinition.ts#L98)

#### Returns

[`Complete`](../../core/type-aliases/Complete.md)\<`Config`\> \| `undefined`

***

### getExternalRuntimeMetadata()

> **getExternalRuntimeMetadata**(): [`ExternalRuntimeMetadata`](ExternalRuntimeMetadata.md)

Defined in: [packages/ai/src/types/AgentDefinition.ts:93](https://github.com/puristajs/purista/blob/4404dd96f5462503c1bc6e1de335782a5a892137/packages/ai/src/types/AgentDefinition.ts#L93)

#### Returns

[`ExternalRuntimeMetadata`](ExternalRuntimeMetadata.md)

***

### getInstance()

> **getInstance**(`eventBridge`, `options?`): `Promise`\<[`AgentRuntimeInstance`](AgentRuntimeInstance.md)\<`EmitPayloads`\>\>

Defined in: [packages/ai/src/types/AgentDefinition.ts:94](https://github.com/puristajs/purista/blob/4404dd96f5462503c1bc6e1de335782a5a892137/packages/ai/src/types/AgentDefinition.ts#L94)

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

Defined in: [packages/ai/src/types/AgentDefinition.ts:92](https://github.com/puristajs/purista/blob/4404dd96f5462503c1bc6e1de335782a5a892137/packages/ai/src/types/AgentDefinition.ts#L92)

#### Returns

[`AgentManifest`](AgentManifest.md)
