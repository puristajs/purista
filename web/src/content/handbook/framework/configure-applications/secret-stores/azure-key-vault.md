---
title: Store secrets in Azure Key Vault
description: Enable Azure Key Vault through DefaultAzureCredential and a production HTTPS vault endpoint.
order: 523
---

```bash title="Install @purista/azure-secret-store"
npm install @purista/azure-secret-store
```

`AzureSecretStore` authenticates with `DefaultAzureCredential`; use managed identity or workload identity in production. Pass the vault's HTTPS URL and leave insecure connections disabled.

```ts title="src/index.ts"
import { AzureSecretStore } from '@purista/azure-secret-store'

const vaultUrl = process.env.AZURE_KEY_VAULT_URL
if (!vaultUrl) throw new Error('AZURE_KEY_VAULT_URL is required')

const secretStore = new AzureSecretStore({
  vaultUrl,
})
```

Pass the configured store to service creation to enable it for handler lookups:

```ts title="src/index.ts"
const service = await incidentV1Service.getInstance(eventBridge, { secretStore })
```

| Call | Parameters, defaults, and intent | Runtime boundary |
| --- | --- | --- |
| [`new AzureSecretStore(options)`](/handbook/api/classes/_purista_azure-secret-store.AzureSecretStore/) | `vaultUrl` is required. `allowInsecureConnection` defaults to false; use it only for a local emulator. `options` passes additional Azure `SecretClient` settings. The adapter enables secret caching by default; `cacheTtl` bounds reuse in milliseconds. | Authentication always uses `DefaultAzureCredential`; constructor configuration cannot inject a different credential object. Missing secrets return `undefined`; access and network failures reject the lookup. |
| [`serviceBuilder.getInstance(eventBridge, { secretStore })`](/handbook/api/classes/_purista_core.ServiceBuilder/#getinstance) | Wires Key Vault for this service. | The process's Azure identity, Key Vault policy, and network path determine what handlers can resolve. |

### Mutation semantics

Writes and removals remain disabled until `enableSet: true` or
`enableRemove: true` is supplied. `setSecret(...)` delegates to Key Vault's
set operation and creates a new secret version as the provider defines it.
`removeSecret(...)` starts Key Vault deletion with `beginDeleteSecret(...)`;
the adapter does not wait for purge, recovery, or retention completion. Prefer
platform-owned rotation and deletion workflows so recovery policy and audit
approval remain visible outside the request path.

Grant the workload only the secret operations it requires. `allowInsecureConnection` is for local emulators and must not be enabled in production. Verify identity and Key Vault access using a non-sensitive test secret; do not work around authorization failures by adding a client secret to application code.

Next: [chapter overview](/handbook/framework/configure-applications/secret-stores/).
