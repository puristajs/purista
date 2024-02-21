[PURISTA API](../README.md) / [Modules](../modules.md) / [@purista/aws-secret-store](../modules/purista_aws_secret_store.md) / AWSSecretStore

# Class: AWSSecretStore

[@purista/aws-secret-store](../modules/purista_aws_secret_store.md).AWSSecretStore

The secret store adapter for AWS Secrets Manager.
It will store, retrive, update or remove secrets in AWS Secrets Manager.

For performance reasons, and to reduce costs, the secret values are cached in memory after first fetch.

You can disable the whole caching via config by setting enableCache to false.
If the cache is enabled, you can set the ttl for cached secret values via config cacheTtl (in ms).

This will return the cached secret if available and if ttl is not exceeded.
If a secret value exceeds the ttl, it does not automatically get removed from cache.
It will be removed/overwritten on next get request.

## Hierarchy

- [`SecretStoreBaseClass`](purista_core.SecretStoreBaseClass.md)\<[`AWSSecretStoreConfig`](../modules/purista_aws_secret_store.md#awssecretstoreconfig)\>

  ↳ **`AWSSecretStore`**

## Table of contents

### Constructors

- [constructor](purista_aws_secret_store.AWSSecretStore.md#constructor)

### Properties

- [cache](purista_aws_secret_store.AWSSecretStore.md#cache)
- [client](purista_aws_secret_store.AWSSecretStore.md#client)
- [config](purista_aws_secret_store.AWSSecretStore.md#config)
- [logger](purista_aws_secret_store.AWSSecretStore.md#logger)
- [name](purista_aws_secret_store.AWSSecretStore.md#name)

### Methods

- [destroy](purista_aws_secret_store.AWSSecretStore.md#destroy)
- [getSecret](purista_aws_secret_store.AWSSecretStore.md#getsecret)
- [getSecretImpl](purista_aws_secret_store.AWSSecretStore.md#getsecretimpl)
- [removeSecret](purista_aws_secret_store.AWSSecretStore.md#removesecret)
- [removeSecretImpl](purista_aws_secret_store.AWSSecretStore.md#removesecretimpl)
- [setSecret](purista_aws_secret_store.AWSSecretStore.md#setsecret)
- [setSecretImpl](purista_aws_secret_store.AWSSecretStore.md#setsecretimpl)

## Constructors

### constructor

• **new AWSSecretStore**(`config`): [`AWSSecretStore`](purista_aws_secret_store.AWSSecretStore.md)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `config` | `Object` | - |
| `config.cacheTtl?` | `number` | Cache time to live in ms |
| `config.client` | `SecretsManagerClientConfigType` | AWS client options |
| `config.enableCache?` | `boolean` | Enable cache |
| `config.enableGet?` | `boolean` | Enable generally get method |
| `config.enableRemove?` | `boolean` | Enable generally remove method |
| `config.enableSet?` | `boolean` | Enable generally set method |
| `config.logLevel?` | [`LogLevelName`](../modules/purista_core.md#loglevelname) | A log level for new logger if logger is not set |
| `config.logger?` | [`Logger`](purista_core.Logger.md) | A logger instance |

#### Returns

[`AWSSecretStore`](purista_aws_secret_store.AWSSecretStore.md)

#### Overrides

[SecretStoreBaseClass](purista_core.SecretStoreBaseClass.md).[constructor](purista_core.SecretStoreBaseClass.md#constructor)

#### Defined in

[aws-secret-store/src/AWSSecretStore.impl.ts:35](https://github.com/sebastianwessel/purista/blob/master/packages/aws-secret-store/src/AWSSecretStore.impl.ts#L35)

## Properties

### cache

• **cache**: [`SecretStoreCacheMap`](../modules/purista_core.md#secretstorecachemap)

#### Inherited from

[SecretStoreBaseClass](purista_core.SecretStoreBaseClass.md).[cache](purista_core.SecretStoreBaseClass.md#cache)

#### Defined in

core/dist/commonjs/core/SecretStore/SecretStoreBaseClass.impl.d.ts:20

___

### client

• **client**: `SecretsManagerClient`

#### Defined in

[aws-secret-store/src/AWSSecretStore.impl.ts:33](https://github.com/sebastianwessel/purista/blob/master/packages/aws-secret-store/src/AWSSecretStore.impl.ts#L33)

___

### config

• **config**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `cacheTtl?` | `number` | Cache time to live in ms |
| `client` | `SecretsManagerClientConfigType` | AWS client options |
| `enableCache?` | `boolean` | Enable cache |
| `enableGet?` | `boolean` | Enable generally get method |
| `enableRemove?` | `boolean` | Enable generally remove method |
| `enableSet?` | `boolean` | Enable generally set method |
| `logLevel?` | [`LogLevelName`](../modules/purista_core.md#loglevelname) | A log level for new logger if logger is not set |
| `logger?` | [`Logger`](purista_core.Logger.md) | A logger instance |

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

[aws-secret-store/src/AWSSecretStore.impl.ts:40](https://github.com/sebastianwessel/purista/blob/master/packages/aws-secret-store/src/AWSSecretStore.impl.ts#L40)

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

[aws-secret-store/src/AWSSecretStore.impl.ts:64](https://github.com/sebastianwessel/purista/blob/master/packages/aws-secret-store/src/AWSSecretStore.impl.ts#L64)

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

[aws-secret-store/src/AWSSecretStore.impl.ts:72](https://github.com/sebastianwessel/purista/blob/master/packages/aws-secret-store/src/AWSSecretStore.impl.ts#L72)
