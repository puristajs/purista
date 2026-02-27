[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / InMemorySessionStore

# Class: InMemorySessionStore

Defined in: memory/sessionStore.ts:35

Simple development-friendly session store that keeps state in memory.

## Example

```ts
const store = new InMemorySessionStore()
await store.save({ sessionId: 'demo', data: { lastOutput: 'hi' }, updatedAt: Date.now() })
```

## Implements

- [`SessionStore`](../interfaces/SessionStore.md)

## Constructors

### Constructor

> **new InMemorySessionStore**(): `InMemorySessionStore`

#### Returns

`InMemorySessionStore`

## Methods

### delete()

> **delete**(`sessionId`): `Promise`\<`void`\>

Defined in: memory/sessionStore.ts:46

#### Parameters

##### sessionId

`string`

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`SessionStore`](../interfaces/SessionStore.md).[`delete`](../interfaces/SessionStore.md#delete)

***

### load()

> **load**(`sessionId`): `Promise`\<[`SessionRecord`](../type-aliases/SessionRecord.md) \| `undefined`\>

Defined in: memory/sessionStore.ts:38

#### Parameters

##### sessionId

`string`

#### Returns

`Promise`\<[`SessionRecord`](../type-aliases/SessionRecord.md) \| `undefined`\>

#### Implementation of

[`SessionStore`](../interfaces/SessionStore.md).[`load`](../interfaces/SessionStore.md#load)

***

### save()

> **save**(`record`): `Promise`\<`void`\>

Defined in: memory/sessionStore.ts:42

#### Parameters

##### record

[`SessionRecord`](../type-aliases/SessionRecord.md)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`SessionStore`](../interfaces/SessionStore.md).[`save`](../interfaces/SessionStore.md#save)
