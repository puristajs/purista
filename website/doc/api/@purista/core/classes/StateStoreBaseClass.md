[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / StateStoreBaseClass

# Abstract Class: StateStoreBaseClass\<StateStoreConfigType\>

Defined in: [core/StateStore/StateStoreBaseClass.impl.ts:20](https://github.com/puristajs/purista/blob/master/packages/core/src/core/StateStore/StateStoreBaseClass.impl.ts#L20)

Base class for config store implementations
The actual store implementation must overwrite the protected methods:

- `getStateImpl`
- `setStateImpl`
- `removeStateImpl`

__DO NOT OVERWRITE__: the regular methods getState, setState or removeState

## Extended by

- [`DefaultStateStore`](DefaultStateStore.md)
- [`DaprStateStore`](../../dapr-sdk/classes/DaprStateStore.md)
- [`NatsStateStore`](../../nats-state-store/classes/NatsStateStore.md)
- [`RedisStateStore`](../../redis-state-store/classes/RedisStateStore.md)

## Type Parameters

### StateStoreConfigType

`StateStoreConfigType` *extends* `Record`\<`string`, `unknown`\> = [`EmptyObject`](../type-aliases/EmptyObject.md)

## Constructors

### Constructor

> **new StateStoreBaseClass**\<`StateStoreConfigType`\>(`name`, `config`): `StateStoreBaseClass`\<`StateStoreConfigType`\>

Defined in: [core/StateStore/StateStoreBaseClass.impl.ts:26](https://github.com/puristajs/purista/blob/master/packages/core/src/core/StateStore/StateStoreBaseClass.impl.ts#L26)

#### Parameters

##### name

`string`

##### config

\{ \[K in string \| number \| symbol\]: (\{ cacheTtl?: number; enableCache?: boolean; enableGet?: boolean; enableRemove?: boolean; enableSet?: boolean; logger?: Logger; logLevel?: LogLevelName \} & StateStoreConfigType)\[K\] \}

#### Returns

`StateStoreBaseClass`\<`StateStoreConfigType`\>

## Properties

### config

> **config**: \{ \[K in string \| number \| symbol\]: (\{ cacheTtl?: number; enableCache?: boolean; enableGet?: boolean; enableRemove?: boolean; enableSet?: boolean; logger?: Logger; logLevel?: LogLevelName \} & StateStoreConfigType)\[K\] \}

Defined in: [core/StateStore/StateStoreBaseClass.impl.ts:22](https://github.com/puristajs/purista/blob/master/packages/core/src/core/StateStore/StateStoreBaseClass.impl.ts#L22)

***

### logger

> **logger**: [`Logger`](Logger.md)

Defined in: [core/StateStore/StateStoreBaseClass.impl.ts:21](https://github.com/puristajs/purista/blob/master/packages/core/src/core/StateStore/StateStoreBaseClass.impl.ts#L21)

***

### name

> **name**: `string`

Defined in: [core/StateStore/StateStoreBaseClass.impl.ts:24](https://github.com/puristajs/purista/blob/master/packages/core/src/core/StateStore/StateStoreBaseClass.impl.ts#L24)

## Methods

### destroy()

> **destroy**(): `Promise`\<`void`\>

Defined in: [core/StateStore/StateStoreBaseClass.impl.ts:84](https://github.com/puristajs/purista/blob/master/packages/core/src/core/StateStore/StateStoreBaseClass.impl.ts#L84)

#### Returns

`Promise`\<`void`\>

***

### getState()

> **getState**\<`StateNames`\>(...`stateNames`): `Promise`\<[`ObjectWithKeysFromStringArray`](../type-aliases/ObjectWithKeysFromStringArray.md)\<`StateNames`\>\>

Defined in: [core/StateStore/StateStoreBaseClass.impl.ts:45](https://github.com/puristajs/purista/blob/master/packages/core/src/core/StateStore/StateStoreBaseClass.impl.ts#L45)

#### Type Parameters

##### StateNames

`StateNames` *extends* `string`[]

#### Parameters

##### stateNames

...`StateNames`

#### Returns

`Promise`\<[`ObjectWithKeysFromStringArray`](../type-aliases/ObjectWithKeysFromStringArray.md)\<`StateNames`\>\>

***

### getStateImpl()

> `abstract` `protected` **getStateImpl**\<`StateNames`\>(...`stateNames`): `Promise`\<[`ObjectWithKeysFromStringArray`](../type-aliases/ObjectWithKeysFromStringArray.md)\<`StateNames`\>\>

Defined in: [core/StateStore/StateStoreBaseClass.impl.ts:40](https://github.com/puristajs/purista/blob/master/packages/core/src/core/StateStore/StateStoreBaseClass.impl.ts#L40)

#### Type Parameters

##### StateNames

`StateNames` *extends* `string`[]

#### Parameters

##### stateNames

...`StateNames`

#### Returns

`Promise`\<[`ObjectWithKeysFromStringArray`](../type-aliases/ObjectWithKeysFromStringArray.md)\<`StateNames`\>\>

***

### removeState()

> **removeState**(`stateName`): `Promise`\<`void`\>

Defined in: [core/StateStore/StateStoreBaseClass.impl.ts:60](https://github.com/puristajs/purista/blob/master/packages/core/src/core/StateStore/StateStoreBaseClass.impl.ts#L60)

#### Parameters

##### stateName

`string`

#### Returns

`Promise`\<`void`\>

***

### removeStateImpl()

> `abstract` `protected` **removeStateImpl**(`stateName`): `Promise`\<`void`\>

Defined in: [core/StateStore/StateStoreBaseClass.impl.ts:58](https://github.com/puristajs/purista/blob/master/packages/core/src/core/StateStore/StateStoreBaseClass.impl.ts#L58)

#### Parameters

##### stateName

`string`

#### Returns

`Promise`\<`void`\>

***

### setState()

> **setState**(`stateName`, `stateValue`): `Promise`\<`void`\>

Defined in: [core/StateStore/StateStoreBaseClass.impl.ts:74](https://github.com/puristajs/purista/blob/master/packages/core/src/core/StateStore/StateStoreBaseClass.impl.ts#L74)

#### Parameters

##### stateName

`string`

##### stateValue

`unknown`

#### Returns

`Promise`\<`void`\>

***

### setStateImpl()

> `abstract` `protected` **setStateImpl**(`stateName`, `stateValue`): `Promise`\<`void`\>

Defined in: [core/StateStore/StateStoreBaseClass.impl.ts:71](https://github.com/puristajs/purista/blob/master/packages/core/src/core/StateStore/StateStoreBaseClass.impl.ts#L71)

#### Parameters

##### stateName

`string`

##### stateValue

`unknown`

#### Returns

`Promise`\<`void`\>
