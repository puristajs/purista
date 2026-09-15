---
title: Use the default secret store locally
description: Seed the included in-memory secret store for local development and tests, then replace it with an audited backend before deployment.
order: 521
---

`DefaultSecretStore` is included in `@purista/core`; no package or external
service is required. It keeps plain strings in this process, loses them at
shutdown, and warns that it is not secure for production. It is appropriate for
local developer values and deterministic tests only.

```ts title="src/index.ts"
import { DefaultSecretStore } from '@purista/core'
import { emailV1Service } from './service/email/v1/emailV1Service.js'

const secretStore = new DefaultSecretStore({
  config: {
    emailProviderAuthToken: process.env.LOCAL_EMAIL_PROVIDER_TOKEN ?? '',
  },
})

const emailService = await emailV1Service.getInstance(eventBridge, {
  secretStore,
})
```

| Call | Parameters, defaults, and intent | Runtime boundary |
| --- | --- | --- |
| [`new DefaultSecretStore(options?)`](/handbook/api/classes/_purista_core.DefaultSecretStore/) | `config` seeds a process-local string map. Reads default on; writes, removals, and caching default off. | Suitable only for local code and deterministic fixtures. It neither encrypts values nor survives process shutdown. |
| [`serviceBuilder.getInstance(eventBridge, { secretStore })`](/handbook/api/classes/_purista_core.ServiceBuilder/#getinstance) | Supplies the store at service composition. | Handlers resolve it through `context.secrets`; the composition root must destroy a supplied instance. |

`getSecret(...)` is enabled by default; writing and removing secrets are
disabled. Do not print the resolved value to prove that setup worked. Instead,
exercise the handler against a local fake provider and assert only the
successful/denied behavior.

```ts title="test/support/createSecretStore.ts"
import { DefaultSecretStore } from '@purista/core'

export const createSecretStore = () => new DefaultSecretStore({
  config: { emailProviderAuthToken: 'test-token' },
})
```

For deployment, use a secret-store adapter with workload identity, least
privilege, auditing, rotation, and a defined refresh/restart path. Keep secrets
out of configuration stores, source control, event payloads, queue headers,
logs, metrics, traces, and error messages.

Next: choose a production [secret store](/handbook/framework/configure-applications/secret-stores/).
