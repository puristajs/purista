---
title: Build a custom state store
description: Implement PURISTA's small state-store contract when the supported adapters do not match the platform, while preserving explicit lifecycle and safe value handling.
order: 660
---

Build a custom store only when Redis, NATS JetStream KV, and Dapr cannot meet
the platform boundary. A custom adapter owns provider authentication,
connection lifecycle, serialization, error translation, and its actual
consistency guarantees; a PURISTA service remains independent by receiving the
adapter at `getInstance`.

The public contract is four methods: `getState`, `setState`, `removeState`, and
`destroy`. Extend `StateStoreBaseClass` rather than reimplementing the public
methods. The base class applies the `enableGet`, `enableSet`, and
`enableRemove` guards, creates a scoped logger, and supplies sensible defaults.

```ts title="src/adapters/AcmeStateStore.ts"
import {
  type ObjectWithKeysFromStringArray,
  type StoreBaseConfig,
  StateStoreBaseClass,
} from '@purista/core'

export type KeyValueClient = {
  get(key: string): Promise<string | undefined>
  set(key: string, value: string): Promise<void>
  delete(key: string): Promise<void>
  close(): Promise<void>
}

type AcmeStateStoreConfig = { client: KeyValueClient }

export class AcmeStateStore extends StateStoreBaseClass<AcmeStateStoreConfig> {
  constructor(config: StoreBaseConfig<AcmeStateStoreConfig>) {
    super('AcmeStateStore', config)
  }

  protected async getStateImpl<StateNames extends string[]>(...keys: StateNames) {
    const result: Record<string, unknown> = {}
    await Promise.all(keys.map(async key => {
      const value = await this.config.client.get(key)
      result[key] = value ? JSON.parse(value) : undefined
    }))
    return result as ObjectWithKeysFromStringArray<StateNames>
  }

  protected async setStateImpl(key: string, value: unknown) {
    await this.config.client.set(key, JSON.stringify(value))
  }

  protected async removeStateImpl(key: string) {
    await this.config.client.delete(key)
  }

  async destroy() {
    await this.config.client.close()
    await super.destroy()
  }
}
```

This is an application-owned adapter shape, not a production policy. Replace
the example client with the selected provider SDK and deliberately choose how
its errors are surfaced. Do not log raw keys or values merely to make adapter
failures easier to diagnose.

## Prove the adapter before wiring it into a service

| Check | Why it matters |
| --- | --- |
| Missing key returns the requested key with `undefined` | Handlers can distinguish an absent record from a malformed one. |
| JSON round-trip handles the allowed application values | Store behavior matches the adapter's documented serialization contract. |
| Disabled get/set/remove operation rejects | The base-class safety switches are not bypassed. |
| Provider failure has a safe, actionable error | A retry policy can classify it without leaking data. |
| `destroy()` closes connections | Tests, workers, and graceful shutdown do not leak sockets. |
| Restart and concurrent-write tests use the real provider | The published guarantee is evidence, not an assumption from a local fake. |

Wire a ready adapter exactly as any supported store:

```ts title="src/index.ts"
import type { EventBridge } from '@purista/core'
import { AcmeStateStore, type KeyValueClient } from './adapters/AcmeStateStore.js'
import { billingV1Service } from './service/billing/v1/billingV1Service.js'

export async function createBillingService(eventBridge: EventBridge, client: KeyValueClient) {
  const stateStore = new AcmeStateStore({ client })
  return billingV1Service.getInstance(eventBridge, { stateStore })
}
```

If the package is meant for other teams, publish its installation, required
external resources, compatibility, enablement, option defaults, and recovery
behavior in a dedicated provider guide. Use [test and migrate state](/handbook/framework/configure-applications/state-stores/test-and-migrate-state/) to define the evidence needed before changing an active store.
