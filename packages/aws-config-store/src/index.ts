/**
The config store adapter for AWS System Manager.
It will store, retrive, update or remove configs in AWS System Manager.

For performance reasons, and to reduce costs, the config values are cached in memory after first fetch.

You can disable the whole caching via config by setting enableCache to false.
If the cache is enabled, you can set the ttl for cached config values via config cacheTtl (in ms).

This will return the cached config if available and if ttl is not exceeded.
If a config value exceeds the ttl, it does not automatically get removed from cache.
It will be removed/overwritten on next get request.

@example ```typescript
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
@module
*/
export * from './AWSConfigStore.impl.js'
export * from './types.js'
export * from './version.js'
