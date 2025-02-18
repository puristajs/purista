---
title: PURISTA 1.11
longTitle: Version 1.11
description: Version 1.11 of the PURISTA framework introduces various new features and enhancements, aimed at improving performance and developer experience 
date: 2024-02-30
order: 20240230
---
<PostDetail>

The new version 1.11 of PURISTA includes some bigger changes under the hood, which results in some breaking changes.

---

[[toc]]

## Breaking changes

In version 1.11 a few methods are becoming `async` and some functionality is deprecated in favor of new possibilities.  
Before upgrading to to the new version, please have a short look, where you need to align your existing code base.

::: info
The reason for these changes is that we can now support more validation schemas and generate OpenAPI definitions from schema libraries other than zod.
:::

### Service builder getInstance is now async

The method `getInstance` in the service builder is now an `async` function, which needs to be awaited.

```typescript
const serviceInstance = serviceBuilder.getInstance(eventbridge) // [!code --]
const serviceInstance = await serviceBuilder.getInstance(eventbridge) // [!code ++]
```

### Deprecation of service test functions

The service unit test helpers `validateCommandDefinitions` and `validateSubscriptionDefinitions` are deprecated. Please migrate to the unified function `testServiceSetup`.

```typescript
import { userV1Service as service } from './userV1Service.js'

describe('service user version 1', () => {
  it('has valid commands', () => { // [!code --]
    service.validateCommandDefinitions() // [!code --]
  }) // [!code --]

  it('has valid subscriptions', () => { // [!code --]
    service.validateSubscriptionDefinitions() // [!code --]
  }) // [!code --]

  it('has a valid setup', async ()=> { // [!code ++]
    await expect(service.testServiceSetup()).resolves.toBeTruthy() // [!code ++]
  }) // [!code ++]
})
```

::: warning
The methods `validateCommandDefinitions` and `validateSubscriptionDefinitions` are doing nothing now.  
They will get removed in one of the next versions.
:::

## Improvements

Store Getters provide now better types. The keys in the returned object are based on the provided keys in the getter.

```typescript
const conf = await context.configs.getConfig('one','two')
// before conf was type of Record<string,unknown>

// now it becomes type of { one: unknown, two: unknown}
if(conf.one) {
  ...
}

if(conf.two) {
  ...
}
```

The stores have been cleaned up and types and namings have been improved.  
Custom store implementations only need to implement the `Impl` methods.

```typescript
export class CustomConfigStore extends ConfigStoreBaseClass<CustomConfigStoreConfig> implements ConfigStore {
  private map = new Map<string, unknown>()

  constructor(config?: StoreBaseConfig<CustomConfigStoreConfig>) {
    super('DefaultConfigStore', { ...config })
    // custom implementation
  }

  protected async getConfigImpl<ConfigNames extends string[]>(
    ...configNames: ConfigNames
  ): Promise<ObjectWithKeysFromStringArray<ConfigNames>> {
    // custom implementation
  }

  protected async setConfigImpl(configName: string, configValue: unknown) {
    // custom implementation
  }

  protected async removeConfigImpl(configName: string) {
    // custom implementation
  }
}

```

## Documentation updates

While the documentation is still in progress, a new section [integrations](../handbook/6_integrations/index.md) has been added. Here, we will provide information and examples on how you can integrate and interact with third-party solutions.

### Temporal integration

We've included a comprehensive guide on setting up Temporal on your local machine. Learn how to establish communication between Temporal and your PURISTA application, and vice versa. Additionally, discover how to seamlessly integrate your temporal workflow into OpenTelemetry traces.

Read more about the [Temporal integration](../handbook/6_integrations/temporal_and_purista/index.md)

</PostDetail>
