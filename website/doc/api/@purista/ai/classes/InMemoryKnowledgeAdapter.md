[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / InMemoryKnowledgeAdapter

# Class: InMemoryKnowledgeAdapter

Defined in: [ai/src/knowledge/adapters/inMemoryAdapter.ts:21](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/knowledge/adapters/inMemoryAdapter.ts#L21)

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

Defined in: [ai/src/knowledge/adapters/inMemoryAdapter.ts:22](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/knowledge/adapters/inMemoryAdapter.ts#L22)

#### Implementation of

[`KnowledgeAdapter`](../interfaces/KnowledgeAdapter.md).[`id`](../interfaces/KnowledgeAdapter.md#id)

## Methods

### delete()

> **delete**(`id`): `Promise`\<`void`\>

Defined in: [ai/src/knowledge/adapters/inMemoryAdapter.ts:36](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/knowledge/adapters/inMemoryAdapter.ts#L36)

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

Defined in: [ai/src/knowledge/adapters/inMemoryAdapter.ts:29](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/knowledge/adapters/inMemoryAdapter.ts#L29)

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

Defined in: [ai/src/knowledge/adapters/inMemoryAdapter.ts:25](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/knowledge/adapters/inMemoryAdapter.ts#L25)

#### Parameters

##### document

[`KnowledgeDocument`](../type-aliases/KnowledgeDocument.md)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`KnowledgeAdapter`](../interfaces/KnowledgeAdapter.md).[`upsert`](../interfaces/KnowledgeAdapter.md#upsert)
