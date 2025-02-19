[**@purista/amqpbridge v2.0.0**](README.md)

***

[PURISTA API](../../packages.md) / @purista/amqpbridge

# @purista/amqpbridge

Package for using a AMQP broker like rabbitMQ as event bridge.

Example usage:

## Example

```typescript
import { AmqpBridge } from '@purista/amqpbridge'

// create and init our eventbridge
  const eventBridge = new AmqpBridge()
  await eventBridge.start()

```

## Type Aliases

- [AmqpBridgeConfig](type-aliases/AmqpBridgeConfig.md)
- [Encoder](type-aliases/Encoder.md)
- [EncoderFunctions](type-aliases/EncoderFunctions.md)
- [Encrypter](type-aliases/Encrypter.md)
- [EncryptFunctions](type-aliases/EncryptFunctions.md)

## Variables

- [puristaVersion](variables/puristaVersion.md)

## Functions

- [deserializeOtpFromAmqpHeader](functions/deserializeOtpFromAmqpHeader.md)
- [getDefaultConfig](functions/getDefaultConfig.md)
- [serializeOtpForAmqpHeader](functions/serializeOtpForAmqpHeader.md)

## Event bridge

- [AmqpBridge](classes/AmqpBridge.md)
