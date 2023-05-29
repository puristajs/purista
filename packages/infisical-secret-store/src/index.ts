/**
A secret store for using [Infisical](https://infisical.com/) as storage.  

@example ```typescript
const config = {
  url: 'redis://alice:foobared@awesome.redis.server:6380'
}

const store = new InfisicalSecretStore({ config })

await store.setSecret('mySecret', 'value')

let value = await store.getSecret('mySecret')
console.log(value) // outputs: { mySecret: 'value' }

await store.removeSecret('mySecret')

value = await store.getSecret('mySecret')
console.log(value) // outputs: undefined

```
@module
*/
export * from './InfisicalClient'
export * from './InfisicalSecretStore.impl'
export * from './types'
