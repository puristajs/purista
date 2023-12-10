/**
A config store for using NATS (with JetStream) as storage.
JetStream must be enabled at the NATS broker.

@example ```typescript
const config = {
  port: 8222
}

const store = new NatsConfigStore(config)

await store.setConfig('configKey',{ myConfig: 'value' })

let value = await store.getConfig('configKey')
console.log(value) // outputs: { configKey: { myConfig: 'value' } }

await store.removeConfig('configKey')

value = await store.getConfig('configKey')
console.log(value) // outputs: undefined
```
@module
 */
export * from './NatsConfigStore.impl.js'
export * from './types/index.js'
export * from './version.js'
