[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / SessionHelpers

# Type Alias: SessionHelpers

> **SessionHelpers** = `object`

Defined in: [packages/ai/src/runtime/context.ts:441](https://github.com/puristajs/purista/blob/4404dd96f5462503c1bc6e1de335782a5a892137/packages/ai/src/runtime/context.ts#L441)

## Properties

### identity

> **identity**: `object`

Defined in: [packages/ai/src/runtime/context.ts:465](https://github.com/puristajs/purista/blob/4404dd96f5462503c1bc6e1de335782a5a892137/packages/ai/src/runtime/context.ts#L465)

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

Defined in: [packages/ai/src/runtime/context.ts:457](https://github.com/puristajs/purista/blob/4404dd96f5462503c1bc6e1de335782a5a892137/packages/ai/src/runtime/context.ts#L457)

Delete a session. If no id is provided, the default scoped id is used.

#### Parameters

##### sessionId?

`string`

#### Returns

`Promise`\<`void`\>

***

### load()

> **load**(`sessionId?`): `Promise`\<[`ConversationStoreRecord`](ConversationStoreRecord.md) \| `undefined`\>

Defined in: [packages/ai/src/runtime/context.ts:445](https://github.com/puristajs/purista/blob/4404dd96f5462503c1bc6e1de335782a5a892137/packages/ai/src/runtime/context.ts#L445)

Load the session record. If no id is provided, the default scoped id is used.

#### Parameters

##### sessionId?

`string`

#### Returns

`Promise`\<[`ConversationStoreRecord`](ConversationStoreRecord.md) \| `undefined`\>

***

### resolveSessionId()

> **resolveSessionId**(`sessionId?`): `string`

Defined in: [packages/ai/src/runtime/context.ts:461](https://github.com/puristajs/purista/blob/4404dd96f5462503c1bc6e1de335782a5a892137/packages/ai/src/runtime/context.ts#L461)

Returns the effective scoped session id for explicit or implicit usage.

#### Parameters

##### sessionId?

`string`

#### Returns

`string`

***

### save()

> **save**(`record`): `Promise`\<`void`\>

Defined in: [packages/ai/src/runtime/context.ts:449](https://github.com/puristajs/purista/blob/4404dd96f5462503c1bc6e1de335782a5a892137/packages/ai/src/runtime/context.ts#L449)

Save session data. If `sessionId` is omitted, the default scoped id is used.

#### Parameters

##### record

[`ConversationStoreRecord`](ConversationStoreRecord.md) | \{ `conversationId?`: `string`; `data`: [`ConversationStoreRecordData`](ConversationStoreRecordData.md); `updatedAt?`: `number`; \}

#### Returns

`Promise`\<`void`\>
