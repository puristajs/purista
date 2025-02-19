[**@purista/dapr-sdk v2.0.0**](../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/dapr-sdk](../README.md) / DaprSecretStoreConfig

# Type Alias: DaprSecretStoreConfig

> **DaprSecretStoreConfig**: `object`

Defined in: [dapr-sdk/src/DaprSecretStore/types/DaprSecretStoreConfig.ts:6](https://github.com/puristajs/purista/blob/master/packages/dapr-sdk/src/DaprSecretStore/types/DaprSecretStoreConfig.ts#L6)

Dapr secret store configuration

## Type declaration

### clientConfig?

> `optional` **clientConfig**: [`DaprClientConfig`](DaprClientConfig.md)

The Dapr client config to interact with Dapr sidecar

### metadata?

> `optional` **metadata**: `object`

Dapr secret store metadata

#### metadata.namespace?

> `optional` **metadata.namespace**: `string`

In case of deploying into namespace other than default, the namespace (e.g. production) must be set

### secretStoreName?

> `optional` **secretStoreName**: `string`

The name of the secret store
