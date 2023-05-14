---
order: 10
shortTitle: Config store
title: Config store
description: Config store
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


A configuration passed into the service creation, should focus on technical configurations and for the service itself.  
As an example, defining urls, ports, timeouts and similar, are technical configurations.  
Configurations, related to business logic, like feature flags and values for business calculations, should be separated from pure technical configurations. This allows to manage configuration, without the need to restart instances, and to use solutions like AWS Parameter Store, without directly coupling vendor specific solutions to business code.  

Also, if a command or subscriptions needs further configurations like urls of external services, than the config store is a good place to persist this information.

The config store is a simple interface to a key-value-store. They key must be a string and the value can be any type which can be serialized via JSON stringify/parse.

## Available config stores

| vendor                                                                                  | package   |
|---                                                                                      |---        |
| [AWS Systems Manager Parameter Store](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html)             | [planned](https://github.com/sebastianwessel/purista/issues/104)      |
| [Azure App Configuration](https://azure.microsoft.com/en-us/products/app-configuration)   | [planned](https://github.com/sebastianwessel/purista/issues/105)      |
| [Dapr](https://dapr.io)       | [@purista/dapr-sdk](../../7._deployment/4_dapr.md) |

## Usage

The config store is provided inside the `context` of command functions and subscription functions.  
It can be used like this:

```typescript
.setCommandFunction(async function (context, payload) {

  // set a config
  await context.configs.setConfig('port', 8080)

  // get a config
  const myConfig = await context.configs.getConfig('hostUrl', 'port')
  console.log(myConfig) // outputs: { hostUrl: "http://example.com", port: 8080 }

  // remove a config
  await context.configs.removeConfig('port')
})
```

::: tip
**Use schemas to validate**  
A production ready approach is, to validate the result of store getters against a schema.  
It validates the returned values and gives you proper types for further usage in one step.  
As an example:
:::

```typescript
setCommandFunction(async function (context, payload) {
  
  const configSchema = z.object({
    hostUrl: z.string().url(),
    port: z.number().int().min(1).max(99999),
  })

  const result = await context.configs.getConfig('hostUrl', 'port')

  // myConfig now has proper types and is technical valid
  const myConfig = configSchema.parse(result)

  console.log(myConfig) // outputs: { hostUrl: "http://example.com", port: 8080 }
 
})
```

::: info
Config stores per default have:  

- enabled getter
- disabled setter
- disabled removal

You need to explicit enable via config if needed
:::

## Default config store

PURISTA comes with a default config store, which can be used as placeholder or connector to config files and environment variables.  
In the constructor config, you can add a `config` property. The property must be from type object.  

Example:

```typescript
const store = new DefaultConfigStore({
  enableGet: true,
  enableRemove: true,
  enableSet: true,
  config: {
    initialValue: 'initial',
  },
})

console.log(store.getState('initialValue')) // outputs: initial
```

## Custom config store

It is quite simple to build a custom config store.  
You can simply extend the `ConfigStoreBaseClass` with type parameter of your custom store config.

```typescript
import { ConfigStoreBaseClass, UnhandledError, StatusCode, StoreBaseConfig } from '@purista/core'

type CustomStoreConfig = {
  url: string
}

export class CustomStore extends ConfigStoreBaseClass<CustomStoreConfig> {

  private client

  constructor(config?: StoreBaseConfig<CustomStoreConfig>) {
    super('CustomStoreName', config)

    this.client = customCLient.connect(this.config.config.url)
  }

  async getConfig(...configNames: string[]): Promise<Record<string, unknown>> {
    if (!this.config.enableGet) {
      throw new UnhandledError(StatusCode.Unauthorized, 'get config from store is disabled by config')
    }

    const result: Record<string, unknown> = {}
    for await (const name of configNames) {
      try {
        // your custom logic goes here:
        const value = await this.client.get(name)
        result[name] = value ? JSON.parse(value) : undefined
      } catch (err) {
        const msg = `error in config store getting value ${name}`
        this.logger.error({ err }, msg)
        throw new UnhandledError(StatusCode.InternalServerError, msg)
      }
    }
    return result

  }

  async removeConfig(configName: string): Promise<void> {
    if (!this.config.enableRemove) {
      throw new UnhandledError(StatusCode.Unauthorized, 'remove config from store is disabled by config')
    }
    
    try {
      // your custom logic goes here:
      await this.client.del(configName)
    } catch (err) {
      const msg = `error in config store removing value ${configName}`
      this.logger.error({ err }, msg)
      throw new UnhandledError(StatusCode.InternalServerError, msg)
    }
  }

  async setConfig(configName: string, configValue: unknown) {
    if (!this.config.enableSet) {
      throw new UnhandledError(StatusCode.Unauthorized, 'set config at store is disabled by config')
    }

    try {
      // your custom logic goes here:
      await this.client.set(configName, JSON.stringify(configValue))
    } catch (err) {
      const msg = `error in config store setting value ${configName}`
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
