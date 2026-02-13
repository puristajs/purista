[**PURISTA API**](../../README.md)

***

[PURISTA API](../../packages.md) / @purista/vault-secret-store

# @purista/vault-secret-store

A secret store for using [HashiCorp Vault](https://www.vaultproject.io/) as storage.

```typescript
const config = {
  endpoint: 'http://localhost:8200',
  token: 'root',
}

const store = new VaultSecretStore(config)

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

The secret store adapter for HashiCorp Vault.
It will store, retrieve, update or remove secrets in HashiCorp Vault.

For performance reasons, and to reduce costs, the secret values are cached in memory after first fetch.

You can disable the whole caching via config by setting enableCache to false.
If the cache is enabled, you can set the ttl for cached secret values via config cacheTtl (in ms).

This will return the cached secret if available and if ttl is not exceeded.
If a secret value exceeds the ttl, it does not automatically get removed from cache.
It will be removed/overwritten on next get request.

## Example

```typescript
const config = {
  endpoint: 'http://localhost:8200',
  token: 'root'
}

const store = new VaultSecretStore(config)

await store.setSecret('mySecret', 'value')

let value = await store.getSecret('mySecret')
console.log(value) // outputs: { mySecret: 'value' }

await store.removeSecret('mySecret')

value = await store.getSecret('mySecret')
console.log(value) // outputs: undefined
```

## Classes

- [VaultSecretStore](classes/VaultSecretStore.md)

## Type Aliases

- [VaultSecretStoreConfig](type-aliases/VaultSecretStoreConfig.md)

## Variables

- [puristaVersion](variables/puristaVersion.md)
