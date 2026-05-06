[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / CreateQueueWorkerContextMockInput

# Type Alias: CreateQueueWorkerContextMockInput\<Payload, Parameter, Resources\>

> **CreateQueueWorkerContextMockInput**\<`Payload`, `Parameter`, `Resources`\> = `object`

Defined in: [testing/createQueueWorkerContextMock.ts:11](https://github.com/puristajs/purista/blob/master/packages/core/src/testing/createQueueWorkerContextMock.ts#L11)

## Type Parameters

### Payload

`Payload` = `unknown`

### Parameter

`Parameter` = `unknown`

### Resources

`Resources` *extends* `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\>

## Properties

### message?

> `optional` **message**: `Partial`\<[`QueueMessage`](QueueMessage.md)\<`Payload`, `Parameter`\>\>

Defined in: [testing/createQueueWorkerContextMock.ts:21](https://github.com/puristajs/purista/blob/master/packages/core/src/testing/createQueueWorkerContextMock.ts#L21)

***

### parameter?

> `optional` **parameter**: `Parameter`

Defined in: [testing/createQueueWorkerContextMock.ts:18](https://github.com/puristajs/purista/blob/master/packages/core/src/testing/createQueueWorkerContextMock.ts#L18)

***

### payload

> **payload**: `Payload`

Defined in: [testing/createQueueWorkerContextMock.ts:17](https://github.com/puristajs/purista/blob/master/packages/core/src/testing/createQueueWorkerContextMock.ts#L17)

***

### queueName

> **queueName**: `string`

Defined in: [testing/createQueueWorkerContextMock.ts:16](https://github.com/puristajs/purista/blob/master/packages/core/src/testing/createQueueWorkerContextMock.ts#L16)

***

### resources?

> `optional` **resources**: `Partial`\<`Resources`\>

Defined in: [testing/createQueueWorkerContextMock.ts:20](https://github.com/puristajs/purista/blob/master/packages/core/src/testing/createQueueWorkerContextMock.ts#L20)

***

### sandbox?

> `optional` **sandbox**: `SinonSandbox`

Defined in: [testing/createQueueWorkerContextMock.ts:19](https://github.com/puristajs/purista/blob/master/packages/core/src/testing/createQueueWorkerContextMock.ts#L19)
