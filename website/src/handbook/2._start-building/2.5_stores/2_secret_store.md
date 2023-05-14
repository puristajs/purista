---
order: 20
shortTitle: Secret store
title: Secret store
description: Secret store
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


The secret store is addressing two things.  
One focus is, to provide a solution, where the secret is short living, and only available, when there is an actual need for it. Secrets should not be provided via the general service configuration. They should also be persited in some secret way.  
The second reason for the secret store interface:  
It provides the possibility, to use different solutions without vendor specific code implementation, within your business code.  
The secret store is a simple interface to a key-value-store. Keys and values are strings.

## Available secret stores

| vendor                                                                    | package   |
|---                                                                        |---        |
| [AWS Secrets Manager](https://aws.amazon.com/secrets-manager)             | [planned](https://github.com/sebastianwessel/purista/issues/106)      |
| [Azure Key Vault](https://azure.microsoft.com/en-us/products/key-vault)   | [planned](https://github.com/sebastianwessel/purista/issues/107)      |
| [Google Cloud Secret Manager](https://cloud.google.com/secret-manager)    | [planned](https://github.com/sebastianwessel/purista/issues/108)      |
| [HashiCorp Vault](https://www.vaultproject.io)                            | [planned](https://github.com/sebastianwessel/purista/issues/109)      |
| [Dapr](https://dapr.io)       | [@purista/dapr-sdk](../../7._deployment/4_dapr.md) |

## Usage

The secret store is provided inside the `context` of command functions and subscription functions.  
It can be used like this:

```typescript
.setCommandFunction(async function (context, payload) {

  // set a config
  await context.configs.setSecret('secret_key', 'super_secret_string_only')
  await context.configs.setSecret('other_secret', 'confidential')

  // get a config
  const myConfig = await context.configs.getConfig('secret_key', 'other_secret')
  console.log(myConfig) // outputs: { secret_key: "super_secret_string_only", other_secret: "confidential" }

  // remove a config
  await context.configs.removeConfig('port')
})
```

::: info
Config stores per default:  

- enabled getter
- disabled setter
- disabled removal

You need to explicit enable via config if needed
:::

## Default secret store

PURISTA comes with a default secret store, which can be used as placeholder or connector to config files and environment variables.  
In the constructor config, you can add a `config` property. The property must be from type object.  

Example:

```typescript
const store = new DefaultSecretStore({
  enableGet: true,
  enableRemove: true,
  enableSet: true,
  config: {
    mySecret: 'secret_value',
  },
})

console.log(store.getSecret('mySecret')) // outputs: secret_value
```


## Custom secret store

It is quite simple to build a custom secret store.  
You can simply extend the `SecretStoreBaseClass` with type parameter of your custom store config.

```typescript
import { SecretStoreBaseClass, UnhandledError, StatusCode, StoreBaseConfig } from '@purista/core'

type CustomStoreConfig = {
  url: string
}

export class CustomStore extends SecretStoreBaseClass<CustomStoreConfig> {

  private client

  constructor(config: StoreBaseConfig<CustomStoreConfig>) {
    super('CustomStoreName', config)

    this.client = customCLient.connect(this.config.config.url)
  }

  async getSecret(...secretNames: string[]): Promise<Record<string, string>> {
    if (!this.config.enableGet) {
      throw new UnhandledError(StatusCode.Unauthorized, 'get secret from store is disabled by config')
    }

    const result: Record<string, string> = {}
    for await (const name of secretNames) {
      try {
        // your custom logic goes here:
        result[name] = await this.client.get(name)
      } catch (err) {
        const msg = `error in secret store getting value ${name}`
        this.logger.error({ err }, msg)
        throw new UnhandledError(StatusCode.InternalServerError, msg)
      }
    }
    return result

  }

  async removeSecret(secretName: string): Promise<void> {
    if (!this.config.enableRemove) {
      throw new UnhandledError(StatusCode.Unauthorized, 'remove secret from store is disabled by config')
    }

    try {
    // your custom logic goes here:
      await this.client.del(secretName)
    } catch (err) {
      const msg = `error in secret store removing value ${secretName}`
      this.logger.error({ err }, msg)
      throw new UnhandledError(StatusCode.InternalServerError, msg)
    }
  }

  async setSecret(secretName: string, secretValue: string) {
    if (!this.config.enableSet) {
      throw new UnhandledError(StatusCode.Unauthorized, 'set secret at store is disabled by config')
    }

    try {
      // your custom logic goes here:
      await this.client.set(secretName, secretValue)
    } catch (err) {
      const msg = `error in secret store setting value ${stateName}`
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
