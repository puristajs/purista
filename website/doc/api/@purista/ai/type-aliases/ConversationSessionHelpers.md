[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / ConversationSessionHelpers

# Type Alias: ConversationSessionHelpers

> **ConversationSessionHelpers** = `object`

Defined in: [packages/ai/src/runtime/conversation.ts:26](https://github.com/puristajs/purista/blob/6304710cc2bd8718e85e838752c7933f343ed2ce/packages/ai/src/runtime/conversation.ts#L26)

## Methods

### load()

> **load**(`sessionId?`): `Promise`\<[`ConversationStoreRecord`](ConversationStoreRecord.md) \| `undefined`\>

Defined in: [packages/ai/src/runtime/conversation.ts:27](https://github.com/puristajs/purista/blob/6304710cc2bd8718e85e838752c7933f343ed2ce/packages/ai/src/runtime/conversation.ts#L27)

#### Parameters

##### sessionId?

`string`

#### Returns

`Promise`\<[`ConversationStoreRecord`](ConversationStoreRecord.md) \| `undefined`\>

***

### save()

> **save**(`record`): `Promise`\<`void`\>

Defined in: [packages/ai/src/runtime/conversation.ts:28](https://github.com/puristajs/purista/blob/6304710cc2bd8718e85e838752c7933f343ed2ce/packages/ai/src/runtime/conversation.ts#L28)

#### Parameters

##### record

###### conversationId?

`string`

###### data

[`ConversationStoreRecordData`](ConversationStoreRecordData.md)

###### updatedAt?

`number`

#### Returns

`Promise`\<`void`\>
