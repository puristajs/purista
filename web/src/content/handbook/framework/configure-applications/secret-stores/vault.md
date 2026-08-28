---
title: Store secrets in HashiCorp Vault
description: Enable a Vault KV v2 backend with short-lived runtime credentials and a narrow policy.
order: 525
---

```bash title="Install @purista/vault-secret-store"
npm install @purista/vault-secret-store
```

`VaultSecretStore` requires a Vault endpoint and token, with `secret` as the default KV v2 mount. Resolve the token from the runtime identity or an injected secret, never from source-controlled configuration.

```ts title="src/index.ts"
import { VaultSecretStore } from '@purista/vault-secret-store'

const endpoint = process.env.VAULT_ADDR
const token = process.env.VAULT_TOKEN
if (!endpoint || !token) throw new Error('VAULT_ADDR and VAULT_TOKEN are required')

const secretStore = new VaultSecretStore({
  endpoint,
  token,
  mount: 'secret',
})
```

Wire the store into service creation rather than leaving the core default in
place:

```ts title="src/index.ts"
const service = await incidentV1Service.getInstance(eventBridge, { secretStore })
```

| Call | Parameters, defaults, and intent | Runtime boundary |
| --- | --- | --- |
| [`new VaultSecretStore(options)`](/handbook/api/classes/_purista_vault-secret-store.VaultSecretStore/) | `endpoint` and `token` are required. `mount` defaults to `secret`; leading/trailing slashes are normalized. Secret caching defaults on; disable it or set a millisecond `cacheTtl` when rotation/revocation needs a shorter reuse period. | The adapter reads KV v2 at `{mount}/data/{name}` and stores a `value` field. A missing secret is `undefined`; other Vault failures reject the lookup. |
| [`serviceBuilder.getInstance(eventBridge, { secretStore })`](/handbook/api/classes/_purista_core.ServiceBuilder/#getinstance) | Replaces the local Core secret store for this service. | The supplied token/policy remains the effective authorization boundary. |

Use short-lived tokens and a policy limited to the application's paths. Verify TLS, mount version, token renewal behavior, and denied-path handling before production. An expired token must fail visibly so operators can renew identity; do not fall back to a local secret map.

Next: [chapter overview](/handbook/framework/configure-applications/secret-stores/).
