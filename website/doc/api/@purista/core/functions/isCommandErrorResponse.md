[**@purista/core v1.11.0**](../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / isCommandErrorResponse

# Function: isCommandErrorResponse()

> **isCommandErrorResponse**(`message`): `message is { contentEncoding: "utf-8"; contentType: "application/json"; correlationId: string; eventName?: string; id: string; isHandledError: boolean; messageType: CommandErrorResponse; otp?: string; payload: { data?: unknown; message: string; status: StatusCode }; principalId?: string; receiver: { instanceId: string; serviceName: string; serviceTarget: string; serviceVersion: string }; sender: { instanceId: string; serviceName: string; serviceTarget: string; serviceVersion: string }; tenantId?: string; timestamp: number; traceId?: string }`

Defined in: [packages/core/src/core/types/commandType/isCommandErrorResponse.impl.ts:12](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/commandType/isCommandErrorResponse.impl.ts#L12)

Checks if given message is type of CommandErrorResponse

## Parameters

### message

`unknown`

## Returns

`message is { contentEncoding: "utf-8"; contentType: "application/json"; correlationId: string; eventName?: string; id: string; isHandledError: boolean; messageType: CommandErrorResponse; otp?: string; payload: { data?: unknown; message: string; status: StatusCode }; principalId?: string; receiver: { instanceId: string; serviceName: string; serviceTarget: string; serviceVersion: string }; sender: { instanceId: string; serviceName: string; serviceTarget: string; serviceVersion: string }; tenantId?: string; timestamp: number; traceId?: string }`

boolean
