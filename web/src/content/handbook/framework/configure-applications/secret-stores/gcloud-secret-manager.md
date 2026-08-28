---
title: Store secrets in Google Cloud Secret Manager
description: Enable Google Cloud Secret Manager with application default credentials or workload identity.
order: 524
---

```bash title="Install @purista/gcloud-secret-store"
npm install @purista/gcloud-secret-store
```

Create the store with the project resource name. Prefer Application Default Credentials or workload identity over a static service-account key.

```ts title="src/index.ts"
import { GoogleSecretStore } from '@purista/gcloud-secret-store'

const secretStore = new GoogleSecretStore({
  project: 'projects/example-project',
})
```

Bind the selected adapter explicitly at the service boundary:

```ts title="src/index.ts"
const service = await incidentV1Service.getInstance(eventBridge, { secretStore })
```

| Call | Parameters, defaults, and intent | Runtime boundary |
| --- | --- | --- |
| [`new GoogleSecretStore(options)`](/handbook/api/classes/_purista_gcloud-secret-store.GoogleSecretStore/) | `project` is required in `projects/*` form; the adapter requests `projects/{project}/secrets/{name}/versions/latest`. `client` optionally passes Google client options. Secret caching is enabled by default; set `enableCache: false` or a millisecond `cacheTtl` when rotation needs fresher reads. | Authentication follows the Google client credential chain. A missing secret resolves as `undefined`; other provider failures reject the operation. |
| [`serviceBuilder.getInstance(eventBridge, { secretStore })`](/handbook/api/classes/_purista_core.ServiceBuilder/#getinstance) | Attaches the adapter at the runtime boundary. | It does not create or authorize the project; workload IAM remains the authorization boundary. |

Provision the secret and grant the workload the least-privilege Secret Manager role. Verify a read in the deployed identity context and monitor audit logs. The `project` value identifies the scope; it does not grant access by itself.

Next: [chapter overview](/handbook/framework/configure-applications/secret-stores/).
