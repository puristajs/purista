[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / InMemoryConversationStore

# Class: InMemoryConversationStore

Defined in: [packages/ai/src/memory/conversationStore.ts:42](https://github.com/puristajs/purista/blob/6e0354b1e51abc331c66c917ee95829470c9fba2/packages/ai/src/memory/conversationStore.ts#L42)

Simple development-friendly conversation store that keeps state in memory.

## Example

```ts
const store = new InMemoryConversationStore()
await store.save({ conversationId: 'demo', data: { lastOutput: 'hi' }, updatedAt: Date.now() })
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

Defined in: [packages/ai/src/memory/conversationStore.ts:65](https://github.com/puristajs/purista/blob/6e0354b1e51abc331c66c917ee95829470c9fba2/packages/ai/src/memory/conversationStore.ts#L65)

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

Defined in: [packages/ai/src/memory/conversationStore.ts:57](https://github.com/puristajs/purista/blob/6e0354b1e51abc331c66c917ee95829470c9fba2/packages/ai/src/memory/conversationStore.ts#L57)

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

Defined in: [packages/ai/src/memory/conversationStore.ts:61](https://github.com/puristajs/purista/blob/6e0354b1e51abc331c66c917ee95829470c9fba2/packages/ai/src/memory/conversationStore.ts#L61)

#### Parameters

##### record

[`ConversationStoreRecord`](../type-aliases/ConversationStoreRecord.md)

##### scope?

[`ConversationStoreScope`](../type-aliases/ConversationStoreScope.md)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`ConversationStore`](../interfaces/ConversationStore.md).[`save`](../interfaces/ConversationStore.md#save)
