[PURISTA API - v1.4.9](../README.md) / [Modules](../modules.md) / [@purista/redis-state-store](purista_redis_state_store.md) / internal

# Namespace: internal

[@purista/redis-state-store](purista_redis_state_store.md).internal

## Table of contents

### Classes

- [Logger](../classes/purista_redis_state_store.internal.Logger.md)

### Store

- [StateStoreBaseClass](../classes/purista_redis_state_store.internal.StateStoreBaseClass.md)
- [StateStore](../interfaces/purista_redis_state_store.internal.StateStore.md)
- [StateDeleteFunction](purista_redis_state_store.internal.md#statedeletefunction)
- [StateGetterFunction](purista_redis_state_store.internal.md#stategetterfunction)
- [StateSetterFunction](purista_redis_state_store.internal.md#statesetterfunction)

### Type Aliases

- [InstanceId](purista_redis_state_store.internal.md#instanceid)
- [LogFnParamType](purista_redis_state_store.internal.md#logfnparamtype)
- [LoggerOptions](purista_redis_state_store.internal.md#loggeroptions)
- [PrincipalId](purista_redis_state_store.internal.md#principalid)
- [StoreBaseConfig](purista_redis_state_store.internal.md#storebaseconfig)
- [TraceId](purista_redis_state_store.internal.md#traceid)

## Store

• **StateStoreBaseClass**<`ConfigType`\>: `Object`

Base class for config store implementations

#### Type parameters

| Name |
| :------ |
| `ConfigType` |

#### Defined in

packages/core/lib/core/StateStore/StateStoreBaseClass.impl.d.ts:8

• **StateStore**: `Object`

Interface definition for state store implementations

#### Defined in

packages/core/lib/core/StateStore/types/StateStore.d.ts:9

### StateDeleteFunction

Ƭ **StateDeleteFunction**: (`stateName`: `string`) => `Promise`<`void`\>

#### Type declaration

▸ (`stateName`): `Promise`<`void`\>

delete a state value from the state store

##### Parameters

| Name | Type |
| :------ | :------ |
| `stateName` | `string` |

##### Returns

`Promise`<`void`\>

#### Defined in

packages/core/lib/core/StateStore/types/StateDeleteFunction.d.ts:2

___

### StateGetterFunction

Ƭ **StateGetterFunction**: (...`stateNames`: `string`[]) => `Promise`<`Record`<`string`, `unknown` \| `undefined`\>\>

#### Type declaration

▸ (`...stateNames`): `Promise`<`Record`<`string`, `unknown` \| `undefined`\>\>

get a state value from the state store

##### Parameters

| Name | Type |
| :------ | :------ |
| `...stateNames` | `string`[] |

##### Returns

`Promise`<`Record`<`string`, `unknown` \| `undefined`\>\>

#### Defined in

packages/core/lib/core/StateStore/types/StateGetterFunction.d.ts:2

___

### StateSetterFunction

Ƭ **StateSetterFunction**: (`secretName`: `string`, `secretValue`: `unknown`) => `Promise`<`void`\>

#### Type declaration

▸ (`secretName`, `secretValue`): `Promise`<`void`\>

set a state value in the state store

##### Parameters

| Name | Type |
| :------ | :------ |
| `secretName` | `string` |
| `secretValue` | `unknown` |

##### Returns

`Promise`<`void`\>

#### Defined in

packages/core/lib/core/StateStore/types/StateSetterFunction.d.ts:2

## Type Aliases

### InstanceId

Ƭ **InstanceId**: `string`

the instance id of the event bridge

#### Defined in

packages/core/lib/core/types/InstanceId.d.ts:2

___

### LogFnParamType

Ƭ **LogFnParamType**: [`unknown`, string?, ...any] \| [`string`, ...any]

#### Defined in

packages/core/lib/core/types/Logger.d.ts:15

___

### LoggerOptions

Ƭ **LoggerOptions**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `hostname?` | `string` |
| `instanceId?` | [`InstanceId`](purista_redis_state_store.internal.md#instanceid) |
| `name?` | `string` |
| `principalId?` | [`PrincipalId`](purista_redis_state_store.internal.md#principalid) |
| `puristaVersion?` | `string` |
| `serviceName?` | `string` |
| `serviceTarget?` | `string` |
| `serviceVersion?` | `string` |
| `traceId?` | [`TraceId`](purista_redis_state_store.internal.md#traceid) |

#### Defined in

packages/core/lib/core/types/Logger.d.ts:4

___

### PrincipalId

Ƭ **PrincipalId**: `string`

the principal id

#### Defined in

packages/core/lib/core/types/PrincipalId.d.ts:2

___

### StoreBaseConfig

Ƭ **StoreBaseConfig**<`Config`\>: `Object`

#### Type parameters

| Name |
| :------ |
| `Config` |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `config?` | `Config` |
| `enableGet?` | `boolean` |
| `enableRemove?` | `boolean` |
| `enableSet?` | `boolean` |
| `logger?` | [`Logger`](../classes/purista_redis_state_store.internal.Logger.md) |

#### Defined in

packages/core/lib/core/types/StoreBaseConfig.d.ts:2

___

### TraceId

Ƭ **TraceId**: `string`

The trace id which will be passed through all commands, invocations and subscriptions

#### Defined in

packages/core/lib/core/types/TraceId.d.ts:4
