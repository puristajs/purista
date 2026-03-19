[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / InMemoryKnowledgeAdapter

# Class: InMemoryKnowledgeAdapter

Defined in: [packages/ai/src/knowledge/adapters/inMemoryAdapter.ts:74](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/knowledge/adapters/inMemoryAdapter.ts#L74)

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

Defined in: [packages/ai/src/knowledge/adapters/inMemoryAdapter.ts:75](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/knowledge/adapters/inMemoryAdapter.ts#L75)

Stable identifier used in logs/telemetry.

#### Implementation of

[`KnowledgeAdapter`](../interfaces/KnowledgeAdapter.md).[`id`](../interfaces/KnowledgeAdapter.md#id)

## Methods

### delete()

> **delete**(`request`): `Promise`\<`void`\>

Defined in: [packages/ai/src/knowledge/adapters/inMemoryAdapter.ts:109](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/knowledge/adapters/inMemoryAdapter.ts#L109)

Remove one document by id.

#### Parameters

##### request

[`KnowledgeDeleteRequest`](../type-aliases/KnowledgeDeleteRequest.md)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`KnowledgeAdapter`](../interfaces/KnowledgeAdapter.md).[`delete`](../interfaces/KnowledgeAdapter.md#delete)

***

### query()

> **query**(`request`): `Promise`\<[`KnowledgeDocument`](../type-aliases/KnowledgeDocument.md)[]\>

Defined in: [packages/ai/src/knowledge/adapters/inMemoryAdapter.ts:97](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/knowledge/adapters/inMemoryAdapter.ts#L97)

Search documents for a natural-language query.

#### Parameters

##### request

[`KnowledgeQueryRequest`](../type-aliases/KnowledgeQueryRequest.md)

#### Returns

`Promise`\<[`KnowledgeDocument`](../type-aliases/KnowledgeDocument.md)[]\>

#### Implementation of

[`KnowledgeAdapter`](../interfaces/KnowledgeAdapter.md).[`query`](../interfaces/KnowledgeAdapter.md#query)

***

### upsert()

> **upsert**(`request`): `Promise`\<`void`\>

Defined in: [packages/ai/src/knowledge/adapters/inMemoryAdapter.ts:91](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/knowledge/adapters/inMemoryAdapter.ts#L91)

Insert or update one document.

#### Parameters

##### request

[`KnowledgeUpsertRequest`](../type-aliases/KnowledgeUpsertRequest.md)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`KnowledgeAdapter`](../interfaces/KnowledgeAdapter.md).[`upsert`](../interfaces/KnowledgeAdapter.md#upsert)
