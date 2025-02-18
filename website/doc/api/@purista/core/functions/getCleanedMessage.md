[**@purista/core v1.11.0**](../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / getCleanedMessage

# Function: getCleanedMessage()

> **getCleanedMessage**(`message`, `stripeOutContent`): `Record`\<`string`, `unknown`\>

Defined in: [packages/core/src/core/helper/getCleanedMessage.impl.ts:16](https://github.com/puristajs/purista/blob/master/packages/core/src/core/helper/getCleanedMessage.impl.ts#L16)

Helper function for logging.
Returns a message object, where fields which might contain sensitive data, are overwritten with string values.
For command messages, parameter and payload are overwritten with string values.

For command success responses, the response field is overwritten.

Command error responses are not changed.

## Parameters

### message

`Readonly`\<[`EBMessage`](../type-aliases/EBMessage.md)\>

### stripeOutContent

`boolean` = `...`

## Returns

`Record`\<`string`, `unknown`\>
