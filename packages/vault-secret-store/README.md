# @purista/vault-secret-store

A secret store for using [HashiCorp Vault](https://www.vaultproject.io/) as storage.

```typescript
const config = {
  endpoint: 'http://localhost:8200',
  token: 'root',
}

const store = new VaultSecretStore(config)

await store.setSecret('mySecret', 'value')

let value = await store.getSecret('mySecret')
console.log(value) // outputs: { mySecret: 'value' }

await store.removeSecret('mySecret')

value = await store.getSecret('mySecret')
console.log(value) // outputs: undefined
```

**Visit [purista.dev](https://purista.dev)**

**Follow on Twitter [@purista_js](https://twitter.com/purista_js)**
**Join the [Discord Chat](https://discord.gg/9feaUm3H2v)**
