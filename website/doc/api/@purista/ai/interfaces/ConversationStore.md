[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / ConversationStore

# Interface: ConversationStore

Defined in: [packages/ai/src/memory/conversationStore.ts:27](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/ai/src/memory/conversationStore.ts#L27)

## Methods

### delete()

> **delete**(`conversationId`, `scope?`): `Promise`\<`void`\>

Defined in: [packages/ai/src/memory/conversationStore.ts:30](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/ai/src/memory/conversationStore.ts#L30)

#### Parameters

##### conversationId

`string`

##### scope?

[`ConversationStoreScope`](../type-aliases/ConversationStoreScope.md)

#### Returns

`Promise`\<`void`\>

***

### load()

> **load**(`conversationId`, `scope?`): `Promise`\<[`ConversationStoreRecord`](../type-aliases/ConversationStoreRecord.md) \| `undefined`\>

Defined in: [packages/ai/src/memory/conversationStore.ts:28](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/ai/src/memory/conversationStore.ts#L28)

#### Parameters

##### conversationId

`string`

##### scope?

[`ConversationStoreScope`](../type-aliases/ConversationStoreScope.md)

#### Returns

`Promise`\<[`ConversationStoreRecord`](../type-aliases/ConversationStoreRecord.md) \| `undefined`\>

***

### save()

> **save**(`record`, `scope?`): `Promise`\<`void`\>

Defined in: [packages/ai/src/memory/conversationStore.ts:29](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/ai/src/memory/conversationStore.ts#L29)

#### Parameters

##### record

[`ConversationStoreRecord`](../type-aliases/ConversationStoreRecord.md)

##### scope?

[`ConversationStoreScope`](../type-aliases/ConversationStoreScope.md)

#### Returns

`Promise`\<`void`\>
