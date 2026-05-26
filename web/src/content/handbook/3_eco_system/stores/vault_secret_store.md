---
title: HashiCorp Vault
description: Store secrets in HashiCorp Vault — self-hosted, multi-cloud, with dynamic secrets and fine-grained policies.
order: 302240
---

# HashiCorp Vault

`@purista/vault-secret-store` connects to [HashiCorp Vault](https://www.vaultproject.io/). Vault is the go-to choice for self-hosted, multi-cloud, or hybrid deployments — it supports dynamic secrets, fine-grained access policies, secret leasing and renewal, and a wide range of auth methods.

## Capabilities

| Feature | Support |
|---|---|
| Read (`getSecret`) | ✅ |
| Write (`setSecret`) | ✅ (opt-in) |
| Delete (`removeSecret`) | ✅ (opt-in) |
| Dynamic secrets | ✅ (Vault-native) |
| Secret leasing / renewal | ✅ (Vault-native) |
| Multi-cloud / self-hosted | ✅ |
| Multiple auth methods | ✅ (token, AppRole, Kubernetes, etc.) |
| Audit logging | ✅ |

## Install

```bash
npm install @purista/vault-secret-store
```

## Setup

```typescript
import { VaultSecretStore } from '@purista/vault-secret-store'

const secretStore = new VaultSecretStore({
  endpoint: process.env.VAULT_ADDR ?? 'http://localhost:8200',
  token: process.env.VAULT_TOKEN ?? 'root',
  // Optional: KV v2 mount path (default: 'secret')
  // mount: 'secret',
  enableSet: true,
  enableRemove: true,
})

const myService = await myV1Service.getInstance(eventBridge, { secretStore })
```

For production, prefer AppRole or Kubernetes auth over static tokens:

```typescript
// Example: authenticate via AppRole before creating the store
import Vault from 'node-vault'

const vaultClient = Vault({ endpoint: process.env.VAULT_ADDR })
const { auth } = await vaultClient.approleLogin({
  role_id: process.env.VAULT_ROLE_ID,
  secret_id: process.env.VAULT_SECRET_ID,
})

const secretStore = new VaultSecretStore({
  endpoint: process.env.VAULT_ADDR,
  token: auth.client_token,
})
```

## Usage inside a handler

```typescript
.setCommandFunction(async function (context, payload) {
  const { dbPassword } = await context.secrets.getSecret('dbPassword')
  // use dbPassword to connect to your database
})
```

## Vault policy

Minimum policy for read-only access to a path:

```hcl
path "secret/data/myapp/*" {
  capabilities = ["read"]
}
```

Add `"create"`, `"update"`, and `"delete"` capabilities only where writes are needed.

## Operational tips

- Use Vault's Kubernetes auth method in Kubernetes clusters — services authenticate with their service account token, no static secrets required
- Enable audit logging to a file or syslog for compliance
- Use dynamic database secrets where possible — Vault generates short-lived credentials on demand instead of storing long-lived passwords
- Set up Vault HA (Raft or Consul backend) for production; a single-node dev Vault loses all data on restart

## Related

- [Secret Store overview](../stores.md)
- [Default Secret Store](./default_secret_store.md)
- [Infisical](./infisical_secret_store.md)
- [AWS Secrets Manager](./aws_secret_store.md)
