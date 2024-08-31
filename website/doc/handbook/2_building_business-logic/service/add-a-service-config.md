---
title: Add Configuration
description: How to add a custom service config to your PURISTA service
order: 201020
---

# Custom service configuration

A custom configuration relates to your business logic and your requirements. It is not used by PURISTA itself.
The custom service config will be available in all commands and subscriptions of this service via `this.config`.
Custom service configurations are one option to pass configuration values to commands and subscriptions.
But, you can also use stores.

Service configuration and stores addressing different data. Here is a table, that will help you to understand the differences.

|                   | custom config                     | [Config Store](../stores/config-stores.md)         | [Secret store](../stores/secret-stores.md)        |
|---                |---                                |---                  |---                  |
| provided/managed by |  infrastructure & deployment   | database or vendor solution   | vendor solution   |
| addresses |  technical configuration   | business configuration   | secrets & confidential data   |
| value             |  is set once, during instance creation   | fetched per usage   | fetched per usage   |
| change effects    |  instance restart/next deployment | on next usage   | on next usage   |
| value type        |  object (nested)                  | object, string, number, boolean (key-value)  | string (key-value)  |
| can be set *(*)*        |  🛑 no                               | ✅ yes                 | ✅ yes                 |
| can be deleted *(*)*   |  🛑 no                               | ✅ yes                 | ✅ yes                 |
| use for confidential data    | 🙏🏻 please no, technically possible | 🙏🏻 please no, technically possible  | ✅ yes                 |
| use cases    |  third-party url, ports, timeout settings                               | feature flag, business data like currency exchange values                 | passwords, auth tokens, certificates               |

_(*)_ by commands and subscriptions

For a custom configuration, you must define a [zod schema](https://zod.dev).
Example:

```typescript
export const userServiceV1ConfigSchema = z.object({
  myOption: z.string().optional()
})

export type UserServiceV1Config = z.input<typeof userServiceV1ConfigSchema>
```

As you can see, in the example a string option entry `myOption` is added. This field is marked as optional. Because of this, in the generated type `UserServiceV1Config`, the `myOption` is also optional.

Now, in the builder file `userV1ServiceBuilder.ts` in the same directory, typescript will complain on `.setDefaultConfig({})`.
Setting the default configuration, requires to set all root fields of the default configuration. The optional flag, only relates to the input, when you create a service instance and provide a service configuration.

::: tip
PURISTA follows the pattern, to always have default values, which can be overwritten, but only when there is a actual need for it.
:::

Because of this, you need to change it in the builder file `userV1ServiceBuilder.ts`.

```typescript
export const userV1ServiceBuilder = new ServiceBuilder(userServiceInfo)
  .setConfigSchema(userServiceV1ConfigSchema)
  .setDefaultConfig({
    myOption: 'something'
  })
```

::: warning Be aware
PURISTA does not deep merge configurations! If you have nested configurations, you should be aware of.
:::
