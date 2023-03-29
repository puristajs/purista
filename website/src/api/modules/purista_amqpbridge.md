[PURISTA API - v1.4.9](../README.md) / [Modules](../modules.md) / @purista/amqpbridge

# Module: @purista/amqpbridge

## Table of contents

### Namespaces

- [internal](purista_amqpbridge.internal.md)

### Classes

- [AmqpBridge](../classes/purista_amqpbridge.AmqpBridge.md)

### Type Aliases

- [AmqpBridgeConfig](purista_amqpbridge.md#amqpbridgeconfig)
- [Encoder](purista_amqpbridge.md#encoder)
- [EncryptFunctions](purista_amqpbridge.md#encryptfunctions)
- [Encrypter](purista_amqpbridge.md#encrypter)

### Variables

- [puristaVersion](purista_amqpbridge.md#puristaversion)

### Functions

- [deserializeOtpFromAmqpHeader](purista_amqpbridge.md#deserializeotpfromamqpheader)
- [getDefaultConfig](purista_amqpbridge.md#getdefaultconfig)
- [serializeOtpForAmqpHeader](purista_amqpbridge.md#serializeotpforamqpheader)

## Type Aliases

### AmqpBridgeConfig

Ƭ **AmqpBridgeConfig**: `Object`

AmqpBridge bridge config

**`See`**

[amqplib documentation](https://amqp-node.github.io/amqplib/)

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `encoder?` | [`Encoder`](purista_amqpbridge.md#encoder) | the encoder(s) to be used for AMQP messages |
| `encrypter?` | [`Encrypter`](purista_amqpbridge.md#encrypter) | the encrypter(s) to be used for AMQP messages |
| `exchangeName?` | `string` | the AMQP exchage name to be used |
| `exchangeOptions?` | `Options.AssertExchange` | the AMQP exchange options |
| `namePrefix?` | `string` | the queue prefix to be used for all PURISTA queues except short living queues created by the broker on request |
| `socketOptions?` | `any` | socket options |
| `url?` | `string` \| `Options.Connect` | the AMQP broker url |

#### Defined in

[packages/amqpbridge/src/types/AmqpBridgeConfig.ts:11](https://github.com/sebastianwessel/purista/blob/dde9cc6/packages/amqpbridge/src/types/AmqpBridgeConfig.ts#L11)

___

### Encoder

Ƭ **Encoder**: `Record`<`string`, [`EncoderFunctions`](purista_amqpbridge.internal.md#encoderfunctions)\>

#### Defined in

[packages/amqpbridge/src/types/Encoder.ts:3](https://github.com/sebastianwessel/purista/blob/dde9cc6/packages/amqpbridge/src/types/Encoder.ts#L3)

___

### EncryptFunctions

Ƭ **EncryptFunctions**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `decrypt` | (`input`: `Buffer`) => `Promise`<`Buffer`\> |
| `encrypt` | (`input`: `Buffer`) => `Promise`<`Buffer`\> |

#### Defined in

[packages/amqpbridge/src/types/EncryptFunctions.ts:1](https://github.com/sebastianwessel/purista/blob/dde9cc6/packages/amqpbridge/src/types/EncryptFunctions.ts#L1)

___

### Encrypter

Ƭ **Encrypter**: `Record`<`string`, [`EncryptFunctions`](purista_amqpbridge.md#encryptfunctions)\>

#### Defined in

[packages/amqpbridge/src/types/Encrypter.ts:3](https://github.com/sebastianwessel/purista/blob/dde9cc6/packages/amqpbridge/src/types/Encrypter.ts#L3)

## Variables

### puristaVersion

• `Const` **puristaVersion**: ``"1.4.9"``

#### Defined in

[packages/amqpbridge/src/version.ts:1](https://github.com/sebastianwessel/purista/blob/dde9cc6/packages/amqpbridge/src/version.ts#L1)

## Functions

### deserializeOtpFromAmqpHeader

▸ **deserializeOtpFromAmqpHeader**(`logger`, `message`, `encrypter`, `encoder`): `Promise`<`undefined` \| `Context`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `logger` | [`Logger`](../classes/purista_amqpbridge.internal.Logger.md) |
| `message` | ``null`` \| `ConsumeMessage` |
| `encrypter` | [`Encrypter`](purista_amqpbridge.md#encrypter) |
| `encoder` | [`Encoder`](purista_amqpbridge.md#encoder) |

#### Returns

`Promise`<`undefined` \| `Context`\>

#### Defined in

[packages/amqpbridge/src/deserializeOtpFromAmqpHeader.impl.ts:8](https://github.com/sebastianwessel/purista/blob/dde9cc6/packages/amqpbridge/src/deserializeOtpFromAmqpHeader.impl.ts#L8)

___

### getDefaultConfig

▸ **getDefaultConfig**(): [`Complete`](purista_amqpbridge.internal.md#complete)<[`AmqpBridgeConfig`](purista_amqpbridge.md#amqpbridgeconfig)\> & { `exchangeName`: `string` ; `url`: `string`  }

#### Returns

[`Complete`](purista_amqpbridge.internal.md#complete)<[`AmqpBridgeConfig`](purista_amqpbridge.md#amqpbridgeconfig)\> & { `exchangeName`: `string` ; `url`: `string`  }

#### Defined in

[packages/amqpbridge/src/getDefaultConfig.impl.ts:5](https://github.com/sebastianwessel/purista/blob/dde9cc6/packages/amqpbridge/src/getDefaultConfig.impl.ts#L5)

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

[packages/amqpbridge/src/serializeOtpForAmqpHeader.impl.ts:3](https://github.com/sebastianwessel/purista/blob/dde9cc6/packages/amqpbridge/src/serializeOtpForAmqpHeader.impl.ts#L3)
