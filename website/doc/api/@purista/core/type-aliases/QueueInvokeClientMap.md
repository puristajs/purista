[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / QueueInvokeClientMap

# Type Alias: QueueInvokeClientMap\<TQueues\>

> **QueueInvokeClientMap**\<`TQueues`\> = \{ \[K in keyof TQueues\]: (payload: InferPayload\<TQueues\[K\]\["payloadSchema"\]\>, parameter?: InferParameter\<TQueues\[K\]\["parameterSchema"\]\>, options?: Omit\<QueueEnqueueOptions\<InferPayload\<TQueues\[K\]\["payloadSchema"\]\>, InferParameter\<TQueues\[K\]\["parameterSchema"\]\>\>, "queueName" \| "payload" \| "parameter"\>) =\> Promise\<QueueEnqueueResult\> \}

Defined in: [core/types/queue/QueueContext.ts:11](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/queue/QueueContext.ts#L11)

## Type Parameters

### TQueues

`TQueues` *extends* [`QueueInvokeList`](QueueInvokeList.md)
