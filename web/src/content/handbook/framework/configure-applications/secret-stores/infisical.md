---
title: Store secrets in Infisical
description: Enable the legacy Infisical service-token adapter only after confirming the project still supports its client-side encryption API.
order: 526
---

```bash title="Install @purista/infisical-secret-store"
npm install @purista/infisical-secret-store
```

The current adapter requires a **legacy Infisical Service Token** in
`<id>.<secret>` form. It does not implement current Machine Identity or
Universal Auth access tokens. The client calls `/api/v2/service-token`, derives
the token secret from the segment after the last dot, decrypts the project key
locally, and uses the client-side-encryption `/api/v3/secrets` flow. Confirm
that the target Infisical project still supports Service Tokens before adopting
this adapter, and inject the token through the deployment secret boundary.

```ts title="src/index.ts"
import { InfisicalSecretStore } from '@purista/infisical-secret-store'

const bearerToken = process.env.INFISICAL_TOKEN
if (!bearerToken) throw new Error('INFISICAL_TOKEN is required')

const secretStore = new InfisicalSecretStore({
  bearerToken,
  baseUrl: 'https://app.infisical.com',
})
```

Use the instance when the service is composed; this is the step that replaces
the core default for this service:

```ts title="src/index.ts"
const service = await incidentV1Service.getInstance(eventBridge, { secretStore })
```

| Call | Parameters, defaults, and intent | Runtime boundary |
| --- | --- | --- |
| [`new InfisicalSecretStore(options)`](/handbook/api/classes/_purista_infisical-secret-store.InfisicalSecretStore/) | `bearerToken` must be a legacy Infisical Service Token, not a Machine Identity token; `baseUrl` selects the Infisical endpoint. The adapter enables cache by default; use `enableCache: false` or a millisecond `cacheTtl` to constrain in-process reuse. | The token and locally decrypted project key are bootstrap secrets. Provider errors reject the lookup rather than returning an empty token. |
| [`serviceBuilder.getInstance(eventBridge, { secretStore })`](/handbook/api/classes/_purista_core.ServiceBuilder/#getinstance) | Binds the adapter to this service instance. | Only this binding makes it available to `context.secrets`; construction alone changes nothing. |

### Mutation semantics

Mutation requires the inherited `enableSet: true` or `enableRemove: true`
flags. `setSecret(...)` encrypts the value locally, attempts an update in the
legacy service token's first environment scope, and creates the secret only
when that update returns not found. `removeSecret(...)` deletes the shared
secret from that same environment. The adapter exposes no recovery or
version-selection policy. Keep request-serving processes read-only and verify
legacy API support, environment scope, and rollback in a separate
administrative workflow before enabling mutation.

Verify that the legacy token can read only its target environment and that audit
logs identify the workload. Treat unsupported Service Tokens, unavailable
Infisical connectivity, or invalid authentication as a startup/secret-resolution
failure and alert it; do not continue with an empty secret value.

Next: [secret-store selection](/handbook/framework/configure-applications/secret-stores/).
