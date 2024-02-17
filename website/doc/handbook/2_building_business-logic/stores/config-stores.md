---
title: Config Stores
description: Config stores in PURISTA typescript framework
order: 206010
---

# Config Stores

In PURISTA applications, there are two general ways to make configuration data accessable for your commands and subscriptions.

You can provide conffigurations via the [service configuration](../service/add-a-service-config.md) or via config stores.  
Both is valid and you might ask why and when to use which option.

Configrations, which are necessarly needed to be able to start a service and which is not changeable during runtime, must be provided via the service configration. As an example: database configurations, setting of timeouts and similar.

Configurations, like urls of third party provides credential user names (not passwords!), which you might also want to change during runtime, should be stored in config stores.

|   | config store  | service config  |
|---|---|---|
| typed*                  | no  | yes  |
| validated*              |  no | yes  |
| changes during runtime  | possible  | no  |
| distributed/shared      | possible  | no  |

_(*) out of the box_

::: tip Feature flags
If you need feature flags in your application, you might have a look at [OpenFeature](https://openfeature.dev).
:::

Using config stores, allows to manage configuration, without the need to restart instances, and to use solutions like AWS Parameter Store, without directly coupling vendor specific solutions to business code.

Also, if a command or subscriptions needs further configurations like urls of external services, than the config store is a good place to persist this information.

The config store is a simple interface to a key-value-store. The key must be a string and the value can be any type which can be serialized via JSON stringify/parse.

## Usage

Config stores are provided to the services during instance creation.

```typescript
const configStore = new DaprConfigStore({ configStoreName: 'local-config-store' })

const myService = myV1Service.getInstance(eventBridge, {
    configStore,
  })
```

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

::: tip Use schemas to validate
A production ready approach is, to validate the result of store getters and setters against a schema.
It validates the input or return values and gives you proper types for further usage in one step.
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
    fromEnvVar: process.env.MY_VALUE;
  },
})

console.log(store.getState('initialValue')) // outputs: initial
```

## Custom config store

It is quite simple to build a custom config store.
You can simply extend the `ConfigStoreBaseClass` with type parameter of your custom store config.

```typescript
import { 
    ConfigStoreBaseClass,
    UnhandledError, 
    StatusCode,
    StoreBaseConfig,
    type ObjectWithKeysFromStringArray 
  } from '@purista/core'

type CustomStoreConfig = {
  url: string
}

export class CustomStore extends ConfigStoreBaseClass<CustomStoreConfig> {

  private client

  constructor(config?: StoreBaseConfig<CustomStoreConfig>) {
    super('CustomStoreName', config)

    this.client = customCLient.connect(this.config.config.url)
  }

  protected async getConfigImpl<ConfigNames extends string[]>(
    ...configNames: ConfigNames
  ): Promise<ObjectWithKeysFromStringArray<ConfigNames>> {
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
    return result as ObjectWithKeysFromStringArray<ConfigNames>

  }

  protected async removeConfigImpl(configName: string): Promise<void> {
    try {
      // your custom logic goes here:
      await this.client.del(configName)
    } catch (err) {
      const msg = `error in config store removing value ${configName}`
      this.logger.error({ err }, msg)
      throw new UnhandledError(StatusCode.InternalServerError, msg)
    }
  }

  protected async setConfigImpl(configName: string, configValue: unknown) {
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
