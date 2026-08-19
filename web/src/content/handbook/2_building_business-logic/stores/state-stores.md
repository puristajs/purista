---
title: State Stores
description: State stores in PURISTA typescript framework
order: 206030
---

# State Stores

State stores are essential for scaling.  
Decoupling the business logic from the actual used state store, allows the usage of different databases or vendor solutions.  
The state store is a simple interface to a key-value-store. The key must be a string and the value can be any type which can be serialized via JSON stringify/parse.

## Usage

State stores are provided to services during instance creation.

```typescript
const stateStore = new DaprStateStore({ stateStoreName: 'local-state-store' })

const myService = await myV1Service.getInstance(eventBridge, {
    stateStore,
  })
```

The state store is provided inside the `context` of command functions and subscription functions.
It can be used like this:

```typescript
.setCommandFunction(async function (context, payload) {

  // set a state value
  await context.states.setState('port', 8080)

  // expire a short-lived value; this requires a store with atomic expiry
  await context.states.setState('password-reset:abc', token, {
    retention: { mode: 'expire', ttlMs: 15 * 60_000 },
  })

  // get state values
  const myState = await context.states.getState('hostUrl', 'port')
  console.log(myState) // outputs: { hostUrl: "http://example.com", port: 8080 }

  // remove a state value
  await context.states.removeState('port')
})
```

## Retention without a second store

State is permanent by default. Choose expiry explicitly for values such as
one-time tokens, temporary workflow markers, and bounded agent sessions. A
finite write is never silently converted to a permanent one: it fails if the
selected store cannot atomically store the value and its expiry together.

When several services share one store, create an immutable view for the service
that needs a default. A write-level option always wins, so business code keeps
control without mutating the shared store's configuration.

Retention resolves from most to least specific: the write's `retention` option,
then an attached agent's `idleTtlMs` for its own records, then the service view,
then an outer store view, and finally `forever`. A scope cannot silently ignore
a finite result: the write fails when the concrete store lacks atomic expiry.

```typescript
import { createStateStoreRetentionView } from '@purista/core'

const agentState = createStateStoreRetentionView(redisStateStore, {
  default: { mode: 'expire', ttlMs: 30 * 24 * 60 * 60_000 },
})

const service = await supportV1Service.getInstance(eventBridge, {
  stateStore: agentState,
})
```

Redis supports per-key atomic expiry. Dapr supports it only when the configured
component supports `ttlInSeconds` and the adapter is created with
`supportsTtl: true` (Dapr rounds millisecond durations up to seconds). NATS KV
can enforce a fixed lifetime per bucket but does not support this per-write
sliding-expiry contract. A custom store must declare
`capabilities.retention.atomicExpiry: true` only when its backend performs the
value write and expiry deadline atomically.

::: tip Use schemas to validate
A production ready approach is, to validate the result of store getters against a schema.
It validates the returned values and gives you proper types for further usage in one step.
As an example:
:::

## Custom state store

It is quite simple to build a custom state store.
You can simply extend the `StateStoreBaseClass` with type parameter of your custom store config.

```typescript
import { 
    StateStore,
    StateStoreBaseClass,
    UnhandledError,
    StatusCode,
    StoreBaseConfig,
    ResolvedStateWriteOptions,
    type ObjectWithKeysFromStringArray,
  } from '@purista/core'

type CustomStoreConfig = {
  url: string
}

export class CustomStore extends StateStoreBaseClass<CustomStoreConfig> implements StateStore {

  private client

  constructor(config: StoreBaseConfig<CustomStoreConfig>) {
    super('CustomStoreName', config, {
      retention: { atomicExpiry: true }, // only when client.set is truly atomic with TTL
    })

    // your custom logic goes here:
    this.client = customClient.connect(this.config.config.url)
  }

  protected async getStateImpl<StateNames extends string[]>(...stateNames: StateNames): Promise<ObjectWithKeysFromStringArray<StateNames>> {
    if (!this.config.enableGet) {
      throw new UnhandledError(StatusCode.Unauthorized, 'get state from store is disabled by config')
    }

    const result: Record<string, unknown> = {}
    for await (const name of stateNames) {
      try {
        // your custom logic goes here:
        const value = await this.client.get(name)
        result[name] = value ? JSON.parse(value) : undefined
      } catch (err) {
        const msg = `error in state store getting value ${name}`
        this.logger.error({ err }, msg)
        throw new UnhandledError(StatusCode.InternalServerError, msg)
      }
    }
    return result as ObjectWithKeysFromStringArray<StateNames>

  }

  protected async removeStateImpl(stateName: string): Promise<void> {
    if (!this.config.enableRemove) {
      throw new UnhandledError(StatusCode.Unauthorized, 'remove state from store is disabled by config')
    }

    try {
      // your custom logic goes here:
      await this.client.del(stateName)
    } catch (err) {
      const msg = `error in state store removing value ${stateName}`
      this.logger.error({ err }, msg)
      throw new UnhandledError(StatusCode.InternalServerError, msg)
    }
  }

  protected async setStateImpl(stateName: string, stateValue: unknown, options: ResolvedStateWriteOptions) {
    if (!this.config.enableSet) {
      throw new UnhandledError(StatusCode.Unauthorized, 'set state at store is disabled by config')
    }

    try {
      // your custom logic goes here:
      await this.client.set(stateName, JSON.stringify(stateValue), {
        // Implement this only if the backend commits the value and TTL atomically.
        ...(options.retention.mode === 'expire' ? { ttlMs: options.retention.ttlMs } : {}),
      })
    } catch (err) {
      const msg = `error in state store setting value ${stateName}`
      this.logger.error({ err }, msg)
      throw new UnhandledError(StatusCode.InternalServerError, msg)
    }
  }

  async destroy() {
    await this.client.disconnect()
    super.destroy()
  }
}
```
