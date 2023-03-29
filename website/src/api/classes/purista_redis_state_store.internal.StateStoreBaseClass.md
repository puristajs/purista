[PURISTA API - v1.4.9](../README.md) / [Modules](../modules.md) / [@purista/redis-state-store](../modules/purista_redis_state_store.md) / [internal](../modules/purista_redis_state_store.internal.md) / StateStoreBaseClass

# Class: StateStoreBaseClass<ConfigType\>

[@purista/redis-state-store](../modules/purista_redis_state_store.md).[internal](../modules/purista_redis_state_store.internal.md).StateStoreBaseClass

Base class for config store implementations

## Type parameters

| Name |
| :------ |
| `ConfigType` |

## Hierarchy

- **`StateStoreBaseClass`**

  ↳ [`RedisStateStore`](purista_redis_state_store.RedisStateStore.md)

## Implements

- [`StateStore`](../interfaces/purista_redis_state_store.internal.StateStore.md)

## Table of contents

### Constructors

- [constructor](purista_redis_state_store.internal.StateStoreBaseClass.md#constructor)

### Properties

- [config](purista_redis_state_store.internal.StateStoreBaseClass.md#config)
- [logger](purista_redis_state_store.internal.StateStoreBaseClass.md#logger)
- [name](purista_redis_state_store.internal.StateStoreBaseClass.md#name)

### Methods

- [destroy](purista_redis_state_store.internal.StateStoreBaseClass.md#destroy)
- [getState](purista_redis_state_store.internal.StateStoreBaseClass.md#getstate)
- [removeState](purista_redis_state_store.internal.StateStoreBaseClass.md#removestate)
- [setState](purista_redis_state_store.internal.StateStoreBaseClass.md#setstate)

## Constructors

### constructor

• **new StateStoreBaseClass**<`ConfigType`\>(`name`, `config?`)

#### Type parameters

| Name |
| :------ |
| `ConfigType` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `config?` | [`StoreBaseConfig`](../modules/purista_redis_state_store.internal.md#storebaseconfig)<`ConfigType`\> |

#### Defined in

packages/core/lib/core/StateStore/StateStoreBaseClass.impl.d.ts:12

## Properties

### config

• **config**: [`StoreBaseConfig`](../modules/purista_redis_state_store.internal.md#storebaseconfig)<`ConfigType`\>

#### Defined in

packages/core/lib/core/StateStore/StateStoreBaseClass.impl.d.ts:10

___

### logger

• **logger**: [`Logger`](purista_redis_state_store.internal.Logger.md)

#### Defined in

packages/core/lib/core/StateStore/StateStoreBaseClass.impl.d.ts:9

___

### name

• **name**: `string`

name of store

#### Implementation of

[StateStore](../interfaces/purista_redis_state_store.internal.StateStore.md).[name](../interfaces/purista_redis_state_store.internal.StateStore.md#name)

#### Defined in

packages/core/lib/core/StateStore/StateStoreBaseClass.impl.d.ts:11

## Methods

### destroy

▸ **destroy**(): `Promise`<`void`\>

disconnects and shuts down the state store

#### Returns

`Promise`<`void`\>

#### Implementation of

[StateStore](../interfaces/purista_redis_state_store.internal.StateStore.md).[destroy](../interfaces/purista_redis_state_store.internal.StateStore.md#destroy)

#### Defined in

packages/core/lib/core/StateStore/StateStoreBaseClass.impl.d.ts:16

___

### getState

▸ **getState**(`...stateNames`): `Promise`<`Record`<`string`, `unknown`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `...stateNames` | `string`[] |

#### Returns

`Promise`<`Record`<`string`, `unknown`\>\>

#### Implementation of

StateStore.getState

#### Defined in

packages/core/lib/core/StateStore/StateStoreBaseClass.impl.d.ts:13

___

### removeState

▸ **removeState**(`stateName`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `stateName` | `string` |

#### Returns

`Promise`<`void`\>

#### Implementation of

StateStore.removeState

#### Defined in

packages/core/lib/core/StateStore/StateStoreBaseClass.impl.d.ts:14

___

### setState

▸ **setState**(`stateName`, `stateValue`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `stateName` | `string` |
| `stateValue` | `unknown` |

#### Returns

`Promise`<`void`\>

#### Implementation of

StateStore.setState

#### Defined in

packages/core/lib/core/StateStore/StateStoreBaseClass.impl.d.ts:15
