[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / StreamWriter

# Interface: StreamWriter\<Chunk, Final\>

Defined in: [core/types/stream/StreamWriter.ts:1](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/stream/StreamWriter.ts#L1)

## Type Parameters

### Chunk

`Chunk` = `unknown`

### Final

`Final` = `unknown`

## Properties

### cancelled

> `readonly` **cancelled**: `boolean`

Defined in: [core/types/stream/StreamWriter.ts:2](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/stream/StreamWriter.ts#L2)

## Methods

### close()

> **close**(`final?`): `Promise`\<`void`\>

Defined in: [core/types/stream/StreamWriter.ts:4](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/stream/StreamWriter.ts#L4)

#### Parameters

##### final?

`Final`

#### Returns

`Promise`\<`void`\>

***

### fail()

> **fail**(`error`): `Promise`\<`void`\>

Defined in: [core/types/stream/StreamWriter.ts:5](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/stream/StreamWriter.ts#L5)

#### Parameters

##### error

`unknown`

#### Returns

`Promise`\<`void`\>

***

### onCancel()

> **onCancel**(`cb`): `void`

Defined in: [core/types/stream/StreamWriter.ts:6](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/stream/StreamWriter.ts#L6)

#### Parameters

##### cb

(`reason?`) => `void`

#### Returns

`void`

***

### write()

> **write**(`chunk`): `Promise`\<`void`\>

Defined in: [core/types/stream/StreamWriter.ts:3](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/stream/StreamWriter.ts#L3)

#### Parameters

##### chunk

`Chunk`

#### Returns

`Promise`\<`void`\>
