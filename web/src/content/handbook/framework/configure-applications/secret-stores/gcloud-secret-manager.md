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

When writes are enabled, keep reads enabled as well. This adapter's
`setSecretImpl(...)` calls the public `getSecret(...)` method to decide whether
it must create the secret resource before adding a version. Configuring
`enableSet: true` with `enableGet: false` therefore makes every write fail the
store's unauthorized read guard. This coupling is specific to the current
Google adapter.

### Mutation semantics

`enableSet: true` allows `setSecret(...)` to create an automatically replicated
secret resource when missing, then add a new version. `enableRemove: true`
allows `removeSecret(...)` to delete the complete secret resource, including
its versions according to Google Secret Manager behavior. These operations are
not equivalent to rotating or disabling one version. Keep normal application
instances read-only and use a reviewed platform workflow for rotation,
version-state changes, and destructive deletion.

Next: [chapter overview](/handbook/framework/configure-applications/secret-stores/).
