[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / KnowledgeHelpers

# Type Alias: KnowledgeHelpers\<KnowledgeAliases\>

> **KnowledgeHelpers**\<`KnowledgeAliases`\> = `object` & `{ [Alias in KnowledgeAliases]: KnowledgeAliasAccessor }`

Defined in: [packages/ai/src/runtime/context.ts:513](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/runtime/context.ts#L513)

High-level knowledge helper API exposed to agent handlers.

Supports both generic calls (`context.knowledge.query('faq', ...)`) and
alias-first calls (`context.knowledge.faq.query(...)`).

## Type Declaration

### delete()

> **delete**(`adapterName`, `id`, `input?`): `Promise`\<`void`\>

#### Parameters

##### adapterName

`string`

##### id

`string`

##### input?

`Omit`\<[`KnowledgeDeleteRequest`](KnowledgeDeleteRequest.md), `"id"` \| `"scope"` \| `"options"`\>

#### Returns

`Promise`\<`void`\>

### query()

> **query**(`adapterName`, `query`, `input?`): `Promise`\<[`KnowledgeDocument`](KnowledgeDocument.md)[]\>

#### Parameters

##### adapterName

`string`

##### query

`string`

##### input?

[`KnowledgeQueryInput`](KnowledgeQueryInput.md)

#### Returns

`Promise`\<[`KnowledgeDocument`](KnowledgeDocument.md)[]\>

### upsert()

> **upsert**(`adapterName`, `document`, `input?`): `Promise`\<`void`\>

#### Parameters

##### adapterName

`string`

##### document

[`KnowledgeDocument`](KnowledgeDocument.md)

##### input?

`Omit`\<[`KnowledgeUpsertRequest`](KnowledgeUpsertRequest.md), `"scope"` \| `"options"` \| `"document"`\>

#### Returns

`Promise`\<`void`\>

## Type Parameters

### KnowledgeAliases

`KnowledgeAliases` *extends* `string` = `never`
