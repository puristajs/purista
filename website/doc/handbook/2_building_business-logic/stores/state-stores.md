---
title: State Stores
description: State stores in PURISTA typescript framwork
order: 206030
---

# State Stores

State stores are essential for scaling.  
Decoupling the business logic from the actual used state store, allows the usage of different databases or vendor solutions.  
The state store is a simple interface to a key-value-store. They key must be a string and the value can be any type which can be serialized via JSON stringify/parse.

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

  // set a config
  await context.states.setState('port', 8080)

  // get a config
  const myState = await context.states.getState('hostUrl', 'port')
  console.log(myState) // outputs: { hostUrl: "http://example.com", port: 8080 }

  // remove a config
  await context.states.removeState('port')
})
```

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
    type ObjectWithKeysFromStringArray,
  } from '@purista/core'

type CustomStoreConfig = {
  url: string
}

export class CustomStore extends StateStoreBaseClass<CustomStoreConfig> implements StateStore {

  private client

  constructor(config: StoreBaseConfig<CustomStoreConfig>) {
    super('CustomStoreName', config, options)

    // your custom logic goes here:
    this.client = customCLient.connect(this.config.config.url)
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

  protected async setStateImpl(stateName: string, stateValue: unknown) {
    if (!this.config.enableSet) {
      throw new UnhandledError(StatusCode.Unauthorized, 'set state at store is disabled by config')
    }

    try {
      // your custom logic goes here:
      await this.client.set(stateName, JSON.stringify(stateValue))
    } catch (err) {
      const msg = `error in state store setting value ${stateName}`
      this.logger.error({ err }, msg)
      throw new UnhandledError(StatusCode.InternalServerError, msg)
    }
  }

  async destroy() {
    await this.client.disconnect()
    await destroy()
  }
}
```
