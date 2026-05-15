[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / OpenStreamFunction

# Type Alias: OpenStreamFunction

> **OpenStreamFunction** = \<`Chunk`, `Final`, `PayloadType`, `ParameterType`\>(`address`, `payload`, `parameter`) => `Promise`\<[`StreamHandle`](../interfaces/StreamHandle.md)\<`Chunk`, `Final`\>\>

Defined in: [core/types/OpenStreamFunction.ts:5](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/OpenStreamFunction.ts#L5)

## Type Parameters

### Chunk

`Chunk` = `unknown`

### Final

`Final` = `unknown`

### PayloadType

`PayloadType` = `unknown`

### ParameterType

`ParameterType` *extends* [`EmptyObject`](EmptyObject.md) = [`EmptyObject`](EmptyObject.md)

## Parameters

### address

[`EBMessageAddress`](EBMessageAddress.md)

### payload

`PayloadType`

### parameter

`ParameterType`

## Returns

`Promise`\<[`StreamHandle`](../interfaces/StreamHandle.md)\<`Chunk`, `Final`\>\>
