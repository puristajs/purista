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

**Follow on Twitter [@purista_js](https://twitter.com/purista_js)**  
**Join the [Discord Chat](https://discord.gg/9feaUm3H2v)**

<a href="https://www.producthunt.com/posts/purista?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-purista" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=386519&theme=light" alt="PURISTA - Typescript&#0032;framework&#0032;for&#0032;IoT&#0044;&#0032;microservices&#0044;&#0032;and&#0032;serverless | Product Hunt" style="width: 250px; height: 54px;" width="250" height="54" /></a>
