---
title: Version 2.0
description: PURISTA 2.0 – A Major Update with New Features and Improvements.
date: 2025-02-18
order: 20250218
image: /graphic/purista_2_0_cover.jpg
---
<PostDetail>
A **huge shout-out 🎉** to the community for your incredible support and feedback! Your suggestions have been instrumental in shaping PURISTA v2.  

While the core functionality of PURISTA remains intact, this release introduces **significant enhancements** based on real-world experiences and production use cases.  

## What’s New?

There’s a lot! Here are some of the highlights:  

- Support for **npm, Bun, Yarn, and pnpm**  
- General **Bun support**  
- **Customizable** file and folder casing  
- **Customizable** event casing  
- **Resource definitions** in service builders  
- Exporting **service definitions** to JSON files  
- **REST client generation**  
- General **improvements and bug fixes**  

### CLI Enhancements

The PURISTA CLI has been completely revamped! The `init` option has been removed and replaced by a more **convenient `create` command**, which works with your preferred package manager.  

To start a new project, simply use your favorite package manager:  

::: code-group  

```bash [npm]  
npm create purista@latest  
```  

```bash [Bun]  
bun create purista@latest  
```  

```bash [Yarn]  
yarn create purista@latest  
```  

```bash [pnpm]  
pnpm create purista@latest  
```  

:::  

This command will guide you through the process of creating a new PURISTA project.  

As you can see, **all major package managers are now supported**. Additionally, official support has been added for [Bun](https://bun.sh) and [Biome](https://biomejs.dev).  

The **CLI has been completely rewritten in TypeScript**. As a result, the `@purista/cli` package now includes an **API**, allowing developers to programmatically create **services, commands, and subscriptions**.  

## Features

PURISTA 2.0 introduces several new features to enhance flexibility and maintainability.  

### Resources

Staying true to PURISTA’s core principles — **clear interface definitions, separation of concerns, and structured architecture** — **Resources** have now been introduced to service builders.  

A **resource** is an entity available in your application that is provided to a service instance and passed down to commands and subscriptions. A common example of a resource is a **database connection or connection pool**.  

You can now define resources within your **service builder**:  

```ts
import type { ServiceInfoType } from '@purista/core'
import { ServiceBuilder } from '@purista/core'

import { generalPingPongServiceInfo } from '../generalPingPongServiceInfo.js'
import { pingPongServiceV1ConfigSchema } from './pingPongServiceConfig.js'

export const pingPongServiceInfo = {
  serviceVersion: '1',
  ...generalPingPongServiceInfo,
} as const satisfies ServiceInfoType

export const pingPongV1ServiceBuilder = new ServiceBuilder(pingPongServiceInfo)
  .setConfigSchema(pingPongServiceV1ConfigSchema)
  .defineResource<'resourceName', TypeOfResource>() // [code ++]
```

Defining a resource is a **TypeScript type definition only**. There is **no runtime validation** or enforcement.  

Resources can be accessed in **commands and subscriptions** via the `context` object:  

```ts
import { ServiceEvent } from '../../../../serviceEvent.enum.js'
import { pingPongV1ServiceBuilder } from '../../pingPongV1ServiceBuilder.js'
import {
  pingPongV1PingInputParameterSchema,
  pingPongV1PingInputPayloadSchema,
  pingPongV1PingOutputPayloadSchema,
} from './schema.js'

export const pingCommandBuilder = pingPongV1ServiceBuilder
  .getCommandBuilder('ping', 'send a ping')
  .setSuccessEventName(ServiceEvent.Pinged)
  .addPayloadSchema(pingPongV1PingInputPayloadSchema)
  .addParameterSchema(pingPongV1PingInputParameterSchema)
  .addOutputSchema(pingPongV1PingOutputPayloadSchema)
  .setCommandFunction(async function (context, _payload, _parameter) {
    const result = context.resources.resourceName.myResourceMethod() // [code ++]
    return 'PING!'
  })
```

Since resources are **TypeScript types only**, **mock implementations** can easily be used in tests. This makes **unit testing more efficient**, allowing you to test commands without depending on the actual resource implementation.

### Service Definition Export

One of the most powerful aspects of PURISTA is that **nearly all interface definitions are programmatically accessible** and structured based on **industry standards** like OpenAPI. This means these definitions can be **extracted, exported, and saved as JSON files**.  

With this capability, **client code generation** becomes straightforward. However, generating client code is just one potential use case. The broader vision is to provide a standardized format that can be leveraged to **generate documentation, diagrams, or even a UI** for building PURISTA applications.  

If you're interested in maintaining a consistent **logical structure** across different parts of your system, the example implementation of a **client SDK** may be particularly useful.  

Instead of writing traditional `fetch` calls, you can now use **simplified client code** like this:  

```ts
const client = new HttpClient()

// client.[SERVICE_NAME].v[SERVICE_VERSION].[COMMAND_NAME]
const result = client.foo.v1.bar(payload, parameter)
```

This approach ensures that your **client-side code follows the same structure** as your **PURISTA-based backend**, maintaining consistency and reducing development overhead.

## Improvements

Beyond the new CLI and features, significant work has been done to **enhance the overall developer experience**. In particular, the **type system has been improved**, making it easier to write **more robust and maintainable code**. Additionally, the **documentation has been updated** to better support developers.  

## **Breaking Changes**  

There are no major breaking changes in **core functionality**—meaning your **business logic remains unaffected**. However, there are a few notable changes:  

### Deprecated Method: `.setDefaultConfig()`

The `.setDefaultConfig()` method in the **service builder** is now **deprecated**. The recommended approach is to **set default values directly in your configuration validation schema**.  

### Deprecated Fastify-Based HTTP Service

The package **`@purista/httpserver`** is now **deprecated**, and it is highly recommended to migrate to the **Hono-based** package:  

✅ **Use instead:** `@purista/hono-http-server`  

The reason for this transition is that **Fastify** is designed for very specific use cases, and integrating it flexibly with PURISTA proved challenging. In contrast, **Hono** offers:  

- **Better out-of-the-box support** for a wider range of use cases  
- **Higher flexibility**  
- **Impressive performance**  

For example, with Hono, dynamically adding routes at runtime is **much easier** than with Fastify.  

While Fastify remains a great and widely used framework, it **doesn’t align perfectly** with PURISTA’s architecture. Therefore, we’ve decided to move away from Fastify and **recommend using Hono instead**.  

### Deprecated Method: `.disableHttpSecurity()`

The `.disableHttpSecurity()` method in the **command builder** is now **deprecated**, as the method name was somewhat **misleading**.  

By default, **all endpoints are non-public**. If you want to expose an endpoint publicly, you must now use:  

✅ **New method:** `.makeEndpointPublic()`  

### Changed Method Shape for Mock Context Getter

The input structure of the **mock context getter methods** has changed.  

🔴 **Before (Pre-2.0)**: These functions required multiple parameters.  
🟢 **Now (2.0+):** They take **a single object** containing all necessary information.  

#### Example of the change

```ts
const ctx = pingCommandBuilder.getCommandContextMock(payload, parameter, sandbox) // [code --]

const ctx = pingCommandBuilder.getCommandContextMock({  // [code ++]
    payload,         // [code ++]
    parameter,       // [code ++]
    sandbox,         // [code ++]
})                   // [code ++]
```

This change affects the following methods:  

- `getCommandContextMock`  
- `getCommandTransformContextMock`  
- `getSubscriptionContextMock`  
- `getSubscriptionTransformContextMock`  

These adjustments **simplify function calls**, improve **code readability**, and align PURISTA’s API with modern best practices.

</PostDetail>
