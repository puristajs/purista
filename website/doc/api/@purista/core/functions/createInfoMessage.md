[**@purista/core v1.11.0**](../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / createInfoMessage

# Function: createInfoMessage()

> **createInfoMessage**(`messageType`, `sender`, `additional`?): [`InfoMessage`](../type-aliases/InfoMessage.md)

Defined in: [packages/core/src/core/helper/createInfoMessage.impl.ts:14](https://github.com/puristajs/purista/blob/master/packages/core/src/core/helper/createInfoMessage.impl.ts#L14)

## Parameters

### messageType

[`InfoMessageType`](../type-aliases/InfoMessageType.md)

### sender

#### instanceId

`string`

instance id of eventbridge

#### serviceName

`string`

the name of the service

#### serviceTarget

`string`

the name of the command or subscription

#### serviceVersion

`string`

the version of the service

### additional?

`Partial`\<[`InfoMessage`](../type-aliases/InfoMessage.md)\>

## Returns

[`InfoMessage`](../type-aliases/InfoMessage.md)
