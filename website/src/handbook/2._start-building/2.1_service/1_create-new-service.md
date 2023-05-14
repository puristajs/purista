---
order: 10
title: Create a new service
shortTitle: Create a new Service
description: Create your first typescript service in PURISTA with a function and a subscription implementation in simple typescript/javascript.
image: https://purista.dev/graphic/add_service.png
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

![Add service with cli](/graphic/add_service.png)

A service is a logical group of functions and subscriptions. This is where the domain driven aspect comes in.  
In our example, we will use the classic example - Users.

At the end, we want to have two domains - *User* and *Email*.

We will need to have this functionality:

- sign up a new user
- get a user by email
- send a welcome email to user

## Set up a new service

First, we need to create a new service.  
You can simply add a new service by using the CLI tool.

::: code-tabs#shell

@tab:active global install

```bash
purista add service
```

@tab local npm

```bash
npx @purista/cli add service
```

@tab local bun

```bash
bunx @purista/cli add service
```

:::

The CLI will guide you through all steps, and will create all files for your.  
In the first step, you will asked for the name of our new service.  
We will start with _User_.

```bash
? What is the name (or domain) of your new service (something like: user or account)
```

::: hint
Service names should be short and in best case a single word - like user or email.  
You can enter the name in natural way. The CLI tool will take care of casing and whitespaces.  
For example, if you have a domain _bank account_, you can simply type in _bank account_.  The CLI tool will convert it to something like _bankAccount_
:::

After you have confirm your input by pressing the enter key, you will be asked for a short description of the service.

```bash
? What is the matter of service "user"
```

Here, you should enter some short, general description, which will be used for some human-facing documentation.  
So, please provide here something like: _manages data related to users_.

In the last step, you will be asked for the version of your service.  It defaults to _1_, which you can simply confirm by pressing the enter key.  
If you need to create a new version of an existing service, you can enter any integer number larger than _1_.

```bash
Version number of this service (1) 
```

Now, all files should be generated. A list of generated files will be printed out.

```bash
✔  ++ /src/service/ServiceEvent.enum.ts 
✔  ++ /src/service/user/generalUserServiceInfo.ts
✔  ++ /src/service/user/v1/userV1Service.ts
✔  ++ /src/service/user/v1/userV1Service.test.ts
✔  ++ /src/service/user/v1/userV1ServiceBuilder.ts
✔  ++ /src/service/user/v1/index.ts
✔  ++ /src/service/user/v1/userServiceConfig.ts
```

From here, you are ready to add commands and subscriptions to the new service _user_.

But, for our example, please redo the steps, and create an additional service _email_.  
You can skip the first step, if you provide the service name at the CLI call.

::: code-tabs#shell

@tab:active global install

```bash
purista add service email
```

@tab local npm

```bash
npx @purista/cli add service email
```

@tab local bun

```bash
bunx @purista/cli add service email
```

:::

## Structure

PURISTA is using [builders](../../1._get-started/3_builders.md) to create services. The created files are no actual service class implementation.  
PURISTA creates a service builder with configurations. And the builder is able to create a service class instance, based on the configuration.

### ServiceEvent.enum.ts

This file `/src/service/ServiceEvent.enum.ts` contains a typescript enum, which should contain all event names, used in the repository.  
The enum will be enhanced by the CLI tool, if you add commands or subscriptions, and the response refers to an event name.  

::: tip
Prevent hardcoding of event names as simple strings in your code. Use this global enum instead.
:::

### generalUserServiceInfo.ts

This file `/src/service/user/generalUserServiceInfo.ts` contains the basic information for your service:

- service name
- service description

You only need to change the file, if you need to align the description.  

### userV1Service.ts

This file `/src/service/user/v1/userV1Service.ts` only contains the registration of commands and subscriptions in the service builder. It __should not contain__ any further service builder configurations. Any other configuration should be done in the service builder file itself.

### userV1Service.test.ts

The file `/src/service/user/v1/userV1Service.test.ts`, is a unit test file, which will check the final configurations in the service builder.

### userV1ServiceBuilder.ts

The `/src/service/user/v1/userV1ServiceBuilder.ts` file, is the initial service builder for your service. In this file, the basic service configuration will be made.  
Also, the optional custom service configuration will be add here.  
If you want to create a new version of a service, you can simply copy the whole service version folder and align the service version in this file.

::: danger Do not add commands or subscriptions here
because of:

- cycling dependencies! the command and subscription builders are created by that builder
- this is used by PURISTA to be able to deploy as FaaS
:::

### userServiceConfig.ts

In the file `/src/service/user/v1/userServiceConfig.ts`, the custom service configuration can be made.

## Service configurations

A custom configuration relates to your business logic and your requirements. It is not used by PURISTA itself.  
The custom service config will be available in all commands and subscriptions of this service via `this.config`.  
Custom service configurations are one option to pass configuration values to commands and subscriptions.  
But, you can also use stores.  

Service configuration and stores addressing different data. Here is a table, that will help you to understand the differences.

|                   | custom config                     | [Config Store](../2.5_stores/1_config_store.md)         | [Secret store](../2.5_stores/2_secret_store.md)        |
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

As you can see, in the example a string option entry `myOption` is added. This filed is marked as optional. Because of this, in the generated type `UserServiceV1Config`, the `myOption` is also optional.

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

::: danger Be aware
PURISTA does not deep merge configurations! If you have nested configurations, you should be aware of.
:::

## Create a service instance

To get a real service instance, you can use the service builder from `userV1Service.ts`, which includes the configuration for the service with all commands and subscriptions.

To create a service instance, you need to provide at least an event bridge instance.

```typescript
// get instance of user
const userInstance = userV1Service.getInstance(eventBridge)
// initiate/start the user instance
// it registers the commands and the subscriptions to the event bridge
await theService.start()
```

If you have a custom configuration, you can provide it like this:

```typescript
const serviceConfig = {
  myOption: 'something'
}
// get instance of user with config
const userInstance = userV1Service.getInstance(eventBridge, { 
    serviceConfig
  })

// which allows usage like
console.log(userInstance.config.myOption) // outputs: something
```

::: info See
All available options can be found in [ServiceBuilder API documentation](../../../api/classes/purista_core.ServiceBuilder.html#getinstance)
:::
