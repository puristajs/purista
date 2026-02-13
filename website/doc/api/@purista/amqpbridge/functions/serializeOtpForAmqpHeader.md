[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/amqpbridge](../README.md) / serializeOtpForAmqpHeader

# Function: serializeOtpForAmqpHeader()

> **serializeOtpForAmqpHeader**(`header`): `Record`\<`string`, `string` \| `undefined`\>

Defined in: [amqpbridge/src/serializeOtpForAmqpHeader.impl.ts:7](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/serializeOtpForAmqpHeader.impl.ts#L7)

Injects the active OpenTelemetry trace context into AMQP headers.
This enables cross-service trace propagation for messages.

## Parameters

### header

`Record`\<`string`, `string` \| `undefined`\>

## Returns

`Record`\<`string`, `string` \| `undefined`\>
