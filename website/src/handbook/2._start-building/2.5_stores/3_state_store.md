---
order: 30
shortTitle: State store
title: State store
description: State store
tag:
  - typescript
  - nodejs
  - javascript
  - backend
  - framework
  - cloud
  - microservice
  - lambda
  - Installation
  - Setup
  - Guide
---

State stores are essential for scaling.  
Decoupling the business logic from the actual used state store, allows the usage of different databases or vendor solutions.  
The state store is a simple interface to a key-value-store. They key must be a string and the value can be any type which can be serialized via JSON stringify/parse.

## Available state stores

| vendor                        | package                                                                       |
|---                            |---                                                                            |
| [Redis](https://redis.io)     | [@purista/redis-state-store](../../../api/modules/purista_redis_state_store.md)  |

## Usage

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

::: tip
**Use schemas to validate**  
A production ready approach is, to validate the result of store getters against a schema.  
It validates the returned values and gives you proper types for further usage in one step.  
As an example:
:::

## Custom state store

It is quite simple to build a custom state store.  
You can simply extend the `StateStoreBaseClass` with type parameter of your custom store config.

```typescript
import { StateStoreBaseClass, UnhandledError, StatusCode, StoreBaseConfig } from '@purista/core'

type CustomStoreConfig = {
  url: string
}

export class CustomStore extends StateStoreBaseClass<CustomStoreConfig> {

  private client

  constructor(config: StoreBaseConfig<CustomStoreConfig>) {
    super('CustomStoreName', config, options)

    // your custom logic goes here:
    this.client = customCLient.connect(this.config.config.url)
  }

  async getState(...stateNames: string[]): Promise<Record<string, unknown>> {
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
    return result

  }

  async removeState(stateName: string): Promise<void> {
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

  async setState(stateName: string, stateValue: unknown) {
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
