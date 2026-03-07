[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / SessionHelpers

# Type Alias: SessionHelpers

> **SessionHelpers** = `object`

Defined in: [ai/src/runtime/context.ts:297](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/runtime/context.ts#L297)

## Properties

### identity

> **identity**: `object`

Defined in: [ai/src/runtime/context.ts:317](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/runtime/context.ts#L317)

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

Defined in: [ai/src/runtime/context.ts:309](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/runtime/context.ts#L309)

Delete a session. If no id is provided, the default scoped id is used.

#### Parameters

##### sessionId?

`string`

#### Returns

`Promise`\<`void`\>

***

### load()

> **load**(`sessionId?`): `Promise`\<[`SessionRecord`](SessionRecord.md) \| `undefined`\>

Defined in: [ai/src/runtime/context.ts:301](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/runtime/context.ts#L301)

Load the session record. If no id is provided, the default scoped id is used.

#### Parameters

##### sessionId?

`string`

#### Returns

`Promise`\<[`SessionRecord`](SessionRecord.md) \| `undefined`\>

***

### resolveSessionId()

> **resolveSessionId**(`sessionId?`): `string`

Defined in: [ai/src/runtime/context.ts:313](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/runtime/context.ts#L313)

Returns the effective scoped session id for explicit or implicit usage.

#### Parameters

##### sessionId?

`string`

#### Returns

`string`

***

### save()

> **save**(`record`): `Promise`\<`void`\>

Defined in: [ai/src/runtime/context.ts:305](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/runtime/context.ts#L305)

Save session data. If `sessionId` is omitted, the default scoped id is used.

#### Parameters

##### record

[`SessionRecord`](SessionRecord.md) | \{ `data`: [`SessionRecordData`](SessionRecordData.md); `sessionId?`: `string`; `updatedAt?`: `number`; \}

#### Returns

`Promise`\<`void`\>
