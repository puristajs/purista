---
title: AWS Secrets Manager
description: Store and rotate secrets in AWS Secrets Manager — IAM-native, audited, with automatic rotation support.
order: 302210
---

# AWS Secrets Manager

`@purista/aws-secret-store` connects to [AWS Secrets Manager](https://aws.amazon.com/secrets-manager/) — the recommended secret store for AWS-native workloads. It supports automatic secret rotation, CloudTrail auditing, and fine-grained IAM access control.

## Capabilities

| Feature | Support |
|---|---|
| Read (`getSecret`) | ✅ |
| Write (`setSecret`) | ✅ (opt-in) |
| Delete (`removeSecret`) | ✅ (opt-in) |
| Automatic rotation | ✅ (configured in AWS) |
| CloudTrail audit trail | ✅ |
| KMS encryption | ✅ |
| IAM-native access control | ✅ |
| Cross-account access | ✅ (resource policies) |

## Install

```bash
npm install @purista/aws-secret-store
```

## Setup

```typescript
import { AWSSecretStore } from '@purista/aws-secret-store'

const secretStore = new AWSSecretStore({
  config: {
    client: {
      region: process.env.AWS_REGION ?? 'us-east-1',
    },
  },
  enableSet: true,
  enableRemove: true,
})

const myService = await myV1Service.getInstance(eventBridge, { secretStore })
```

Authentication follows the standard AWS credential chain — IAM roles, instance profiles, ECS task roles, and EKS IRSA all work without additional configuration.

## Usage inside a handler

```typescript
.setCommandFunction(async function (context, payload) {
  const { emailApiKey } = await context.secrets.getSecret('emailApiKey')
  // use emailApiKey to authenticate with your email provider
})
```

## IAM policy

Minimum permissions for read-only access:

```json
{
  "Effect": "Allow",
  "Action": [
    "secretsmanager:GetSecretValue"
  ],
  "Resource": "arn:aws:secretsmanager:us-east-1:123456789012:secret:myapp/*"
}
```

Add `secretsmanager:CreateSecret`, `secretsmanager:PutSecretValue`, and `secretsmanager:DeleteSecret` only to services that need to write.

## Operational tips

- Enable automatic rotation using Lambda rotation functions — your services transparently receive the latest version on the next `getSecret` call
- Use secret versioning (`AWSCURRENT`, `AWSPENDING`) for zero-downtime rotation
- Tag secrets by service and environment for cost allocation and access policy scoping
- Enable resource policies for cross-account secret sharing in multi-account architectures

## Related

- [Secret Store overview](../stores.md)
- [Default Secret Store](./default_secret_store.md)
- [HashiCorp Vault](./vault_secret_store.md)
- [Google Cloud Secret Manager](./gcloud_secret_store.md)
