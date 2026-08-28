---
title: Store secrets in Infisical
description: Enable the Infisical secret-store adapter with a scoped machine identity or token.
order: 526
---

```bash title="Install @purista/infisical-secret-store"
npm install @purista/infisical-secret-store
```

Choose Infisical when its project/environment access model is the approved secret boundary. Provision a non-human machine identity or scoped token for the runtime and configure the adapter from environment-injected values, never literals.

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
| [`new InfisicalSecretStore(options)`](/handbook/api/classes/_purista_infisical-secret-store.InfisicalSecretStore/) | `bearerToken` is required by the underlying client; `baseUrl` selects the Infisical endpoint. The adapter enables cache by default; use `enableCache: false` or a millisecond `cacheTtl` to constrain in-process reuse. | The token is a bootstrap credential and must arrive through deployment secret delivery. Provider errors reject the lookup rather than returning an empty token. |
| [`serviceBuilder.getInstance(eventBridge, { secretStore })`](/handbook/api/classes/_purista_core.ServiceBuilder/#getinstance) | Binds the adapter to this service instance. | Only this binding makes it available to `context.secrets`; construction alone changes nothing. |

Verify that the identity can read only its target environment and that audit logs identify the workload. Treat unavailable Infisical connectivity or invalid authentication as a startup/secret-resolution failure and alert it; do not continue with an empty secret value.

Next: [secret-store selection](/handbook/framework/configure-applications/secret-stores/).
