[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/amqpbridge](../README.md) / EncryptFunctions

# Type Alias: EncryptFunctions

> **EncryptFunctions** = `object`

Defined in: [amqpbridge/src/types/EncryptFunctions.ts:4](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/types/EncryptFunctions.ts#L4)

Encrypt/decrypt contract for one content-encoding implementation.

## Properties

### decrypt()

> **decrypt**: (`input`) => `Promise`\<`Buffer`\>

Defined in: [amqpbridge/src/types/EncryptFunctions.ts:8](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/types/EncryptFunctions.ts#L8)

Decrypts a payload after it is received from AMQP.

#### Parameters

##### input

`Buffer`

#### Returns

`Promise`\<`Buffer`\>

***

### encrypt()

> **encrypt**: (`input`) => `Promise`\<`Buffer`\>

Defined in: [amqpbridge/src/types/EncryptFunctions.ts:6](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/types/EncryptFunctions.ts#L6)

Encrypts a payload before it is sent to AMQP.

#### Parameters

##### input

`Buffer`

#### Returns

`Promise`\<`Buffer`\>
