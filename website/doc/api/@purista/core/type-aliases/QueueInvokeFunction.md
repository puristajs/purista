[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / QueueInvokeFunction

# Type Alias: QueueInvokeFunction()

> **QueueInvokeFunction** = \<`Payload`, `Params`\>(`queueName`, `payload`, `parameter?`, `options?`) => `Promise`\<[`QueueEnqueueResult`](QueueEnqueueResult.md)\>

Defined in: [core/types/queue/QueueInvokeFunction.ts:4](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/queue/QueueInvokeFunction.ts#L4)

## Type Parameters

### Payload

`Payload` = `unknown`

### Params

`Params` = `unknown`

## Parameters

### queueName

`string`

### payload

`Payload`

### parameter?

`Params`

### options?

`Omit`\<[`QueueEnqueueOptions`](QueueEnqueueOptions.md)\<`Payload`, `Params`\>, `"queueName"` \| `"payload"` \| `"parameter"`\>

## Returns

`Promise`\<[`QueueEnqueueResult`](QueueEnqueueResult.md)\>
