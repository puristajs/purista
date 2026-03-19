[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / KnowledgeAdapter

# Interface: KnowledgeAdapter

Defined in: [packages/ai/src/knowledge/adapters/inMemoryAdapter.ts:51](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/knowledge/adapters/inMemoryAdapter.ts#L51)

## Properties

### id

> **id**: `string`

Defined in: [packages/ai/src/knowledge/adapters/inMemoryAdapter.ts:55](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/knowledge/adapters/inMemoryAdapter.ts#L55)

Stable identifier used in logs/telemetry.

## Methods

### delete()

> **delete**(`request`): `Promise`\<`void`\>

Defined in: [packages/ai/src/knowledge/adapters/inMemoryAdapter.ts:67](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/knowledge/adapters/inMemoryAdapter.ts#L67)

Remove one document by id.

#### Parameters

##### request

[`KnowledgeDeleteRequest`](../type-aliases/KnowledgeDeleteRequest.md)

#### Returns

`Promise`\<`void`\>

***

### query()

> **query**(`request`): `Promise`\<[`KnowledgeDocument`](../type-aliases/KnowledgeDocument.md)[]\>

Defined in: [packages/ai/src/knowledge/adapters/inMemoryAdapter.ts:63](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/knowledge/adapters/inMemoryAdapter.ts#L63)

Search documents for a natural-language query.

#### Parameters

##### request

[`KnowledgeQueryRequest`](../type-aliases/KnowledgeQueryRequest.md)

#### Returns

`Promise`\<[`KnowledgeDocument`](../type-aliases/KnowledgeDocument.md)[]\>

***

### upsert()

> **upsert**(`request`): `Promise`\<`void`\>

Defined in: [packages/ai/src/knowledge/adapters/inMemoryAdapter.ts:59](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/knowledge/adapters/inMemoryAdapter.ts#L59)

Insert or update one document.

#### Parameters

##### request

[`KnowledgeUpsertRequest`](../type-aliases/KnowledgeUpsertRequest.md)

#### Returns

`Promise`\<`void`\>
