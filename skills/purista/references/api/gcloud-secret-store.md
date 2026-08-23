# @purista/gcloud-secret-store API Patterns

<!-- Generated from current TypeDoc; do not edit manually. -->
<!-- typedoc-digest: 33dfc6c4700fa85e -->

Use this reference only when working with `@purista/gcloud-secret-store`. Every API name, callable pattern, and example below is extracted from the current public TypeDoc output. Do not invent a method that is absent here; consult the complete `../generated-api-manifest.json` and the public handbook when the API is not listed.

## Contents

- [GoogleSecretStore](#googlesecretstore)

## GoogleSecretStore

**class.** Secret store backed by Google Secret Manager. Source: `gcloud-secret-store/src/GoogleSecretStore.impl.ts:41`.

**Verified example**

```typescript
const store = new GoogleSecretStore({
  project: 'projects/example-project',
  cacheTtl: 30_000,
})

await store.setSecret('acme-prod-payments-api-token', 'placeholder-secret')
const secret = await store.getSecret('acme-prod-payments-api-token')
```

**Public callable patterns**

- `destroy()` — Shutdown hook for store adapters.
- `getSecret(...secretNames)` — Get one or more secrets by name.
- `removeSecret(secretName)` — Remove one secret by name.
- `removeSecretImpl(secretName)` — Removes a secret resource from Google Secret Manager.
- `setSecret(secretName, secretValue)` — Store or replace one secret value.
- `setSecretImpl(secretName, secretValue)` — Adds a new secret version, creating the secret resource first when needed.

