[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentDefinition

# Type Alias: AgentDefinition

> **AgentDefinition** = `object`

Defined in: [ai/src/types/AgentDefinition.ts:17](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/types/AgentDefinition.ts#L17)

## Properties

### info

> **info**: [`AgentInfo`](AgentInfo.md)

Defined in: [ai/src/types/AgentDefinition.ts:18](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/types/AgentDefinition.ts#L18)

***

### manifest

> **manifest**: [`AgentManifest`](AgentManifest.md)

Defined in: [ai/src/types/AgentDefinition.ts:19](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/types/AgentDefinition.ts#L19)

***

### schemas

> **schemas**: `object`

Defined in: [ai/src/types/AgentDefinition.ts:20](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/types/AgentDefinition.ts#L20)

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

> **getInstance**(`options`): `Promise`\<[`AgentRuntimeInstance`](AgentRuntimeInstance.md)\>

Defined in: [ai/src/types/AgentDefinition.ts:27](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/types/AgentDefinition.ts#L27)

#### Parameters

##### options

[`AgentInstanceOptions`](AgentInstanceOptions.md)

#### Returns

`Promise`\<[`AgentRuntimeInstance`](AgentRuntimeInstance.md)\>

***

### getManifest()

> **getManifest**(): [`AgentManifest`](AgentManifest.md)

Defined in: [ai/src/types/AgentDefinition.ts:26](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/types/AgentDefinition.ts#L26)

#### Returns

[`AgentManifest`](AgentManifest.md)
