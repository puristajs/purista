[**PURISTA API**](../../README.md)

***

[PURISTA API](../../packages.md) / @purista/infisical-secret-store

# @purista/infisical-secret-store

A secret store for using [Infisical](https://infisical.com/) as storage.  

For local docker setup, the `docker-compose.yml` reads the root `.env` file (`../../.env`).  

```typescript
const config = {
  token: 'YOUR_INFISICAL_TOKEN',
  baseUrl: 'http://example.com'
}

const store = new InfisicalSecretStore(config)

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

A secret store for using [Infisical](https://infisical.com/) as storage.  

For performance reasons, and to reduce costs, the secret values are cached in memory after first fetch.

You can disable the whole caching via config by setting enableCache to false.  
If the cache is enabled, you can set the ttl for cached secret values via config cacheTtl (in ms).  

This will return the cached secret if available and if ttl is not exceeded.  
If a secret value exceeds the ttl, it does not automatically get removed from cache.  
It will be removed/overwritten on next get request.

## Example

```typescript
const config = {
  bearerToken: 'YOUR_INFISICAL_TOKEN',
  baseUrl: 'https://app.infisical.com'
}

const store = new InfisicalSecretStore({ config })

await store.setSecret('mySecret', 'value')

let value = await store.getSecret('mySecret')
console.log(value) // outputs: { mySecret: 'value' }

await store.removeSecret('mySecret')

value = await store.getSecret('mySecret')
console.log(value) // outputs: undefined

```

## Classes

- [InfisicalClient](classes/InfisicalClient.md)
- [InfisicalSecretStore](classes/InfisicalSecretStore.md)

## Type Aliases

- [ClientConfig](type-aliases/ClientConfig.md)
- [DecryptInput](type-aliases/DecryptInput.md)
- [EncryptInput](type-aliases/EncryptInput.md)
- [HttpClientConfigCustom](type-aliases/HttpClientConfigCustom.md)
- [InfisicalSecretConfig](type-aliases/InfisicalSecretConfig.md)
- [Scope](type-aliases/Scope.md)
- [Secret](type-aliases/Secret.md)
- [TokenData](type-aliases/TokenData.md)

## Variables

- [puristaVersion](variables/puristaVersion.md)
