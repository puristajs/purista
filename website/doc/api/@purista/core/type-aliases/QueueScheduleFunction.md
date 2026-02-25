[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / QueueScheduleFunction

# Type Alias: QueueScheduleFunction()

> **QueueScheduleFunction** = \<`Payload`, `Params`\>(`queueName`, `runAt`, `payload`, `parameter?`, `options?`) => `Promise`\<[`QueueEnqueueResult`](QueueEnqueueResult.md)\>

Defined in: [core/types/queue/QueueScheduleFunction.ts:4](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/queue/QueueScheduleFunction.ts#L4)

## Type Parameters

### Payload

`Payload` = `unknown`

### Params

`Params` = `unknown`

## Parameters

### queueName

`string`

### runAt

`Date` | `number`

### payload

`Payload`

### parameter?

`Params`

### options?

`Omit`\<[`QueueEnqueueOptions`](QueueEnqueueOptions.md)\<`Payload`, `Params`\>, `"queueName"` \| `"payload"` \| `"parameter"` \| `"delayMs"`\>

## Returns

`Promise`\<[`QueueEnqueueResult`](QueueEnqueueResult.md)\>
