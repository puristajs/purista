[PURISTA API](../README.md) / [Modules](../modules.md) / [@purista/dapr-sdk](../modules/purista_dapr_sdk.md) / DaprSecretStore

# Class: DaprSecretStore

[@purista/dapr-sdk](../modules/purista_dapr_sdk.md).DaprSecretStore

DaprSecretStore is an adapter which connects to the secret store provided by the underlaying Dapr infrastructure.

Dapr currently provides only the possibility to fetch a secret. Creating a new secret, changing an existing secret or removal of secrets is not supported.

## Hierarchy

- `SecretStoreBaseClass`\<[`DaprSecretStoreConfig`](../modules/purista_dapr_sdk.md#daprsecretstoreconfig)\>

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
- [removeSecret](purista_dapr_sdk.DaprSecretStore.md#removesecret)
- [setSecret](purista_dapr_sdk.DaprSecretStore.md#setsecret)

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
| `config.logLevel?` | `LogLevelName` | A log level for new logger if logger is not set |
| `config.logger?` | `Logger` | A logger instance |
| `config.metadata?` | `Object` | Dapr secret store metadata |
| `config.metadata.namespace?` | `string` | In case of deploying into namespace other than default, the namespace (e.g. production) must be set |
| `config.secretStoreName?` | `string` | The name of the secret store |

#### Returns

[`DaprSecretStore`](purista_dapr_sdk.DaprSecretStore.md)

#### Overrides

SecretStoreBaseClass\&lt;DaprSecretStoreConfig\&gt;.constructor

#### Defined in

[dapr-sdk/src/DaprSecretStore/DaprSecretStore.impl.ts:19](https://github.com/sebastianwessel/purista/blob/master/packages/dapr-sdk/src/DaprSecretStore/DaprSecretStore.impl.ts#L19)

## Properties

### cache

• **cache**: `SecretStoreCacheMap`

#### Inherited from

SecretStoreBaseClass.cache

#### Defined in

core/lib/types/core/SecretStore/SecretStoreBaseClass.impl.d.ts:12

___

### client

• `Private` **client**: `HttpClient`\<[`DaprClientConfig`](../modules/purista_dapr_sdk.md#daprclientconfig)\>

#### Defined in

[dapr-sdk/src/DaprSecretStore/DaprSecretStore.impl.ts:17](https://github.com/sebastianwessel/purista/blob/master/packages/dapr-sdk/src/DaprSecretStore/DaprSecretStore.impl.ts#L17)

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
| `logLevel?` | `LogLevelName` | A log level for new logger if logger is not set |
| `logger?` | `Logger` | A logger instance |
| `metadata?` | \{ `namespace?`: `string`  } | Dapr secret store metadata |
| `metadata.namespace?` | `string` | In case of deploying into namespace other than default, the namespace (e.g. production) must be set |
| `secretStoreName?` | `string` | The name of the secret store |

#### Inherited from

SecretStoreBaseClass.config

#### Defined in

core/lib/types/core/SecretStore/SecretStoreBaseClass.impl.d.ts:10

___

### logger

• **logger**: `Logger`

#### Inherited from

SecretStoreBaseClass.logger

#### Defined in

core/lib/types/core/SecretStore/SecretStoreBaseClass.impl.d.ts:9

___

### name

• **name**: `string`

#### Inherited from

SecretStoreBaseClass.name

#### Defined in

core/lib/types/core/SecretStore/SecretStoreBaseClass.impl.d.ts:11

## Methods

### destroy

▸ **destroy**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Inherited from

SecretStoreBaseClass.destroy

#### Defined in

core/lib/types/core/SecretStore/SecretStoreBaseClass.impl.d.ts:17

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

SecretStoreBaseClass.getSecret

#### Defined in

[dapr-sdk/src/DaprSecretStore/DaprSecretStore.impl.ts:54](https://github.com/sebastianwessel/purista/blob/master/packages/dapr-sdk/src/DaprSecretStore/DaprSecretStore.impl.ts#L54)

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

SecretStoreBaseClass.removeSecret

#### Defined in

[dapr-sdk/src/DaprSecretStore/DaprSecretStore.impl.ts:98](https://github.com/sebastianwessel/purista/blob/master/packages/dapr-sdk/src/DaprSecretStore/DaprSecretStore.impl.ts#L98)

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

SecretStoreBaseClass.setSecret

#### Defined in

[dapr-sdk/src/DaprSecretStore/DaprSecretStore.impl.ts:90](https://github.com/sebastianwessel/purista/blob/master/packages/dapr-sdk/src/DaprSecretStore/DaprSecretStore.impl.ts#L90)
