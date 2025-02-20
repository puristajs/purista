[**@purista/amqpbridge v2.0.5**](../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/amqpbridge](../README.md) / EncoderFunctions

# Type Alias: EncoderFunctions

> **EncoderFunctions**: `object`

Defined in: [amqpbridge/src/types/EncoderFunctions.ts:1](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/types/EncoderFunctions.ts#L1)

## Type declaration

### decode()

> **decode**: \<`T`\>(`input`) => `Promise`\<`T`\>

#### Type Parameters

• **T**

#### Parameters

##### input

`Buffer`

#### Returns

`Promise`\<`T`\>

### encode()

> **encode**: \<`T`\>(`input`) => `Promise`\<`Buffer`\>

#### Type Parameters

• **T**

#### Parameters

##### input

`T`

#### Returns

`Promise`\<`Buffer`\>
