[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / PendingStreamRegistry

# Class: PendingStreamRegistry\<Chunk, Final\>

Defined in: [core/EventBridge/PendingStreamRegistry.impl.ts:20](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/PendingStreamRegistry.impl.ts#L20)

## Type Parameters

### Chunk

`Chunk` = `unknown`

### Final

`Final` = `unknown`

## Constructors

### Constructor

> **new PendingStreamRegistry**\<`Chunk`, `Final`\>(`options?`): `PendingStreamRegistry`\<`Chunk`, `Final`\>

Defined in: [core/EventBridge/PendingStreamRegistry.impl.ts:24](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/PendingStreamRegistry.impl.ts#L24)

#### Parameters

##### options?

###### onLateFrame?

(`correlationId`) => `void`

###### retentionMs?

`number`

#### Returns

`PendingStreamRegistry`\<`Chunk`, `Final`\>

## Accessors

### size

#### Get Signature

> **get** **size**(): `number`

Defined in: [core/EventBridge/PendingStreamRegistry.impl.ts:31](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/PendingStreamRegistry.impl.ts#L31)

##### Returns

`number`

## Methods

### clear()

> **clear**(): `void`

Defined in: [core/EventBridge/PendingStreamRegistry.impl.ts:208](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/PendingStreamRegistry.impl.ts#L208)

#### Returns

`void`

***

### get()

> **get**(`correlationId`): `PendingStreamSession`\<`Chunk`, `Final`\> \| `undefined`

Defined in: [core/EventBridge/PendingStreamRegistry.impl.ts:187](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/PendingStreamRegistry.impl.ts#L187)

#### Parameters

##### correlationId

`string`

#### Returns

`PendingStreamSession`\<`Chunk`, `Final`\> \| `undefined`

***

### register()

> **register**(`correlationId`, `timeoutMs`, `traceId`): `PendingStreamSession`\<`Chunk`, `Final`\>

Defined in: [core/EventBridge/PendingStreamRegistry.impl.ts:35](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/PendingStreamRegistry.impl.ts#L35)

#### Parameters

##### correlationId

`string`

##### timeoutMs

`number`

##### traceId

`string` | `undefined`

#### Returns

`PendingStreamSession`\<`Chunk`, `Final`\>

***

### reject()

> **reject**(`correlationId`, `error`): `"rejected"` \| `PushResult`

Defined in: [core/EventBridge/PendingStreamRegistry.impl.ts:191](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/PendingStreamRegistry.impl.ts#L191)

#### Parameters

##### correlationId

`string`

##### error

`unknown`

#### Returns

`"rejected"` \| `PushResult`

***

### rejectAll()

> **rejectAll**(`error`): `void`

Defined in: [core/EventBridge/PendingStreamRegistry.impl.ts:200](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/PendingStreamRegistry.impl.ts#L200)

#### Parameters

##### error

`unknown`

#### Returns

`void`
