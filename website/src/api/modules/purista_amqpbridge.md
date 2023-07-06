[PURISTA API](../README.md) / [Modules](../modules.md) / @purista/amqpbridge

# Module: @purista/amqpbridge

Package for using a AMQP broker like rabbitMQ as event bridge.

Example usage:

**`Example`**

```typescript
import { AmqpBridge } from '@purista/amqpbridge'

// create and init our eventbridge
  const eventBridge = new AmqpBridge()
  await eventBridge.start()

```

## Table of contents

### Type Aliases

- [AmqpBridgeConfig](purista_amqpbridge.md#amqpbridgeconfig)
- [Encoder](purista_amqpbridge.md#encoder)
- [EncoderFunctions](purista_amqpbridge.md#encoderfunctions)
- [EncryptFunctions](purista_amqpbridge.md#encryptfunctions)
- [Encrypter](purista_amqpbridge.md#encrypter)

### Variables

- [puristaVersion](purista_amqpbridge.md#puristaversion)

### Functions

- [deserializeOtpFromAmqpHeader](purista_amqpbridge.md#deserializeotpfromamqpheader)
- [getDefaultConfig](purista_amqpbridge.md#getdefaultconfig)
- [serializeOtpForAmqpHeader](purista_amqpbridge.md#serializeotpforamqpheader)

### Event bridge

- [AmqpBridge](../classes/purista_amqpbridge.AmqpBridge.md)

## Type Aliases

### AmqpBridgeConfig

Ƭ **AmqpBridgeConfig**: `Object`

AmqpBridge bridge config

**`See`**

[amqplib documentation](https://amqp-node.github.io/amqplib/)

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `encoder?` | [`Encoder`](purista_amqpbridge.md#encoder) | the encoder(s) to be used for AMQP messages **`Default`** ```ts jsonEncoder ``` |
| `encrypter?` | [`Encrypter`](purista_amqpbridge.md#encrypter) | the encrypter(s) to be used for AMQP messages **`Default`** ```ts plain ``` |
| `exchangeName?` | `string` | the AMQP exchage name to be used **`Default`** ```ts purista ``` |
| `exchangeOptions?` | `Options.AssertExchange` | the AMQP exchange options |
| `namePrefix?` | `string` | the queue prefix to be used for all PURISTA queues except short living queues created by the broker on request **`Default`** ```ts purista ``` |
| `socketOptions?` | `any` | socket options |
| `url?` | `string` \| `Options.Connect` | the AMQP broker url **`Default`** ```ts amqp://localhost ``` |

#### Defined in

[amqpbridge/src/types/AmqpBridgeConfig.ts:11](https://github.com/sebastianwessel/purista/blob/master/packages/amqpbridge/src/types/AmqpBridgeConfig.ts#L11)

___

### Encoder

Ƭ **Encoder**: `Record`<`string`, [`EncoderFunctions`](purista_amqpbridge.md#encoderfunctions)\>

#### Defined in

[amqpbridge/src/types/Encoder.ts:3](https://github.com/sebastianwessel/purista/blob/master/packages/amqpbridge/src/types/Encoder.ts#L3)

___

### EncoderFunctions

Ƭ **EncoderFunctions**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `decode` | <T\>(`input`: `Buffer`) => `Promise`<`T`\> |
| `encode` | <T\>(`input`: `T`) => `Promise`<`Buffer`\> |

#### Defined in

[amqpbridge/src/types/EncoderFunctions.ts:1](https://github.com/sebastianwessel/purista/blob/master/packages/amqpbridge/src/types/EncoderFunctions.ts#L1)

___

### EncryptFunctions

Ƭ **EncryptFunctions**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `decrypt` | (`input`: `Buffer`) => `Promise`<`Buffer`\> |
| `encrypt` | (`input`: `Buffer`) => `Promise`<`Buffer`\> |

#### Defined in

[amqpbridge/src/types/EncryptFunctions.ts:1](https://github.com/sebastianwessel/purista/blob/master/packages/amqpbridge/src/types/EncryptFunctions.ts#L1)

___

### Encrypter

Ƭ **Encrypter**: `Record`<`string`, [`EncryptFunctions`](purista_amqpbridge.md#encryptfunctions)\>

#### Defined in

[amqpbridge/src/types/Encrypter.ts:3](https://github.com/sebastianwessel/purista/blob/master/packages/amqpbridge/src/types/Encrypter.ts#L3)

## Variables

### puristaVersion

• `Const` **puristaVersion**: ``"1.7.3"``

#### Defined in

[amqpbridge/src/version.ts:1](https://github.com/sebastianwessel/purista/blob/master/packages/amqpbridge/src/version.ts#L1)

## Functions

### deserializeOtpFromAmqpHeader

▸ **deserializeOtpFromAmqpHeader**(`logger`, `message`, `encrypter`, `encoder`): `Promise`<`undefined` \| `Context`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `logger` | `Logger` |
| `message` | ``null`` \| `ConsumeMessage` |
| `encrypter` | [`Encrypter`](purista_amqpbridge.md#encrypter) |
| `encoder` | [`Encoder`](purista_amqpbridge.md#encoder) |

#### Returns

`Promise`<`undefined` \| `Context`\>

#### Defined in

[amqpbridge/src/deserializeOtpFromAmqpHeader.impl.ts:8](https://github.com/sebastianwessel/purista/blob/master/packages/amqpbridge/src/deserializeOtpFromAmqpHeader.impl.ts#L8)

___

### getDefaultConfig

▸ **getDefaultConfig**(): `Complete`<[`AmqpBridgeConfig`](purista_amqpbridge.md#amqpbridgeconfig)\> & { `exchangeName`: `string` ; `url`: `string`  }

#### Returns

`Complete`<[`AmqpBridgeConfig`](purista_amqpbridge.md#amqpbridgeconfig)\> & { `exchangeName`: `string` ; `url`: `string`  }

#### Defined in

[amqpbridge/src/getDefaultConfig.impl.ts:5](https://github.com/sebastianwessel/purista/blob/master/packages/amqpbridge/src/getDefaultConfig.impl.ts#L5)

___

### serializeOtpForAmqpHeader

▸ **serializeOtpForAmqpHeader**(`header`): `Record`<`string`, `undefined` \| `string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `header` | `Record`<`string`, `undefined` \| `string`\> |

#### Returns

`Record`<`string`, `undefined` \| `string`\>

#### Defined in

[amqpbridge/src/serializeOtpForAmqpHeader.impl.ts:3](https://github.com/sebastianwessel/purista/blob/master/packages/amqpbridge/src/serializeOtpForAmqpHeader.impl.ts#L3)
