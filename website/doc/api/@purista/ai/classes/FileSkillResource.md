[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / FileSkillResource

# Class: FileSkillResource

Defined in: [packages/ai/src/skills/fileSystem.ts:259](https://github.com/puristajs/purista/blob/6e0354b1e51abc331c66c917ee95829470c9fba2/packages/ai/src/skills/fileSystem.ts#L259)

## Implements

- [`SkillResource`](../type-aliases/SkillResource.md)

## Constructors

### Constructor

> **new FileSkillResource**(`input`): `FileSkillResource`

Defined in: [packages/ai/src/skills/fileSystem.ts:264](https://github.com/puristajs/purista/blob/6e0354b1e51abc331c66c917ee95829470c9fba2/packages/ai/src/skills/fileSystem.ts#L264)

#### Parameters

##### input

###### roots

`string`[]

#### Returns

`FileSkillResource`

## Methods

### list()

> **list**(): `Promise`\<[`SkillMetadata`](../type-aliases/SkillMetadata.md)[]\>

Defined in: [packages/ai/src/skills/fileSystem.ts:270](https://github.com/puristajs/purista/blob/6e0354b1e51abc331c66c917ee95829470c9fba2/packages/ai/src/skills/fileSystem.ts#L270)

#### Returns

`Promise`\<[`SkillMetadata`](../type-aliases/SkillMetadata.md)[]\>

#### Implementation of

`SkillResource.list`

***

### load()

> **load**(`skillName`): `Promise`\<[`SkillDocument`](../type-aliases/SkillDocument.md)\>

Defined in: [packages/ai/src/skills/fileSystem.ts:298](https://github.com/puristajs/purista/blob/6e0354b1e51abc331c66c917ee95829470c9fba2/packages/ai/src/skills/fileSystem.ts#L298)

#### Parameters

##### skillName

`string`

#### Returns

`Promise`\<[`SkillDocument`](../type-aliases/SkillDocument.md)\>

#### Implementation of

`SkillResource.load`

***

### loadBundle()

> **loadBundle**(`skillName`): `Promise`\<[`SkillBundle`](../type-aliases/SkillBundle.md)\>

Defined in: [packages/ai/src/skills/fileSystem.ts:371](https://github.com/puristajs/purista/blob/6e0354b1e51abc331c66c917ee95829470c9fba2/packages/ai/src/skills/fileSystem.ts#L371)

#### Parameters

##### skillName

`string`

#### Returns

`Promise`\<[`SkillBundle`](../type-aliases/SkillBundle.md)\>

#### Implementation of

`SkillResource.loadBundle`

***

### loadMany()

> **loadMany**(`skillNames`): `Promise`\<[`SkillDocument`](../type-aliases/SkillDocument.md)[]\>

Defined in: [packages/ai/src/skills/fileSystem.ts:336](https://github.com/puristajs/purista/blob/6e0354b1e51abc331c66c917ee95829470c9fba2/packages/ai/src/skills/fileSystem.ts#L336)

#### Parameters

##### skillNames

`string`[]

#### Returns

`Promise`\<[`SkillDocument`](../type-aliases/SkillDocument.md)[]\>

#### Implementation of

`SkillResource.loadMany`

***

### loadReferences()

> **loadReferences**(`skillName`): `Promise`\<[`SkillReferenceDocument`](../type-aliases/SkillReferenceDocument.md)[]\>

Defined in: [packages/ai/src/skills/fileSystem.ts:344](https://github.com/puristajs/purista/blob/6e0354b1e51abc331c66c917ee95829470c9fba2/packages/ai/src/skills/fileSystem.ts#L344)

#### Parameters

##### skillName

`string`

#### Returns

`Promise`\<[`SkillReferenceDocument`](../type-aliases/SkillReferenceDocument.md)[]\>

#### Implementation of

`SkillResource.loadReferences`

***

### search()

> **search**(`input`): `Promise`\<[`SkillDocument`](../type-aliases/SkillDocument.md)[]\>

Defined in: [packages/ai/src/skills/fileSystem.ts:403](https://github.com/puristajs/purista/blob/6e0354b1e51abc331c66c917ee95829470c9fba2/packages/ai/src/skills/fileSystem.ts#L403)

#### Parameters

##### input

[`SkillSearchInput`](../type-aliases/SkillSearchInput.md)

#### Returns

`Promise`\<[`SkillDocument`](../type-aliases/SkillDocument.md)[]\>

#### Implementation of

`SkillResource.search`
