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

[dapr-sdk/src/DaprSecretStore/DaprSecretStore.impl.ts:20](https://github.com/puristajs/purista/blob/master/packages/dapr-sdk/src/DaprSecretStore/DaprSecretStore.impl.ts#L20)

## Properties

### cache

• **cache**: [`SecretStoreCacheMap`](../modules/purista_core.md#secretstorecachemap)

#### Inherited from

[SecretStoreBaseClass](purista_core.SecretStoreBaseClass.md).[cache](purista_core.SecretStoreBaseClass.md#cache)

#### Defined in

core/dist/commonjs/core/SecretStore/SecretStoreBaseClass.impl.d.ts:20

___

### client

• `Private` **client**: [`HttpClient`](purista_core.HttpClient.md)\<[`DaprClientConfig`](../modules/purista_dapr_sdk.md#daprclientconfig)\>

#### Defined in

[dapr-sdk/src/DaprSecretStore/DaprSecretStore.impl.ts:18](https://github.com/puristajs/purista/blob/master/packages/dapr-sdk/src/DaprSecretStore/DaprSecretStore.impl.ts#L18)

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

core/dist/commonjs/core/SecretStore/SecretStoreBaseClass.impl.d.ts:18

___

### logger

• **logger**: [`Logger`](purista_core.Logger.md)

#### Inherited from

[SecretStoreBaseClass](purista_core.SecretStoreBaseClass.md).[logger](purista_core.SecretStoreBaseClass.md#logger)

#### Defined in

core/dist/commonjs/core/SecretStore/SecretStoreBaseClass.impl.d.ts:17

___

### name

• **name**: `string`

#### Inherited from

[SecretStoreBaseClass](purista_core.SecretStoreBaseClass.md).[name](purista_core.SecretStoreBaseClass.md#name)

#### Defined in

core/dist/commonjs/core/SecretStore/SecretStoreBaseClass.impl.d.ts:19

## Methods

### destroy

▸ **destroy**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Inherited from

[SecretStoreBaseClass](purista_core.SecretStoreBaseClass.md).[destroy](purista_core.SecretStoreBaseClass.md#destroy)

#### Defined in

core/dist/commonjs/core/SecretStore/SecretStoreBaseClass.impl.d.ts:28

___

### getSecret

▸ **getSecret**\<`SecretNames`\>(`...secretNames`): `Promise`\<[`ObjectWithKeysFromStringArray`](../modules/purista_core.md#objectwithkeysfromstringarray)\<`SecretNames`, `undefined` \| `string`\>\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `SecretNames` | extends `string`[] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...secretNames` | `SecretNames` |

#### Returns

`Promise`\<[`ObjectWithKeysFromStringArray`](../modules/purista_core.md#objectwithkeysfromstringarray)\<`SecretNames`, `undefined` \| `string`\>\>

#### Inherited from

[SecretStoreBaseClass](purista_core.SecretStoreBaseClass.md).[getSecret](purista_core.SecretStoreBaseClass.md#getsecret)

#### Defined in

core/dist/commonjs/core/SecretStore/SecretStoreBaseClass.impl.d.ts:23

___

### getSecretImpl

▸ **getSecretImpl**\<`SecretNames`\>(`...secretNames`): `Promise`\<[`ObjectWithKeysFromStringArray`](../modules/purista_core.md#objectwithkeysfromstringarray)\<`SecretNames`, `undefined` \| `string`\>\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `SecretNames` | extends `string`[] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...secretNames` | `SecretNames` |

#### Returns

`Promise`\<[`ObjectWithKeysFromStringArray`](../modules/purista_core.md#objectwithkeysfromstringarray)\<`SecretNames`, `undefined` \| `string`\>\>

#### Overrides

[SecretStoreBaseClass](purista_core.SecretStoreBaseClass.md).[getSecretImpl](purista_core.SecretStoreBaseClass.md#getsecretimpl)

#### Defined in

[dapr-sdk/src/DaprSecretStore/DaprSecretStore.impl.ts:55](https://github.com/puristajs/purista/blob/master/packages/dapr-sdk/src/DaprSecretStore/DaprSecretStore.impl.ts#L55)

___

### removeSecret

▸ **removeSecret**(`secretName`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `secretName` | `string` |

#### Returns

`Promise`\<`void`\>

#### Inherited from

[SecretStoreBaseClass](purista_core.SecretStoreBaseClass.md).[removeSecret](purista_core.SecretStoreBaseClass.md#removesecret)

#### Defined in

core/dist/commonjs/core/SecretStore/SecretStoreBaseClass.impl.d.ts:25

___

### removeSecretImpl

▸ **removeSecretImpl**(`_secretName`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_secretName` | `string` |

#### Returns

`Promise`\<`void`\>

#### Overrides

[SecretStoreBaseClass](purista_core.SecretStoreBaseClass.md).[removeSecretImpl](purista_core.SecretStoreBaseClass.md#removesecretimpl)

#### Defined in

[dapr-sdk/src/DaprSecretStore/DaprSecretStore.impl.ts:93](https://github.com/puristajs/purista/blob/master/packages/dapr-sdk/src/DaprSecretStore/DaprSecretStore.impl.ts#L93)

___

### setSecret

▸ **setSecret**(`secretName`, `secretValue`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `secretName` | `string` |
| `secretValue` | `string` |

#### Returns

`Promise`\<`void`\>

#### Inherited from

[SecretStoreBaseClass](purista_core.SecretStoreBaseClass.md).[setSecret](purista_core.SecretStoreBaseClass.md#setsecret)

#### Defined in

core/dist/commonjs/core/SecretStore/SecretStoreBaseClass.impl.d.ts:27

___

### setSecretImpl

▸ **setSecretImpl**(`_secretName`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_secretName` | `string` |

#### Returns

`Promise`\<`void`\>

#### Overrides

[SecretStoreBaseClass](purista_core.SecretStoreBaseClass.md).[setSecretImpl](purista_core.SecretStoreBaseClass.md#setsecretimpl)

#### Defined in

[dapr-sdk/src/DaprSecretStore/DaprSecretStore.impl.ts:89](https://github.com/puristajs/purista/blob/master/packages/dapr-sdk/src/DaprSecretStore/DaprSecretStore.impl.ts#L89)
