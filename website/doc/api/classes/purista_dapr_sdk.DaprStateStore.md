[PURISTA API](../README.md) / [Modules](../modules.md) / [@purista/dapr-sdk](../modules/purista_dapr_sdk.md) / DaprStateStore

# Class: DaprStateStore

[@purista/dapr-sdk](../modules/purista_dapr_sdk.md).DaprStateStore

DaprStateStore is an adapter which connects to the state store provided by the underlaying Dapr infrastructure

## Hierarchy

- [`StateStoreBaseClass`](purista_core.StateStoreBaseClass.md)\<[`DaprStateStoreConfig`](../modules/purista_dapr_sdk.md#daprstatestoreconfig)\>

  ↳ **`DaprStateStore`**

## Table of contents

### Constructors

- [constructor](purista_dapr_sdk.DaprStateStore.md#constructor)

### Properties

- [client](purista_dapr_sdk.DaprStateStore.md#client)
- [config](purista_dapr_sdk.DaprStateStore.md#config)
- [logger](purista_dapr_sdk.DaprStateStore.md#logger)
- [name](purista_dapr_sdk.DaprStateStore.md#name)

### Methods

- [destroy](purista_dapr_sdk.DaprStateStore.md#destroy)
- [getState](purista_dapr_sdk.DaprStateStore.md#getstate)
- [getStateImpl](purista_dapr_sdk.DaprStateStore.md#getstateimpl)
- [removeState](purista_dapr_sdk.DaprStateStore.md#removestate)
- [removeStateImpl](purista_dapr_sdk.DaprStateStore.md#removestateimpl)
- [setState](purista_dapr_sdk.DaprStateStore.md#setstate)
- [setStateImpl](purista_dapr_sdk.DaprStateStore.md#setstateimpl)

## Constructors

### constructor

• **new DaprStateStore**(`config?`): [`DaprStateStore`](purista_dapr_sdk.DaprStateStore.md)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `config?` | `Object` | - |
| `config.cacheTtl?` | `number` | Cache time to live in ms |
| `config.clientConfig?` | [`DaprClientConfig`](../modules/purista_dapr_sdk.md#daprclientconfig) | The Dapr client config to interact with Dapr sidecar |
| `config.enableCache?` | `boolean` | Enable cache |
| `config.enableGet?` | `boolean` | Enable generally get method |
| `config.enableRemove?` | `boolean` | Enable generally remove method |
| `config.enableSet?` | `boolean` | Enable generally set method |
| `config.logLevel?` | [`LogLevelName`](../modules/purista_core.md#loglevelname) | A log level for new logger if logger is not set |
| `config.logger?` | [`Logger`](purista_core.Logger.md) | A logger instance |
| `config.stateStoreName?` | `string` | The name of the state store |

#### Returns

[`DaprStateStore`](purista_dapr_sdk.DaprStateStore.md)

#### Overrides

[StateStoreBaseClass](purista_core.StateStoreBaseClass.md).[constructor](purista_core.StateStoreBaseClass.md#constructor)

#### Defined in

[dapr-sdk/src/DaprStateStore/DaprStateStore.impl.ts:18](https://github.com/sebastianwessel/purista/blob/master/packages/dapr-sdk/src/DaprStateStore/DaprStateStore.impl.ts#L18)

## Properties

### client

• `Private` **client**: [`HttpClient`](purista_core.HttpClient.md)\<[`DaprClientConfig`](../modules/purista_dapr_sdk.md#daprclientconfig)\>

#### Defined in

[dapr-sdk/src/DaprStateStore/DaprStateStore.impl.ts:16](https://github.com/sebastianwessel/purista/blob/master/packages/dapr-sdk/src/DaprStateStore/DaprStateStore.impl.ts#L16)

___

### config

• **config**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `cacheTtl?` | `number` | Cache time to live in ms |
| `clientConfig?` | [`DaprClientConfig`](../modules/purista_dapr_sdk.md#daprclientconfig) | The Dapr client config to interact with Dapr sidecar |
| `enableCache?` | `boolean` | Enable cache |
| `enableGet?` | `boolean` | Enable generally get method |
| `enableRemove?` | `boolean` | Enable generally remove method |
| `enableSet?` | `boolean` | Enable generally set method |
| `logLevel?` | [`LogLevelName`](../modules/purista_core.md#loglevelname) | A log level for new logger if logger is not set |
| `logger?` | [`Logger`](purista_core.Logger.md) | A logger instance |
| `stateStoreName?` | `string` | The name of the state store |

#### Inherited from

[StateStoreBaseClass](purista_core.StateStoreBaseClass.md).[config](purista_core.StateStoreBaseClass.md#config)

#### Defined in

core/dist/commonjs/core/StateStore/StateStoreBaseClass.impl.d.ts:17

___

### logger

• **logger**: [`Logger`](purista_core.Logger.md)

#### Inherited from

[StateStoreBaseClass](purista_core.StateStoreBaseClass.md).[logger](purista_core.StateStoreBaseClass.md#logger)

#### Defined in

core/dist/commonjs/core/StateStore/StateStoreBaseClass.impl.d.ts:16

___

### name

• **name**: `string`

name of store

#### Inherited from

[StateStoreBaseClass](purista_core.StateStoreBaseClass.md).[name](purista_core.StateStoreBaseClass.md#name)

#### Defined in

core/dist/commonjs/core/StateStore/StateStoreBaseClass.impl.d.ts:18

## Methods

### destroy

▸ **destroy**(): `Promise`\<`void`\>

disconnects and shuts down the state store

#### Returns

`Promise`\<`void`\>

#### Inherited from

[StateStoreBaseClass](purista_core.StateStoreBaseClass.md).[destroy](purista_core.StateStoreBaseClass.md#destroy)

#### Defined in

core/dist/commonjs/core/StateStore/StateStoreBaseClass.impl.d.ts:26

___

### getState

▸ **getState**\<`StateNames`\>(`...stateNames`): `Promise`\<[`ObjectWithKeysFromStringArray`](../modules/purista_core.md#objectwithkeysfromstringarray)\<`StateNames`\>\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `StateNames` | extends `string`[] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...stateNames` | `StateNames` |

#### Returns

`Promise`\<[`ObjectWithKeysFromStringArray`](../modules/purista_core.md#objectwithkeysfromstringarray)\<`StateNames`\>\>

#### Inherited from

[StateStoreBaseClass](purista_core.StateStoreBaseClass.md).[getState](purista_core.StateStoreBaseClass.md#getstate)

#### Defined in

core/dist/commonjs/core/StateStore/StateStoreBaseClass.impl.d.ts:21

___

### getStateImpl

▸ **getStateImpl**\<`StateNames`\>(`...stateNames`): `Promise`\<[`ObjectWithKeysFromStringArray`](../modules/purista_core.md#objectwithkeysfromstringarray)\<`StateNames`\>\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `StateNames` | extends `string`[] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...stateNames` | `StateNames` |

#### Returns

`Promise`\<[`ObjectWithKeysFromStringArray`](../modules/purista_core.md#objectwithkeysfromstringarray)\<`StateNames`\>\>

#### Overrides

[StateStoreBaseClass](purista_core.StateStoreBaseClass.md).[getStateImpl](purista_core.StateStoreBaseClass.md#getstateimpl)

#### Defined in

[dapr-sdk/src/DaprStateStore/DaprStateStore.impl.ts:53](https://github.com/sebastianwessel/purista/blob/master/packages/dapr-sdk/src/DaprStateStore/DaprStateStore.impl.ts#L53)

___

### removeState

▸ **removeState**(`stateName`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `stateName` | `string` |

#### Returns

`Promise`\<`void`\>

#### Inherited from

[StateStoreBaseClass](purista_core.StateStoreBaseClass.md).[removeState](purista_core.StateStoreBaseClass.md#removestate)

#### Defined in

core/dist/commonjs/core/StateStore/StateStoreBaseClass.impl.d.ts:23

___

### removeStateImpl

▸ **removeStateImpl**(`stateName`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `stateName` | `string` |

#### Returns

`Promise`\<`void`\>

#### Overrides

[StateStoreBaseClass](purista_core.StateStoreBaseClass.md).[removeStateImpl](purista_core.StateStoreBaseClass.md#removestateimpl)

#### Defined in

[dapr-sdk/src/DaprStateStore/DaprStateStore.impl.ts:99](https://github.com/sebastianwessel/purista/blob/master/packages/dapr-sdk/src/DaprStateStore/DaprStateStore.impl.ts#L99)

___

### setState

▸ **setState**(`stateName`, `stateValue`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `stateName` | `string` |
| `stateValue` | `unknown` |

#### Returns

`Promise`\<`void`\>

#### Inherited from

[StateStoreBaseClass](purista_core.StateStoreBaseClass.md).[setState](purista_core.StateStoreBaseClass.md#setstate)

#### Defined in

core/dist/commonjs/core/StateStore/StateStoreBaseClass.impl.d.ts:25

___

### setStateImpl

▸ **setStateImpl**(`stateName`, `stateValue`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `stateName` | `string` |
| `stateValue` | `unknown` |

#### Returns

`Promise`\<`void`\>

#### Overrides

[StateStoreBaseClass](purista_core.StateStoreBaseClass.md).[setStateImpl](purista_core.StateStoreBaseClass.md#setstateimpl)

#### Defined in

[dapr-sdk/src/DaprStateStore/DaprStateStore.impl.ts:82](https://github.com/sebastianwessel/purista/blob/master/packages/dapr-sdk/src/DaprStateStore/DaprStateStore.impl.ts#L82)
