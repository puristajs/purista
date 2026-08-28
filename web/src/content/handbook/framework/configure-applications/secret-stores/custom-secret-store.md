---
title: Build a custom secret store
description: Implement a provider-specific secret adapter without weakening PURISTA's no-leak, read-only-by-default, and explicit cache boundaries.
order: 528
---

Create a custom secret store only when the approved secret platform is not one
of the supported adapters. The adapter owns the provider client, workload
identity, audit trail, rotation semantics, and connection lifecycle. The
service receives it through `getInstance(..., { secretStore })`; no handler
should construct a provider client or read a token from its own environment.

Extend `SecretStoreBaseClass`. It keeps `getSecret` enabled and secret writes
and removals disabled by default, prevents the adapter from bypassing those
operation guards, and can cache resolved values only when `enableCache` is
explicitly enabled.

```ts title="packages/acme-secret-store/src/AcmeSecretStore.ts"
import {
  type ObjectWithKeysFromStringArray,
  type StoreBaseConfig,
  SecretStoreBaseClass,
} from '@purista/core'

type SecretClient = {
  read(name: string): Promise<string | undefined>
  write(name: string, value: string): Promise<void>
  remove(name: string): Promise<void>
  close(): Promise<void>
}

type AcmeSecretStoreOptions = { client: SecretClient }

export class AcmeSecretStore extends SecretStoreBaseClass<AcmeSecretStoreOptions> {
  constructor(config: StoreBaseConfig<AcmeSecretStoreOptions>) {
    super('AcmeSecretStore', config)
  }

  protected async getSecretImpl<Names extends string[]>(...names: Names) {
    const result: Record<string, string | undefined> = {}
    await Promise.all(names.map(async name => { result[name] = await this.config.client.read(name) }))
    return result as ObjectWithKeysFromStringArray<Names, string | undefined>
  }

  protected async setSecretImpl(name: string, value: string) {
    await this.config.client.write(name, value)
  }

  protected async removeSecretImpl(name: string) {
    await this.config.client.remove(name)
  }

  async destroy() {
    await this.config.client.close()
    await super.destroy()
  }
}
```

| API | Contract to preserve | Why it matters |
| --- | --- | --- |
| [`SecretStoreBaseClass`](/handbook/api/classes/_purista_core.SecretStoreBaseClass/) | It defaults reads on and writes/removals/cache off, applies the operation switches before provider calls, and scopes the logger. | Keep public `getSecret`, `setSecret`, and `removeSecret` on the base class so cache invalidation and no-leak error handling remain consistent. |
| `getSecretImpl(...names)` | Return every requested key with a string or `undefined`. | The public getter adds optional cache behavior and preserves literal names in the returned object. |
| `setSecretImpl(name, value)` / `removeSecretImpl(name)` | Implement the provider write/remove semantics only when the adapter really supports them. | Enabling a base operation makes a supported implementation callable; it does not make an unsupported provider operation safe. |
| `destroy()` | Close provider clients and call `super.destroy()`. | The application can release adapter resources predictably after dependent services stop. |

## Treat caching as a rotation decision

`enableCache` defaults to `false`. If you enable it, set `cacheTtl` no longer
than the acceptable rotation delay and confirm what happens after an access
policy change. A cache can reduce provider calls; it can also keep a revoked or
rotated credential in memory. Never put a resolved secret in a log, trace,
metric, event, error response, or test snapshot.

Test missing-secret, denied-identity, expired/rotated value, disabled mutation,
and shutdown behavior. Run provider integration tests with a dedicated test
identity and audit trail. A passing mock proves the application flow, not the
provider's encryption, access policy, or rotation behavior.
