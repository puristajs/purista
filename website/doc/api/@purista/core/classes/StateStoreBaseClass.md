[**@purista/core v2.0.5**](../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / StateStoreBaseClass

# Class: `abstract` StateStoreBaseClass\<StateStoreConfigType\>

Defined in: [packages/core/src/core/StateStore/StateStoreBaseClass.impl.ts:18](https://github.com/puristajs/purista/blob/master/packages/core/src/core/StateStore/StateStoreBaseClass.impl.ts#L18)

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

• **StateStoreConfigType** *extends* `Record`\<`string`, `unknown`\> = [`EmptyObject`](../type-aliases/EmptyObject.md)

## Constructors

### new StateStoreBaseClass()

> **new StateStoreBaseClass**\<`StateStoreConfigType`\>(`name`, `config`): [`StateStoreBaseClass`](StateStoreBaseClass.md)\<`StateStoreConfigType`\>

Defined in: [packages/core/src/core/StateStore/StateStoreBaseClass.impl.ts:24](https://github.com/puristajs/purista/blob/master/packages/core/src/core/StateStore/StateStoreBaseClass.impl.ts#L24)

#### Parameters

##### name

`string`

##### config

\{ \[K in string \| number \| symbol\]: (\{ cacheTtl?: number; enableCache?: boolean; enableGet?: boolean; enableRemove?: boolean; enableSet?: boolean; logger?: Logger; logLevel?: LogLevelName \} & StateStoreConfigType)\[K\] \}

#### Returns

[`StateStoreBaseClass`](StateStoreBaseClass.md)\<`StateStoreConfigType`\>

## Properties

### config

> **config**: \{ \[K in string \| number \| symbol\]: (\{ cacheTtl?: number; enableCache?: boolean; enableGet?: boolean; enableRemove?: boolean; enableSet?: boolean; logger?: Logger; logLevel?: LogLevelName \} & StateStoreConfigType)\[K\] \}

Defined in: [packages/core/src/core/StateStore/StateStoreBaseClass.impl.ts:20](https://github.com/puristajs/purista/blob/master/packages/core/src/core/StateStore/StateStoreBaseClass.impl.ts#L20)

***

### logger

> **logger**: [`Logger`](Logger.md)

Defined in: [packages/core/src/core/StateStore/StateStoreBaseClass.impl.ts:19](https://github.com/puristajs/purista/blob/master/packages/core/src/core/StateStore/StateStoreBaseClass.impl.ts#L19)

***

### name

> **name**: `string`

Defined in: [packages/core/src/core/StateStore/StateStoreBaseClass.impl.ts:22](https://github.com/puristajs/purista/blob/master/packages/core/src/core/StateStore/StateStoreBaseClass.impl.ts#L22)

## Methods

### destroy()

> **destroy**(): `Promise`\<`void`\>

Defined in: [packages/core/src/core/StateStore/StateStoreBaseClass.impl.ts:82](https://github.com/puristajs/purista/blob/master/packages/core/src/core/StateStore/StateStoreBaseClass.impl.ts#L82)

#### Returns

`Promise`\<`void`\>

***

### getState()

> **getState**\<`StateNames`\>(...`stateNames`): `Promise`\<[`ObjectWithKeysFromStringArray`](../type-aliases/ObjectWithKeysFromStringArray.md)\<`StateNames`\>\>

Defined in: [packages/core/src/core/StateStore/StateStoreBaseClass.impl.ts:43](https://github.com/puristajs/purista/blob/master/packages/core/src/core/StateStore/StateStoreBaseClass.impl.ts#L43)

#### Type Parameters

• **StateNames** *extends* `string`[]

#### Parameters

##### stateNames

...`StateNames`

#### Returns

`Promise`\<[`ObjectWithKeysFromStringArray`](../type-aliases/ObjectWithKeysFromStringArray.md)\<`StateNames`\>\>

***

### getStateImpl()

> `abstract` `protected` **getStateImpl**\<`StateNames`\>(...`stateNames`): `Promise`\<[`ObjectWithKeysFromStringArray`](../type-aliases/ObjectWithKeysFromStringArray.md)\<`StateNames`\>\>

Defined in: [packages/core/src/core/StateStore/StateStoreBaseClass.impl.ts:38](https://github.com/puristajs/purista/blob/master/packages/core/src/core/StateStore/StateStoreBaseClass.impl.ts#L38)

#### Type Parameters

• **StateNames** *extends* `string`[]

#### Parameters

##### stateNames

...`StateNames`

#### Returns

`Promise`\<[`ObjectWithKeysFromStringArray`](../type-aliases/ObjectWithKeysFromStringArray.md)\<`StateNames`\>\>

***

### removeState()

> **removeState**(`stateName`): `Promise`\<`void`\>

Defined in: [packages/core/src/core/StateStore/StateStoreBaseClass.impl.ts:58](https://github.com/puristajs/purista/blob/master/packages/core/src/core/StateStore/StateStoreBaseClass.impl.ts#L58)

#### Parameters

##### stateName

`string`

#### Returns

`Promise`\<`void`\>

***

### removeStateImpl()

> `abstract` `protected` **removeStateImpl**(`stateName`): `Promise`\<`void`\>

Defined in: [packages/core/src/core/StateStore/StateStoreBaseClass.impl.ts:56](https://github.com/puristajs/purista/blob/master/packages/core/src/core/StateStore/StateStoreBaseClass.impl.ts#L56)

#### Parameters

##### stateName

`string`

#### Returns

`Promise`\<`void`\>

***

### setState()

> **setState**(`stateName`, `stateValue`): `Promise`\<`void`\>

Defined in: [packages/core/src/core/StateStore/StateStoreBaseClass.impl.ts:72](https://github.com/puristajs/purista/blob/master/packages/core/src/core/StateStore/StateStoreBaseClass.impl.ts#L72)

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

Defined in: [packages/core/src/core/StateStore/StateStoreBaseClass.impl.ts:69](https://github.com/puristajs/purista/blob/master/packages/core/src/core/StateStore/StateStoreBaseClass.impl.ts#L69)

#### Parameters

##### stateName

`string`

##### stateValue

`unknown`

#### Returns

`Promise`\<`void`\>
