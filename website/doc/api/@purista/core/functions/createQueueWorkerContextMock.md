[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / createQueueWorkerContextMock

# Function: createQueueWorkerContextMock()

> **createQueueWorkerContextMock**\<`Payload`, `Parameter`, `Resources`\>(`_builder`, `input`): [`QueueWorkerContextMockResult`](../type-aliases/QueueWorkerContextMockResult.md)\<`Payload`, `Parameter`, `Resources`\>

Defined in: [testing/createQueueWorkerContextMock.ts:83](https://github.com/puristajs/purista/blob/master/packages/core/src/testing/createQueueWorkerContextMock.ts#L83)

Create a queue worker context mock with controllable job controls.

Use this helper when you want to test a queue worker handler directly without
running the worker loop.

## Type Parameters

### Payload

`Payload` = `unknown`

### Parameter

`Parameter` = `unknown`

### Resources

`Resources` *extends* `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\>

## Parameters

### \_builder

[`QueueWorkerBuilder`](../classes/QueueWorkerBuilder.md)

### input

[`CreateQueueWorkerContextMockInput`](../type-aliases/CreateQueueWorkerContextMockInput.md)\<`Payload`, `Parameter`, `Resources`\>

## Returns

[`QueueWorkerContextMockResult`](../type-aliases/QueueWorkerContextMockResult.md)\<`Payload`, `Parameter`, `Resources`\>
