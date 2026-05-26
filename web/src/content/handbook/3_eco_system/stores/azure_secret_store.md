---
title: Azure Key Vault
description: Store secrets in Azure Key Vault — managed identity support, versioned, integrated with Azure RBAC.
order: 302220
---

# Azure Key Vault

`@purista/azure-secret-store` connects to [Azure Key Vault](https://azure.microsoft.com/products/key-vault/). It is the natural choice for Azure-hosted workloads — secrets are versioned, access is controlled with Azure RBAC and managed identities, and operations are logged to Azure Monitor.

## Capabilities

| Feature | Support |
|---|---|
| Read (`getSecret`) | ✅ |
| Write (`setSecret`) | ✅ (opt-in) |
| Delete (`removeSecret`) | ✅ (opt-in, soft-delete) |
| Managed identity auth | ✅ |
| Secret versioning | ✅ |
| Azure Monitor audit logs | ✅ |
| Azure RBAC | ✅ |

## Install

```bash
npm install @purista/azure-secret-store
```

## Setup

```typescript
import { AzureSecretStore } from '@purista/azure-secret-store'

const secretStore = new AzureSecretStore({
  vaultUrl: process.env.AZURE_VAULT_URL ?? 'https://my-vault.vault.azure.net',
  // Uses DefaultAzureCredential — works with managed identity, env vars, CLI login:
  enableSet: true,
  enableRemove: true,
})

const myService = await myV1Service.getInstance(eventBridge, { secretStore })
```

The store uses `@azure/identity`'s `DefaultAzureCredential` — it automatically picks up managed identity in AKS/App Service, environment variables (`AZURE_CLIENT_ID`, `AZURE_TENANT_ID`, `AZURE_CLIENT_SECRET`), or Azure CLI credentials in development.

## Usage inside a handler

```typescript
.setCommandFunction(async function (context, payload) {
  const { dbConnectionString } = await context.secrets.getSecret('dbConnectionString')
  // use dbConnectionString to connect to your database
})
```

## Access policy

Assign the `Key Vault Secrets User` role for read-only access, or `Key Vault Secrets Officer` for read/write. Use managed identities instead of service principal credentials wherever possible.

## Operational tips

- Enable Key Vault soft-delete and purge protection to prevent accidental permanent deletion
- Use separate Key Vaults per environment (dev/staging/prod) scoped with distinct RBAC assignments
- Monitor access logs in Azure Monitor — set alerts on unexpected access patterns
- Key Vault has [service limits](https://learn.microsoft.com/en-us/azure/key-vault/general/service-limits); use caching at the application layer for high-throughput reads

## Related

- [Secret Store overview](../stores.md)
- [Default Secret Store](./default_secret_store.md)
- [AWS Secrets Manager](./aws_secret_store.md)
- [HashiCorp Vault](./vault_secret_store.md)
