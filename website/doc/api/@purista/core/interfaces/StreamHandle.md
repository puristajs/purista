[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / StreamHandle

# Interface: StreamHandle\<Chunk, Final\>

Defined in: [core/types/stream/StreamHandle.ts:4](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/stream/StreamHandle.ts#L4)

## Extends

- `AsyncIterable`\<`Readonly`\<[`StreamFrame`](../type-aliases/StreamFrame.md)\<`Chunk`, `Final`\>\>\>

## Type Parameters

### Chunk

`Chunk` = `unknown`

### Final

`Final` = `unknown`

## Properties

### sessionId

> `readonly` **sessionId**: `string`

Defined in: [core/types/stream/StreamHandle.ts:6](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/stream/StreamHandle.ts#L6)

## Methods

### cancel()

> **cancel**(`reason?`): `Promise`\<`void`\>

Defined in: [core/types/stream/StreamHandle.ts:7](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/stream/StreamHandle.ts#L7)

#### Parameters

##### reason?

`string`

#### Returns

`Promise`\<`void`\>
