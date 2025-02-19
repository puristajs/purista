[**@purista/core v2.0.0**](../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / isCommandSuccessResponse

# Function: isCommandSuccessResponse()

> **isCommandSuccessResponse**(`message`): `message is { contentEncoding: string; contentType: string; correlationId: string; eventName?: string; id: string; messageType: CommandSuccessResponse; otp?: string; payload: unknown; principalId?: string; receiver: { instanceId: string; serviceName: string; serviceTarget: string; serviceVersion: string }; sender: { instanceId: string; serviceName: string; serviceTarget: string; serviceVersion: string }; tenantId?: string; timestamp: number; traceId?: string }`

Defined in: [packages/core/src/core/types/commandType/isCommandSuccessResponse.impl.ts:12](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/commandType/isCommandSuccessResponse.impl.ts#L12)

Checks if given message is type of CommandSuccessResponse

## Parameters

### message

[`EBMessage`](../type-aliases/EBMessage.md)

## Returns

`message is { contentEncoding: string; contentType: string; correlationId: string; eventName?: string; id: string; messageType: CommandSuccessResponse; otp?: string; payload: unknown; principalId?: string; receiver: { instanceId: string; serviceName: string; serviceTarget: string; serviceVersion: string }; sender: { instanceId: string; serviceName: string; serviceTarget: string; serviceVersion: string }; tenantId?: string; timestamp: number; traceId?: string }`

boolean
