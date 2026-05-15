[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / QueueJobStore

# Type Alias: QueueJobStore

> **QueueJobStore** = `object`

Defined in: [core/types/queue/QueueJobStore.ts:25](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/queue/QueueJobStore.ts#L25)

## Methods

### get()

> **get**(`jobId`): `Promise`\<[`QueueJobStatusRecord`](QueueJobStatusRecord.md) \| `undefined`\>

Defined in: [core/types/queue/QueueJobStore.ts:26](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/queue/QueueJobStore.ts#L26)

#### Parameters

##### jobId

`string`

#### Returns

`Promise`\<[`QueueJobStatusRecord`](QueueJobStatusRecord.md) \| `undefined`\>

***

### set()

> **set**(`record`, `ttlMs?`): `Promise`\<`void`\>

Defined in: [core/types/queue/QueueJobStore.ts:27](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/queue/QueueJobStore.ts#L27)

#### Parameters

##### record

[`QueueJobStatusRecord`](QueueJobStatusRecord.md)

##### ttlMs?

`number`

#### Returns

`Promise`\<`void`\>
