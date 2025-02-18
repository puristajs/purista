[**@purista/core v1.11.0**](../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / isCustomMessage

# Function: isCustomMessage()

> **isCustomMessage**(`message`): `message is { contentEncoding: string; contentType: string; correlationId?: string; eventName: string; id: string; messageType: CustomMessage; otp?: string; payload?: unknown; principalId?: string; receiver?: EBMessageAddress; sender: { instanceId: string; serviceName: string; serviceTarget: string; serviceVersion: string }; tenantId?: string; timestamp: number; traceId?: string }`

Defined in: [packages/core/src/core/types/isCustomMessage.impl.ts:10](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/isCustomMessage.impl.ts#L10)

Checks if a PURISTA message is type of custom message

## Parameters

### message

[`EBMessage`](../type-aliases/EBMessage.md)

any PURISTA message

## Returns

`message is { contentEncoding: string; contentType: string; correlationId?: string; eventName: string; id: string; messageType: CustomMessage; otp?: string; payload?: unknown; principalId?: string; receiver?: EBMessageAddress; sender: { instanceId: string; serviceName: string; serviceTarget: string; serviceVersion: string }; tenantId?: string; timestamp: number; traceId?: string }`

true if message is type of custom message
