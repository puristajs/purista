# @purista/infisical-secret-store API Patterns

<!-- Generated from current TypeDoc; do not edit manually. -->
<!-- typedoc-digest: 527f17db6c2c34eb -->

Use this reference only when working with `@purista/infisical-secret-store`. Every API name, callable pattern, and example below is extracted from the current public TypeDoc output. Do not invent a method that is absent here; consult the complete `../generated-api-manifest.json` and the public handbook when the API is not listed.

## Contents

- [InfisicalClient](#infisicalclient)
- [InfisicalSecretStore](#infisicalsecretstore)

## InfisicalClient

**class.** HTTP client for the Infisical API used by `InfisicalSecretStore`. Source: `infisical-secret-store/src/InfisicalClient/InfisicalClient.impl.ts:30`.

**Verified example**

```ts
// Prefer InfisicalSecretStore in an application. Keep the service token in a
// bootstrap secret source and never log this configuration.
const client = new InfisicalClient({
  baseUrl: 'https://app.infisical.com',
  bearerToken: process.env.INFISICAL_SERVICE_TOKEN!,
})
```

**Public callable patterns**

- `delete(path, options?, payload?)` — DELETE request.
- `get(path, options?)` — GET request.
- `getSecret(name)` — Reads and decrypts a single shared Infisical secret.
- `getServiceTokenData()` — Fetches service-token metadata and decrypts the project key for later calls.
- `getTracer()` — Returns OpenTelemetry tracer of this client.
- `patch(path, payload, options?)` — PATCH request with an optional JSON payload.
- `post(path, payload, options?)` — POST request with an optional JSON payload.
- `put(path, payload, options?)` — PUT request with an optional JSON payload.
- `removeSecret(name)` — Removes a shared Infisical secret from the token's first environment scope.
- `setBearerToken(token)` — Set the bearer token for all following requests.
- `setSecret(name, value)` — Creates or updates a shared Infisical secret.
- `startActiveSpan(name, opts, context, fn)` — Start a child span for OpenTelemetry tracking.

## InfisicalSecretStore

**class.** Secret store backed by Infisical. Source: `infisical-secret-store/src/InfisicalSecretStore.impl.ts:33`.

**Verified example**

```typescript
const store = new InfisicalSecretStore({
  bearerToken: process.env.INFISICAL_TOKEN ?? '',
  baseUrl: 'https://app.infisical.com',
  cacheTtl: 30_000,
})

await store.setSecret('ACME_PROD_PAYMENTS_API_TOKEN', 'placeholder-secret')
const secret = await store.getSecret('ACME_PROD_PAYMENTS_API_TOKEN')
```

**Public callable patterns**

- `destroy()` — Shutdown hook for store adapters.
- `getSecret(...secretNames)` — Get one or more secrets by name.
- `removeSecret(secretName)` — Remove one secret by name.
- `setSecret(secretName, secretValue)` — Store or replace one secret value.

