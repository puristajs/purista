[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / PendingInvocationRegistry

# Class: PendingInvocationRegistry\<T\>

Defined in: [core/EventBridge/PendingInvocationRegistry.impl.ts:10](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/PendingInvocationRegistry.impl.ts#L10)

## Type Parameters

### T

`T` = `unknown`

## Constructors

### Constructor

> **new PendingInvocationRegistry**\<`T`\>(`options?`): `PendingInvocationRegistry`\<`T`\>

Defined in: [core/EventBridge/PendingInvocationRegistry.impl.ts:14](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/PendingInvocationRegistry.impl.ts#L14)

#### Parameters

##### options?

###### onLateResponse?

(`correlationId`) => `void`

###### retentionMs?

`number`

#### Returns

`PendingInvocationRegistry`\<`T`\>

## Accessors

### size

#### Get Signature

> **get** **size**(): `number`

Defined in: [core/EventBridge/PendingInvocationRegistry.impl.ts:21](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/PendingInvocationRegistry.impl.ts#L21)

##### Returns

`number`

## Methods

### clear()

> **clear**(): `void`

Defined in: [core/EventBridge/PendingInvocationRegistry.impl.ts:82](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/PendingInvocationRegistry.impl.ts#L82)

#### Returns

`void`

***

### getPendingMap()

> **getPendingMap**(): `Map`\<`string`, `PendingInvocation`\<`T`\>\>

Defined in: [core/EventBridge/PendingInvocationRegistry.impl.ts:25](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/PendingInvocationRegistry.impl.ts#L25)

#### Returns

`Map`\<`string`, `PendingInvocation`\<`T`\>\>

***

### register()

> **register**(`correlationId`, `timeoutMs`, `traceId`): `Promise`\<`T`\>

Defined in: [core/EventBridge/PendingInvocationRegistry.impl.ts:29](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/PendingInvocationRegistry.impl.ts#L29)

#### Parameters

##### correlationId

`string`

##### timeoutMs

`number`

##### traceId

`string` \| `undefined`

#### Returns

`Promise`\<`T`\>

***

### reject()

> **reject**(`correlationId`, `error`): `"rejected"` \| `"late"` \| `"missing"`

Defined in: [core/EventBridge/PendingInvocationRegistry.impl.ts:64](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/PendingInvocationRegistry.impl.ts#L64)

#### Parameters

##### correlationId

`string`

##### error

`unknown`

#### Returns

`"rejected"` \| `"late"` \| `"missing"`

***

### rejectAll()

> **rejectAll**(`error`): `void`

Defined in: [core/EventBridge/PendingInvocationRegistry.impl.ts:73](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/PendingInvocationRegistry.impl.ts#L73)

#### Parameters

##### error

`unknown`

#### Returns

`void`

***

### resolve()

> **resolve**(`correlationId`, `payload`): `"late"` \| `"missing"` \| `"resolved"`

Defined in: [core/EventBridge/PendingInvocationRegistry.impl.ts:55](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/PendingInvocationRegistry.impl.ts#L55)

#### Parameters

##### correlationId

`string`

##### payload

`T`

#### Returns

`"late"` \| `"missing"` \| `"resolved"`
