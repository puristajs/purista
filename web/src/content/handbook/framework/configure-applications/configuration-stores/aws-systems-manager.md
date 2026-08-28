---
title: Store configuration in AWS Systems Manager
description: Enable AWS Systems Manager Parameter Store through the first-party configuration-store adapter.
order: 513
---

Choose AWS Systems Manager Parameter Store for non-sensitive configuration in AWS when workload identity can receive narrowly scoped SSM read permissions.

```bash title="Install @purista/aws-config-store"
npm install @purista/aws-config-store
```

Create `AWSConfigStore` with an AWS SDK client configuration such as its region. Prefer the AWS default credential provider chain or workload roles; do not put access keys in source code.

```ts title="src/index.ts"
import { AWSConfigStore } from '@purista/aws-config-store'

const configStore = new AWSConfigStore({
  client: { region: process.env.AWS_REGION },
})

const service = await incidentV1Service.getInstance(eventBridge, { configStore })
```

| Call | Parameters, defaults, and intent | Runtime boundary |
| --- | --- | --- |
| [`new AWSConfigStore(options)`](/handbook/api/classes/_purista_aws-config-store.AWSConfigStore/) | `client` is required and is passed to the AWS SDK `SSMClient`; `region` is the common setting. Inherited reads default on, writes/removals off. The constructor sets `enableCache: true`, but the current `ConfigStoreBaseClass` does not implement read caching. | The adapter uses the AWS SDK credential chain or supplied SDK client settings. It does not resolve a parameter until `getConfig` is called. |
| [`serviceBuilder.getInstance(eventBridge, { configStore })`](/handbook/api/classes/_purista_core.ServiceBuilder/#getinstance) | Supplies the adapter as this instance's runtime configuration store. | The service's `context.configs` calls use the process identity; IAM policy is the effective authorization boundary. |

Provision the parameter path and IAM policy before deployment. `getConfig(...)`
is enabled; management writes/removals remain disabled unless you explicitly
enable those base-store operations for an approved administrative process.
Verify with a non-sensitive parameter and inspect CloudTrail/SDK errors if
access is denied. Parameter Store is not a reason to store passwords in
configuration; use a secret-store adapter for those values.

| Capability | AWS Systems Manager behavior |
| --- | --- |
| Value representation | Reads `Parameter.Value` as a string; do not rely on automatic JSON serialization for arbitrary configuration values. |
| Missing value | The adapter returns `undefined`. |
| Write/remove when the base operations are enabled | Writes an SSM `String` parameter with overwrite; removal deletes the named parameter. Review IAM and rollback before enabling either. |
| `enableCache` / `cacheTtl` | The adapter constructor supplies `enableCache: true`, but the current configuration-store base class does not implement read caching. Do not rely on either setting for cache or TTL behavior. |

Next: [chapter overview](/handbook/framework/configure-applications/configuration-stores/).
