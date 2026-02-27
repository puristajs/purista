[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / SessionStore

# Interface: SessionStore

Defined in: memory/sessionStore.ts:20

## Methods

### delete()

> **delete**(`sessionId`): `Promise`\<`void`\>

Defined in: memory/sessionStore.ts:23

#### Parameters

##### sessionId

`string`

#### Returns

`Promise`\<`void`\>

***

### load()

> **load**(`sessionId`): `Promise`\<[`SessionRecord`](../type-aliases/SessionRecord.md) \| `undefined`\>

Defined in: memory/sessionStore.ts:21

#### Parameters

##### sessionId

`string`

#### Returns

`Promise`\<[`SessionRecord`](../type-aliases/SessionRecord.md) \| `undefined`\>

***

### save()

> **save**(`record`): `Promise`\<`void`\>

Defined in: memory/sessionStore.ts:22

#### Parameters

##### record

[`SessionRecord`](../type-aliases/SessionRecord.md)

#### Returns

`Promise`\<`void`\>
