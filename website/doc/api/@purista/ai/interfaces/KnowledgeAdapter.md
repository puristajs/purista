[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / KnowledgeAdapter

# Interface: KnowledgeAdapter

Defined in: knowledge/adapters/inMemoryAdapter.ts:10

## Properties

### id

> **id**: `string`

Defined in: knowledge/adapters/inMemoryAdapter.ts:11

## Methods

### delete()

> **delete**(`id`): `Promise`\<`void`\>

Defined in: knowledge/adapters/inMemoryAdapter.ts:14

#### Parameters

##### id

`string`

#### Returns

`Promise`\<`void`\>

***

### query()

> **query**(`query`, `limit?`): `Promise`\<[`KnowledgeDocument`](../type-aliases/KnowledgeDocument.md)[]\>

Defined in: knowledge/adapters/inMemoryAdapter.ts:13

#### Parameters

##### query

`string`

##### limit?

`number`

#### Returns

`Promise`\<[`KnowledgeDocument`](../type-aliases/KnowledgeDocument.md)[]\>

***

### upsert()

> **upsert**(`document`): `Promise`\<`void`\>

Defined in: knowledge/adapters/inMemoryAdapter.ts:12

#### Parameters

##### document

[`KnowledgeDocument`](../type-aliases/KnowledgeDocument.md)

#### Returns

`Promise`\<`void`\>
