[**PURISTA API**](../../README.md)

***

[PURISTA API](../../packages.md) / @purista/gcloud-secret-store

# @purista/gcloud-secret-store

A secret store for using [Google Cloud Secret Manager](https://cloud.google.com/secret-manager) as storage.  

```typescript
const config = {
  projectId: 'project/MY_GOOGLE_PROJECT_ID'
}

const store = new GoogleSecretStore({ config })

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

The secret store adapter for Google Secret Manager.
It will store, retrive, update or remove secrets in Google Secret Manager.

For performance reasons, and to reduce costs, the secret values are cached in memory after first fetch.

You can disable the whole caching via config by setting enableCache to false.
If the cache is enabled, you can set the ttl for cached secret values via config cacheTtl (in ms).

This will return the cached secret if available and if ttl is not exceeded.
If a secret value exceeds the ttl, it does not automatically get removed from cache.
It will be removed/overwritten on next get request.

## Example

```typescript
const config = {
  projectId: 'project/MY_GOOGLE_PROJECT_ID'
}

const store = new GoogleSecretStore({ config })

await store.setSecret('mySecret', 'value')

let value = await store.getSecret('mySecret')
console.log(value) // outputs: { mySecret: 'value' }

await store.removeSecret('mySecret')

value = await store.getSecret('mySecret')
console.log(value) // outputs: undefined

```

## Classes

- [GoogleSecretStore](classes/GoogleSecretStore.md)

## Type Aliases

- [GoogleSecretStoreConfig](type-aliases/GoogleSecretStoreConfig.md)

## Variables

- [puristaVersion](variables/puristaVersion.md)
