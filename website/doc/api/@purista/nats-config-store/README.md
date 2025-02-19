**@purista/nats-config-store v2.0.0**

***

[PURISTA API](../../packages.md) / @purista/nats-config-store

# @purista/nats-config-store

A config store for using NATS (with JetStream) as storage.  
JetStream must be enabled at the NATS broker.

```typescript
const config = {
  port: 8222
}

const store = new NatsConfigStore( config )

await store.setConfig('configKey',{ myConfig: 'value' })

let value = await store.getConfig('configKey')
console.log(value) // outputs: { configKey: { myConfig: 'value' } }

await store.removeConfig('configKey')

value = await store.getConfig('configKey')
console.log(value) // outputs: undefined

```

 See documentation of underlaying redis lib package for detailed configuration options - [NODE-REDIS](https://redis.js.org).

**Visit [purista.dev](https://purista.dev)**

**Follow on Twitter [@purista_js](https://twitter.com/purista_js)**  
**Join the [Discord Chat](https://discord.gg/9feaUm3H2v)**

<a href="https://www.producthunt.com/posts/purista?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-purista" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=386519&theme=light" alt="PURISTA - Typescript&#0032;framework&#0032;for&#0032;IoT&#0044;&#0032;microservices&#0044;&#0032;and&#0032;serverless | Product Hunt" style="width: 250px; height: 54px;" width="250" height="54" /></a>
