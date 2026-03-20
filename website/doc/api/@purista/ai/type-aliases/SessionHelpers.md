[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / SessionHelpers

# Type Alias: SessionHelpers

> **SessionHelpers** = `object`

Defined in: [packages/ai/src/runtime/context.ts:407](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/runtime/context.ts#L407)

## Properties

### identity

> **identity**: `object`

Defined in: [packages/ai/src/runtime/context.ts:431](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/runtime/context.ts#L431)

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

Defined in: [packages/ai/src/runtime/context.ts:423](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/runtime/context.ts#L423)

Delete a session. If no id is provided, the default scoped id is used.

#### Parameters

##### sessionId?

`string`

#### Returns

`Promise`\<`void`\>

***

### load()

> **load**(`sessionId?`): `Promise`\<[`ConversationStoreRecord`](ConversationStoreRecord.md) \| `undefined`\>

Defined in: [packages/ai/src/runtime/context.ts:411](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/runtime/context.ts#L411)

Load the session record. If no id is provided, the default scoped id is used.

#### Parameters

##### sessionId?

`string`

#### Returns

`Promise`\<[`ConversationStoreRecord`](ConversationStoreRecord.md) \| `undefined`\>

***

### resolveSessionId()

> **resolveSessionId**(`sessionId?`): `string`

Defined in: [packages/ai/src/runtime/context.ts:427](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/runtime/context.ts#L427)

Returns the effective scoped session id for explicit or implicit usage.

#### Parameters

##### sessionId?

`string`

#### Returns

`string`

***

### save()

> **save**(`record`): `Promise`\<`void`\>

Defined in: [packages/ai/src/runtime/context.ts:415](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/runtime/context.ts#L415)

Save session data. If `sessionId` is omitted, the default scoped id is used.

#### Parameters

##### record

[`ConversationStoreRecord`](ConversationStoreRecord.md) | \{ `conversationId?`: `string`; `data`: [`ConversationStoreRecordData`](ConversationStoreRecordData.md); `updatedAt?`: `number`; \}

#### Returns

`Promise`\<`void`\>
