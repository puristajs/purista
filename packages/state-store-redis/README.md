# @purista/redis-state-store

 A state store for using redis as storage.  
 State values are stored as stringified JSON in the redis database.

 By default `get

```typescript
 const config = {
  url: 'redis://alice:foobared@awesome.redis.server:6380'
 }

 const store = new RedisStateStore({ config })

 await store.setState('stateKey',{ myState: 'value' })

 let value = await store.getState('stateKey')
 console.log(value) // outputs: { myState: 'value' }

 await store.removeState('stateKey')

 value = await store.getState('stateKey')
 console.log(value) // outputs: undefined

 ```

 See documentation of underlaying redis lib package for detailed configuration options - [NODE-REDIS](https://redis.js.org).

**Visit [purista.dev](https://purista.dev)**
