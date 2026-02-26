[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / isStreamControl

# Function: isStreamControl()

> **isStreamControl**(`message`): `message is { contentEncoding: string; contentType: string; correlationId: string; eventName?: string; id: string; messageType: Stream; otp?: string; payload: StreamControlPayload; principalId?: string; receiver: EBMessageAddress & Required<Pick<EBMessageAddress, "instanceId">>; sender: { instanceId: string; serviceName: string; serviceTarget: string; serviceVersion: string }; tenantId?: string; timestamp: number; traceId?: string }`

Defined in: [core/types/stream/isStreamControl.impl.ts:4](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/stream/isStreamControl.impl.ts#L4)

## Parameters

### message

[`StreamMessage`](../type-aliases/StreamMessage.md)

## Returns

`message is { contentEncoding: string; contentType: string; correlationId: string; eventName?: string; id: string; messageType: Stream; otp?: string; payload: StreamControlPayload; principalId?: string; receiver: EBMessageAddress & Required<Pick<EBMessageAddress, "instanceId">>; sender: { instanceId: string; serviceName: string; serviceTarget: string; serviceVersion: string }; tenantId?: string; timestamp: number; traceId?: string }`
