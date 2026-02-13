[**PURISTA API**](../../README.md)

***

[PURISTA API](../../packages.md) / @purista/aws-config-store

# @purista/aws-config-store

A config store for using [AWS System Manager](https://aws.amazon.com/systems-manager) as storage.  

```typescript
const config = {
  region: 'us-east-1'
}

const store = new AWSConfigStore(config)

await store.setConfig('myConfig', 'value')

let value = await store.getConfig('myConfig')
console.log(value) // outputs: { myConfig: 'value' }

await store.removeConfig('myConfig')

value = await store.getConfig('myConfig')
console.log(value) // outputs: undefined

```

**Visit [purista.dev](https://purista.dev)**

**Follow on Twitter [@purista_js](https://twitter.com/purista_js)**  
**Join the [Discord Chat](https://discord.gg/9feaUm3H2v)**

<a href="https://www.producthunt.com/posts/purista?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-purista" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=386519&theme=light" alt="PURISTA - Typescript&#0032;framework&#0032;for&#0032;IoT&#0044;&#0032;microservices&#0044;&#0032;and&#0032;serverless | Product Hunt" style="width: 250px; height: 54px;" width="250" height="54" /></a>

The config store adapter for AWS System Manager.
It will store, retrive, update or remove configs in AWS System Manager.

For performance reasons, and to reduce costs, the config values are cached in memory after first fetch.

You can disable the whole caching via config by setting enableCache to false.
If the cache is enabled, you can set the ttl for cached config values via config cacheTtl (in ms).

This will return the cached config if available and if ttl is not exceeded.
If a config value exceeds the ttl, it does not automatically get removed from cache.
It will be removed/overwritten on next get request.

## Example

```typescript
const config = {
  region: 'us-east-1'
}

const store = new AWSConfigStore({ config })

await store.setConfig('myConfig', 'value')

let value = await store.getConfig('myConfig')
console.log(value) // outputs: { myConfig: 'value' }

await store.removeConfig('myConfig')

value = await store.getConfig('myConfig')
console.log(value) // outputs: undefined

```

## Classes

- [AWSConfigStore](classes/AWSConfigStore.md)

## Type Aliases

- [AWSConfigStoreConfig](type-aliases/AWSConfigStoreConfig.md)

## Variables

- [puristaVersion](variables/puristaVersion.md)
