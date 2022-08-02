[PURISTA API - v1.4.3](../README.md) / @purista/amqpbridge

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

### Functions

- [getDefaultConfig](purista_amqpbridge.md#getdefaultconfig)

## Type Aliases

### AmqpBridgeConfig

Ƭ **AmqpBridgeConfig**: `Object`

AmqpBridge bridge config

#### Type declaration

| Name | Type |
| :------ | :------ |
| `defaultCommandTimeout` | `number` |
| `encoder?` | [`Encoder`](purista_amqpbridge.md#encoder) |
| `encrypter?` | [`Encrypter`](purista_amqpbridge.md#encrypter) |
| `exchangeName` | `string` |
| `exchangeOptions?` | `Options.AssertExchange` |
| `instanceId` | `string` |
| `namePrefix?` | `string` |
| `socketOptions?` | `any` |
| `url` | `string` \| `Options.Connect` |

#### Defined in

[amqpbridge/src/types/AmqpBridgeConfig.ts:9](https://github.com/sebastianwessel/purista/blob/dc1cd23/packages/amqpbridge/src/types/AmqpBridgeConfig.ts#L9)

___

### Encoder

Ƭ **Encoder**: `Record`<`string`, [`EncoderFunctions`](purista_amqpbridge.internal.md#encoderfunctions)\>

#### Defined in

[amqpbridge/src/types/Encoder.ts:3](https://github.com/sebastianwessel/purista/blob/dc1cd23/packages/amqpbridge/src/types/Encoder.ts#L3)

___

### EncryptFunctions

Ƭ **EncryptFunctions**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `decrypt` | (`input`: `Buffer`) => `Promise`<`Buffer`\> |
| `encrypt` | (`input`: `Buffer`) => `Promise`<`Buffer`\> |

#### Defined in

[amqpbridge/src/types/EncryptFunctions.ts:1](https://github.com/sebastianwessel/purista/blob/dc1cd23/packages/amqpbridge/src/types/EncryptFunctions.ts#L1)

___

### Encrypter

Ƭ **Encrypter**: `Record`<`string`, [`EncryptFunctions`](purista_amqpbridge.md#encryptfunctions)\>

#### Defined in

[amqpbridge/src/types/Encrypter.ts:3](https://github.com/sebastianwessel/purista/blob/dc1cd23/packages/amqpbridge/src/types/Encrypter.ts#L3)

## Functions

### getDefaultConfig

▸ **getDefaultConfig**(): [`AmqpBridgeConfig`](purista_amqpbridge.md#amqpbridgeconfig)

#### Returns

[`AmqpBridgeConfig`](purista_amqpbridge.md#amqpbridgeconfig)

#### Defined in

[amqpbridge/src/getDefaultConfig.impl.ts:5](https://github.com/sebastianwessel/purista/blob/dc1cd23/packages/amqpbridge/src/getDefaultConfig.impl.ts#L5)
