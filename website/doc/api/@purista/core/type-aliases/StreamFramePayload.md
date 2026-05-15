[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / StreamFramePayload

# Type Alias: StreamFramePayload\<Chunk, Final\>

> **StreamFramePayload**\<`Chunk`, `Final`\> = `object`

Defined in: [core/types/stream/StreamFrame.ts:9](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/stream/StreamFrame.ts#L9)

## Type Parameters

### Chunk

`Chunk` = `unknown`

### Final

`Final` = `unknown`

## Properties

### chunk?

> `optional` **chunk?**: `Chunk`

Defined in: [core/types/stream/StreamFrame.ts:12](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/stream/StreamFrame.ts#L12)

***

### error?

> `optional` **error?**: [`StreamErrorPayload`](StreamErrorPayload.md)

Defined in: [core/types/stream/StreamFrame.ts:14](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/stream/StreamFrame.ts#L14)

***

### final?

> `optional` **final?**: `Final`

Defined in: [core/types/stream/StreamFrame.ts:13](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/stream/StreamFrame.ts#L13)

***

### frameType

> **frameType**: `Exclude`\<[`StreamFrameType`](StreamFrameType.md), `"open"`\>

Defined in: [core/types/stream/StreamFrame.ts:10](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/stream/StreamFrame.ts#L10)

***

### reason?

> `optional` **reason?**: `string`

Defined in: [core/types/stream/StreamFrame.ts:15](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/stream/StreamFrame.ts#L15)

***

### sequence

> **sequence**: `number`

Defined in: [core/types/stream/StreamFrame.ts:11](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/stream/StreamFrame.ts#L11)
