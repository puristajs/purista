# @purista/azure-secret-store API Patterns

<!-- Generated from current TypeDoc; do not edit manually. -->
<!-- typedoc-digest: 33dfc6c4700fa85e -->

Use this reference only when working with `@purista/azure-secret-store`. Every API name, callable pattern, and example below is extracted from the current public TypeDoc output. Do not invent a method that is absent here; consult the complete `../generated-api-manifest.json` and the public handbook when the API is not listed.

## Contents

- [AzureSecretStore](#azuresecretstore)

## AzureSecretStore

**class.** Secret store backed by Azure Key Vault. Source: `azure-secret-store/src/AzureSecretStore.impl.ts:39`.

**Verified example**

```typescript
const store = new AzureSecretStore({
  vaultUrl: 'https://example-vault.vault.azure.net',
  cacheTtl: 30_000,
})

await store.setSecret('acme-prod-payments-api-token', 'placeholder-secret')
const secret = await store.getSecret('acme-prod-payments-api-token')
```

**Public callable patterns**

- `destroy()` — Shutdown hook for store adapters.
- `getSecret(...secretNames)` — Get one or more secrets by name.
- `removeSecret(secretName)` — Remove one secret by name.
- `setSecret(secretName, secretValue)` — Store or replace one secret value.

