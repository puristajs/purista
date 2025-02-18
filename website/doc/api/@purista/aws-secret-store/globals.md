[**@purista/aws-secret-store v1.11.0**](README.md)

***

[PURISTA API](../../packages.md) / @purista/aws-secret-store

# @purista/aws-secret-store

The secret store adapter for AWS Secret Manager.
It will store, retrive, update or remove secrets in AWS Secret Manager.

For performance reasons, and to reduce costs, the secret values are cached in memory after first fetch.

You can disable the whole caching via config by setting enableCache to false.
If the cache is enabled, you can set the ttl for cached secret values via config cacheTtl (in ms).

This will return the cached secret if available and if ttl is not exceeded.
If a secret value exceeds the ttl, it does not automatically get removed from cache.
It will be removed/overwritten on next get request.

## Example

```typescript
const config = {
  region: 'us-east-1'
}

const store = new AWSSecretStore({ config })

await store.setSecret('mySecret', 'value')

let value = await store.getSecret('mySecret')
console.log(value) // outputs: { mySecret: 'value' }

await store.removeSecret('mySecret')

value = await store.getSecret('mySecret')
console.log(value) // outputs: undefined

```

## Classes

- [AWSSecretStore](classes/AWSSecretStore.md)

## Type Aliases

- [AWSSecretStoreConfig](type-aliases/AWSSecretStoreConfig.md)

## Variables

- [puristaVersion](variables/puristaVersion.md)
