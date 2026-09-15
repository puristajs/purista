---
title: Build a custom HTTP server
description: Extend the Hono application for HTTP-only routes or implement the base HTTP EventBridge contract for a sidecar platform.
order: 419
---

Choose the smallest extension point. Most applications should keep the PURISTA
Hono service and add HTTP-only middleware/routes to `honoService.app`. Build an
HTTP EventBridge only when a sidecar or platform owns message transport and URL
mapping.

## Add application-owned Hono routes

Register static files, a UI fallback, or a small runtime-config endpoint before
`honoService.start()`. Keep business operations as commands or streams.

```ts title="src/http/registerUiRoutes.ts"
import { HandledError, StatusCode } from '@purista/core'

honoService.app.get('/ui/config', context => {
  if (!uiBuildId) {
    throw new HandledError(StatusCode.ServiceUnavailable, 'The UI build is not ready')
  }

  return context.json({ apiBaseUrl: '/api', buildId: uiBuildId })
})

honoService.openApi.addPath('/ui/config', {
  get: {
    summary: 'Read browser runtime configuration',
    responses: { '200': { description: 'Runtime configuration' } },
  },
})
```

Hono's installed `onError` handler renders thrown handled errors. Do not return
a hand-built problem response from each custom route. Custom routes are not
automatically added to OpenAPI; add them deliberately when they are public.

## Implement a sidecar HTTP EventBridge

`@purista/base-http-bridge` provides `HttpEventBridge`. It hosts internal
command/subscription endpoints and optional REST command projections, while a
provider-specific `HttpEventBridgeClient` maps outgoing calls to the sidecar.

```bash title="Install the base HTTP bridge"
npm install @purista/base-http-bridge hono @hono/node-server
```

```ts title="src/eventbridge/platformHttpEventBridge.ts"
import { serve } from '@hono/node-server'
import { HttpEventBridge, type HttpEventBridgeClient } from '@purista/base-http-bridge'

const client: HttpEventBridgeClient = {
  getInternalPathForCommand: address =>
    `/purista/${address.serviceName}/${address.serviceVersion}/${address.serviceTarget}`,
  getInternalPathForSubscription: address =>
    `/purista/${address.serviceName}/${address.serviceVersion}/${address.serviceTarget}`,
  getApiPathForCommand: (_address, metadata) => metadata.expose.http.path,
  invoke: command => platformClient.invoke(command),
  sendEvent: message => platformClient.publish(message),
  isSidecarAvailable: () => platformClient.isHealthy(),
}

export const eventBridge = new HttpEventBridge({
  serve,
  serverHost: '0.0.0.0',
  serverPort: 8080,
  pathPrefix: 'purista',
  apiPrefix: '/api',
  enableRestApiExpose: true,
  commandPayloadAsCloudEvent: false,
  subscriptionPayloadAsCloudEvent: true,
}, client)
```

The `platformClient` methods are your provider adapter and must preserve full
PURISTA messages, trace context, timeouts, and safe errors. The base bridge
advertises no stream support and conservative delivery capabilities. Do not
claim manual acknowledgement, durable retry, or streaming unless a concrete
adapter implements and reports them.

Test route mapping, CloudEvent unwrapping, command success/error envelopes,
sidecar health, shutdown drain, and every advertised capability against the
real platform. For ordinary public APIs, prefer the maintained Hono service.

Next: [configure Hono](/handbook/framework/expose-and-consume-services/http-and-rest/hono/).
