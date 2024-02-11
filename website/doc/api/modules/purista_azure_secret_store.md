[PURISTA API](../README.md) / [Modules](../modules.md) / @purista/azure-secret-store

# Module: @purista/azure-secret-store

The secret store adapter for Azure Key Vault.
It will store, retrive, update or remove secrets in Azure Key Vault.

For performance reasons, and to reduce costs, the secret values are cached in memory after first fetch.

You can disable the whole caching via config by setting enableCache to false.
If the cache is enabled, you can set the ttl for cached secret values via config cacheTtl (in ms).

This will return the cached secret if available and if ttl is not exceeded.
If a secret value exceeds the ttl, it does not automatically get removed from cache.
It will be removed/overwritten on next get request.

**`Example`**

```typescript
const config = {
  vaultUrl: 'https://[KEY_VAULT_NAME].vault.azure.net'
}

const store = new AzureSecretStore({ config })

await store.setSecret('mySecret', 'value')

let value = await store.getSecret('mySecret')
console.log(value) // outputs: { mySecret: 'value' }

await store.removeSecret('mySecret')

value = await store.getSecret('mySecret')
console.log(value) // outputs: undefined

```

## Table of contents

### Classes

- [AzureSecretStore](../classes/purista_azure_secret_store.AzureSecretStore.md)

### Type Aliases

- [AzureSecretStoreConfig](purista_azure_secret_store.md#azuresecretstoreconfig)

### Variables

- [puristaVersion](purista_azure_secret_store.md#puristaversion)

## Type Aliases

### AzureSecretStoreConfig

Ƭ **AzureSecretStoreConfig**: `Object`

Azure Key Vault store config

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `options?` | `SecretClientOptions` | - |
| `vaultUrl` | `string` | The URL to reach the Azure Key Vault **`Example`** ```ts https://[KEY_VAULT_NAME].vault.azure.net ``` |

#### Defined in

[azure-secret-store/src/types.ts:6](https://github.com/sebastianwessel/purista/blob/master/packages/azure-secret-store/src/types.ts#L6)

## Variables

### puristaVersion

• `Const` **puristaVersion**: ``"1.9.0"``

#### Defined in

[azure-secret-store/src/version.ts:1](https://github.com/sebastianwessel/purista/blob/master/packages/azure-secret-store/src/version.ts#L1)
