---
title: Dapr Secret Store
description: Access any Dapr-supported secret backend — AWS, Azure, GCP, Vault, Kubernetes secrets — via the Dapr sidecar.
order: 302260
---

# Dapr Secret Store

When running with the [Dapr](https://dapr.io) sidecar, `@purista/dapr-sdk` routes secret store operations through Dapr's secret management API. The backing secret store — Kubernetes secrets, HashiCorp Vault, AWS Secrets Manager, Azure Key Vault, GCP Secret Manager — is configured as a Dapr component, completely decoupled from your PURISTA code.

## Capabilities

| Feature | Support |
|---|---|
| Read (`getSecret`) | ✅ |
| Write (`setSecret`) | ✅ (opt-in) |
| Delete (`removeSecret`) | ✅ (opt-in) |
| Backing store | Any Dapr secret component |
| Infrastructure portability | ✅ (swap component, not code) |

## Install

```bash
npm install @purista/dapr-sdk
```

## Setup

Secret store access is configured on the `DaprEventBridge` alongside the event bridge — no separate constructor needed.

```typescript
import { DaprEventBridge } from '@purista/dapr-sdk'

const eventBridge = new DaprEventBridge({
  daprApiToken: process.env.DAPR_API_TOKEN,
  secretStoreName: 'my-secret-store',
  configStoreName: 'my-config-store',
  stateStoreName: 'my-state-store',
})

const myService = await myV1Service.getInstance(eventBridge)
```

## Dapr component definition

Example using Kubernetes secrets as the backing store:

```yaml
# components/secret-store.yaml
apiVersion: dapr.io/v1alpha1
kind: Component
metadata:
  name: my-secret-store
spec:
  type: secretstores.kubernetes
  version: v1
```

Swap `spec.type` to `secretstores.hashicorp.vault`, `secretstores.aws.secretsmanager`, `secretstores.azure.keyvault`, etc. without any PURISTA code change.

## Usage inside a handler

```typescript
.setCommandFunction(async function (context, payload) {
  const { dbPassword } = await context.secrets.getSecret('dbPassword')
  // use dbPassword to connect to your database
})
```

## Operational tips

- Use [Dapr secret store scopes](https://docs.dapr.io/operations/components/component-scopes/) to restrict which services can access which secrets
- In Kubernetes, Dapr's Kubernetes secret store accesses native Kubernetes secrets — combine with external-secrets-operator for GitOps-driven secret management
- Dapr handles connection retries to the sidecar automatically; implement graceful startup to handle the case where the sidecar is not yet ready

## Related

- [Secret Store overview](../stores.md)
- [Dapr Event Bridge](../eventbridges/dapr.md)
- [Dapr Config Store](./dapr_config_store.md)
- [Dapr State Store](./dapr_state_store.md)
- [Default Secret Store](./default_secret_store.md)
