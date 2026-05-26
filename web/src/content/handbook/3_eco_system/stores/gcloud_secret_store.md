---
title: Google Cloud Secret Manager
description: Store secrets in Google Cloud Secret Manager — version-aware, IAM-native, integrated with GCP Workload Identity.
order: 302230
---

# Google Cloud Secret Manager

`@purista/gcloud-secret-store` connects to [Google Cloud Secret Manager](https://cloud.google.com/secret-manager). It is the recommended choice for GCP-hosted services — secrets are versioned, access is controlled with IAM, and operations are logged to Cloud Audit Logs.

## Capabilities

| Feature | Support |
|---|---|
| Read (`getSecret`) | ✅ |
| Write (`setSecret`) | ✅ (opt-in) |
| Delete (`removeSecret`) | ✅ (opt-in) |
| Secret versioning | ✅ |
| Workload Identity (GKE) | ✅ |
| Cloud Audit Logs | ✅ |
| CMEK encryption | ✅ |

## Install

```bash
npm install @purista/gcloud-secret-store
```

## Setup

```typescript
import { GoogleSecretStore } from '@purista/gcloud-secret-store'

const secretStore = new GoogleSecretStore({
  project: process.env.GCP_PROJECT_ID ?? 'projects/my-gcp-project',
  enableSet: true,
  enableRemove: true,
})

const myService = await myV1Service.getInstance(eventBridge, { secretStore })
```

Authentication uses [Application Default Credentials](https://cloud.google.com/docs/authentication/application-default-credentials) — Workload Identity in GKE, service account key files, or `gcloud auth application-default login` in development.

## Usage inside a handler

```typescript
.setCommandFunction(async function (context, payload) {
  const { stripeApiKey } = await context.secrets.getSecret('stripeApiKey')
  // use stripeApiKey to call Stripe
})
```

## IAM policy

Grant the `Secret Manager Secret Accessor` role for read-only access:

```bash
gcloud projects add-iam-policy-binding MY_PROJECT \
  --member="serviceAccount:my-service@MY_PROJECT.iam.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

## Operational tips

- Use Workload Identity in GKE instead of exporting service account keys — it's more secure and easier to rotate
- Each secret version is immutable; disable old versions instead of deleting to preserve audit history
- Secret Manager supports [regional replication](https://cloud.google.com/secret-manager/docs/locations) — use it for compliance requirements or latency optimization
- Enable `Secret Manager Viewer` audit logs in Cloud Audit Logs to track all access

## Related

- [Secret Store overview](../stores.md)
- [Default Secret Store](./default_secret_store.md)
- [AWS Secrets Manager](./aws_secret_store.md)
- [HashiCorp Vault](./vault_secret_store.md)
