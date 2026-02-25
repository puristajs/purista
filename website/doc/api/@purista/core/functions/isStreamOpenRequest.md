[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / isStreamOpenRequest

# Function: isStreamOpenRequest()

> **isStreamOpenRequest**(`message`): `message is { contentEncoding: string; contentType: string; correlationId: string; eventName?: string; id: string; messageType: Stream; otp?: string; payload: StreamOpenRequestPayload<unknown, unknown>; principalId?: string; receiver: EBMessageAddress; sender: { instanceId: string; serviceName: string; serviceTarget: string; serviceVersion: string }; tenantId?: string; timestamp: number; traceId?: string }`

Defined in: [core/types/stream/isStreamOpenRequest.impl.ts:4](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/stream/isStreamOpenRequest.impl.ts#L4)

## Parameters

### message

[`StreamMessage`](../type-aliases/StreamMessage.md)

## Returns

`message is { contentEncoding: string; contentType: string; correlationId: string; eventName?: string; id: string; messageType: Stream; otp?: string; payload: StreamOpenRequestPayload<unknown, unknown>; principalId?: string; receiver: EBMessageAddress; sender: { instanceId: string; serviceName: string; serviceTarget: string; serviceVersion: string }; tenantId?: string; timestamp: number; traceId?: string }`
