/**
A state store for using NATS (with JetStream) as storage.  

@example 
```typescript
const config = {
  port: 8222
}

const store = new NatsStateStore(config)

await store.setState('stateKey',{ myState: 'value' })

let value = await store.getState('stateKey')
console.log(value) // outputs: { stateKey: { myState: 'value' } }

await store.removeState('stateKey')

value = await store.getState('stateKey')
console.log(value) // outputs: undefined

```
@module
 */
export * from './NatsStateStore.impl.js'
export * from './types/index.js'
export * from './version.js'
