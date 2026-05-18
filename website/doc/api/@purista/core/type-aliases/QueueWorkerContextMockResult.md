[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / QueueWorkerContextMockResult

# Type Alias: QueueWorkerContextMockResult\<Payload, Parameter, Resources\>

> **QueueWorkerContextMockResult**\<`Payload`, `Parameter`, `Resources`\> = `object`

Defined in: [testing/createQueueWorkerContextMock.ts:30](https://github.com/puristajs/purista/blob/master/packages/core/src/testing/createQueueWorkerContextMock.ts#L30)

## Type Parameters

### Payload

`Payload` = `unknown`

### Parameter

`Parameter` = `unknown`

### Resources

`Resources` *extends* `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\>

## Properties

### context

> **context**: [`QueueJobContext`](QueueJobContext.md)\<`Payload`, `Parameter`, `Resources`\>

Defined in: [testing/createQueueWorkerContextMock.ts:35](https://github.com/puristajs/purista/blob/master/packages/core/src/testing/createQueueWorkerContextMock.ts#L35)

***

### message

> **message**: [`QueueMessage`](QueueMessage.md)\<`Payload`, `Parameter`\>

Defined in: [testing/createQueueWorkerContextMock.ts:36](https://github.com/puristajs/purista/blob/master/packages/core/src/testing/createQueueWorkerContextMock.ts#L36)

***

### stubs

> **stubs**: `object`

Defined in: [testing/createQueueWorkerContextMock.ts:37](https://github.com/puristajs/purista/blob/master/packages/core/src/testing/createQueueWorkerContextMock.ts#L37)

#### emit

> **emit**: `SinonStub`

#### getConfig

> **getConfig**: `SinonStub`

#### getSecret

> **getSecret**: `SinonStub`

#### getState

> **getState**: `SinonStub`

#### job

> **job**: `object`

##### job.cancelRequested

> **cancelRequested**: `SinonStub`

##### job.complete

> **complete**: `SinonStub`

##### job.extendLease

> **extendLease**: `SinonStub`

##### job.fail

> **fail**: `SinonStub`

##### job.retry

> **retry**: `SinonStub`

#### logger

> **logger**: `Record`\<`string`, `SinonStub`\>

#### removeConfig

> **removeConfig**: `SinonStub`

#### removeSecret

> **removeSecret**: `SinonStub`

#### removeState

> **removeState**: `SinonStub`

#### resources

> **resources**: `Partial`\<`Resources`\>

#### service

> **service**: [`QueueJobContext`](QueueJobContext.md)\<`Payload`, `Parameter`, `Resources`\>\[`"service"`\]

#### setConfig

> **setConfig**: `SinonStub`

#### setSecret

> **setSecret**: `SinonStub`

#### setState

> **setState**: `SinonStub`

#### startActiveSpan

> **startActiveSpan**: `SinonStub`

#### stream

> **stream**: [`QueueJobContext`](QueueJobContext.md)\<`Payload`, `Parameter`, `Resources`\>\[`"stream"`\]

#### wrapInSpan

> **wrapInSpan**: `SinonStub`
