[**@purista/redis-config-store v2.0.0**](README.md)

***

[PURISTA API](../../packages.md) / @purista/redis-config-store

# @purista/redis-config-store

A state store for using redis as storage.
Config values are stored as stringified JSON.

Per default, setting/changing and removal of values are enabled.

## Example

```typescript
const config = {
 enableGet: true, // optional, default is true
 enableRemove: true, // optional, default is true
 enableSet: true, // optional, default is true
 url: 'redis://alice:foobared@awesome.redis.server:6379'
}

const store = new RedisConfigStore(config)

await store.setConfig('stateKey',{ myConfig: 'value' })

let value = await store.getConfig('stateKey')
console.log(value) // outputs: { myConfig: 'value' }

await store.removeConfig('stateKey')

value = await store.getConfig('stateKey')
console.log(value) // outputs: undefined
```

See documentation of underlaying redis lib package for detailed configuration options.

## See

[NODE-REDIS](https://redis.js.org)

## Classes

- [RedisConfigStore](classes/RedisConfigStore.md)

## Type Aliases

- [RedisStoreConfig](type-aliases/RedisStoreConfig.md)

## Variables

- [puristaVersion](variables/puristaVersion.md)
