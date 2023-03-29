[PURISTA API - v1.4.9](../README.md) / [Modules](../modules.md) / @purista/redis-state-store

# Module: @purista/redis-state-store

A state store for using redis as storage.
State values are stored as stringified JSON.

Per default, setting/changing and removal of values are enabled.

**`Example`**

```typescript
const config = {
 enableGet: true, // optional, default is true
 enableRemove: true, // optional, default is true
 enableSet: true, // optional, default is true
 url: 'redis://alice:foobared@awesome.redis.server:6379'
}

const store = new RedisStateStore({ config })

await store.setState('stateKey',{ myState: 'value' })

let value = await store.getState('stateKey')
console.log(value) // outputs: { myState: 'value' }

await store.removeState('stateKey')

value = await store.getState('stateKey')
console.log(value) // outputs: undefined
```

See documentation of underlaying redis lib package for detailed configuration options.

**`See`**

[NODE-REDIS](https://redis.js.org)

## Table of contents

### Namespaces

- [internal](purista_redis_state_store.internal.md)

### Classes

- [RedisStateStore](../classes/purista_redis_state_store.RedisStateStore.md)
