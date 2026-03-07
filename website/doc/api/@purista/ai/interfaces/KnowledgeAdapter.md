[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / KnowledgeAdapter

# Interface: KnowledgeAdapter

Defined in: [ai/src/knowledge/adapters/inMemoryAdapter.ts:10](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/knowledge/adapters/inMemoryAdapter.ts#L10)

## Properties

### id

> **id**: `string`

Defined in: [ai/src/knowledge/adapters/inMemoryAdapter.ts:11](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/knowledge/adapters/inMemoryAdapter.ts#L11)

## Methods

### delete()

> **delete**(`id`): `Promise`\<`void`\>

Defined in: [ai/src/knowledge/adapters/inMemoryAdapter.ts:14](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/knowledge/adapters/inMemoryAdapter.ts#L14)

#### Parameters

##### id

`string`

#### Returns

`Promise`\<`void`\>

***

### query()

> **query**(`query`, `limit?`): `Promise`\<[`KnowledgeDocument`](../type-aliases/KnowledgeDocument.md)[]\>

Defined in: [ai/src/knowledge/adapters/inMemoryAdapter.ts:13](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/knowledge/adapters/inMemoryAdapter.ts#L13)

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

Defined in: [ai/src/knowledge/adapters/inMemoryAdapter.ts:12](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/knowledge/adapters/inMemoryAdapter.ts#L12)

#### Parameters

##### document

[`KnowledgeDocument`](../type-aliases/KnowledgeDocument.md)

#### Returns

`Promise`\<`void`\>
