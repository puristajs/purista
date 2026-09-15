---
title: Build a custom configuration store
description: Add a platform-specific non-secret configuration backend while preserving PURISTA's guarded lookup contract and explicit shutdown lifecycle.
order: 516
---

Create a custom configuration store when the supported providers do not match
the platform's approved non-secret configuration system. The service stays
portable: the composition root creates the adapter and supplies it as
`configStore` to `getInstance`.

Extend `ConfigStoreBaseClass` rather than reimplementing `getConfig`,
`setConfig`, or `removeConfig`. The base class keeps reads enabled and writes
and removals disabled by default, applies explicit operation guards, and gives
the adapter a scoped logger. Implement only the protected provider calls and
`destroy()`.

```ts title="packages/acme-config-store/src/AcmeConfigStore.ts"
import {
  type ObjectWithKeysFromStringArray,
  type StoreBaseConfig,
  ConfigStoreBaseClass,
} from '@purista/core'

type ConfigurationClient = {
  get(key: string): Promise<string | undefined>
  set(key: string, value: string): Promise<void>
  delete(key: string): Promise<void>
  close(): Promise<void>
}

type AcmeConfigStoreOptions = { client: ConfigurationClient }

export class AcmeConfigStore extends ConfigStoreBaseClass<AcmeConfigStoreOptions> {
  constructor(config: StoreBaseConfig<AcmeConfigStoreOptions>) {
    super('AcmeConfigStore', config)
  }

  protected async getConfigImpl<Names extends string[]>(...keys: Names) {
    const result: Record<string, unknown> = {}
    await Promise.all(keys.map(async key => {
      const value = await this.config.client.get(key)
      result[key] = value === undefined ? undefined : JSON.parse(value)
    }))
    return result as ObjectWithKeysFromStringArray<Names>
  }

  protected async setConfigImpl(key: string, value: unknown) {
    await this.config.client.set(key, JSON.stringify(value))
  }

  protected async removeConfigImpl(key: string) {
    await this.config.client.delete(key)
  }

  async destroy() {
    await this.config.client.close()
    await super.destroy()
  }
}
```

| API | Contract to preserve | Why it matters |
| --- | --- | --- |
| [`ConfigStoreBaseClass`](/handbook/api/classes/_purista_core.ConfigStoreBaseClass/) | The constructor takes a stable store name and `StoreBaseConfig<AdapterOptions>`. It defaults `enableGet` to `true` and `enableSet`, `enableRemove`, and `enableCache` to `false`; a supplied `logger` takes precedence over `logLevel`. | Keep public `getConfig`, `setConfig`, and `removeConfig` on the base class so every caller receives the same operation guard and error shape. `ConfigStoreBaseClass` currently has no read-cache implementation, so do not promise cache behavior from the shared `enableCache` option. |
| `getConfigImpl(...keys)` | Return an object that contains every requested key, using `undefined` when the provider has no value. | The public `getConfig` method preserves tuple-key inference for handlers; a broad `Record` at the boundary needs the shown localized, typed conversion. |
| `setConfigImpl(key, value)` / `removeConfigImpl(key)` | Implement provider writes only when the adapter supports them. | A base toggle enables access to the protected implementation; it cannot manufacture a provider mutation API. |
| `destroy()` | Close provider-owned clients, then call `super.destroy()`. | Composition shutdown should release sockets once and preserve the base lifecycle log. |

The adapter must define its own authorization, serialization, connection,
failure, and cache guarantees. Do not use a configuration store for tokens or
private keys merely because a provider can encrypt values; those belong in a
[secret store](/handbook/framework/configure-applications/secret-stores/).

Test missing keys, disabled operations, decoding failure, denied access, and
shutdown deterministically. Then test the real provider with the deployed
workload identity and a separate test namespace before allowing it to supply
production settings.
