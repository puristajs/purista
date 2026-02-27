[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / InMemoryKnowledgeAdapter

# Class: InMemoryKnowledgeAdapter

Defined in: knowledge/adapters/inMemoryAdapter.ts:21

Reference knowledge adapter that keeps documents in memory.
Useful for tests and local development.

## Implements

- [`KnowledgeAdapter`](../interfaces/KnowledgeAdapter.md)

## Constructors

### Constructor

> **new InMemoryKnowledgeAdapter**(): `InMemoryKnowledgeAdapter`

#### Returns

`InMemoryKnowledgeAdapter`

## Properties

### id

> `readonly` **id**: `"in-memory-knowledge"` = `'in-memory-knowledge'`

Defined in: knowledge/adapters/inMemoryAdapter.ts:22

#### Implementation of

[`KnowledgeAdapter`](../interfaces/KnowledgeAdapter.md).[`id`](../interfaces/KnowledgeAdapter.md#id)

## Methods

### delete()

> **delete**(`id`): `Promise`\<`void`\>

Defined in: knowledge/adapters/inMemoryAdapter.ts:36

#### Parameters

##### id

`string`

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`KnowledgeAdapter`](../interfaces/KnowledgeAdapter.md).[`delete`](../interfaces/KnowledgeAdapter.md#delete)

***

### query()

> **query**(`query`, `limit?`): `Promise`\<[`KnowledgeDocument`](../type-aliases/KnowledgeDocument.md)[]\>

Defined in: knowledge/adapters/inMemoryAdapter.ts:29

#### Parameters

##### query

`string`

##### limit?

`number` = `5`

#### Returns

`Promise`\<[`KnowledgeDocument`](../type-aliases/KnowledgeDocument.md)[]\>

#### Implementation of

[`KnowledgeAdapter`](../interfaces/KnowledgeAdapter.md).[`query`](../interfaces/KnowledgeAdapter.md#query)

***

### upsert()

> **upsert**(`document`): `Promise`\<`void`\>

Defined in: knowledge/adapters/inMemoryAdapter.ts:25

#### Parameters

##### document

[`KnowledgeDocument`](../type-aliases/KnowledgeDocument.md)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`KnowledgeAdapter`](../interfaces/KnowledgeAdapter.md).[`upsert`](../interfaces/KnowledgeAdapter.md#upsert)
