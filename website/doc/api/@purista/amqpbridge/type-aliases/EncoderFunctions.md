[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/amqpbridge](../README.md) / EncoderFunctions

# Type Alias: EncoderFunctions

> **EncoderFunctions** = `object`

Defined in: [amqpbridge/src/types/EncoderFunctions.ts:4](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/types/EncoderFunctions.ts#L4)

Encode/decode contract for one content-type codec.

## Properties

### decode()

> **decode**: \<`T`\>(`input`) => `Promise`\<`T`\>

Defined in: [amqpbridge/src/types/EncoderFunctions.ts:8](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/types/EncoderFunctions.ts#L8)

Decodes a binary payload into a JavaScript value.

#### Type Parameters

##### T

`T`

#### Parameters

##### input

`Buffer`

#### Returns

`Promise`\<`T`\>

***

### encode()

> **encode**: \<`T`\>(`input`) => `Promise`\<`Buffer`\>

Defined in: [amqpbridge/src/types/EncoderFunctions.ts:6](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/types/EncoderFunctions.ts#L6)

Encodes a JavaScript value into a binary payload.

#### Type Parameters

##### T

`T`

#### Parameters

##### input

`T`

#### Returns

`Promise`\<`Buffer`\>
