---
title: Secret Stores
description: Secret stores in PURISTA typescript framwork
order: 206020
---

# Secret Stores

The secret store serves two main purposes.

Firstly, it ensures that secrets have a short lifespan and are only accessible when needed in your implementation. Secrets should not be included in general service configurations and should be stored securely.

Secondly, the secret store interface allows for the use of different solutions without the need for vendor-specific code implementation in your business logic.

Essentially, the secret store offers a straightforward interface to a key-value store, where both keys and values are strings.

## Usage

Secret stores are provided to services during instance creation.

```typescript
const secretStore = new DaprSecretStore({ secretStoreName: 'local-secret-store' })

const myService = await myV1Service.getInstance(eventBridge, {
    secretStore,
  })
```

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
import { 
    SecretStore,
    SecretStoreBaseClass, 
    UnhandledError, 
    StatusCode, 
    StoreBaseConfig 
    type ObjectWithKeysFromStringArray,
  } from '@purista/core'

type CustomStoreConfig = {
  url: string
}

export class CustomStore extends SecretStoreBaseClass<CustomStoreConfig> implements SecretStore {

  private client

  constructor(config: StoreBaseConfig<CustomStoreConfig>) {
    super('CustomStoreName', config)

    this.client = customCLient.connect(this.config.config.url)
  }

  protected async getSecretImpl<SecretNames extends string []>(
    ...secretNames: SecretNames
  ): Promise<ObjectWithKeysFromStringArray<SecretNames, string | undefined>> {
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
    return result as ObjectWithKeysFromStringArray<SecretNames, string | undefined>
  }

  protected async removeSecretImpl(secretName: string): Promise<void> {
    try {
    // your custom logic goes here:
      await this.client.del(secretName)
    } catch (err) {
      const msg = `error in secret store removing value ${secretName}`
      this.logger.error({ err }, msg)
      throw new UnhandledError(StatusCode.InternalServerError, msg)
    }
  }

  protected async setSecretImpl(secretName: string, secretValue: string) {
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
