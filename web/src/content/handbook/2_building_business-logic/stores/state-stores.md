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

## Retention

State is permanent by default. Add retention only to data that is deliberately
temporary: password-reset tokens, checkout drafts, rate-limit windows, job
progress, or bounded conversation history. An expiry is a **write policy**. A
successful expiring write sets the deadline; a later write refreshes it, while a
read never does. PURISTA does not start a generic cleanup timer.

### Choose the scope that owns the lifetime

**One temporary value.** Keep the rule beside the business operation when only
one kind of state has a short lifetime. This is the usual choice for tokens and
rate-limit windows.

```typescript
await context.states.setState(`password-reset:${tokenId}`, record, {
  retention: { mode: 'expire', ttlMs: 15 * 60_000 },
})
```

**All state written by one service.** Use `stateRetention` at service runtime
wiring when one service owns short-lived operational state, such as checkout
drafts. It creates a service-local view; another service using the same store is
not changed.

```typescript
const checkout = await checkoutV1Service.getInstance(eventBridge, {
  stateStore,
  stateRetention: {
    default: { mode: 'expire', ttlMs: 24 * 60 * 60_000 },
  },
})
```

**A dedicated StateStore instance.** Configure `retention` on the store when
every consumer of that particular instance shares the same lifetime policy.
Use a separate instance when permanent business records and temporary state
need different defaults.

```typescript
const sessionState = new RedisStateStore({
  config: { url: process.env.REDIS_URL },
  retention: {
    default: { mode: 'expire', ttlMs: 30 * 24 * 60 * 60_000 },
  },
})
```

An explicit write policy always wins. For example, a service with an expiring
default can deliberately persist one record with
`{ retention: { mode: 'forever' } }`.

| Priority | Where it is configured | Typical use |
| --- | --- | --- |
| 1 | `context.states.setState(..., { retention })` | One token, cache entry, or business exception. |
| 2 | `service.getInstance(..., { stateRetention })` | One service's temporary operational state. |
| 3 | `new StateStore({ retention })` | A dedicated state-store instance with one default lifetime. |
| 4 | No policy | Permanent state. |

### StateStore retention compatibility

A finite policy is never silently changed to permanent storage. It succeeds
only when the adapter can store the value and expiry deadline atomically;
otherwise the write fails clearly.

| StateStore | Persists across restart | Atomic per-write expiry | Notes |
| --- | --- | --- | --- |
| `DefaultStateStore` | No | Yes | Deterministic local development and tests only. |
| `RedisStateStore` | Yes | Yes | Writes the value and expiry together. |
| `DaprStateStore` | Depends on the selected Dapr component | Only with `supportsTtl: true` and a TTL-capable component | Durations round up to whole seconds. |
| `NatsStateStore` | Yes | No | Bucket max age is not a per-key, write-refreshing TTL. |
| Custom StateStore | Depends on the implementation | Only when it declares `capabilities.retention.atomicExpiry: true` | The implementation must commit the value and deadline as one backend operation. |

Do not use `DefaultStateStore` as evidence of production durability. For a
custom store, leave `atomicExpiry` false unless the backend genuinely provides
this guarantee.

### Attached-agent retention compatibility

Attached agents reuse the same StateStore capability for their service-owned
records. Their additional history, run, and event bounds are documented in the
[AI runtime guide](../ai/index.md#retention-is-policy-stores-enforce-it).
They do not create a generic cleanup job. The selected binding determines which
agent controls are available:

| Agent policy | Service StateStore (default) | Explicit Harness `ai.stateStore` |
| --- | --- | --- |
| `history.maxTurns` / `history.maxBytes` | Supported. Harness keeps complete newest turns by replacing the stored transcript. | Supported only when the Harness store implements atomic `replaceMessages`. |
| `idleTtlMs` | Supported only when the StateStore reports `capabilities.retention.atomicExpiry: true`. An unsupported store fails the expiring write instead of retaining data forever. | Not available. |
| `runs.maxPerSession` / `events.maxPerRun` | Supported by PURISTA's agent StateStore adapter. | Not available. |

Use the service StateStore for the ordinary case. Choose `ai.stateStore` only
when agent persistence intentionally needs a separate Harness-native backend.

Durable workflow workspace retention is separate from StateStore retention. Its
workspace adapter owns file cleanup, quotas, encryption, and durable-workspace
policy.

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
    StateStoreConfig,
    ResolvedStateWriteOptions,
    type ObjectWithKeysFromStringArray,
  } from '@purista/core'

type CustomStoreConfig = {
  url: string
}

export class CustomStore extends StateStoreBaseClass<CustomStoreConfig> implements StateStore {

  private client

  constructor(config: StateStoreConfig<CustomStoreConfig>) {
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
