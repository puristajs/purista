[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / createStateStoreQueueJobStore

# Function: createStateStoreQueueJobStore()

> **createStateStoreQueueJobStore**(`stateStore`, `prefix?`): [`QueueJobStore`](../type-aliases/QueueJobStore.md)

Defined in: [core/types/queue/QueueJobStore.ts:38](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/queue/QueueJobStore.ts#L38)

Create a small queue job store backed by PURISTA's StateStore.

## Parameters

### stateStore

[`StateStore`](../interfaces/StateStore.md)

### prefix?

`string` = `'purista:queue-job'`

## Returns

[`QueueJobStore`](../type-aliases/QueueJobStore.md)

## Example

```ts
const jobStore = createStateStoreQueueJobStore(stateStore)
```
