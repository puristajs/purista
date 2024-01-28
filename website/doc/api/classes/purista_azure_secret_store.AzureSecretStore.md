[PURISTA API](../README.md) / [Modules](../modules.md) / [@purista/azure-secret-store](../modules/purista_azure_secret_store.md) / AzureSecretStore

# Class: AzureSecretStore

[@purista/azure-secret-store](../modules/purista_azure_secret_store.md).AzureSecretStore

The secret store adapter for Azure Secrets Manager.
It will store, retrive, update or remove secrets in Azure Secrets Manager.

For performance reasons, and to reduce costs, the secret values are cached in memory after first fetch.

You can disable the whole caching via config by setting enableCache to false.
If the cache is enabled, you can set the ttl for cached secret values via config cacheTtl (in ms).

This will return the cached secret if available and if ttl is not exceeded.
If a secret value exceeds the ttl, it does not automatically get removed from cache.
It will be removed/overwritten on next get request.

## Hierarchy

- [`SecretStoreBaseClass`](purista_core.SecretStoreBaseClass.md)\<[`AzureSecretStoreConfig`](../modules/purista_azure_secret_store.md#azuresecretstoreconfig)\>

  ↳ **`AzureSecretStore`**

## Table of contents

### Constructors

- [constructor](purista_azure_secret_store.AzureSecretStore.md#constructor)

### Properties

- [cache](purista_azure_secret_store.AzureSecretStore.md#cache)
- [client](purista_azure_secret_store.AzureSecretStore.md#client)
- [config](purista_azure_secret_store.AzureSecretStore.md#config)
- [logger](purista_azure_secret_store.AzureSecretStore.md#logger)
- [name](purista_azure_secret_store.AzureSecretStore.md#name)

### Methods

- [destroy](purista_azure_secret_store.AzureSecretStore.md#destroy)
- [getSecret](purista_azure_secret_store.AzureSecretStore.md#getsecret)
- [getSecretImpl](purista_azure_secret_store.AzureSecretStore.md#getsecretimpl)
- [removeSecret](purista_azure_secret_store.AzureSecretStore.md#removesecret)
- [removeSecretImpl](purista_azure_secret_store.AzureSecretStore.md#removesecretimpl)
- [setSecret](purista_azure_secret_store.AzureSecretStore.md#setsecret)
- [setSecretImpl](purista_azure_secret_store.AzureSecretStore.md#setsecretimpl)

## Constructors

### constructor

• **new AzureSecretStore**(`config`): [`AzureSecretStore`](purista_azure_secret_store.AzureSecretStore.md)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `config` | `Object` | - |
| `config.cacheTtl?` | `number` | Cache time to live in ms |
| `config.enableCache?` | `boolean` | Enable cache |
| `config.enableGet?` | `boolean` | Enable generally get method |
| `config.enableRemove?` | `boolean` | Enable generally remove method |
| `config.enableSet?` | `boolean` | Enable generally set method |
| `config.logLevel?` | [`LogLevelName`](../modules/purista_core.md#loglevelname) | A log level for new logger if logger is not set |
| `config.logger?` | [`Logger`](purista_core.Logger.md) | A logger instance |
| `config.options?` | `SecretClientOptions` | - |
| `config.vaultUrl` | `string` | The URL to reach the Azure Key Vault **`Example`** ```ts https://[KEY_VAULT_NAME].vault.azure.net ``` |

#### Returns

[`AzureSecretStore`](purista_azure_secret_store.AzureSecretStore.md)

#### Overrides

[SecretStoreBaseClass](purista_core.SecretStoreBaseClass.md).[constructor](purista_core.SecretStoreBaseClass.md#constructor)

#### Defined in

[azure-secret-store/src/AzureSecretStore.impl.ts:23](https://github.com/sebastianwessel/purista/blob/master/packages/azure-secret-store/src/AzureSecretStore.impl.ts#L23)

## Properties

### cache

• **cache**: [`SecretStoreCacheMap`](../modules/purista_core.md#secretstorecachemap)

#### Inherited from

[SecretStoreBaseClass](purista_core.SecretStoreBaseClass.md).[cache](purista_core.SecretStoreBaseClass.md#cache)

#### Defined in

core/dist/commonjs/core/SecretStore/SecretStoreBaseClass.impl.d.ts:12

___

### client

• **client**: `SecretClient`

#### Defined in

[azure-secret-store/src/AzureSecretStore.impl.ts:21](https://github.com/sebastianwessel/purista/blob/master/packages/azure-secret-store/src/AzureSecretStore.impl.ts#L21)

___

### config

• **config**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `cacheTtl?` | `number` | Cache time to live in ms |
| `enableCache?` | `boolean` | Enable cache |
| `enableGet?` | `boolean` | Enable generally get method |
| `enableRemove?` | `boolean` | Enable generally remove method |
| `enableSet?` | `boolean` | Enable generally set method |
| `logLevel?` | [`LogLevelName`](../modules/purista_core.md#loglevelname) | A log level for new logger if logger is not set |
| `logger?` | [`Logger`](purista_core.Logger.md) | A logger instance |
| `options?` | `SecretClientOptions` | - |
| `vaultUrl` | `string` | The URL to reach the Azure Key Vault **`Example`** ```ts https://[KEY_VAULT_NAME].vault.azure.net ``` |

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

▸ **getSecret**(`...secretNames`): `Promise`\<`Record`\<`string`, `undefined` \| `string`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `...secretNames` | `string`[] |

#### Returns

`Promise`\<`Record`\<`string`, `undefined` \| `string`\>\>

#### Inherited from

[SecretStoreBaseClass](purista_core.SecretStoreBaseClass.md).[getSecret](purista_core.SecretStoreBaseClass.md#getsecret)

#### Defined in

core/dist/commonjs/core/SecretStore/SecretStoreBaseClass.impl.d.ts:15

___

### getSecretImpl

▸ **getSecretImpl**(`...secretNames`): `Promise`\<`Record`\<`string`, `undefined` \| `string`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `...secretNames` | `string`[] |

#### Returns

`Promise`\<`Record`\<`string`, `undefined` \| `string`\>\>

#### Overrides

[SecretStoreBaseClass](purista_core.SecretStoreBaseClass.md).[getSecretImpl](purista_core.SecretStoreBaseClass.md#getsecretimpl)

#### Defined in

[azure-secret-store/src/AzureSecretStore.impl.ts:31](https://github.com/sebastianwessel/purista/blob/master/packages/azure-secret-store/src/AzureSecretStore.impl.ts#L31)

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

core/dist/commonjs/core/SecretStore/SecretStoreBaseClass.impl.d.ts:17

___

### removeSecretImpl

▸ **removeSecretImpl**(`secretName`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `secretName` | `string` |

#### Returns

`Promise`\<`void`\>

#### Overrides

[SecretStoreBaseClass](purista_core.SecretStoreBaseClass.md).[removeSecretImpl](purista_core.SecretStoreBaseClass.md#removesecretimpl)

#### Defined in

[azure-secret-store/src/AzureSecretStore.impl.ts:48](https://github.com/sebastianwessel/purista/blob/master/packages/azure-secret-store/src/AzureSecretStore.impl.ts#L48)

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

core/dist/commonjs/core/SecretStore/SecretStoreBaseClass.impl.d.ts:19

___

### setSecretImpl

▸ **setSecretImpl**(`secretName`, `secretValue`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `secretName` | `string` |
| `secretValue` | `string` |

#### Returns

`Promise`\<`void`\>

#### Overrides

[SecretStoreBaseClass](purista_core.SecretStoreBaseClass.md).[setSecretImpl](purista_core.SecretStoreBaseClass.md#setsecretimpl)

#### Defined in

[azure-secret-store/src/AzureSecretStore.impl.ts:52](https://github.com/sebastianwessel/purista/blob/master/packages/azure-secret-store/src/AzureSecretStore.impl.ts#L52)
