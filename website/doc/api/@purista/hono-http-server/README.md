[**PURISTA API**](../../README.md)

***

[PURISTA API](../../packages.md) / @purista/hono-http-server

# @purista/hono-http-server

The HonoService is a service which exposes commands of services as http endpoints.
All exposed commands must be marked as exposed endpoints in the CommandBuilder.

Under the hood, [Hono](https://hono.dev) is used as basement.

Example usage:

```typescript
import { serve } from '@hono/node-server'
import { swaggerUI } from '@hono/swagger-ui'
import { DefaultEventBridge } from '@purista/core'
import { honoV1Service } from '@purista/hono-http-server'
import { basicAuth } from 'hono/basic-auth'
import { compress } from 'hono/compress'

import { pingV1Service } from './service/ping/v1/index.js'

export const main = async () => {
  // initiate the event bridge as first step
  const eventBridge = new DefaultEventBridge()
  await eventBridge.start()

  // add your service
  const pingService = await pingV1Service.getInstance(eventBridge)
  await pingService.start()

  // initiate the webserver service as second step
  const honoService = await honoV1Service.getInstance(eventBridge, { serviceConfig: { services: [pingService] } })

  honoService.app.use('*', compress())
  honoService.app.get('/api', swaggerUI({ url: '/api/openapi.json' }))
  honoService.openApi.addSecurityScheme('basicAuth', { type: 'http', scheme: 'basic' })
  honoService.openApi.addServer({ url: 'http://localhost:3000', description: 'the local server' })

  honoService.setHealthFunction(async function () {
    this.logger.info('custom health check')
  })

  honoService.setProtectHandler(async function (c, next) {
    const auth = basicAuth({ username: 'user', password: 'password' })
    return auth(c, next)
  })

  // start the webserver service
  await honoService.start()

  // open socket
  const _serverInstance = serve({
    fetch: honoService.app.fetch,
    port: 3000,
  })
}

main()

```

**Visit [purista.dev](https://purista.dev)**

**Follow on Twitter [@purista_js](https://twitter.com/purista_js)**  
**Join the [Discord Chat](https://discord.gg/9feaUm3H2v)**

<a href="https://www.producthunt.com/posts/purista?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-purista" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=386519&theme=light" alt="PURISTA - Typescript&#0032;framework&#0032;for&#0032;IoT&#0044;&#0032;microservices&#0044;&#0032;and&#0032;serverless | Product Hunt" style="width: 250px; height: 54px;" width="250" height="54" /></a>

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

## Classes

- [HonoServiceClass](classes/HonoServiceClass.md)

## Type Aliases

- [BindingsBase](type-aliases/BindingsBase.md)
- [Config](type-aliases/Config.md)
- [EndpointProtectMiddleware](type-aliases/EndpointProtectMiddleware.md)
- [HealthFunction](type-aliases/HealthFunction.md)
- [HonoServiceV1Config](type-aliases/HonoServiceV1Config.md)
- [HonoServiceV1ConfigPartial](type-aliases/HonoServiceV1ConfigPartial.md)
- [HonoV1ServiceCommandsToRestApiInputPayload](type-aliases/HonoV1ServiceCommandsToRestApiInputPayload.md)
- [ProblemDetails](type-aliases/ProblemDetails.md)
- [ProblemTypeConfig](type-aliases/ProblemTypeConfig.md)
- [ProtocolSseEvent](type-aliases/ProtocolSseEvent.md)
- [StreamTransportFramePayload](type-aliases/StreamTransportFramePayload.md)
- [VariablesBase](type-aliases/VariablesBase.md)

## Variables

- [DEFAULT\_API\_MOUNT\_PATH](variables/DEFAULT_API_MOUNT_PATH.md)
- [ExternalDocumentationObjectSchema](variables/ExternalDocumentationObjectSchema.md)
- [~~getQueryDefintion~~](variables/getQueryDefintion.md)
- [honoServiceInfo](variables/honoServiceInfo.md)
- [honoServiceV1ConfigSchema](variables/honoServiceV1ConfigSchema.md)
- [honoV1Service](variables/honoV1Service.md)
- [honoV1ServiceBuilder](variables/honoV1ServiceBuilder.md)
- [honoV1ServiceCommandsToRestApiInputPayloadSchema](variables/honoV1ServiceCommandsToRestApiInputPayloadSchema.md)
- [InfoObjectSchema](variables/InfoObjectSchema.md)
- [OPENAPI\_DEFAULT\_INFO](variables/OPENAPI_DEFAULT_INFO.md)
- [ProblemDetailsObjectSchema](variables/ProblemDetailsObjectSchema.md)
- [puristaVersion](variables/puristaVersion.md)
- [ServerObjectSchema](variables/ServerObjectSchema.md)
- [serviceCommandsToRestApiSubscriptionBuilder](variables/serviceCommandsToRestApiSubscriptionBuilder.md)
- [ServiceEvent](variables/ServiceEvent.md)
- [TagObjectSchema](variables/TagObjectSchema.md)

## Functions

- [addPathToOpenApi](functions/addPathToOpenApi.md)
- [collectAggregateStreamResult](functions/collectAggregateStreamResult.md)
- [encodeProtocolSseEvent](functions/encodeProtocolSseEvent.md)
- [getErrorName](functions/getErrorName.md)
- [getErrorResponseSchema](functions/getErrorResponseSchema.md)
- [getParameterDefinition](functions/getParameterDefinition.md)
- [getProblemDetailsSchema](functions/getProblemDetailsSchema.md)
- [getProblemTypeUri](functions/getProblemTypeUri.md)
- [getQueryDefinition](functions/getQueryDefinition.md)
- [isAgentEnvelopeLike](functions/isAgentEnvelopeLike.md)
- [isProtocolSseEvent](functions/isProtocolSseEvent.md)
- [isStreamErrorPayload](functions/isStreamErrorPayload.md)
- [isTransportControlFrame](functions/isTransportControlFrame.md)
- [negotiateProblemRepresentation](functions/negotiateProblemRepresentation.md)
- [renderProblemDetailsMarkdown](functions/renderProblemDetailsMarkdown.md)
- [resolveHttpStreamingMode](functions/resolveHttpStreamingMode.md)
- [toProblemDetails](functions/toProblemDetails.md)
