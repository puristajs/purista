[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/azure-secret-store](../README.md) / AzureSecretStoreConfig

# Type Alias: AzureSecretStoreConfig

> **AzureSecretStoreConfig** = `object`

Defined in: [azure-secret-store/src/types.ts:6](https://github.com/puristajs/purista/blob/master/packages/azure-secret-store/src/types.ts#L6)

Azure Key Vault store config

## Properties

### allowInsecureConnection?

> `optional` **allowInsecureConnection?**: `boolean`

Defined in: [azure-secret-store/src/types.ts:16](https://github.com/puristajs/purista/blob/master/packages/azure-secret-store/src/types.ts#L16)

Allow connections to self-signed / insecure endpoints (useful for local emulators).
Never enable this in production.

***

### options?

> `optional` **options?**: `SecretClientOptions`

Defined in: [azure-secret-store/src/types.ts:17](https://github.com/puristajs/purista/blob/master/packages/azure-secret-store/src/types.ts#L17)

***

### vaultUrl

> **vaultUrl**: `string`

Defined in: [azure-secret-store/src/types.ts:11](https://github.com/puristajs/purista/blob/master/packages/azure-secret-store/src/types.ts#L11)

The URL to reach the Azure Key Vault

#### Example

```ts
https://[KEY_VAULT_NAME].vault.azure.net
```
