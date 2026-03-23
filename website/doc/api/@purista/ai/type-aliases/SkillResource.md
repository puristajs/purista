[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / SkillResource

# Type Alias: SkillResource

> **SkillResource** = `object`

Defined in: [packages/ai/src/skills/fileSystem.ts:68](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/skills/fileSystem.ts#L68)

## Methods

### list()

> **list**(): `Promise`\<[`SkillMetadata`](SkillMetadata.md)[]\>

Defined in: [packages/ai/src/skills/fileSystem.ts:69](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/skills/fileSystem.ts#L69)

#### Returns

`Promise`\<[`SkillMetadata`](SkillMetadata.md)[]\>

***

### load()

> **load**(`skillName`): `Promise`\<[`SkillDocument`](SkillDocument.md)\>

Defined in: [packages/ai/src/skills/fileSystem.ts:70](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/skills/fileSystem.ts#L70)

#### Parameters

##### skillName

`string`

#### Returns

`Promise`\<[`SkillDocument`](SkillDocument.md)\>

***

### loadBundle()

> **loadBundle**(`skillName`): `Promise`\<[`SkillBundle`](SkillBundle.md)\>

Defined in: [packages/ai/src/skills/fileSystem.ts:73](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/skills/fileSystem.ts#L73)

#### Parameters

##### skillName

`string`

#### Returns

`Promise`\<[`SkillBundle`](SkillBundle.md)\>

***

### loadMany()

> **loadMany**(`skillNames`): `Promise`\<[`SkillDocument`](SkillDocument.md)[]\>

Defined in: [packages/ai/src/skills/fileSystem.ts:71](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/skills/fileSystem.ts#L71)

#### Parameters

##### skillNames

`string`[]

#### Returns

`Promise`\<[`SkillDocument`](SkillDocument.md)[]\>

***

### loadReferences()

> **loadReferences**(`skillName`): `Promise`\<[`SkillReferenceDocument`](SkillReferenceDocument.md)[]\>

Defined in: [packages/ai/src/skills/fileSystem.ts:72](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/skills/fileSystem.ts#L72)

#### Parameters

##### skillName

`string`

#### Returns

`Promise`\<[`SkillReferenceDocument`](SkillReferenceDocument.md)[]\>

***

### search()

> **search**(`input`): `Promise`\<[`SkillDocument`](SkillDocument.md)[]\>

Defined in: [packages/ai/src/skills/fileSystem.ts:74](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/skills/fileSystem.ts#L74)

#### Parameters

##### input

[`SkillSearchInput`](SkillSearchInput.md)

#### Returns

`Promise`\<[`SkillDocument`](SkillDocument.md)[]\>
