---
title: Store secrets in AWS Secrets Manager
description: Enable AWS Secrets Manager with workload identity and a narrowly scoped read policy.
order: 522
---

```bash title="Install @purista/aws-secret-store"
npm install @purista/aws-secret-store
```

Choose AWS Secrets Manager when the workload runs in AWS and can use an IAM role instead of embedded keys. Configure `AWSSecretStore` with AWS SDK client options such as region:

```ts title="src/index.ts"
import { AWSSecretStore } from '@purista/aws-secret-store'

const secretStore = new AWSSecretStore({
  client: { region: process.env.AWS_REGION },
})
```

Enable this store for the service instance; constructing it alone does not
change what handlers resolve:

```ts title="src/index.ts"
const service = await incidentV1Service.getInstance(eventBridge, { secretStore })
```

| Call | Parameters, defaults, and intent | Runtime boundary |
| --- | --- | --- |
| [`new AWSSecretStore(options)`](/handbook/api/classes/_purista_aws-secret-store.AWSSecretStore/) | `client` is required AWS SDK `SecretsManagerClient` configuration, commonly `{ region }`. This adapter enables the secret-store cache by default; use `enableCache: false` for a fresh backend read or `cacheTtl` (milliseconds) to bound reuse. | Credentials resolve through AWS SDK configuration and the runtime role. Reads occur at handler execution; a missing secret returns `undefined`, while other SDK failures become an error. |
| [`serviceBuilder.getInstance(eventBridge, { secretStore })`](/handbook/api/classes/_purista_core.ServiceBuilder/#getinstance) | Supplies the selected store to the service instance. | This is the step that replaces Core's local default for `context.secrets`. |

Create the secret and an IAM policy limited to the exact secret ARN/path before deployment. Verify a non-production secret read using the workload role, then inspect CloudTrail and access-denied errors rather than logging the resolved value. Rotate through Secrets Manager and restart/refresh the application according to its secret-resolution lifecycle.

Next: [chapter overview](/handbook/framework/configure-applications/secret-stores/).
