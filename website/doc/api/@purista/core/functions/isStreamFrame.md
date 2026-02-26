[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / isStreamFrame

# Function: isStreamFrame()

> **isStreamFrame**\<`Chunk`, `Final`\>(`message`): `message is { contentEncoding: string; contentType: string; correlationId: string; eventName?: string; id: string; messageType: Stream; otp?: string; payload: StreamFramePayload<Chunk, Final>; principalId?: string; receiver: { instanceId: string; serviceName: string; serviceTarget: string; serviceVersion: string }; sender: { instanceId: string; serviceName: string; serviceTarget: string; serviceVersion: string }; tenantId?: string; timestamp: number; traceId?: string }`

Defined in: [core/types/stream/isStreamFrame.impl.ts:4](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/stream/isStreamFrame.impl.ts#L4)

## Type Parameters

### Chunk

`Chunk` = `unknown`

### Final

`Final` = `unknown`

## Parameters

### message

[`StreamMessage`](../type-aliases/StreamMessage.md)\<`Chunk`, `Final`\>

## Returns

`message is { contentEncoding: string; contentType: string; correlationId: string; eventName?: string; id: string; messageType: Stream; otp?: string; payload: StreamFramePayload<Chunk, Final>; principalId?: string; receiver: { instanceId: string; serviceName: string; serviceTarget: string; serviceVersion: string }; sender: { instanceId: string; serviceName: string; serviceTarget: string; serviceVersion: string }; tenantId?: string; timestamp: number; traceId?: string }`
