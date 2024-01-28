[PURISTA API](../README.md) / [Modules](../modules.md) / [@purista/dapr-sdk](../modules/purista_dapr_sdk.md) / DaprSecretStore

# Class: DaprSecretStore

[@purista/dapr-sdk](../modules/purista_dapr_sdk.md).DaprSecretStore

DaprSecretStore is an adapter which connects to the secret store provided by the underlaying Dapr infrastructure.

Dapr currently provides only the possibility to fetch a secret. Creating a new secret, changing an existing secret or removal of secrets is not supported.

## Hierarchy

- [`SecretStoreBaseClass`](purista_core.SecretStoreBaseClass.md)\<[`DaprSecretStoreConfig`](../modules/purista_dapr_sdk.md#daprsecretstoreconfig)\>

  ↳ **`DaprSecretStore`**

## Table of contents

### Constructors

- [constructor](purista_dapr_sdk.DaprSecretStore.md#constructor)

### Properties

- [cache](purista_dapr_sdk.DaprSecretStore.md#cache)
- [client](purista_dapr_sdk.DaprSecretStore.md#client)
- [config](purista_dapr_sdk.DaprSecretStore.md#config)
- [logger](purista_dapr_sdk.DaprSecretStore.md#logger)
- [name](purista_dapr_sdk.DaprSecretStore.md#name)

### Methods

- [destroy](purista_dapr_sdk.DaprSecretStore.md#destroy)
- [getSecret](purista_dapr_sdk.DaprSecretStore.md#getsecret)
- [getSecretImpl](purista_dapr_sdk.DaprSecretStore.md#getsecretimpl)
- [removeSecret](purista_dapr_sdk.DaprSecretStore.md#removesecret)
- [removeSecretImpl](purista_dapr_sdk.DaprSecretStore.md#removesecretimpl)
- [setSecret](purista_dapr_sdk.DaprSecretStore.md#setsecret)
- [setSecretImpl](purista_dapr_sdk.DaprSecretStore.md#setsecretimpl)

## Constructors

### constructor

• **new DaprSecretStore**(`config?`): [`DaprSecretStore`](purista_dapr_sdk.DaprSecretStore.md)

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
| `config.metadata?` | `Object` | Dapr secret store metadata |
| `config.metadata.namespace?` | `string` | In case of deploying into namespace other than default, the namespace (e.g. production) must be set |
| `config.secretStoreName?` | `string` | The name of the secret store |

#### Returns

[`DaprSecretStore`](purista_dapr_sdk.DaprSecretStore.md)

#### Overrides

[SecretStoreBaseClass](purista_core.SecretStoreBaseClass.md).[constructor](purista_core.SecretStoreBaseClass.md#constructor)

#### Defined in

[dapr-sdk/src/DaprSecretStore/DaprSecretStore.impl.ts:20](https://github.com/sebastianwessel/purista/blob/master/packages/dapr-sdk/src/DaprSecretStore/DaprSecretStore.impl.ts#L20)

## Properties

### cache

• **cache**: [`SecretStoreCacheMap`](../modules/purista_core.md#secretstorecachemap)

#### Inherited from

[SecretStoreBaseClass](purista_core.SecretStoreBaseClass.md).[cache](purista_core.SecretStoreBaseClass.md#cache)

#### Defined in

core/dist/commonjs/core/SecretStore/SecretStoreBaseClass.impl.d.ts:12

___

### client

• `Private` **client**: [`HttpClient`](purista_core.HttpClient.md)\<[`DaprClientConfig`](../modules/purista_dapr_sdk.md#daprclientconfig)\>

#### Defined in

[dapr-sdk/src/DaprSecretStore/DaprSecretStore.impl.ts:18](https://github.com/sebastianwessel/purista/blob/master/packages/dapr-sdk/src/DaprSecretStore/DaprSecretStore.impl.ts#L18)

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
| `metadata?` | \{ `namespace?`: `string`  } | Dapr secret store metadata |
| `metadata.namespace?` | `string` | In case of deploying into namespace other than default, the namespace (e.g. production) must be set |
| `secretStoreName?` | `string` | The name of the secret store |

#### Inherited from

[SecretStoreBaseClass](purista_core.SecretStoreBaseClass.md).[config](purista_core.SecretStoreBaseClass.md#config)

#### Defined in

core/dist/commonjs/core/SecretStore/SecretStoreBaseClass.impl.d.ts:10

___

### logger

• **logger**: [`Logger`](purista_core.Logger.md)

#### Inherited from

[SecretStoreBaseClass](purista_core.SecretStoreBaseClass.md).[logger](purista_core.SecretStoreBaseClass.md#logger)

#### Defined in

core/dist/commonjs/core/SecretStore/SecretStoreBaseClass.impl.d.ts:9

___

### name

• **name**: `string`

name of store

#### Inherited from

[SecretStoreBaseClass](purista_core.SecretStoreBaseClass.md).[name](purista_core.SecretStoreBaseClass.md#name)

#### Defined in

core/dist/commonjs/core/SecretStore/SecretStoreBaseClass.impl.d.ts:11

## Methods

### destroy

▸ **destroy**(): `Promise`\<`void`\>

disconnects and shuts down the secret store

#### Returns

`Promise`\<`void`\>

#### Inherited from

[SecretStoreBaseClass](purista_core.SecretStoreBaseClass.md).[destroy](purista_core.SecretStoreBaseClass.md#destroy)

#### Defined in

core/dist/commonjs/core/SecretStore/SecretStoreBaseClass.impl.d.ts:20

___

### getSecret

▸ **getSecret**(`...secretNames`): `Promise`\<`Record`\<`string`, `string`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `...secretNames` | `string`[] |

#### Returns

`Promise`\<`Record`\<`string`, `string`\>\>

#### Overrides

[SecretStoreBaseClass](purista_core.SecretStoreBaseClass.md).[getSecret](purista_core.SecretStoreBaseClass.md#getsecret)

#### Defined in

[dapr-sdk/src/DaprSecretStore/DaprSecretStore.impl.ts:55](https://github.com/sebastianwessel/purista/blob/master/packages/dapr-sdk/src/DaprSecretStore/DaprSecretStore.impl.ts#L55)

___

### getSecretImpl

▸ **getSecretImpl**(`..._secretNames`): `Promise`\<`Record`\<`string`, `undefined` \| `string`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `..._secretNames` | `string`[] |

#### Returns

`Promise`\<`Record`\<`string`, `undefined` \| `string`\>\>

#### Inherited from

[SecretStoreBaseClass](purista_core.SecretStoreBaseClass.md).[getSecretImpl](purista_core.SecretStoreBaseClass.md#getsecretimpl)

#### Defined in

core/dist/commonjs/core/SecretStore/SecretStoreBaseClass.impl.d.ts:14

___

### removeSecret

▸ **removeSecret**(`_secretName`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_secretName` | `string` |

#### Returns

`Promise`\<`void`\>

#### Overrides

[SecretStoreBaseClass](purista_core.SecretStoreBaseClass.md).[removeSecret](purista_core.SecretStoreBaseClass.md#removesecret)

#### Defined in

[dapr-sdk/src/DaprSecretStore/DaprSecretStore.impl.ts:99](https://github.com/sebastianwessel/purista/blob/master/packages/dapr-sdk/src/DaprSecretStore/DaprSecretStore.impl.ts#L99)

___

### removeSecretImpl

▸ **removeSecretImpl**(`_secretName`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_secretName` | `string` |

#### Returns

`Promise`\<`void`\>

#### Inherited from

[SecretStoreBaseClass](purista_core.SecretStoreBaseClass.md).[removeSecretImpl](purista_core.SecretStoreBaseClass.md#removesecretimpl)

#### Defined in

core/dist/commonjs/core/SecretStore/SecretStoreBaseClass.impl.d.ts:16

___

### setSecret

▸ **setSecret**(`_secretName`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_secretName` | `string` |

#### Returns

`Promise`\<`void`\>

#### Overrides

[SecretStoreBaseClass](purista_core.SecretStoreBaseClass.md).[setSecret](purista_core.SecretStoreBaseClass.md#setsecret)

#### Defined in

[dapr-sdk/src/DaprSecretStore/DaprSecretStore.impl.ts:91](https://github.com/sebastianwessel/purista/blob/master/packages/dapr-sdk/src/DaprSecretStore/DaprSecretStore.impl.ts#L91)

___

### setSecretImpl

▸ **setSecretImpl**(`_secretName`, `_secretValue`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_secretName` | `string` |
| `_secretValue` | `string` |

#### Returns

`Promise`\<`void`\>

#### Inherited from

[SecretStoreBaseClass](purista_core.SecretStoreBaseClass.md).[setSecretImpl](purista_core.SecretStoreBaseClass.md#setsecretimpl)

#### Defined in

core/dist/commonjs/core/SecretStore/SecretStoreBaseClass.impl.d.ts:18
