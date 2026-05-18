[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / QueueJobControls

# Type Alias: QueueJobControls

> **QueueJobControls** = `object`

Defined in: [core/types/queue/QueueJobContext.ts:13](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/queue/QueueJobContext.ts#L13)

## Methods

### cancelRequested()

> **cancelRequested**(): `boolean`

Defined in: [core/types/queue/QueueJobContext.ts:19](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/queue/QueueJobContext.ts#L19)

#### Returns

`boolean`

***

### complete()

> **complete**(`output?`, `headers?`): `Promise`\<`void`\>

Defined in: [core/types/queue/QueueJobContext.ts:14](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/queue/QueueJobContext.ts#L14)

#### Parameters

##### output?

`unknown`

##### headers?

`Record`\<`string`, `string`\>

#### Returns

`Promise`\<`void`\>

***

### extendLease()

> **extendLease**(`durationMs`): `Promise`\<`void`\>

Defined in: [core/types/queue/QueueJobContext.ts:18](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/queue/QueueJobContext.ts#L18)

#### Parameters

##### durationMs

`number`

#### Returns

`Promise`\<`void`\>

***

### fail()

> **fail**(`reason`, `fatal?`): `Promise`\<`void`\>

Defined in: [core/types/queue/QueueJobContext.ts:16](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/queue/QueueJobContext.ts#L16)

#### Parameters

##### reason

`string`

##### fatal?

`boolean`

#### Returns

`Promise`\<`void`\>

***

### moveToDeadLetter()

> **moveToDeadLetter**(`reason?`): `Promise`\<`void`\>

Defined in: [core/types/queue/QueueJobContext.ts:17](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/queue/QueueJobContext.ts#L17)

#### Parameters

##### reason?

`string`

#### Returns

`Promise`\<`void`\>

***

### retry()

> **retry**(`request?`): `Promise`\<`void`\>

Defined in: [core/types/queue/QueueJobContext.ts:15](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/queue/QueueJobContext.ts#L15)

#### Parameters

##### request?

[`QueueRetryRequest`](QueueRetryRequest.md)

#### Returns

`Promise`\<`void`\>
