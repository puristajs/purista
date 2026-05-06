[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / InMemoryConversationStore

# Class: InMemoryConversationStore

Defined in: [packages/ai/src/memory/conversationStore.ts:41](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/memory/conversationStore.ts#L41)

Simple development-friendly conversation store that keeps state in memory.

## Example

```ts
const store = new InMemoryConversationStore()
await store.save({ conversationId: 'demo', data: { conversation: { messages: [] } }, updatedAt: Date.now() })
```

## Implements

- [`ConversationStore`](../interfaces/ConversationStore.md)

## Constructors

### Constructor

> **new InMemoryConversationStore**(): `InMemoryConversationStore`

#### Returns

`InMemoryConversationStore`

## Methods

### delete()

> **delete**(`conversationId`, `scope?`): `Promise`\<`void`\>

Defined in: [packages/ai/src/memory/conversationStore.ts:64](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/memory/conversationStore.ts#L64)

#### Parameters

##### conversationId

`string`

##### scope?

[`ConversationStoreScope`](../type-aliases/ConversationStoreScope.md)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`ConversationStore`](../interfaces/ConversationStore.md).[`delete`](../interfaces/ConversationStore.md#delete)

***

### load()

> **load**(`conversationId`, `scope?`): `Promise`\<[`ConversationStoreRecord`](../type-aliases/ConversationStoreRecord.md) \| `undefined`\>

Defined in: [packages/ai/src/memory/conversationStore.ts:56](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/memory/conversationStore.ts#L56)

#### Parameters

##### conversationId

`string`

##### scope?

[`ConversationStoreScope`](../type-aliases/ConversationStoreScope.md)

#### Returns

`Promise`\<[`ConversationStoreRecord`](../type-aliases/ConversationStoreRecord.md) \| `undefined`\>

#### Implementation of

[`ConversationStore`](../interfaces/ConversationStore.md).[`load`](../interfaces/ConversationStore.md#load)

***

### save()

> **save**(`record`, `scope?`): `Promise`\<`void`\>

Defined in: [packages/ai/src/memory/conversationStore.ts:60](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/memory/conversationStore.ts#L60)

#### Parameters

##### record

[`ConversationStoreRecord`](../type-aliases/ConversationStoreRecord.md)

##### scope?

[`ConversationStoreScope`](../type-aliases/ConversationStoreScope.md)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`ConversationStore`](../interfaces/ConversationStore.md).[`save`](../interfaces/ConversationStore.md#save)
