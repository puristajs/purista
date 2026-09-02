---
title: Configure store operations and secret caching
description: Control read, write, and removal operations deliberately, use scoped logging safely, and enable the built-in secret cache only when its rotation and exposure trade-off is acceptable.
order: 504
---

Store operation switches are application-composition controls. They make a
method unavailable to every handler using that store instance; they do not
decide whether a particular tenant or principal may use the remaining method.
Enforce that business authorization in a guard, handler, and resource policy.

## Choose the smallest operation surface

| Store family | `get` default | `set` / `remove` default | Use writes only when |
| --- | --- | --- | --- |
| State | Enabled | Enabled | The service owns a service-state record; still validate values and design concurrency/recovery. |
| Configuration | Enabled | Disabled | A deliberately authorized administrative configuration workflow owns the value lifecycle. |
| Secret | Enabled | Disabled | The application owns a runtime secret lifecycle such as delegated-credential rotation or revocation. |

Each disabled call rejects with an unauthorized `UnhandledError`. That is a
useful fail-closed process setting, but it is not tenant isolation and does
not turn a broad cloud policy into least privilege.

```ts title="src/application/createBillingStores.ts"
import { DefaultConfigStore, DefaultSecretStore, DefaultStateStore } from '@purista/core'

export const createBillingStores = () => ({
  stateStore: new DefaultStateStore({
    enableGet: true,
    enableSet: true,
    enableRemove: true,
  }),
  configStore: new DefaultConfigStore({
    enableGet: true,
    enableSet: false,
    enableRemove: false,
  }),
  secretStore: new DefaultSecretStore({
    enableGet: true,
    enableSet: false,
    enableRemove: false,
  }),
})
```

| Option | Default and effect | Set it when |
| --- | --- | --- |
| `enableGet` | `true` for state, configuration, and secret stores. A disabled public read rejects before the adapter implementation runs. | A process must not resolve this class of value at all. This is a process capability switch, not a per-request authorization rule. |
| `enableSet` / `enableRemove` | `true` for state; `false` for configuration and secret stores. | A controlled workflow owns mutations and the selected adapter implements them. Enabling a switch for a read-only adapter still results in its provider-specific unsupported-operation error. |
| `logger` / `logLevel` | The supplied logger wins; without one, the base creates a logger at `logLevel`. | You need consistent application correlation. Do not use either to expose returned values. |
| `enableCache` / `cacheTtl` | Both default to `false` / unset. The current base cache is implemented for `SecretStoreBaseClass`; `cacheTtl` is milliseconds. | A secret can remain in process memory for the chosen maximum reuse period. Do not infer cache support for configuration or state stores from the shared option type. |

The exact base contracts are [`StateStoreBaseClass`](/handbook/api/classes/_purista_core.StateStoreBaseClass/), [`ConfigStoreBaseClass`](/handbook/api/classes/_purista_core.ConfigStoreBaseClass/), and [`SecretStoreBaseClass`](/handbook/api/classes/_purista_core.SecretStoreBaseClass/).

Pass these instances to the service in [composition-root wiring](/handbook/framework/configure-applications/wire-stores-at-the-composition-root/).
The included stores are still local/test only; the toggles do not make them a
production persistence or secret-management system.

## Use logging without exposing stored values

All store base classes accept `logger` or `logLevel` and create a scoped child
logger for the store name. Supply a shared application logger when you need
consistent correlation and output; use `logLevel` only when no custom logger
is supplied. Never log values returned by `getSecret`, or raw configuration
and state values unless their exact fields are reviewed as safe.

## Enable the secret cache only deliberately

`enableCache` and `cacheTtl` are shared configuration fields, but the core
base implementation provides cache behavior for **secret stores**. With
`enableCache: true`, a resolved secret stays in the process memory cache; a
defined `cacheTtl` bounds reuse in milliseconds. Without a TTL, it remains
cached until a write/removal updates that entry or the process ends.

```ts title="src/application/createEmailSecretStore.ts"
import { DefaultSecretStore } from '@purista/core'

export const createEmailSecretStore = () =>
  new DefaultSecretStore({
    enableCache: true,
    cacheTtl: 30_000,
  })
```

Choose a cache only when a short-lived secret copy in process memory is
acceptable and the TTL is shorter than the required rotation/revocation
window. Caching does not improve authorization, audit, encryption, or
cross-process consistency. Never cache a secret merely to hide a slow or
failing backend; repair the backend/identity path instead.

Configuration and state adapter constructors may expose the same fields, but
the shared Core configuration type alone does not guarantee cache behavior for
them. Treat caching as adapter-specific unless that adapter's page and source
explicitly promise it.

Next: choose [configuration stores](/handbook/framework/configure-applications/configuration-stores/),
[secret stores](/handbook/framework/configure-applications/secret-stores/), or
[state stores](/handbook/framework/configure-applications/state-stores/) for provider
installation, external prerequisites, wiring, and verification.
