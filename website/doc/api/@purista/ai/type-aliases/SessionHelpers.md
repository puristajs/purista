[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / SessionHelpers

# Type Alias: SessionHelpers

> **SessionHelpers** = `object`

Defined in: [packages/ai/src/runtime/context.ts:573](https://github.com/puristajs/purista/blob/6e0354b1e51abc331c66c917ee95829470c9fba2/packages/ai/src/runtime/context.ts#L573)

## Properties

### identity

> **identity**: `object`

Defined in: [packages/ai/src/runtime/context.ts:597](https://github.com/puristajs/purista/blob/6e0354b1e51abc331c66c917ee95829470c9fba2/packages/ai/src/runtime/context.ts#L597)

Identity metadata used to build scoped session ids.

#### agentName

> **agentName**: `string`

#### agentVersion

> **agentVersion**: `string`

#### baseSessionId

> **baseSessionId**: `string`

#### principalId?

> `optional` **principalId**: `string`

#### tenantId?

> `optional` **tenantId**: `string`

## Methods

### delete()

> **delete**(`sessionId?`): `Promise`\<`void`\>

Defined in: [packages/ai/src/runtime/context.ts:589](https://github.com/puristajs/purista/blob/6e0354b1e51abc331c66c917ee95829470c9fba2/packages/ai/src/runtime/context.ts#L589)

Delete a session. If no id is provided, the default scoped id is used.

#### Parameters

##### sessionId?

`string`

#### Returns

`Promise`\<`void`\>

***

### load()

> **load**(`sessionId?`): `Promise`\<[`ConversationStoreRecord`](ConversationStoreRecord.md) \| `undefined`\>

Defined in: [packages/ai/src/runtime/context.ts:577](https://github.com/puristajs/purista/blob/6e0354b1e51abc331c66c917ee95829470c9fba2/packages/ai/src/runtime/context.ts#L577)

Load the session record. If no id is provided, the default scoped id is used.

#### Parameters

##### sessionId?

`string`

#### Returns

`Promise`\<[`ConversationStoreRecord`](ConversationStoreRecord.md) \| `undefined`\>

***

### resolveSessionId()

> **resolveSessionId**(`sessionId?`): `string`

Defined in: [packages/ai/src/runtime/context.ts:593](https://github.com/puristajs/purista/blob/6e0354b1e51abc331c66c917ee95829470c9fba2/packages/ai/src/runtime/context.ts#L593)

Returns the effective scoped session id for explicit or implicit usage.

#### Parameters

##### sessionId?

`string`

#### Returns

`string`

***

### save()

> **save**(`record`): `Promise`\<`void`\>

Defined in: [packages/ai/src/runtime/context.ts:581](https://github.com/puristajs/purista/blob/6e0354b1e51abc331c66c917ee95829470c9fba2/packages/ai/src/runtime/context.ts#L581)

Save session data. If `sessionId` is omitted, the default scoped id is used.

#### Parameters

##### record

[`ConversationStoreRecord`](ConversationStoreRecord.md) | \{ `conversationId?`: `string`; `data`: [`ConversationStoreRecordData`](ConversationStoreRecordData.md); `updatedAt?`: `number`; \}

#### Returns

`Promise`\<`void`\>
