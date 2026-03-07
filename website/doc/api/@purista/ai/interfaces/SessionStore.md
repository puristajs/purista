[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / SessionStore

# Interface: SessionStore

Defined in: [ai/src/memory/sessionStore.ts:20](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/memory/sessionStore.ts#L20)

## Methods

### delete()

> **delete**(`sessionId`): `Promise`\<`void`\>

Defined in: [ai/src/memory/sessionStore.ts:23](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/memory/sessionStore.ts#L23)

#### Parameters

##### sessionId

`string`

#### Returns

`Promise`\<`void`\>

***

### load()

> **load**(`sessionId`): `Promise`\<[`SessionRecord`](../type-aliases/SessionRecord.md) \| `undefined`\>

Defined in: [ai/src/memory/sessionStore.ts:21](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/memory/sessionStore.ts#L21)

#### Parameters

##### sessionId

`string`

#### Returns

`Promise`\<[`SessionRecord`](../type-aliases/SessionRecord.md) \| `undefined`\>

***

### save()

> **save**(`record`): `Promise`\<`void`\>

Defined in: [ai/src/memory/sessionStore.ts:22](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/memory/sessionStore.ts#L22)

#### Parameters

##### record

[`SessionRecord`](../type-aliases/SessionRecord.md)

#### Returns

`Promise`\<`void`\>
