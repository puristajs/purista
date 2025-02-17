---
title: REST API
description: Use the PURISTA HTTP server service to expose endpoints
order: 207010
---

# REST API

PURISTA provides a unique approach to building REST APIs.

It is essential to understand the concept. When you create a command in PURISTA, you can specify that it should be exposed as an HTTP endpoint. In the command definition builder, you define all details such as the HTTP method (GET, POST, PUT, DELETE), URL path, and request/response body.

However, the command's service does not implement an HTTP server. Instead, PURISTA provides a generic HTTP server that can be configured to expose any command as an HTTP endpoint. This allows you to focus on building your commands while PURISTA handles the HTTP server details.

This means the HTTP server is an independent service that can be started and scaled separately from your commands. Additionally, you can use different HTTP servers (such as Hono, Fastify, etc.) with PURISTA.

From a high-level perspective, each service in your system informs the HTTP server about which commands should be exposed as HTTP endpoints. The HTTP server then listens for incoming requests and routes them to the appropriate service and command.

## Setup

When you create a new PURISTA project, you will be asked whether you want to use the HTTP server service. If you choose to use it, PURISTA will automatically configure the HTTP server and generate the necessary code for you.

If you need to manually add the HTTP server service, ensure that the package `@purista/hono-http-server` is installed in your project.

The Hono service can be integrated like any other service in PURISTA.

```ts
import { honoV1Service } from '@purista/hono-http-server'

const honoService = await honoV1Service.getInstance(eventBridge)

await honoService.start()
  
```

When the `.start()` method is called, the HTTP server **does not** start listening for incoming requests. Instead, it connects to the event bridge and waits for messages indicating which commands to expose as HTTP endpoints.

## Connecting services to the HTTP server

There are two main ways to connect services and their commands to the HTTP server. Both methods are compatible and can be used together.

### Providing services via config

You can provide a list of service instances in the HTTP server service configuration. The HTTP server will then automatically register all commands from these services as HTTP endpoints. This approach is preferred when deploying your service as a monolith.

```ts
import { honoV1Service } from '@purista/hono-http-server'

const honoService = await honoV1Service.getInstance(eventBridge,{
  serviceConfig: {  // [!code ++]
    services: [serviceInstanceA, serviceInstanceB]  // [!code ++]
  }  // [!code ++]
})

await honoService.start()
  
```

::: info
When using this approach, all service instances must be created before the HTTP service is initialized. Additionally, all services must be available within the running process.
:::

#### Graceful shutdown

A key advantage of this approach is the ability to perform a graceful shutdown.

The general steps for a graceful shutdown are:

1. Stop accepting new incoming HTTP requests (return an HTTP error).  
2. Drain the event bridge, ensuring messages and command responses are delivered.  
3. Shut down the service instances.  
4. Close the HTTP socket connection (stop listening on the port).  
5. Shut down the HTTP server service.

```ts
import { type Service, gracefulShutdown } from '@purista/core'
import { honoV1Service } from '@purista/hono-http-server'

const services: Service[] = [serviceInstanceA, serviceInstanceB]]

const honoService = await honoV1Service.getInstance(eventBridge,{
  serviceConfig: {
    services,
  }
})

await honoService.start()

gracefulShutdown(logger, [
  honoService.prepareDestroy(), // 1.
  eventBridge, // 2.
  ...services, // 3.
  { // 4.
    name: `${honoService.serviceInfo.serviceName} ${honoService.serviceInfo.serviceVersion} close socket`,
    destroy: async () => {
      await serverInstance.stop()
    },
  },
  honoService, // 5.
])
```

Depending on your actual implementation, you may need to close database connections or other resources. This can be done by adding an object with a destroy function to the shutdown array:

```ts
{ 
  name: 'name in logger output',
  destroy: async () => { 
    // implementation goes here 
  }
}
```

### Dynamic registration

If your services are independently deployed in a distributed system, you cannot provide service instances directly to the HTTP service. In this case, dynamic registration can be used.

With dynamic registration, the HTTP server must be started first. It then listens for special info messages from other services via the event bridge. These messages are automatically sent when a service starts up, and this process is fully managed by the PURISTA framework.

```ts
import { honoV1Service } from '@purista/hono-http-server'

const honoService = await honoV1Service.getInstance(eventBridge,{
  serviceConfig: {  // [!code ++]
    enableDynamicRoutes: true  // [!code ++]
  }  // [!code ++]
})

await honoService.start()
  
```

::: info
Dynamic registration is enabled by default. To disable it, set `enableDynamicRoutes` to `false`.
:::

## Start listening

TThe HTTP server service does not automatically start listening for requests (i.e., open a socket). Instead, it relies on [Hono](https://hono.dev), which provides high flexibility and performance. However, this also means that you need to manually start listening for requests.

::: code-group

```ts [Node.js]
import { type Service, gracefulShutdown } from '@purista/core'
import { serve } from '@hono/node-server'
import { honoV1Service } from '@purista/hono-http-server'

const services: Service[] = [serviceInstanceA, serviceInstanceB]]

const honoService = await honoV1Service.getInstance(eventBridge,{
  serviceConfig: {
    services,
  }
})

await honoService.start()

// Node.js runtime specific
const serverInstance = serve({
  fetch: honoService.app.fetch,
  port: 3000,
})
```

```ts [Bun]
import { type Service, gracefulShutdown } from '@purista/core'
import { honoV1Service } from '@purista/hono-http-server'

const services: Service[] = [serviceInstanceA, serviceInstanceB]]

const honoService = await honoV1Service.getInstance(eventBridge,{
  serviceConfig: {
    services,
  }
})

await honoService.start()

// Bun runtime specific
const serverInstance = Bun.serve({
  fetch: honoService.app.fetch,
  port: 3000,
})
```

:::

For more details, refer to the official Hono documentation: [hono.dev/docs](https://hono.dev/docs/).

## The Hono instance
The PURISTA HTTP server service provides access to the Hono instance through `honoService.app`. This means you can leverage the full range of Hono features, including adding custom routes, serving static files, and more.

## Passing data to commands

In some cases, you may need to pass additional data from the HTTP server to a command. For example, you might want to add middleware that extends the command request with extra information, such as the current user or session ID.

Within your Hono middleware, you can use the Hono context, which provides `get` and `set` methods to retrieve or store data in the request context.

```ts
// [...]
honoService.app.use(async (c, next) => {
  c.set('additionalParameter', {
    ...c.get('additionalParameter'),
      someOtherInfo: 'value'
  })
})
// [...]
```

::: warning
The data must be serializable (JSON-stringifiable). It is not possible to pass functions or other non-serializable objects, as the data is transmitted via the event bridge.
:::

The context of the PURISTA HTTP server service is already typed, with specific fields defined for different use cases.

### additionalParameter

This field must be an object and can be used to store any additional information. The data is added to the parameters of the command.

```ts
honoService.app.use(async (c, next) => {
  c.set('additionalParameter', {
    ...c.get('additionalParameter'),
      someOtherInfo: 'value'
  })
})
```

It can then be accessed within the command function.

```ts
// [...]
.addParameterSchema(myV1CmdInputParameterSchema)
.setCommandFunction(async function (context, payload, parameter) {
  console.log(parameter.someOtherInfo)
})
```

Ensure that the parameter schema aligns correctly. Otherwise, the data may be filtered out.

```ts
export const myV1CmdInputParameterSchema = z.object({
  someOtherInfo: z.string()
})
```

::: warning
Avoid overwriting existing parameters, as they will be lost. Also, ensure there are no naming conflicts with URL or query parameters.
:::

### Event Bridge Message Fields

The event bridge message structure includes unique fields:

- `principalId`: A unique identifier for the user making the request.  
- `tenantId`: A unique identifier for the user's organization or tenant.  
- `traceId`: A unique identifier for tracking the request or operation.  
- `instanceId`: A unique identifier for the instance or service.  

For more details, see [Structure of a Message](../advanced/structure_of_a_message.md).

When these fields are set, they are available in the event bridge message but are not included in the command parameters. The command context provides access to the event bridge message.

## OpenAPI Documentation

By default, the PURISTA HTTP server service automatically generates an OpenAPI schema, which is exposed at `/api/v1/openapi.json`.

The PURISTA HTTP server service does not include a built-in UI for viewing OpenAPI documentation. However, several Hono plugins are available—see [Hono OpenAPI Middleware](https://hono.dev/docs/middleware/third-party#openapi).

If you create a new PURISTA project and choose to install the HTTP server service, it will automatically include the Scalar OpenAPI UI. The required code and dependencies will be set up for you.

To manually add the Scalar OpenAPI UI, use the following example:

```ts
import { apiReference } from '@scalar/hono-api-reference'

// [...]

honoService.app.get(
  '/api',
  apiReference({
    pageTitle: 'My Project API Reference',
    spec: {
      url: `/api/openapi.json`,
    },
  }),
)

// [...]
```

## Securing Endpoints

Securing API endpoints is critical for any modern application. By default, commands exposed via HTTP are protected, but they can be made publicly accessible using `.makeEndpointPublic()` in the command builder.

The actual authentication and authorization logic is not handled within the command or the service that contains it. Instead, it is the responsibility of the HTTP server service. By default, no protection mechanism is implemented, as it depends on your specific use case and infrastructure.

### Implementing Authentication

You can implement authentication by setting the `protectHandler` option in the service configuration or by using the `.setProtectHandler()` method on the HTTP service.

Here is a minimal example of a bearer token authentication mechanism:

```ts
import type { ContentfulStatusCode } from 'hono/utils/http-status'

// [...]

honoService.setProtectHandler(async function (c, next) {
  // implement your protection logic here:
  const header = c.req.header('authorization')
  if (!header) {
    const err = new HandledError(StatusCode.Unauthorized, 'User not logged in')
    return c.json(err.getErrorResponse(), err.errorCode as ContentfulStatusCode)
  }

  const token = header.split(' ')[1] || ''
  const {payload, error} = await tokenValidator(token)

  if(error){
    const err = new HandledError(StatusCode.InvalidToken, 'Token invalid or expired')
    return c.json(err.getErrorResponse(), err.errorCode as ContentfulStatusCode)
  }


  // pass the user ID to the commands parameter input (optional)
  c.set('additionalParameter', { userId: payload.id })

  // set the principal ID in the message (optional)
  c.set('principalId', payload.id)

  // call next to continue the request handling
  return next()
})
```

This approach provides full control over authentication logic.

### Updating the OpenAPI Definition

Because authentication methods are highly customizable, they are not automatically added to the OpenAPI documentation. However, you can manually update the OpenAPI definition in the service configuration.

```ts
// [...]

const honoService = await honoV1Service.getInstance(eventBridge, {
  serviceConfig: {    
    openApi: {
      enabled: isOpenApiEnabled,
      openapi: '3.1.0',
      info: {
        title: 'My project',
        description: 'OpenApi definition for my project',
        version: '1.0.0',
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
      security: [{ bearerAuth: [] }],
    },
  },
})

// [...]
```

This configuration follows the [OpenAPI Specification](https://swagger.io/docs/specification/v3_0/authentication/).

## Health Check Function

For deployments, it is essential to have a health check endpoint to verify that your application is running correctly and can handle requests.

The PURISTA HTTP server service allows you to define a health check function using either the `healthzFunction` option in the service configuration or the `.setHealthFunction()` method on the service instance.

The health check function should throw an error if the service is not healthy and return `void` otherwise.

Here is an example:

```ts
honoServiceInstance.setHealthFunction(async function () {
  // throw when not healthy
  if (!isHealthy()) {
    throw new Error('Service is not healthy');
  }
})
```
