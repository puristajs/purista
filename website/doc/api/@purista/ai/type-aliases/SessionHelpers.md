[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / SessionHelpers

# Type Alias: SessionHelpers

> **SessionHelpers** = `object`

Defined in: [packages/ai/src/runtime/context.ts:1045](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/context.ts#L1045)

## Properties

### identity

> **identity**: `object`

Defined in: [packages/ai/src/runtime/context.ts:1069](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/context.ts#L1069)

Identity metadata used to build scoped session ids.

#### agentName

> **agentName**: `string`

#### baseSessionId

> **baseSessionId**: `string`

#### conversationId

> **conversationId**: `string`

#### correlationId

> **correlationId**: `string`

#### principalId?

> `optional` **principalId**: `string`

#### scopedSessionId

> **scopedSessionId**: `string`

#### serviceVersion

> **serviceVersion**: `string`

#### tenantId?

> `optional` **tenantId**: `string`

#### traceId

> **traceId**: `string`

## Methods

### delete()

> **delete**(`sessionId?`): `Promise`\<`void`\>

Defined in: [packages/ai/src/runtime/context.ts:1061](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/context.ts#L1061)

Delete a session. If no id is provided, the default scoped id is used.

#### Parameters

##### sessionId?

`string`

#### Returns

`Promise`\<`void`\>

***

### load()

> **load**(`sessionId?`): `Promise`\<[`ConversationStoreRecord`](ConversationStoreRecord.md) \| `undefined`\>

Defined in: [packages/ai/src/runtime/context.ts:1049](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/context.ts#L1049)

Load the session record. If no id is provided, the default scoped id is used.

#### Parameters

##### sessionId?

`string`

#### Returns

`Promise`\<[`ConversationStoreRecord`](ConversationStoreRecord.md) \| `undefined`\>

***

### resolveSessionId()

> **resolveSessionId**(`sessionId?`): `string`

Defined in: [packages/ai/src/runtime/context.ts:1065](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/context.ts#L1065)

Returns the effective scoped session id for explicit or implicit usage.

#### Parameters

##### sessionId?

`string`

#### Returns

`string`

***

### save()

> **save**(`record`): `Promise`\<`void`\>

Defined in: [packages/ai/src/runtime/context.ts:1053](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/context.ts#L1053)

Save session data. If `sessionId` is omitted, the default scoped id is used.

#### Parameters

##### record

[`ConversationStoreRecord`](ConversationStoreRecord.md) | \{ `conversationId?`: `string`; `data`: [`ConversationStoreRecordData`](ConversationStoreRecordData.md); `updatedAt?`: `number`; \}

#### Returns

`Promise`\<`void`\>
