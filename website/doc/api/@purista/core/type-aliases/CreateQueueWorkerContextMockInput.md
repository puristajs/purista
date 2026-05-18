[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / CreateQueueWorkerContextMockInput

# Type Alias: CreateQueueWorkerContextMockInput\<Payload, Parameter, Resources\>

> **CreateQueueWorkerContextMockInput**\<`Payload`, `Parameter`, `Resources`\> = `object`

Defined in: [testing/createQueueWorkerContextMock.ts:17](https://github.com/puristajs/purista/blob/master/packages/core/src/testing/createQueueWorkerContextMock.ts#L17)

## Type Parameters

### Payload

`Payload` = `unknown`

### Parameter

`Parameter` = `unknown`

### Resources

`Resources` *extends* `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\>

## Properties

### message?

> `optional` **message?**: `Partial`\<[`QueueMessage`](QueueMessage.md)\<`Payload`, `Parameter`\>\>

Defined in: [testing/createQueueWorkerContextMock.ts:27](https://github.com/puristajs/purista/blob/master/packages/core/src/testing/createQueueWorkerContextMock.ts#L27)

***

### parameter?

> `optional` **parameter?**: `Parameter`

Defined in: [testing/createQueueWorkerContextMock.ts:24](https://github.com/puristajs/purista/blob/master/packages/core/src/testing/createQueueWorkerContextMock.ts#L24)

***

### payload

> **payload**: `Payload`

Defined in: [testing/createQueueWorkerContextMock.ts:23](https://github.com/puristajs/purista/blob/master/packages/core/src/testing/createQueueWorkerContextMock.ts#L23)

***

### queueName

> **queueName**: `string`

Defined in: [testing/createQueueWorkerContextMock.ts:22](https://github.com/puristajs/purista/blob/master/packages/core/src/testing/createQueueWorkerContextMock.ts#L22)

***

### resources?

> `optional` **resources?**: `Partial`\<`Resources`\>

Defined in: [testing/createQueueWorkerContextMock.ts:26](https://github.com/puristajs/purista/blob/master/packages/core/src/testing/createQueueWorkerContextMock.ts#L26)

***

### sandbox?

> `optional` **sandbox?**: `SinonSandbox`

Defined in: [testing/createQueueWorkerContextMock.ts:25](https://github.com/puristajs/purista/blob/master/packages/core/src/testing/createQueueWorkerContextMock.ts#L25)
