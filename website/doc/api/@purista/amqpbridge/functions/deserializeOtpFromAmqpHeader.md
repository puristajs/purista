[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/amqpbridge](../README.md) / deserializeOtpFromAmqpHeader

# Function: deserializeOtpFromAmqpHeader()

> **deserializeOtpFromAmqpHeader**(`logger`, `message`, `encrypter`, `encoder`): `Promise`\<`Context` \| `undefined`\>

Defined in: [amqpbridge/src/deserializeOtpFromAmqpHeader.impl.ts:13](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/deserializeOtpFromAmqpHeader.impl.ts#L13)

Reconstructs OpenTelemetry context from AMQP headers or message payload.

## Parameters

### logger

[`Logger`](../../core/classes/Logger.md)

### message

`ConsumeMessage` | `null`

### encrypter

[`Encrypter`](../type-aliases/Encrypter.md)

### encoder

[`Encoder`](../type-aliases/Encoder.md)

## Returns

`Promise`\<`Context` \| `undefined`\>
