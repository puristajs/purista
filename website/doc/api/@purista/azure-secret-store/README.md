[**PURISTA API**](../../README.md)

***

[PURISTA API](../../packages.md) / @purista/azure-secret-store

# @purista/aws-secret-store

A secret store for using [Azure Key Vault](https://azure.microsoft.com/products/key-vault/) as storage.  

```typescript
const config = {
  vaultUrl: 'https://[KEY_VAULT_NAME].vault.azure.net'
}

const store = new AzureSecretStore(config)

await store.setSecret('mySecret', 'value')

let value = await store.getSecret('mySecret')
console.log(value) // outputs: { mySecret: 'value' }

await store.removeSecret('mySecret')

value = await store.getSecret('mySecret')
console.log(value) // outputs: undefined

```

**Visit [purista.dev](https://purista.dev)**

**Follow on Twitter [@purista_js](https://twitter.com/purista_js)**  
**Join the [Discord Chat](https://discord.gg/9feaUm3H2v)**

<a href="https://www.producthunt.com/posts/purista?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-purista" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=386519&theme=light" alt="PURISTA - Typescript&#0032;framework&#0032;for&#0032;IoT&#0044;&#0032;microservices&#0044;&#0032;and&#0032;serverless | Product Hunt" style="width: 250px; height: 54px;" width="250" height="54" /></a>

The secret store adapter for Azure Key Vault.
It will store, retrive, update or remove secrets in Azure Key Vault.

For performance reasons, and to reduce costs, the secret values are cached in memory after first fetch.

You can disable the whole caching via config by setting enableCache to false.
If the cache is enabled, you can set the ttl for cached secret values via config cacheTtl (in ms).

This will return the cached secret if available and if ttl is not exceeded.
If a secret value exceeds the ttl, it does not automatically get removed from cache.
It will be removed/overwritten on next get request.

## Example

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

## Classes

- [AzureSecretStore](classes/AzureSecretStore.md)

## Type Aliases

- [AzureSecretStoreConfig](type-aliases/AzureSecretStoreConfig.md)

## Variables

- [puristaVersion](variables/puristaVersion.md)
