[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / InlineSkillResource

# Class: InlineSkillResource\<SkillNames\>

Defined in: [packages/ai/src/skills/fileSystem.ts:414](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/skills/fileSystem.ts#L414)

## Type Parameters

### SkillNames

`SkillNames` *extends* `string` = `string`

## Implements

- [`SkillResource`](../type-aliases/SkillResource.md)

## Constructors

### Constructor

> **new InlineSkillResource**\<`SkillNames`\>(`sources`): `InlineSkillResource`\<`SkillNames`\>

Defined in: [packages/ai/src/skills/fileSystem.ts:415](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/skills/fileSystem.ts#L415)

#### Parameters

##### sources

[`SkillSourceMap`](../type-aliases/SkillSourceMap.md)\<`SkillNames`\>

#### Returns

`InlineSkillResource`\<`SkillNames`\>

## Methods

### list()

> **list**(): `Promise`\<[`SkillMetadata`](../type-aliases/SkillMetadata.md)[]\>

Defined in: [packages/ai/src/skills/fileSystem.ts:445](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/skills/fileSystem.ts#L445)

#### Returns

`Promise`\<[`SkillMetadata`](../type-aliases/SkillMetadata.md)[]\>

#### Implementation of

`SkillResource.list`

***

### load()

> **load**(`skillName`): `Promise`\<[`SkillDocument`](../type-aliases/SkillDocument.md)\>

Defined in: [packages/ai/src/skills/fileSystem.ts:452](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/skills/fileSystem.ts#L452)

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

Defined in: [packages/ai/src/skills/fileSystem.ts:474](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/skills/fileSystem.ts#L474)

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

Defined in: [packages/ai/src/skills/fileSystem.ts:456](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/skills/fileSystem.ts#L456)

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

Defined in: [packages/ai/src/skills/fileSystem.ts:462](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/skills/fileSystem.ts#L462)

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

Defined in: [packages/ai/src/skills/fileSystem.ts:513](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/skills/fileSystem.ts#L513)

#### Parameters

##### input

[`SkillSearchInput`](../type-aliases/SkillSearchInput.md)

#### Returns

`Promise`\<[`SkillDocument`](../type-aliases/SkillDocument.md)[]\>

#### Implementation of

`SkillResource.search`
