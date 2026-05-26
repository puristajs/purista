---
title: AWS SSM Config Store
description: Store config values in AWS Systems Manager Parameter Store — versioned, audited, IAM-native.
order: 302120
---

# AWS SSM Config Store

`@purista/aws-config-store` uses [AWS Systems Manager Parameter Store](https://aws.amazon.com/systems-manager/features/#Parameter_Store) as the config backend. It is the natural choice for AWS-native stacks: values are versioned, changes are audited in CloudTrail, and access is controlled with IAM policies — no extra secrets management needed.

## Capabilities

| Feature | Support |
|---|---|
| Read (`getConfig`) | ✅ |
| Write (`setConfig`) | ✅ (opt-in) |
| Delete (`removeConfig`) | ✅ (opt-in) |
| Versioned parameters | ✅ |
| CloudTrail audit trail | ✅ |
| SecureString (KMS encryption) | ✅ |
| IAM-native access control | ✅ |

## Install

```bash
npm install @purista/aws-config-store
```

## Setup

```typescript
import { AWSConfigStore } from '@purista/aws-config-store'

const configStore = new AWSConfigStore({
  config: {
    client: {
      region: process.env.AWS_REGION ?? 'us-east-1',
    },
  },
  enableSet: true,
  enableRemove: true,
})

const myService = await myV1Service.getInstance(eventBridge, { configStore })
```

Authentication uses the standard AWS credential chain — IAM roles, environment variables (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`), or EC2/ECS/EKS instance profiles all work without any extra configuration.

## Usage inside a handler

```typescript
.setCommandFunction(async function (context, payload) {
  const { apiBaseUrl } = await context.configs.getConfig('apiBaseUrl')

  await context.configs.setConfig('featureFlags', JSON.stringify({ newCheckout: true }))
})
```

## IAM policy

Minimum permissions for read-only access:

```json
{
  "Effect": "Allow",
  "Action": [
    "ssm:GetParameter",
    "ssm:GetParameters"
  ],
  "Resource": "arn:aws:ssm:us-east-1:123456789012:parameter/myapp/*"
}
```

Add `ssm:PutParameter` and `ssm:DeleteParameter` only to services that need to write.

## Operational tips

- Use a path prefix per service and environment (`/myapp/prod/user-service/`) to scope IAM policies precisely
- Prefer `SecureString` type with KMS for values that are sensitive but still configuration (not secrets — those belong in Secrets Manager)
- SSM Parameter Store has API rate limits; use the `GetParameters` batch call (which the store adapter does automatically) to stay within limits
- Changes to parameters are visible in CloudTrail — useful for compliance and debugging

## Related

- [Config Store overview](../stores.md)
- [Default Config Store](./default_config_store.md)
- [Redis Config Store](./redis_config_store.md)
- [NATS Config Store](./nats_config_store.md)
