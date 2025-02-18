[**@purista/nats-state-store v1.11.0**](../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/nats-state-store](../README.md) / NatsStateStore

# Class: NatsStateStore

Defined in: [nats-state-store/src/NatsStateStore.impl.ts:31](https://github.com/puristajs/purista/blob/master/packages/nats-state-store/src/NatsStateStore.impl.ts#L31)

A state store for using NATS (with JetStream) as storage.

## Example

```ts
* ```typescript
const config = {
  port: 8222
}

const store = new NatsStateStore({ config })

await store.setState('stateKey',{ myState: 'value' })

let value = await store.getState('stateKey')
console.log(value) // outputs: { stateKey: { myState: 'value' } }

await store.removeState('stateKey')

value = await store.getState('stateKey')
console.log(value) // outputs: undefined

```
```

## Extends

- [`StateStoreBaseClass`](../../core/classes/StateStoreBaseClass.md)\<[`NatsStateStoreConfig`](../type-aliases/NatsStateStoreConfig.md)\>

## Constructors

### new NatsStateStore()

> **new NatsStateStore**(`config`?): [`NatsStateStore`](NatsStateStore.md)

Defined in: [nats-state-store/src/NatsStateStore.impl.ts:37](https://github.com/puristajs/purista/blob/master/packages/nats-state-store/src/NatsStateStore.impl.ts#L37)

#### Parameters

##### config?

###### cacheTtl?

`number`

Cache time to live in ms

###### enableCache?

`boolean`

Enable cache

###### enableGet?

`boolean`

Enable generally get method

###### enableRemove?

`boolean`

Enable generally remove method

###### enableSet?

`boolean`

Enable generally set method

###### keyValueStoreName?

`string`

###### logger?

[`Logger`](../../core/classes/Logger.md)

A logger instance

###### logLevel?

[`LogLevelName`](../../core/type-aliases/LogLevelName.md)

A log level for new logger if logger is not set

#### Returns

[`NatsStateStore`](NatsStateStore.md)

#### Overrides

[`StateStoreBaseClass`](../../core/classes/StateStoreBaseClass.md).[`constructor`](../../core/classes/StateStoreBaseClass.md#constructors)

## Properties

### config

> **config**: `object`

Defined in: core/dist/commonjs/core/StateStore/StateStoreBaseClass.impl.d.ts:16

#### cacheTtl?

> `optional` **cacheTtl**: `number`

Cache time to live in ms

#### enableCache?

> `optional` **enableCache**: `boolean`

Enable cache

#### enableGet?

> `optional` **enableGet**: `boolean`

Enable generally get method

#### enableRemove?

> `optional` **enableRemove**: `boolean`

Enable generally remove method

#### enableSet?

> `optional` **enableSet**: `boolean`

Enable generally set method

#### keyValueStoreName

> **keyValueStoreName**: `string`

#### logger?

> `optional` **logger**: [`Logger`](../../core/classes/Logger.md)

A logger instance

#### logLevel?

> `optional` **logLevel**: [`LogLevelName`](../../core/type-aliases/LogLevelName.md)

A log level for new logger if logger is not set

#### Inherited from

[`StateStoreBaseClass`](../../core/classes/StateStoreBaseClass.md).[`config`](../../core/classes/StateStoreBaseClass.md#config-1)

***

### connection

> **connection**: `undefined` \| `NatsConnection`

Defined in: [nats-state-store/src/NatsStateStore.impl.ts:32](https://github.com/puristajs/purista/blob/master/packages/nats-state-store/src/NatsStateStore.impl.ts#L32)

***

### kv

> **kv**: `undefined` \| `KV`

Defined in: [nats-state-store/src/NatsStateStore.impl.ts:35](https://github.com/puristajs/purista/blob/master/packages/nats-state-store/src/NatsStateStore.impl.ts#L35)

***

### logger

> **logger**: [`Logger`](../../core/classes/Logger.md)

Defined in: core/dist/commonjs/core/StateStore/StateStoreBaseClass.impl.d.ts:15

#### Inherited from

[`StateStoreBaseClass`](../../core/classes/StateStoreBaseClass.md).[`logger`](../../core/classes/StateStoreBaseClass.md#logger)

***

### name

> **name**: `string`

Defined in: core/dist/commonjs/core/StateStore/StateStoreBaseClass.impl.d.ts:17

#### Inherited from

[`StateStoreBaseClass`](../../core/classes/StateStoreBaseClass.md).[`name`](../../core/classes/StateStoreBaseClass.md#name-1)

***

### sc

> **sc**: `Codec`\<`unknown`\>

Defined in: [nats-state-store/src/NatsStateStore.impl.ts:34](https://github.com/puristajs/purista/blob/master/packages/nats-state-store/src/NatsStateStore.impl.ts#L34)

## Methods

### destroy()

> **destroy**(): `Promise`\<`void`\>

Defined in: [nats-state-store/src/NatsStateStore.impl.ts:116](https://github.com/puristajs/purista/blob/master/packages/nats-state-store/src/NatsStateStore.impl.ts#L116)

#### Returns

`Promise`\<`void`\>

#### Overrides

[`StateStoreBaseClass`](../../core/classes/StateStoreBaseClass.md).[`destroy`](../../core/classes/StateStoreBaseClass.md#destroy)

***

### getState()

> **getState**\<`StateNames`\>(...`stateNames`): `Promise`\<[`ObjectWithKeysFromStringArray`](../../core/type-aliases/ObjectWithKeysFromStringArray.md)\<`StateNames`\>\>

Defined in: core/dist/commonjs/core/StateStore/StateStoreBaseClass.impl.d.ts:20

#### Type Parameters

• **StateNames** *extends* `string`[]

#### Parameters

##### stateNames

...`StateNames`

#### Returns

`Promise`\<[`ObjectWithKeysFromStringArray`](../../core/type-aliases/ObjectWithKeysFromStringArray.md)\<`StateNames`\>\>

#### Inherited from

[`StateStoreBaseClass`](../../core/classes/StateStoreBaseClass.md).[`getState`](../../core/classes/StateStoreBaseClass.md#getstate)

***

### getStateImpl()

> `protected` **getStateImpl**\<`StateNames`\>(...`stateNames`): `Promise`\<[`ObjectWithKeysFromStringArray`](../../core/type-aliases/ObjectWithKeysFromStringArray.md)\<`StateNames`\>\>

Defined in: [nats-state-store/src/NatsStateStore.impl.ts:73](https://github.com/puristajs/purista/blob/master/packages/nats-state-store/src/NatsStateStore.impl.ts#L73)

#### Type Parameters

• **StateNames** *extends* `string`[]

#### Parameters

##### stateNames

...`StateNames`

#### Returns

`Promise`\<[`ObjectWithKeysFromStringArray`](../../core/type-aliases/ObjectWithKeysFromStringArray.md)\<`StateNames`\>\>

#### Overrides

[`StateStoreBaseClass`](../../core/classes/StateStoreBaseClass.md).[`getStateImpl`](../../core/classes/StateStoreBaseClass.md#getstateimpl)

***

### getStore()

> **getStore**(): `Promise`\<`KV`\>

Defined in: [nats-state-store/src/NatsStateStore.impl.ts:45](https://github.com/puristajs/purista/blob/master/packages/nats-state-store/src/NatsStateStore.impl.ts#L45)

#### Returns

`Promise`\<`KV`\>

***

### removeState()

> **removeState**(`stateName`): `Promise`\<`void`\>

Defined in: core/dist/commonjs/core/StateStore/StateStoreBaseClass.impl.d.ts:22

#### Parameters

##### stateName

`string`

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`StateStoreBaseClass`](../../core/classes/StateStoreBaseClass.md).[`removeState`](../../core/classes/StateStoreBaseClass.md#removestate)

***

### removeStateImpl()

> `protected` **removeStateImpl**(`stateName`): `Promise`\<`void`\>

Defined in: [nats-state-store/src/NatsStateStore.impl.ts:92](https://github.com/puristajs/purista/blob/master/packages/nats-state-store/src/NatsStateStore.impl.ts#L92)

#### Parameters

##### stateName

`string`

#### Returns

`Promise`\<`void`\>

#### Overrides

[`StateStoreBaseClass`](../../core/classes/StateStoreBaseClass.md).[`removeStateImpl`](../../core/classes/StateStoreBaseClass.md#removestateimpl)

***

### setState()

> **setState**(`stateName`, `stateValue`): `Promise`\<`void`\>

Defined in: core/dist/commonjs/core/StateStore/StateStoreBaseClass.impl.d.ts:24

#### Parameters

##### stateName

`string`

##### stateValue

`unknown`

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`StateStoreBaseClass`](../../core/classes/StateStoreBaseClass.md).[`setState`](../../core/classes/StateStoreBaseClass.md#setstate)

***

### setStateImpl()

> `protected` **setStateImpl**(`stateName`, `stateValue`): `Promise`\<`void`\>

Defined in: [nats-state-store/src/NatsStateStore.impl.ts:104](https://github.com/puristajs/purista/blob/master/packages/nats-state-store/src/NatsStateStore.impl.ts#L104)

#### Parameters

##### stateName

`string`

##### stateValue

`unknown`

#### Returns

`Promise`\<`void`\>

#### Overrides

[`StateStoreBaseClass`](../../core/classes/StateStoreBaseClass.md).[`setStateImpl`](../../core/classes/StateStoreBaseClass.md#setstateimpl)
