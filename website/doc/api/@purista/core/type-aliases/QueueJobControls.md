[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / QueueJobControls

# Type Alias: QueueJobControls

> **QueueJobControls** = `object`

Defined in: [core/types/queue/QueueJobContext.ts:10](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/queue/QueueJobContext.ts#L10)

## Methods

### cancelRequested()

> **cancelRequested**(): `boolean`

Defined in: [core/types/queue/QueueJobContext.ts:16](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/queue/QueueJobContext.ts#L16)

#### Returns

`boolean`

***

### complete()

> **complete**(`output?`, `headers?`): `Promise`\<`void`\>

Defined in: [core/types/queue/QueueJobContext.ts:11](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/queue/QueueJobContext.ts#L11)

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

Defined in: [core/types/queue/QueueJobContext.ts:15](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/queue/QueueJobContext.ts#L15)

#### Parameters

##### durationMs

`number`

#### Returns

`Promise`\<`void`\>

***

### fail()

> **fail**(`reason`, `fatal?`): `Promise`\<`void`\>

Defined in: [core/types/queue/QueueJobContext.ts:13](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/queue/QueueJobContext.ts#L13)

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

Defined in: [core/types/queue/QueueJobContext.ts:14](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/queue/QueueJobContext.ts#L14)

#### Parameters

##### reason?

`string`

#### Returns

`Promise`\<`void`\>

***

### retry()

> **retry**(`request?`): `Promise`\<`void`\>

Defined in: [core/types/queue/QueueJobContext.ts:12](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/queue/QueueJobContext.ts#L12)

#### Parameters

##### request?

[`QueueRetryRequest`](QueueRetryRequest.md)

#### Returns

`Promise`\<`void`\>
