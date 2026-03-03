[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / SessionHelpers

# Type Alias: SessionHelpers

> **SessionHelpers** = `object`

Defined in: [ai/src/runtime/context.ts:266](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/runtime/context.ts#L266)

## Methods

### delete()

> **delete**(`sessionId`): `Promise`\<`void`\>

Defined in: [ai/src/runtime/context.ts:269](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/runtime/context.ts#L269)

#### Parameters

##### sessionId

`string`

#### Returns

`Promise`\<`void`\>

***

### load()

> **load**(`sessionId`): `Promise`\<[`SessionRecord`](SessionRecord.md) \| `undefined`\>

Defined in: [ai/src/runtime/context.ts:267](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/runtime/context.ts#L267)

#### Parameters

##### sessionId

`string`

#### Returns

`Promise`\<[`SessionRecord`](SessionRecord.md) \| `undefined`\>

***

### save()

> **save**(`record`): `Promise`\<`void`\>

Defined in: [ai/src/runtime/context.ts:268](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/runtime/context.ts#L268)

#### Parameters

##### record

[`SessionRecord`](SessionRecord.md)

#### Returns

`Promise`\<`void`\>
