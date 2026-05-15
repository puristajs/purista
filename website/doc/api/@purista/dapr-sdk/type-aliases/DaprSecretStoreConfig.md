[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/dapr-sdk](../README.md) / DaprSecretStoreConfig

# Type Alias: DaprSecretStoreConfig

> **DaprSecretStoreConfig** = `object`

Defined in: [dapr-sdk/src/DaprSecretStore/types/DaprSecretStoreConfig.ts:6](https://github.com/puristajs/purista/blob/master/packages/dapr-sdk/src/DaprSecretStore/types/DaprSecretStoreConfig.ts#L6)

Dapr secret store configuration

## Properties

### clientConfig?

> `optional` **clientConfig?**: [`DaprClientConfig`](DaprClientConfig.md)

Defined in: [dapr-sdk/src/DaprSecretStore/types/DaprSecretStoreConfig.ts:15](https://github.com/puristajs/purista/blob/master/packages/dapr-sdk/src/DaprSecretStore/types/DaprSecretStoreConfig.ts#L15)

The Dapr client config to interact with Dapr sidecar

***

### metadata?

> `optional` **metadata?**: `object`

Defined in: [dapr-sdk/src/DaprSecretStore/types/DaprSecretStoreConfig.ts:20](https://github.com/puristajs/purista/blob/master/packages/dapr-sdk/src/DaprSecretStore/types/DaprSecretStoreConfig.ts#L20)

Dapr secret store metadata

#### namespace?

> `optional` **namespace?**: `string`

In case of deploying into namespace other than default, the namespace (e.g. production) must be set

***

### secretStoreName?

> `optional` **secretStoreName?**: `string`

Defined in: [dapr-sdk/src/DaprSecretStore/types/DaprSecretStoreConfig.ts:10](https://github.com/puristajs/purista/blob/master/packages/dapr-sdk/src/DaprSecretStore/types/DaprSecretStoreConfig.ts#L10)

The name of the secret store
