[PURISTA API](../README.md) / [Modules](../modules.md) / [@purista/dapr-sdk](../modules/purista_dapr_sdk.md) / DaprStateStore

# Class: DaprStateStore

[@purista/dapr-sdk](../modules/purista_dapr_sdk.md).DaprStateStore

DaprStateStore is an adapter which connects to the state store provided by the underlaying Dapr infrastructure

## Hierarchy

- `StateStoreBaseClass`<[`DaprStateStoreConfig`](../modules/purista_dapr_sdk.md#daprstatestoreconfig)\>

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
- [removeState](purista_dapr_sdk.DaprStateStore.md#removestate)
- [setState](purista_dapr_sdk.DaprStateStore.md#setstate)

## Constructors

### constructor

• **new DaprStateStore**(`config?`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `config?` | `Object` | - |
| `config.clientConfig?` | [`DaprClientConfig`](../modules/purista_dapr_sdk.md#daprclientconfig) | The Dapr client config to interact with Dapr sidecar |
| `config.enableGet?` | `boolean` | Enable generally get method |
| `config.enableRemove?` | `boolean` | Enable generally remove method |
| `config.enableSet?` | `boolean` | Enable generally set method |
| `config.logLevel?` | `LogLevelName` | A log level for new logger if logger is not set |
| `config.logger?` | `Logger` | A logger instance |
| `config.stateStoreName?` | `string` | The name of the state store |

#### Overrides

StateStoreBaseClass&lt;DaprStateStoreConfig\&gt;.constructor

#### Defined in

[dapr-sdk/src/DaprStateStore/DaprStateStore.impl.ts:16](https://github.com/sebastianwessel/purista/blob/master/packages/dapr-sdk/src/DaprStateStore/DaprStateStore.impl.ts#L16)

## Properties

### client

• `Private` **client**: `HttpClient`<[`DaprClientConfig`](../modules/purista_dapr_sdk.md#daprclientconfig)\>

#### Defined in

[dapr-sdk/src/DaprStateStore/DaprStateStore.impl.ts:14](https://github.com/sebastianwessel/purista/blob/master/packages/dapr-sdk/src/DaprStateStore/DaprStateStore.impl.ts#L14)

___

### config

• **config**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `clientConfig?` | [`DaprClientConfig`](../modules/purista_dapr_sdk.md#daprclientconfig) | The Dapr client config to interact with Dapr sidecar |
| `enableGet?` | `boolean` | Enable generally get method |
| `enableRemove?` | `boolean` | Enable generally remove method |
| `enableSet?` | `boolean` | Enable generally set method |
| `logLevel?` | `LogLevelName` | A log level for new logger if logger is not set |
| `logger?` | `Logger` | A logger instance |
| `stateStoreName?` | `string` | The name of the state store |

#### Inherited from

StateStoreBaseClass.config

#### Defined in

core/lib/types/core/StateStore/StateStoreBaseClass.impl.d.ts:10

___

### logger

• **logger**: `Logger`

#### Inherited from

StateStoreBaseClass.logger

#### Defined in

core/lib/types/core/StateStore/StateStoreBaseClass.impl.d.ts:9

___

### name

• **name**: `string`

#### Inherited from

StateStoreBaseClass.name

#### Defined in

core/lib/types/core/StateStore/StateStoreBaseClass.impl.d.ts:11

## Methods

### destroy

▸ **destroy**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Inherited from

StateStoreBaseClass.destroy

#### Defined in

core/lib/types/core/StateStore/StateStoreBaseClass.impl.d.ts:16

___

### getState

▸ **getState**(`...stateNames`): `Promise`<`Record`<`string`, `string`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `...stateNames` | `string`[] |

#### Returns

`Promise`<`Record`<`string`, `string`\>\>

#### Overrides

StateStoreBaseClass.getState

#### Defined in

[dapr-sdk/src/DaprStateStore/DaprStateStore.impl.ts:51](https://github.com/sebastianwessel/purista/blob/master/packages/dapr-sdk/src/DaprStateStore/DaprStateStore.impl.ts#L51)

___

### removeState

▸ **removeState**(`stateName`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `stateName` | `string` |

#### Returns

`Promise`<`void`\>

#### Overrides

StateStoreBaseClass.removeState

#### Defined in

[dapr-sdk/src/DaprStateStore/DaprStateStore.impl.ts:103](https://github.com/sebastianwessel/purista/blob/master/packages/dapr-sdk/src/DaprStateStore/DaprStateStore.impl.ts#L103)

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

#### Overrides

StateStoreBaseClass.setState

#### Defined in

[dapr-sdk/src/DaprStateStore/DaprStateStore.impl.ts:82](https://github.com/sebastianwessel/purista/blob/master/packages/dapr-sdk/src/DaprStateStore/DaprStateStore.impl.ts#L82)
