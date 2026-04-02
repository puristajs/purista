[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / PendingStreamRegistry

# Class: PendingStreamRegistry\<Chunk, Final\>

Defined in: core/EventBridge/PendingStreamRegistry.impl.ts:20

## Type Parameters

### Chunk

`Chunk` = `unknown`

### Final

`Final` = `unknown`

## Constructors

### Constructor

> **new PendingStreamRegistry**\<`Chunk`, `Final`\>(`options?`): `PendingStreamRegistry`\<`Chunk`, `Final`\>

Defined in: core/EventBridge/PendingStreamRegistry.impl.ts:24

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

Defined in: core/EventBridge/PendingStreamRegistry.impl.ts:31

##### Returns

`number`

## Methods

### clear()

> **clear**(): `void`

Defined in: core/EventBridge/PendingStreamRegistry.impl.ts:208

#### Returns

`void`

***

### get()

> **get**(`correlationId`): `PendingStreamSession`\<`Chunk`, `Final`\> \| `undefined`

Defined in: core/EventBridge/PendingStreamRegistry.impl.ts:187

#### Parameters

##### correlationId

`string`

#### Returns

`PendingStreamSession`\<`Chunk`, `Final`\> \| `undefined`

***

### register()

> **register**(`correlationId`, `timeoutMs`, `traceId`): `PendingStreamSession`\<`Chunk`, `Final`\>

Defined in: core/EventBridge/PendingStreamRegistry.impl.ts:35

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

Defined in: core/EventBridge/PendingStreamRegistry.impl.ts:191

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

Defined in: core/EventBridge/PendingStreamRegistry.impl.ts:200

#### Parameters

##### error

`unknown`

#### Returns

`void`
