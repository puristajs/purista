[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / SessionHelpers

# Type Alias: SessionHelpers

> **SessionHelpers** = `object`

Defined in: [packages/ai/src/runtime/context.ts:414](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/runtime/context.ts#L414)

## Properties

### identity

> **identity**: `object`

Defined in: [packages/ai/src/runtime/context.ts:438](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/runtime/context.ts#L438)

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

Defined in: [packages/ai/src/runtime/context.ts:430](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/runtime/context.ts#L430)

Delete a session. If no id is provided, the default scoped id is used.

#### Parameters

##### sessionId?

`string`

#### Returns

`Promise`\<`void`\>

***

### load()

> **load**(`sessionId?`): `Promise`\<[`ConversationStoreRecord`](ConversationStoreRecord.md) \| `undefined`\>

Defined in: [packages/ai/src/runtime/context.ts:418](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/runtime/context.ts#L418)

Load the session record. If no id is provided, the default scoped id is used.

#### Parameters

##### sessionId?

`string`

#### Returns

`Promise`\<[`ConversationStoreRecord`](ConversationStoreRecord.md) \| `undefined`\>

***

### resolveSessionId()

> **resolveSessionId**(`sessionId?`): `string`

Defined in: [packages/ai/src/runtime/context.ts:434](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/runtime/context.ts#L434)

Returns the effective scoped session id for explicit or implicit usage.

#### Parameters

##### sessionId?

`string`

#### Returns

`string`

***

### save()

> **save**(`record`): `Promise`\<`void`\>

Defined in: [packages/ai/src/runtime/context.ts:422](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/runtime/context.ts#L422)

Save session data. If `sessionId` is omitted, the default scoped id is used.

#### Parameters

##### record

[`ConversationStoreRecord`](ConversationStoreRecord.md) | \{ `conversationId?`: `string`; `data`: [`ConversationStoreRecordData`](ConversationStoreRecordData.md); `updatedAt?`: `number`; \}

#### Returns

`Promise`\<`void`\>
