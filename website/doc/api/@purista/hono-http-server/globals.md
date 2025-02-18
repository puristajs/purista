[**@purista/hono-http-server v1.11.0**](README.md)

***

[PURISTA API](../../packages.md) / @purista/hono-http-server

# @purista/hono-http-server

Package for using a Hono as webserver.

Minimal example:

## Example

```typescript
import { serve } from '@hono/node-server'
import { DefaultEventBridge } from '@purista/core'
import { honoV1Service } from '@purista/hono-http-server'

// create and init our eventbridge
const eventBridge = new DefaultEventBridge()
await eventBridge.start()

// add your service
const pingService = await pingV1Service.getInstance(eventBridge)
await pingService.start()

const honoService = await honoV1Service.getInstance(eventBridge, {
  serviceConfig: {
    services: [pingService]
  }
})
await honoService.start()

const _serverInstance = serve({
  fetch: honoService.app.fetch,
  port: 3000,
})

```

## Enumerations

- [ServiceEvent](enumerations/ServiceEvent.md)

## Type Aliases

- [BindingsBase](type-aliases/BindingsBase.md)
- [EndpointProtectMiddleware](type-aliases/EndpointProtectMiddleware.md)
- [HealthFunction](type-aliases/HealthFunction.md)
- [HonoServiceV1Config](type-aliases/HonoServiceV1Config.md)
- [HonoServiceV1ConfigPartial](type-aliases/HonoServiceV1ConfigPartial.md)
- [VariablesBase](type-aliases/VariablesBase.md)

## Variables

- [DEFAULT\_API\_MOUNT\_PATH](variables/DEFAULT_API_MOUNT_PATH.md)
- [ExternalDocumentationObjectSchema](variables/ExternalDocumentationObjectSchema.md)
- [honoServiceV1ConfigSchema](variables/honoServiceV1ConfigSchema.md)
- [honoV1Service](variables/honoV1Service.md)
- [InfoObjectSchema](variables/InfoObjectSchema.md)
- [OPENAPI\_DEFAULT\_INFO](variables/OPENAPI_DEFAULT_INFO.md)
- [puristaVersion](variables/puristaVersion.md)
- [ServerObjectSchema](variables/ServerObjectSchema.md)
- [TagObjectSchema](variables/TagObjectSchema.md)

## Functions

- [addPathToOpenApi](functions/addPathToOpenApi.md)
- [getErrorName](functions/getErrorName.md)
- [getErrorResponseSchema](functions/getErrorResponseSchema.md)
- [getParameterDefinition](functions/getParameterDefinition.md)
- [getQueryDefintion](functions/getQueryDefintion.md)
