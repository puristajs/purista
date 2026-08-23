# @purista/aws-secret-store API Patterns

<!-- Generated from current TypeDoc; do not edit manually. -->
<!-- typedoc-digest: 33dfc6c4700fa85e -->

Use this reference only when working with `@purista/aws-secret-store`. Every API name, callable pattern, and example below is extracted from the current public TypeDoc output. Do not invent a method that is absent here; consult the complete `../generated-api-manifest.json` and the public handbook when the API is not listed.

## Contents

- [AWSSecretStore](#awssecretstore)

## AWSSecretStore

**class.** Secret store backed by AWS Secrets Manager. Source: `aws-secret-store/src/AWSSecretStore.impl.ts:45`.

**Verified example**

```typescript
const store = new AWSSecretStore({
  client: { region: 'eu-central-1' },
  cacheTtl: 30_000,
})

await store.setSecret('tenants/acme/prod/payments/api-token', 'placeholder-secret')
const secret = await store.getSecret('tenants/acme/prod/payments/api-token')
```

**Public callable patterns**

- `destroy()` — Shutdown hook for store adapters.
- `getSecret(...secretNames)` — Get one or more secrets by name.
- `removeSecret(secretName)` — Remove one secret by name.
- `setSecret(secretName, secretValue)` — Store or replace one secret value.

