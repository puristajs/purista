[**@purista/core v2.0.5**](../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / isCommand

# Function: isCommand()

> **isCommand**(`message`): `message is { contentEncoding: string; contentType: string; correlationId: string; eventName?: string; id: string; messageType: Command; otp?: string; payload: { parameter: unknown; payload: unknown }; principalId?: string; receiver: EBMessageAddress; sender: { instanceId: string; serviceName: string; serviceTarget: string; serviceVersion: string }; tenantId?: string; timestamp: number; traceId?: string }`

Defined in: [packages/core/src/core/types/commandType/isCommand.impl.ts:12](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/commandType/isCommand.impl.ts#L12)

Checks if given message is type of Command

## Parameters

### message

[`EBMessage`](../type-aliases/EBMessage.md)

## Returns

`message is { contentEncoding: string; contentType: string; correlationId: string; eventName?: string; id: string; messageType: Command; otp?: string; payload: { parameter: unknown; payload: unknown }; principalId?: string; receiver: EBMessageAddress; sender: { instanceId: string; serviceName: string; serviceTarget: string; serviceVersion: string }; tenantId?: string; timestamp: number; traceId?: string }`

boolean
