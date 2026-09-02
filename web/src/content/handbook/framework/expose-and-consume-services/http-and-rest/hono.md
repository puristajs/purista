---
title: Configure Hono
description: Install and configure the optional Hono projection service, its public boundary, and its OpenAPI and health surfaces.
order: 420
---

Choose Hono when a Node application needs HTTP command and stream projections,
OpenAPI, middleware, and RFC 9457 problem responses. It is an independent
runtime service, not middleware inserted into each business service. Installing
`@purista/core` alone never exposes a port.

Choose the startup path first: [distributed endpoint discovery versus monolith
direct registration](/handbook/framework/expose-and-consume-services/http-and-rest/runtime-architecture/).
This page configures the Hono process after that choice.

## Install the optional server

`@purista/hono-http-server` is a separate first-party runtime package. It
brings Hono itself, but it deliberately does not bind a network listener.
`@hono/node-server` is its optional Node listener dependency. Install both for
the Node deployment shown here; another Hono runtime needs its own supported
listener adapter and bootstrap code.

```sh title="Install the Hono HTTP server"
npm install @purista/hono-http-server @hono/node-server
```

| After installation | Still required | Evidence that it works |
| --- | --- | --- |
| Hono service definition and HTTP/OpenAPI projection code | Instantiate and start `honoV1Service`, then bind `honoService.app.fetch` with a listener | `GET /api/openapi.json` returns the generated document after `start()`. |
| Node listener package | Application-owned port, TLS/ingress, lifecycle, and shutdown handling | The listener accepts a request and the Hono service returns a route or an RFC 9457 problem. |

The Hono service has no listener of its own. Starting it makes the route table
and service receivers ready; `serve(...)` is the separate application-owned
network step.

For a monolith, instantiate the business services, register their definitions
with Hono, then start both services before binding the Node listener. This is
direct definition registration: the business services do not have to publish
endpoint announcements for Hono to create routes.

```ts title="src/index.ts"
import { serve } from '@hono/node-server'
import { DefaultEventBridge } from '@purista/core'
import { honoV1Service } from '@purista/hono-http-server'
import { pingV1Service } from './service/ping/v1/pingV1Service.js'

const eventBridge = new DefaultEventBridge()
await eventBridge.start()

const pingService = await pingV1Service.getInstance(eventBridge)

const honoService = await honoV1Service.getInstance(eventBridge, {
  serviceConfig: {
    apiMountPath: '/api',
    enableHealth: true,
    healthPath: '/healthz',
    maxRequestBodyBytes: 1_048_576,
    openApi: { enabled: true, info: { title: 'Ping API', version: '1.0.0' } },
  },
})

honoService.registerService(pingService) // before honoService.start()
await honoService.start()

await pingService.start() // registers the command receiver before traffic begins

serve({ fetch: honoService.app.fetch, port: 3000 })
```

[`registerService(...services)`](/handbook/api/classes/_purista_hono-http-server.HonoServiceClass/#registerservice)
must run before `honoService.start()`. If you prefer configuration-based wiring,
set `serviceConfig.services: [pingService]` and
`autoRegisterServicesFromConfig: true`; the default is `false` so registration
stays obvious in code review. Do not use either direct-registration option for
a separately deployed HTTP process: it has no in-memory business-service
instances to register.

## Verify the declared surface

With the command from [HTTP and REST](/handbook/framework/expose-and-consume-services/http-and-rest/),
call the route and inspect the generated contract:

```sh title="Call the exposed ping command"
curl -X POST http://localhost:3000/api/v1/ping \
  -H 'content-type: application/json' \
  -d '{"ping":"ready"}'
```

```json title="Expected ping response"
{"pong":"ready"}
```

With `apiMountPath: '/api'`, Hono serves `/api/openapi.json` and
`/api/openapi.yaml`. A `404` usually means the command was not marked for HTTP
exposure, Hono missed an endpoint announcement, direct registration happened
after startup, or the selected route/mount path differs from the client
request. A `503` means the Hono service was deliberately made unavailable;
check process readiness and shutdown state.

## Configure the public boundary

`serviceConfig` is validated by
[`HonoServiceV1ConfigPartial`](/handbook/api/types/_purista_hono-http-server.HonoServiceV1ConfigPartial/).
The service applies its defaults during `getInstance(...)`; changes after
`start()` do not rebuild existing generated routes or their protection
middleware. Set the general service logger through the top-level
`getInstance(..., { logLevel, logger })` options, not inside `serviceConfig`.

| `serviceConfig` option | Default | Runtime effect | Choose it when |
| --- | --- | --- | --- |
| `apiMountPath` | `/api` | Prefixes generated endpoint routes and both OpenAPI documents. The service-version segment follows it. | A gateway or ingress reserves another prefix. Keep it stable because it is part of the public URL. |
| `enableDynamicRoutes` | `false` | Retains Hono’s built-in endpoint-announcement subscription and uses a dynamic Hono router. | Hono is a separately deployed edge process and starts before business services. It cannot replay missed non-durable announcements. |
| `services` | `[]` | Holds in-memory service instances for direct route discovery. | A monolith owns both Hono and the business services. This is invalid as a remote-service discovery mechanism. |
| `autoRegisterServicesFromConfig` | `false` | During `start()`, calls `registerService(...services)` before the server becomes available. | You prefer declarative monolith composition. Do not combine it with an equivalent manual `registerService(...)` call. |
| `maxRequestBodyBytes` | `1_048_576` (1 MiB) | Rejects oversized `POST`, `PUT`, and `PATCH` bodies before parsing, including chunked bodies, with `413`. | Set the smallest reviewed limit for the largest intended request. It does not limit `GET`/`DELETE` query strings. |
| `streamRequestTimeoutMs` | `300_000` ms | Limits the EventBridge operation that opens a stream. | A stream needs a different first-response budget. It does not limit the lifetime of an established stream or make it durable. |
| `enableHealth` | `false` | Registers `GET healthPath`; it returns `503` while Hono is unavailable, `200` when its health callback resolves, and an RFC 9457 error when the callback throws. | Your platform probes this HTTP process. Enable it deliberately; a listener alone is not a readiness claim. |
| `healthPath` | `/healthz` | Selects the health route. | Your platform requires a specific probe path. Keep it outside a conflicting API route. |
| `healthFunction` | A successful no-op | Optional health callback used only when `enableHealth` is true. | Dependencies beyond Hono process readiness must be checked. Prefer `setHealthFunction(...)` after instantiation for its typed callback. |
| `protectHandler` | Pass-through middleware | Middleware used only by endpoints with HTTP security enabled (the builder default). | The edge authenticates a request or supplies normalized principal/tenant values. Prefer `setProtectMiddleware(...)` for typed variables. |
| `traceHeaderField` | `x-trace-id` | Reads and echoes the application trace header and includes it in problem details. | An existing edge uses another application correlation header. It complements, rather than replaces, W3C trace propagation. |
| `problemDetails.typeBaseUri` | Unset | Prefixes generated RFC 9457 problem `type` URIs. | You publish stable, documented problem-type URLs. |

Here is the complete service-level shape in one place. This monolith uses
configuration-based service registration. In a distributed HTTP process, set
`enableDynamicRoutes: true`, leave `services` empty, and keep
`autoRegisterServicesFromConfig` disabled.

```ts title="src/http/honoConfig.ts"
import type { HonoServiceV1ConfigPartial } from '@purista/hono-http-server'

export const honoConfig = {
  enableDynamicRoutes: false,
  streamRequestTimeoutMs: 300_000,
  maxRequestBodyBytes: 1_048_576,
  apiMountPath: '/api',
  enableHealth: true,
  healthPath: '/healthz',
  autoRegisterServicesFromConfig: true,
  services: [pingService],
  traceHeaderField: 'x-trace-id',
  problemDetails: {
    typeBaseUri: 'https://example.com/problems',
  },
  openApi: {
    enabled: true,
    openapi: '3.1.0',
    info: {
      title: 'Ping API',
      description: 'Public HTTP contract for the Ping service',
      version: '1.0.0',
      termsOfService: 'https://example.com/terms',
      contact: { name: 'API team', email: 'api@example.com' },
      license: { name: 'Proprietary' },
    },
    servers: [{ url: 'https://api.example.com' }],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer' },
      },
    },
    security: [{ bearerAuth: [] }],
    tags: [{ name: 'Ping', description: 'Readiness examples' }],
    externalDocs: { url: 'https://example.com/docs' },
    paths: {},
  },
} satisfies HonoServiceV1ConfigPartial
```

`healthFunction` and `protectHandler` are also accepted inside
`serviceConfig`. Prefer the typed `setHealthFunction(...)` and
`setProtectMiddleware(...)` methods shown below. They make the Hono context
types visible and keep executable policy next to the composition code.

### OpenAPI document settings

The complete `openApi` object is enabled by default. Without configuration,
Hono serves `/api/openapi.json` and `/api/openapi.yaml` with OpenAPI `3.1.0`
and `Server api` / `1.0.0` document information. Disable it only when another
release process owns the published contract.

| `serviceConfig.openApi` option | Default | Effect |
| --- | --- | --- |
| `enabled` | `true` | Publishes JSON and YAML below `apiMountPath`. `false` leaves the in-memory builder available but does not register those routes. |
| `openapi` | `3.1.0` | Document specification version written to the root document. |
| `info.title`, `info.description`, `info.version` | `Server api`, `OpenApi definition for server endpoints`, `1.0.0` | Release identity displayed by OpenAPI tools. Supply these for every published API. |
| `info.termsOfService`, `info.contact`, `info.license` | Unset | Optional ownership and legal metadata. |
| `servers` | Unset | Server URLs and optional descriptions/variables. Use public gateway URLs, not internal service addresses. |
| `components`, `security`, `externalDocs`, `tags`, `paths` | Unset | Additional OpenAPI fragments merged with generated operation metadata. Keep endpoint schemas and operation security on the command/stream builder; do not use this to bypass a missing runtime contract. |

Configure `openApi.components.securitySchemes` before Hono registers an
endpoint. At registration time, Hono adds an operation security requirement
only when a scheme already exists; adding a scheme later does not retrofit
existing operations. OpenAPI metadata never authenticates a request: configure
the protection middleware as well.

## Know what an HTTP handler receives

Hono owns HTTP parsing and turns the request into the command or stream input.
The schema on that definition still owns business validation.

| Concern | Hono behavior | Design consequence |
| --- | --- | --- |
| Payload | `POST`, `PUT`, and `PATCH` require the declared request content type, then parse JSON, form/multipart data, or text. `GET` and `DELETE` do not parse a body, so payload is `undefined`. | Do not model required delete input as an HTTP body; use a path/query parameter with a parameter schema. |
| Parameter | Hono merges query values, then path values, then middleware `additionalParameter`; later values override earlier same-named values. | Use a parameter schema for every public value. Middleware may deliberately normalize/override a value only after authentication. |
| Trusted identity | Only middleware-provided `principalId` and `tenantId` are forwarded to the PURISTA request. | Set them from verified authentication, never from a request payload or query. |
| Trace context | Hono extracts W3C trace context and echoes its configurable application trace header. | Keep an existing correlation header only as a complement to normal trace propagation. |
| Controlled failure | Invalid/missing body representation produces `400`, too-large body `413`, unknown endpoint `404`, unavailable Hono `503`, and a stream operation unsupported by the EventBridge `501`. Handled errors become RFC 9457 problem details; unexpected errors become `500`. | Treat these as transport outcomes. Keep domain error classification in the command/stream handler. |

Protection middleware fields are merged into `additionalParameter` before the
definition's parameter schema runs. A `.strict()` object schema therefore
rejects middleware-injected keys unless it declares them. Include every
injected business parameter in that schema, or keep identity only in the
trusted `principalId` and `tenantId` message fields and authorize it with a
business guard.

## Authenticate at the edge; authorize in the service

[`setProtectMiddleware(fn)`](/handbook/api/classes/_purista_hono-http-server.HonoServiceClass/#setprotectmiddleware)
runs only for endpoints whose builder retains the default secure setting or
calls `enableHttpSecurity(true)`. Its arguments are Hono's request context and
`next`. It may reject unauthenticated traffic, then set normalized
`principalId`, `tenantId`, or `additionalParameter` values before calling
`next`. Its `this` value is the Hono service, so a normal `function` can use
the service deliberately; an arrow function is suitable when no receiver is
needed. A command guard still makes the business authorization decision.

Generated endpoints are protected by default. Mark only an intentionally
anonymous command or stream with `.makeEndpointPublic()`:

```ts title="Declare public and protected commands"
const loginCommandBuilder = authV1ServiceBuilder
  .getCommandBuilder('login', 'Starts a local session')
  .addPayloadSchema(loginInputSchema)
  .addOutputSchema(loginOutputSchema)
  .exposeAsHttpEndpoint('POST', 'login')
  .makeEndpointPublic()

const currentSessionCommandBuilder = authV1ServiceBuilder
  .getCommandBuilder('currentSession', 'Returns the current session')
  .addOutputSchema(sessionSchema)
  .exposeAsHttpEndpoint('GET', 'session')
```

[`getCommandBuilder(name, description, eventName?)`](/handbook/api/classes/_purista_core.ServiceBuilder/#getcommandbuilder)
creates the service-owned operation. The optional event name is only for a
canonical success fact. [`addPayloadSchema(schema, contentType?, contentEncoding?)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#addpayloadschema)
and [`addOutputSchema(schema, contentType?, contentEncoding?)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#addoutputschema)
define the validated request and successful result; omitted representation
values use JSON and UTF-8. [`exposeAsHttpEndpoint(method, path, ...)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#exposeashttpendpoint)
adds HTTP/OpenAPI metadata and does not replace the command handler.
[`makeEndpointPublic()`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#makeendpointpublic)
disables generated-route protection only for the login command.

The second endpoint keeps the default protection. The middleware should throw
a `HandledError` for expected authentication failures and let Hono's installed
error handler render the RFC 9457 response.

```ts title="src/http/createHonoService.ts"
import { HandledError, StatusCode } from '@purista/core'

honoService
  .setHealthFunction(async () => {
    if (!(await eventBridge.isHealthy())) {
      throw new Error('EventBridge is not healthy')
    }
  })
  .setProtectMiddleware(async function (request, next) {
    const identity = await verifyAccessToken(request.req.header('authorization'))
    if (!identity) {
      throw new HandledError(StatusCode.Unauthorized, 'A valid access token is required')
    }

    request.set('principalId', identity.subject)
    request.set('tenantId', identity.tenantId)
    return next()
  })
```

[`setHealthFunction(fn)`](/handbook/api/classes/_purista_hono-http-server.HonoServiceClass/#sethealthfunction)
is called by the health route with the same service receiver. Throw from it to
make the probe fail; do not return a boolean and assume it changes the status.
[`setHonoTypes<...>()`](/handbook/api/classes/_purista_hono-http-server.HonoServiceClass/#sethonotypes)
is a compile-time helper for typing middleware bindings/variables; it has no
runtime effect.

Apply TLS, rate limits, ingress request timeout, network policy, and DDoS
protection at the edge. Hono’s `maxRequestBodyBytes` and protected-route
middleware are application-level controls, not a substitute for those boundary
controls.

## Extend and stop the HTTP process deliberately

`honoService.app` is the real typed Hono application. Use it for HTTP-only
concerns such as static files, a browser fallback, an API reference page, or a
small runtime configuration document. A business operation should remain a
PURISTA command or stream so it keeps schemas, guards, messaging, tests, and
generated OpenAPI.

Register custom middleware and handlers before `honoService.start()`. Register
all generated service endpoints before that call as well, then start the Node
listener last.

```ts title="src/http/registerUiRoutes.ts"
import { HandledError, StatusCode } from '@purista/core'
import { honoV1Service } from '@purista/hono-http-server'

const honoService = (await honoV1Service.getInstance(eventBridge, {
  serviceConfig: honoConfig,
})).setHonoTypes<{
  Variables: { locale: 'en' | 'de' }
}>()

honoService.app.use('/ui/*', async (context, next) => {
  const locale = context.req.header('accept-language')?.startsWith('de') ? 'de' : 'en'
  context.set('locale', locale)
  await next()
})

honoService.app.get('/ui/config', context => {
  if (!uiBuildId) {
    throw new HandledError(StatusCode.ServiceUnavailable, 'The UI build is not ready')
  }

  return context.json({
    apiBaseUrl: '/api',
    buildId: uiBuildId,
    locale: context.get('locale'),
  })
})

honoService.openApi.addPath('/ui/config', {
  get: {
    summary: 'Read public browser configuration',
    responses: { '200': { description: 'Browser configuration' } },
  },
})

honoService.registerService(pingService)
await honoService.start()
```

The Framework error handler installed by `start()` converts a `HandledError`
from a custom Hono handler or protection middleware into the same RFC 9457
problem response used by generated endpoints. An unexpected error becomes a
generic `500` response; its internal message is not returned to the caller.

Custom handlers do not automatically receive command payload validation,
command guards, generated route protection, or generated OpenAPI. Add their
Hono middleware and OpenAPI path deliberately. In particular,
`setProtectMiddleware(...)` applies only to generated endpoints marked as
protected. [`addEndpoint(...)`](/handbook/api/classes/_purista_hono-http-server.HonoServiceClass/#addendpoint)
is an advanced projection API for PURISTA command or stream metadata. It is not
the way to add an ordinary custom Hono handler, discover remote services, or
replay a missed endpoint announcement.

During graceful shutdown, call
[`prepareDestroy()`](/handbook/api/classes/_purista_hono-http-server.HonoServiceClass/#preparedestroy)
before closing the listener and dependent services. It marks Hono unavailable
so new HTTP requests receive `503`, allowing the application to stop accepting
work before it drains the process. Then destroy the Hono service through the
same composition-root shutdown sequence as its EventBridge and business
services.

The object returned by `serve(...)` is the raw Node listener, not another
PURISTA service. Wrap it in a small lifecycle object only so
`gracefulShutdown(...)` can close the listening socket after
`honoService.prepareDestroy()` has stopped new work:

```ts title="Close the Node HTTP listener"
const server = serve({ fetch: honoService.app.fetch, port: 3000 })
const httpListener = {
  name: 'HTTP listener',
  destroy: () => new Promise<void>((resolve, reject) => {
    server.close(error => error ? reject(error) : resolve())
  }),
}

gracefulShutdown(logger, [
  httpListener,
  honoService,
  businessService,
  eventBridge,
])
```
