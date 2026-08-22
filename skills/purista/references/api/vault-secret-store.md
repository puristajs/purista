# @purista/vault-secret-store API Patterns

<!-- Generated from current TypeDoc; do not edit manually. -->
<!-- typedoc-digest: 527f17db6c2c34eb -->

Use this reference only when working with `@purista/vault-secret-store`. Every API name, callable pattern, and example below is extracted from the current public TypeDoc output. Do not invent a method that is absent here; consult the complete `../generated-api-manifest.json` and the public handbook when the API is not listed.

## Contents

- [VaultSecretStore](#vaultsecretstore)

## VaultSecretStore

**class.** Secret store backed by HashiCorp Vault KV v2. Source: `vault-secret-store/src/VaultSecretStore.impl.ts:52`.

**Verified example**

```typescript
const store = new VaultSecretStore({
  endpoint: 'https://vault.example.internal',
  token: process.env.VAULT_TOKEN ?? '',
  mount: 'secret',
})

await store.setSecret('tenants/acme/prod/payments/api-token', 'placeholder-secret')
const secret = await store.getSecret('tenants/acme/prod/payments/api-token')
```

**Public callable patterns**

- `destroy()` — Shutdown hook for store adapters.
- `getSecret(...secretNames)` — Get one or more secrets by name.
- `removeSecret(secretName)` — Remove one secret by name.
- `setSecret(secretName, secretValue)` — Store or replace one secret value.

