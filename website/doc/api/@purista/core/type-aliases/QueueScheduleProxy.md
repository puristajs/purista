[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / QueueScheduleProxy

# Type Alias: QueueScheduleProxy\<TQueues\>

> **QueueScheduleProxy**\<`TQueues`\> = \{ \[K in keyof TQueues\]: TQueues\[K\] extends (payload: infer Payload, parameter?: infer Params, options?: infer Options) =\> Promise\<QueueEnqueueResult\> ? (runAt: Date \| number, payload: Payload, parameter?: Params, options?: Options extends Record\<string, unknown\> ? Omit\<Options, "delayMs"\> : Options) =\> Promise\<QueueEnqueueResult\> : never \}

Defined in: [core/types/queue/QueueContext.ts:22](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/queue/QueueContext.ts#L22)

## Type Parameters

### TQueues

`TQueues` *extends* `Record`\<`string`, (...`args`) => `Promise`\<[`QueueEnqueueResult`](QueueEnqueueResult.md)\>\>
